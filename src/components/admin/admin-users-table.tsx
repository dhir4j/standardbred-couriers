
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    shipment_count: number;
}

interface UsersApiResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

export function AdminUsersTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '10');
        if (search) params.append('q', search);
        return params.toString();
    }, [page, search]);

    const { data, isLoading, error } = useApi<UsersApiResponse>(`/api/admin/users?${queryParams}`);

    return (
        <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Customer Management</h2>
                <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Shipments</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                        ))
                    ) : error ? (
                        <TableRow><TableCell colSpan={5} className="text-center text-red-500 py-10">Failed to load customers.</TableCell></TableRow>
                    ) : data?.users.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No customers found.</TableCell></TableRow>
                    ) : (
                        data?.users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.first_name} {user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{user.shipment_count}</TableCell>
                                <TableCell>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/users/${user.id}`}>
                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                        </Link>
                                    </Button>
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
