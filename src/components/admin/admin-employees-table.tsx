
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Eye, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/use-session';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    shipment_count: number;
    balance: number;
}

interface UsersApiResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

const employeeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export function AdminEmployeesTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
    const { session } = useSession();

    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '10');
        if (search) params.append('q', search);
        return params.toString();
    }, [page, search]);

    const { data, isLoading, error, mutate } = useApi<UsersApiResponse>(`/api/admin/employees?${queryParams}`);
    const { toast } = useToast();

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
    });
    
    const handleFormSubmit = async (values: EmployeeFormValues) => {
        if (!session?.email) {
            toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
            return;
        }

        const url = editingEmployee 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employees/${editingEmployee.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employees`;
        
        const method = editingEmployee ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': session.email,
                },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            if (response.ok) {
                toast({ title: "Success", description: `Employee ${editingEmployee ? 'updated' : 'created'} successfully.` });
                setCreateDialogOpen(false);
                setEditingEmployee(null);
                form.reset();
                mutate();
            } else {
                toast({ title: "Error", description: result.error || `Failed to ${editingEmployee ? 'update' : 'create'} employee.`, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };
    
    const openEditDialog = (employee: User) => {
        setEditingEmployee(employee);
        form.reset({
            firstName: employee.first_name,
            lastName: employee.last_name,
            email: employee.email,
            password: "",
        });
        setCreateDialogOpen(true);
    };

    const openCreateDialog = () => {
        setEditingEmployee(null);
        form.reset({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        });
        setCreateDialogOpen(true);
    };
    
    const handleDeleteEmployee = async (employeeId: number) => {
        if (!session?.email) {
            toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/employees/${employeeId}`, {
                method: 'DELETE',
                headers: { 
                    'X-User-Email': session.email,
                },
            });
            const result = await response.json();
            if(response.ok) {
                toast({ title: "Success", description: "Employee deleted successfully." });
                mutate();
            } else {
                toast({ title: "Error", description: result.error || "Failed to delete employee.", variant: "destructive" });
            }
        } catch (err) {
             toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    }


    return (
        <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-semibold">Employee Management</h2>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Dialog open={isCreateDialogOpen} onOpenChange={(isOpen) => {
                        setCreateDialogOpen(isOpen);
                        if (!isOpen) {
                            form.reset();
                            setEditingEmployee(null);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateDialog}><PlusCircle className="mr-2 h-4 w-4" />Create Employee</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingEmployee ? "Edit" : "Create New"} Employee</DialogTitle>
                                {editingEmployee && <DialogDescription>Update the employee's details. Leave password blank to keep it unchanged.</DialogDescription>}
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                                    <FormField control={form.control} name="firstName" render={({ field }) => (
                                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="lastName" render={({ field }) => (
                                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} placeholder={editingEmployee ? "Leave blank to keep current" : ""}/></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? "Saving..." : "Save Employee"}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Shipments</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                        ))
                    ) : error ? (
                        <TableRow><TableCell colSpan={6} className="text-center text-red-500 py-10">Failed to load employees.</TableCell></TableRow>
                    ) : data?.users.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10">No employees found.</TableCell></TableRow>
                    ) : (
                        data?.users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.first_name} {user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{user.shipment_count}</TableCell>
                                <TableCell>₹{user.balance.toFixed(2)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                     <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/users/${user.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the employee account for {user.first_name} {user.last_name}. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteEmployee(user.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || !data || data.totalPages <= 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                 <span className="text-sm">Page {data?.currentPage || 1} of {data?.totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!data || page === data.totalPages}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
