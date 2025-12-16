
"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { User, Package, CreditCard, Wallet } from "lucide-react";

interface UserDetails {
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        created_at: string;
        balance?: number;
        is_employee?: boolean;
    };
    shipments: {
        id: number;
        shipment_id_str: string;
        receiver_name: string;
        booking_date: string;
        status: string;
        total_with_tax_18_percent: number;
    }[];
    payments: {
        id: number;
        shipment_id_str: string;
        amount: number;
        utr: string;
        status: string;
        created_at: string;
    }[];
}

export default function AdminUserDetails({ userId }: { userId: string }) {
    const { data, isLoading, error } = useApi<UserDetails>(`/api/admin/users/${userId}`);

    if (isLoading) return <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>;
    if (error) return <p className="text-red-500">Failed to load user details.</p>;
    if (!data) return null;

    const { user, shipments, payments } = data;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    <div><strong>Name:</strong> {user.first_name} {user.last_name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                    {user.is_employee && (
                         <div>
                            <strong>Balance:</strong> 
                            <span className="font-bold ml-2">₹{user.balance?.toFixed(2)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Package /> Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Shipment ID</TableHead>
                                <TableHead>Receiver</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipments.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.shipment_id_str}</TableCell>
                                    <TableCell>{s.receiver_name}</TableCell>
                                    <TableCell>{new Date(s.booking_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{s.status}</TableCell>
                                    <TableCell>₹{s.total_with_tax_18_percent.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard /> Payments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Shipment ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>UTR</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.shipment_id_str}</TableCell>
                                    <TableCell>₹{p.amount.toFixed(2)}</TableCell>
                                    <TableCell>{p.utr}</TableCell>
                                    <TableCell>{p.status}</TableCell>
                                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

    