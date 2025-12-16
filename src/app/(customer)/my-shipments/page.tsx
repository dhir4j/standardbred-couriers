"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Package, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

interface Shipment {
  id: number;
  shipment_id_str: string;
  receiver_name: string;
  booking_date: string;
  status: string;
}

export default function MyShipmentsPage() {
    const { session, isLoading: isSessionLoading } = useSession();
    const router = useRouter();
    const [allShipments, setAllShipments] = useState<Shipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isSessionLoading) {
            if (!session?.email) {
                router.push('/login');
                return;
            }
            const fetchShipments = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments?email=${session.email}`);
                    if (response.ok) {
                        const data = await response.json();
                        setAllShipments(data);
                    } else {
                        // Handle error case
                        console.error("Failed to fetch shipments");
                    }
                } catch (error) {
                    console.error("An error occurred while fetching shipments", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchShipments();
        }
    }, [session, isSessionLoading, router]);

    const filteredShipments = useMemo(() => {
        const ongoingStatuses = ['Booked', 'In Transit', 'Out for Delivery'];
        return {
            ongoing: allShipments.filter(s => ongoingStatuses.includes(s.status)),
            delivered: allShipments.filter(s => s.status === 'Delivered'),
            pending: allShipments.filter(s => s.status === 'Pending Payment'),
        };
    }, [allShipments]);
    
    if (isSessionLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const ShipmentsTable = ({ shipments }: { shipments: Shipment[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {shipments.length > 0 ? (
                    shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                            <TableCell className="font-medium">{shipment.shipment_id_str}</TableCell>
                            <TableCell>{shipment.receiver_name}</TableCell>
                            <TableCell>{new Date(shipment.booking_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge 
                                    variant={shipment.status === 'Delivered' ? 'default' : 
                                    (shipment.status === 'In Transit' || shipment.status === 'Out for Delivery') ? 'secondary' : 'outline'}
                                >{shipment.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/track/${shipment.shipment_id_str}`}>
                                        <Search className="mr-2 h-4 w-4" /> Track
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No shipments in this category.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div>
             <h1 className="text-2xl font-bold mb-6">My Shipments</h1>
             <Card>
                <CardHeader>
                     <CardTitle>Shipment History</CardTitle>
                    <CardDescription>View and track all your ongoing and past shipments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="ongoing">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="ongoing">Ongoing ({filteredShipments.ongoing.length})</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered ({filteredShipments.delivered.length})</TabsTrigger>
                            <TabsTrigger value="pending">Pending Payment ({filteredShipments.pending.length})</TabsTrigger>
                        </TabsList>
                         {isLoading ? (
                            <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
                         ) : (
                            <>
                                <TabsContent value="ongoing">
                                    <ShipmentsTable shipments={filteredShipments.ongoing} />
                                </TabsContent>
                                <TabsContent value="delivered">
                                    <ShipmentsTable shipments={filteredShipments.delivered} />
                                </TabsContent>
                                <TabsContent value="pending">
                                    <ShipmentsTable shipments={filteredShipments.pending} />
                                </TabsContent>
                            </>
                         )}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
