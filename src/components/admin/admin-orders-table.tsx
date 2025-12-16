
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Download, FileText, X } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/use-session';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';

interface Shipment {
    id: number;
    shipment_id_str: string;
    sender_name: string;
    receiver_name: string;
    receiver_address_city: string;
    booking_date: string;
    status: string;
    total_with_tax_18_percent: number;
    user_type: 'Customer' | 'Employee';
}

interface ShipmentsApiResponse {
    shipments: Shipment[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

const statusUpdateSchema = z.object({
  status: z.string().min(1, "Status is required."),
  location: z.string().optional(),
  activity: z.string().optional(),
});

type StatusUpdateFormValues = z.infer<typeof statusUpdateSchema>;

const statusOptions = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];

export function AdminOrdersTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
    
    // Bulk update state
    const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
    const [bulkStatus, setBulkStatus] = useState("");
    const [isBulkConfirmOpen, setBulkConfirmOpen] = useState(false);


    const { toast } = useToast();
    const { session } = useSession();

    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '10');
        if (search) params.append('q', search);
        if (status && status !== 'all') params.append('status', status);
        return params.toString();
    }, [page, search, status]);

    const { data, isLoading, error, mutate } = useApi<ShipmentsApiResponse>(`/api/admin/shipments?${queryParams}`);
    
    const form = useForm<StatusUpdateFormValues>({
        resolver: zodResolver(statusUpdateSchema),
    });

    const selectedIds = useMemo(() => Object.entries(selectedRows).filter(([, isSelected]) => isSelected).map(([id]) => Number(id)), [selectedRows]);
    const isAllVisibleSelected = useMemo(() => {
        if (!data?.shipments || data.shipments.length === 0) return false;
        return data.shipments.every(s => selectedRows[s.id]);
    }, [data, selectedRows]);

    // Keyboard shortcut for select all
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
                event.preventDefault();
                toggleSelectAll();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isAllVisibleSelected, data]);


    const toggleRowSelection = (id: number) => {
        setSelectedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleSelectAll = () => {
        if (isAllVisibleSelected) {
            setSelectedRows({});
        } else {
            const allVisibleIds = data?.shipments.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}) || {};
            setSelectedRows(allVisibleIds);
        }
    };

    const handleOpenUpdateDialog = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        form.reset({
            status: shipment.status,
            location: '',
            activity: '',
        });
        setUpdateDialogOpen(true);
    };

    const handleSingleStatusUpdate = async (values: StatusUpdateFormValues) => {
        if (!selectedShipment || !session?.email) {
            toast({ title: "Error", description: "Authentication error or no shipment selected.", variant: "destructive" });
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/shipments/${selectedShipment.shipment_id_str}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': session.email,
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                toast({ title: "Success", description: "Shipment status updated." });
                mutate();
                setUpdateDialogOpen(false);
                setSelectedShipment(null);
            } else {
                const err = await response.json();
                toast({ title: "Error", description: err.error || "Failed to update status.", variant: "destructive"});
            }
        } catch (err) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };
    
    const handleBulkStatusUpdate = async () => {
        if (selectedIds.length === 0 || !bulkStatus) {
            toast({ title: "Error", description: "No orders selected or no status chosen.", variant: "destructive"});
            return;
        }
         if (!session?.email) {
            toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
            return;
        }
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/shipments/bulk-status-update`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': session.email,
                },
                body: JSON.stringify({ shipment_ids: selectedIds, status: bulkStatus }),
            });
            const result = await response.json();
            if (response.ok) {
                toast({ title: "Bulk Update Successful", description: result.message });
                mutate();
                setSelectedRows({});
            } else {
                 toast({ title: "Bulk Update Failed", description: result.error || "An error occurred.", variant: "destructive" });
            }
        } catch (err) {
             toast({ title: "Error", description: "An unexpected network error occurred.", variant: "destructive" });
        } finally {
            setBulkConfirmOpen(false);
            setBulkStatus("");
        }
    }

    const exportToCSV = () => {
        if (!data?.shipments.length) return;
        const headers = ["Order ID", "Type", "Sender", "Receiver", "Destination", "Date", "Amount", "Status"];
        const rows = data.shipments.map(s => [
            s.shipment_id_str,
            s.user_type,
            s.sender_name,
            s.receiver_name,
            s.receiver_address_city,
            new Date(s.booking_date).toLocaleDateString(),
            s.total_with_tax_18_percent,
            s.status
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "shipments.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-background border rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by Order ID, Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Booked</SelectItem>
                            <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" onClick={exportToCSV} disabled={!data?.shipments.length}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={isAllVisibleSelected}
                                    onCheckedChange={toggleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Sender</TableHead>
                            <TableHead>Receiver</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={10}><Skeleton className="h-8 w-full" /></TableCell>
                            </TableRow>
                        ))}
                        {error && <TableRow><TableCell colSpan={10} className="text-center text-red-500">Failed to load shipments.</TableCell></TableRow>}
                        {!isLoading && !error && data?.shipments.map((s) => (
                            <TableRow key={s.id} data-state={selectedRows[s.id] ? "selected" : ""}>
                                <TableCell>
                                    <Checkbox
                                        checked={!!selectedRows[s.id]}
                                        onCheckedChange={() => toggleRowSelection(s.id)}
                                        aria-label={`Select row ${s.id}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{s.shipment_id_str}</TableCell>
                                <TableCell>
                                    <Badge variant={s.user_type === 'Employee' ? 'default' : 'secondary'} className={cn(s.user_type === 'Employee' ? 'bg-blue-100 text-blue-800' : '')}>
                                        {s.user_type === 'Employee' ? 'E' : 'C'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{s.sender_name}</TableCell>
                                <TableCell>{s.receiver_name}</TableCell>
                                <TableCell>{s.receiver_address_city}</TableCell>
                                <TableCell>{new Date(s.booking_date).toLocaleDateString()}</TableCell>
                                <TableCell>₹{s.total_with_tax_18_percent.toFixed(2)}</TableCell>
                                <TableCell>{s.status}</TableCell>
                                <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenUpdateDialog(s)}>Update</Button>
                                <Button variant="outline" size="sm" asChild>
                                        <Link href={`/invoice/${s.shipment_id_str}`} target="_blank">
                                            <FileText className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm">Page {data?.currentPage || 1} of {data?.totalPages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!data || page === data.totalPages}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="sticky bottom-4 left-0 right-0 p-2 flex justify-center">
                    <div className="bg-background border rounded-lg shadow-lg flex items-center gap-4 p-3 animate-in fade-in-0 slide-in-from-bottom-5">
                        <p className="text-sm font-medium">{selectedIds.length} order(s) selected</p>
                        <Select onValueChange={setBulkStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select new status..." />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <AlertDialog open={isBulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
                            <AlertDialogTrigger asChild>
                                <Button disabled={!bulkStatus}>Update Status</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You are about to update the status of {selectedIds.length} shipment(s) to <span className="font-bold">{bulkStatus}</span>. This action cannot be easily undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleBulkStatusUpdate}>Confirm & Update</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedRows({})}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={isUpdateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Shipment: {selectedShipment?.shipment_id_str}</DialogTitle>
                        <DialogDescription>Add a new entry to the tracking history.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSingleStatusUpdate)} className="space-y-4">
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="Optional" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="activity" render={({ field }) => (
                                <FormItem><FormLabel>Activity / Comment</FormLabel><FormControl><Textarea {...field} placeholder="Optional" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Updating..." : "Update Status"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

    

    