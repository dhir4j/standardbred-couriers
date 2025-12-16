
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Loader2, Download, PackageCheck, Truck, Warehouse, CheckCircle2, CircleAlert } from 'lucide-react';
import { useSession } from '@/hooks/use-session';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AwbSheet from '@/components/awb-sheet';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface TrackingHistory {
    stage: string;
    date: string;
    location: string;
    activity: string;
}

interface ShipmentDetails {
    shipment_id_str: string;
    status: string;
    sender_name: string;
    sender_address_street: string;
    sender_address_city: string;
    sender_address_state: string;
    sender_address_pincode: string;
    sender_address_country: string;
    sender_phone: string;
    user_email: string;
    receiver_name: string;
    receiver_address_street: string;
    receiver_address_city: string;
    receiver_address_state: string;
    receiver_address_pincode: string;
    receiver_address_country: string;
    receiver_phone: string;
    package_weight_kg: number;
    package_length_cm: number;
    package_width_cm: number;
    package_height_cm: number;
    service_type: string;
    booking_date: string;
    total_with_tax_18_percent: number;
    tracking_history: TrackingHistory[];
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Delivered': return CheckCircle2;
        case 'Out for Delivery': return Truck;
        case 'In Transit': return Truck;
        case 'Booked': return PackageCheck;
        case 'Pending Payment': return PackageCheck;
        case 'Cancelled': return CircleAlert;
        default: return Warehouse;
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Delivered': return 'bg-green-500 text-white';
        case 'Cancelled': return 'bg-red-500 text-white';
        case 'Out for Delivery':
        case 'In Transit': return 'bg-blue-500 text-white';
        default: return 'bg-primary text-primary-foreground';
    }
}


export default function AwbTrackingPage() {
  const searchParams = useSearchParams();
  const idFromQuery = searchParams.get('id');

  const [trackingId, setTrackingId] = useState(idFromQuery || '');
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const { toast } = useToast();
  const awbRef = useRef<HTMLDivElement>(null);


  const handleSearch = useCallback(async (idToSearch: string) => {
    if (!idToSearch) {
      toast({ title: "Error", description: "Please enter a Tracking ID.", variant: "destructive" });
      return;
    }
     if (!session?.email) {
      toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    setShipmentDetails(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${idToSearch}`,{
           headers: { 'X-User-Email': session.email }
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Shipment not found');
      }
      const data: ShipmentDetails = await response.json();
      setShipmentDetails(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);
  
  useEffect(() => {
    if (idFromQuery) {
        handleSearch(idFromQuery);
    }
  }, [idFromQuery, handleSearch]);


  const handleDownloadPdf = async () => {
    const input = awbRef.current;
    if (!input) return;

    try {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`AWB-${shipmentDetails?.shipment_id_str}.pdf`);
    } catch(e) {
        console.error("Error generating PDF", e);
        toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    }
  };
  
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-100/50 w-full">
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AWB / Tracking</CardTitle>
                    <CardDescription>Enter the AWB number (Tracking ID) to fetch shipment details and generate the Air Waybill.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter Tracking ID..."
                            className="h-11"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(trackingId)}
                            disabled={isLoading}
                        />
                        <Button onClick={() => handleSearch(trackingId)} disabled={isLoading} className="h-11">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {isLoading && (
              <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {shipmentDetails && (
              <>
                <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Shipment Progress</CardTitle>
                      <CardDescription>Tracking ID: <span className="font-bold text-primary">{shipmentDetails.shipment_id_str}</span></CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="relative pl-8">
                          <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-border -translate-x-1/2"></div>
                          {shipmentDetails.tracking_history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((step, index) => {
                              const Icon = getStatusIcon(step.stage);
                              const iconColor = getStatusColor(step.stage);
                              return (
                                  <div key={index} className="flex items-start gap-6 mb-8 last:mb-0">
                                  <div className={cn(
                                      "z-10 flex h-10 w-10 items-center justify-center rounded-full ring-8 ring-secondary",
                                      iconColor
                                  )}>
                                      <Icon className="h-5 w-5" />
                                  </div>
                                  <div className="pt-1.5 flex-1">
                                      <div className="grid grid-cols-3 gap-4 items-start">
                                          <div className="col-span-2">
                                              <p className="font-semibold text-lg">{step.activity}</p>
                                              <p className="text-muted-foreground text-sm">{new Date(step.date).toLocaleString()}</p>
                                          </div>
                                          <p className="text-muted-foreground text-sm font-medium text-right">{step.location}</p>
                                      </div>
                                      <p className="text-muted-foreground text-sm mt-1">{step.stage}</p>
                                  </div>
                                  </div>
                              )
                          })}
                      </div>
                  </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>AWB Details for {shipmentDetails.shipment_id_str}</CardTitle>
                                <CardDescription>Review the details below and proceed to download the AWB.</CardDescription>
                            </div>
                            <Button onClick={handleDownloadPdf}>
                                <Download className="mr-2 h-4 w-4"/>
                                Download AWB
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div ref={awbRef} className="bg-white">
                           <AwbSheet shipment={shipmentDetails} />
                        </div>
                    </CardContent>
                </Card>
              </>
            )}
        </div>
    </div>
  );
}
