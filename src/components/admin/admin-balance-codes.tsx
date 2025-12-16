
"use client";

import { useState, useMemo } from "react";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface BalanceCode {
    id: number;
    code: string;
    amount: number;
    is_redeemed: boolean;
    created_at: string;
    redeemed_at: string | null;
    redeemed_by: string | null;
}

export default function AdminBalanceCodes() {
    const [statusFilter, setStatusFilter] = useState("all");
    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') {
            params.append('status', statusFilter);
        }
        return params.toString();
    }, [statusFilter]);

    const { data: codes, isLoading, error, mutate } = useApi<BalanceCode[]>(`/api/admin/balance-codes?${queryParams}`);
    const [amount, setAmount] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { session } = useSession();

    const handleCreateCode = async () => {
        if (!amount || !/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
            toast({ title: "Error", description: "Please enter a valid positive amount.", variant: "destructive" });
            return;
        }
        if (!session?.email) {
            toast({ title: "Error", description: "Authentication error. Please log in again.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/balance-codes`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': session.email,
                },
                body: JSON.stringify({ amount: amount }),
            });
            const result = await response.json();
            if (response.ok) {
                toast({ title: "Success", description: `Code ${result.code} created for ₹${result.amount}.` });
                setAmount("");
                mutate();
            } else {
                toast({ title: "Error", description: result.error || "Failed to create code.", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteCode = async (codeId: number) => {
        if (!session?.email) {
            toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
            return;
        }
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/balance-codes/${codeId}`, {
                method: 'DELETE',
                headers: { 'X-User-Email': session.email },
            });
            const result = await response.json();
            if (response.ok) {
                toast({ title: "Success", description: result.message });
                mutate();
            } else {
                 toast({ title: "Error", description: result.error || "Failed to delete code.", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Generate New Balance Code</CardTitle>
                    <CardDescription>Create a top-up code for an employee. They can redeem this to add funds to their wallet.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Enter amount, e.g., 21000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="max-w-xs"
                        disabled={isSubmitting}
                    />
                    <Button onClick={handleCreateCode} disabled={isSubmitting}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Generating..." : "Generate Code"}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div className="space-y-1">
                        <CardTitle>Generated Codes</CardTitle>
                        <CardDescription>A list of all generated balance top-up codes.</CardDescription>
                    </div>
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="redeemed">Redeemed</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Redeemed By</TableHead>
                                <TableHead>Redeemed At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                            ))}
                            {error && <TableRow><TableCell colSpan={7} className="text-center text-red-500">Failed to load codes.</TableCell></TableRow>}
                            {!isLoading && !error && codes?.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-mono">{c.code}</TableCell>
                                    <TableCell>₹{c.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={c.is_redeemed ? "secondary" : "default"} className={c.is_redeemed ? "" : "bg-green-600 hover:bg-green-700"}>
                                            {c.is_redeemed ? "Redeemed" : "Active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
                                    <TableCell>{c.redeemed_by || 'N/A'}</TableCell>
                                    <TableCell>{c.redeemed_at ? new Date(c.redeemed_at).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm" disabled={c.is_redeemed}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the balance code <span className="font-bold">{c.code}</span>.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteCode(c.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

    