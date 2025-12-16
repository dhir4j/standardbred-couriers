
"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Package, IndianRupee, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface DayEndStats {
    current_balance: number;
    todays_shipments_count: number;
    todays_shipments_value: number;
    todays_shipments: {
        id: number;
        shipment_id_str: string;
        receiver_name: string;
        status: string;
        total_with_tax_18_percent: number;
    }[];
    shipments_by_hour: {
        hour: string;
        shipments: number;
    }[];
}

export default function DayEndPage() {
    const { data: stats, isLoading, error } = useApi<DayEndStats>('/api/employee/day-end-stats');

    const statCards = [
        { title: "Shipments Today", value: stats?.todays_shipments_count, icon: Package },
        { title: "Volume Today", value: stats?.todays_shipments_value, icon: IndianRupee, isCurrency: true },
        { title: "Remaining Balance", value: stats?.current_balance, icon: Wallet, isCurrency: true },
    ];

    const chartConfig = {
      shipments: {
        label: "Shipments",
        color: "hsl(var(--primary))",
      },
    };

    return (
        <div className="flex-1 p-4 sm:p-6 bg-gray-100/50 w-full space-y-6">
             <h1 className="text-3xl font-bold flex items-center gap-2"><BarChart className="h-8 w-8" /> Day End Report</h1>
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

            <Card>
                <CardHeader>
                    <CardTitle>Hourly Shipment Breakdown</CardTitle>
                    <CardDescription>Number of shipments created per hour today.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-[350px] w-full" />
                    ) : error || !stats?.shipments_by_hour ? (
                        <div className="h-[350px] flex items-center justify-center text-red-500">Failed to load chart data.</div>
                    ) : (
                        <ChartContainer config={chartConfig} className="h-[350px] w-full">
                            <RechartsBarChart accessibilityLayer data={stats.shipments_by_hour}>
                                <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <ChartTooltipContent />
                                <Bar dataKey="shipments" fill="var(--color-shipments)" radius={4} />
                            </RechartsBarChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Today's Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tracking ID</TableHead>
                                <TableHead>Receiver</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                                ))
                            ) : error ? (
                                <TableRow><TableCell colSpan={4} className="text-center text-red-500">Failed to load shipments.</TableCell></TableRow>
                            ) : stats?.todays_shipments.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No shipments created today.</TableCell></TableRow>
                            ) : (
                                stats?.todays_shipments.map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">{s.shipment_id_str}</TableCell>
                                        <TableCell>{s.receiver_name}</TableCell>
                                        <TableCell>{s.status}</TableCell>
                                        <TableCell className="text-right">₹{s.total_with_tax_18_percent.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
