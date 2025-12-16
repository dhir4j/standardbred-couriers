
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { DollarSign, Package, BarChart, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmployeeStats {
    current_balance: number;
    total_shipments_count: number;
    total_shipments_value: number;
    all_shipments: {
        id: number;
        shipment_id_str: string;
        receiver_name: string;
        status: string;
    }[];
}

export default function EmployeeDashboardPage() {
    const { session, isLoading: isSessionLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isSessionLoading && !session) {
            router.push('/employee-login');
        }
    }, [session, isSessionLoading, router]);

    const { data: stats, isLoading, error } = useApi<EmployeeStats>(session ? `/api/employee/day-end-stats` : null);
    
    if (isSessionLoading || !session) {
        return (
          <div className="flex justify-center items-center h-screen w-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
    
    const statCards = [
        { title: "Current Balance", value: stats?.current_balance, icon: DollarSign, isCurrency: true },
        { title: "Total Shipments", value: stats?.total_shipments_count, icon: Package },
        { title: "Total Volume", value: stats?.total_shipments_value, icon: BarChart, isCurrency: true },
    ];

  return (
    <div className="flex-1 p-8 bg-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
            {statCards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : error ? (
                             <p className="text-sm text-red-500">Error loading data</p>
                        ) : (
                            <div className="text-2xl font-bold">
                                {card.isCurrency ? `₹${Number(card.value ?? 0).toFixed(2)}` : (card.value ?? 0)}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                   {isLoading ? (
                        <div className="space-y-2">
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                        </div>
                   ) : error ? (
                        <p className="text-center text-red-500">Could not load recent activity.</p>
                   ) : stats && stats.all_shipments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tracking ID</TableHead>
                                    <TableHead>Receiver</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.all_shipments.slice(0, 10).map((shipment) => (
                                    <TableRow key={shipment.id}>
                                        <TableCell className="font-medium">{shipment.shipment_id_str}</TableCell>
                                        <TableCell>{shipment.receiver_name}</TableCell>
                                        <TableCell><Badge variant="secondary">{shipment.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/employee/awb-tracking?id=${shipment.shipment_id_str}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                   ) : (
                        <p className="text-center text-muted-foreground">No shipments created yet.</p>
                   )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
