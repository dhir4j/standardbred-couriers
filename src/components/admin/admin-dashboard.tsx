
"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, BarChart } from "lucide-react";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { Skeleton } from "../ui/skeleton";

interface WebAnalytics {
    total_orders: number;
    total_revenue: number;
    total_users: number;
    avg_revenue: number;
}

export default function AdminDashboard() {
    const { data: analytics, isLoading, error } = useApi<WebAnalytics>('/api/admin/web_analytics');

    const analyticsCards = [
        { title: "Total Orders", value: analytics?.total_orders, icon: Package },
        { title: "Total Revenue", value: analytics?.total_revenue, icon: DollarSign, isCurrency: true },
        { title: "Total Users", value: analytics?.total_users, icon: Users },
        { title: "Avg. Revenue/Order", value: analytics?.avg_revenue, icon: BarChart, isCurrency: true },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {analyticsCards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-1/2" />
                            ) : error ? (
                                <p className="text-xs text-red-500">Error</p>
                            ) : (
                                <div className="text-2xl font-bold">
                                    {card.isCurrency ? `₹${Number(card.value ?? 0).toFixed(2)}` : (card.value ?? 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                <AdminOrdersTable />
            </div>
        </div>
    );
}
