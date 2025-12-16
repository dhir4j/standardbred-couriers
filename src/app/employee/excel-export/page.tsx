
"use client";

import { useState, useMemo, useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Download, FileDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface Shipment {
    id: number;
    shipment_id_str: string;
    receiver_name: string;
    booking_date: string;
    status: string;
    total_with_tax_18_percent: number;
}

export default function ExcelExportPage() {
    const { session } = useSession();
    const [date, setDate] = useState<DateRange | undefined>();
    const [status, setStatus] = useState<string>("all");

    const queryParams = useMemo(() => {
        if (!session?.email) return null;
        const params = new URLSearchParams();
        params.append('email', session.email);
        if (date?.from) params.append('from_date', date.from.toISOString());
        if (date?.to) params.append('to_date', date.to.toISOString());
        if (status !== 'all') params.append('status', status);
        return params.toString();
    }, [session, date, status]);

    const { data: shipments, isLoading, error } = useApi<Shipment[]>(queryParams ? `/api/shipments?${queryParams}` : null);
    
    const exportToCSV = () => {
        if (!shipments || shipments.length === 0) return;
        const headers = ["Tracking ID", "Receiver", "Date", "Status", "Amount"];
        const rows = shipments.map(s => [
            s.shipment_id_str,
            s.receiver_name,
            new Date(s.booking_date).toLocaleDateString(),
            s.status,
            `₹${s.total_with_tax_18_percent.toFixed(2)}`
        ].map(field => `"${field.replace(/"/g, '""')}"`).join(','));

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `shipment_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-100 w-full">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileDown />
                    Shipment Export
                </CardTitle>
                <CardDescription>
                    Filter your shipments and export the data to a CSV file.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-secondary rounded-lg">
                    {/* Date Range Filter */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            id="date"
                            variant={"outline"}
                            className="w-[300px] justify-start text-left font-normal"
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                                ) : (
                                format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Status Filter */}
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Button onClick={exportToCSV} disabled={isLoading || !shipments || shipments.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Export to CSV
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tracking ID</TableHead>
                            <TableHead>Receiver</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                            ))
                        ) : error ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-red-500 py-10">Failed to load shipments.</TableCell></TableRow>
                        ) : shipments?.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No shipments found for the selected criteria.</TableCell></TableRow>
                        ) : (
                            shipments?.map((shipment) => (
                                <TableRow key={shipment.id}>
                                    <TableCell className="font-medium">{shipment.shipment_id_str}</TableCell>
                                    <TableCell>{shipment.receiver_name}</TableCell>
                                    <TableCell>{new Date(shipment.booking_date).toLocaleDateString()}</TableCell>
                                    <TableCell>₹{shipment.total_with_tax_18_percent.toFixed(2)}</TableCell>
                                    <TableCell>{shipment.status}</TableCell>
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
