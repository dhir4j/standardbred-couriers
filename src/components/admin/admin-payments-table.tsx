
"use client";

import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/use-session";

interface Payment {
    id: number;
    order_id: string;
    first_name: string;
    last_name: string;
    amount: number;
    utr: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    created_at: string;
}

export function AdminPaymentsTable() {
    const { data: payments, isLoading, error, mutate } = useApi<Payment[]>('/api/admin/payments');
    const { toast } = useToast();
    const { session } = useSession();

    const handleStatusUpdate = async (paymentId: number, newStatus: 'Approved' | 'Rejected') => {
        if (!session?.email) {
            toast({ title: "Error", description: "Authentication error. Please log in again.", variant: "destructive" });
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments/${paymentId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': session.email,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const result = await response.json();
            if (response.ok) {
                toast({ title: "Success", description: result.message });
                mutate(); 
            } else {
                toast({ title: "Error", description: result.error || "Failed to update payment status.", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };

    return (
        <div className="bg-background border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Customer Payment Requests</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Shipment ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UTR Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                    ))}
                    {error && <TableRow><TableCell colSpan={7} className="text-center text-red-500">Failed to load payments.</TableCell></TableRow>}
                    {!isLoading && !error && payments?.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.order_id}</TableCell>
                            <TableCell>{p.first_name} {p.last_name}</TableCell>
                            <TableCell>₹{p.amount.toFixed(2)}</TableCell>
                            <TableCell className="font-mono">{p.utr}</TableCell>
                            <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                            <TableCell><Badge variant={p.status === 'Approved' ? 'default' : p.status === 'Rejected' ? 'destructive' : 'secondary'} className={p.status === 'Approved' ? 'bg-green-600' : ''}>{p.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                {p.status === 'Pending' ? (
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(p.id, 'Approved')}>Approve</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(p.id, 'Rejected')}>Reject</Button>
                                    </div>
                                ) : 'Processed'}
                            </TableCell>
                        </TableRow>
                    ))}
                     {!isLoading && payments?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                                No pending payment requests found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
