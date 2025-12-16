
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, PackageCheck, Truck, Warehouse, CheckCircle2, ArrowLeft, Loader2, Download, FileText, CircleAlert, Landmark, CreditCard, QrCode } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const paymentSchema = z.object({
  utr: z.string().min(12, { message: "UTR must be 12 digits." }).max(12, { message: "UTR must be 12 digits." }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface TrackingHistory {
    stage: string;
    date: string;
    location: string;
    activity: string;
}

interface ShipmentDetails {
    shipment_id_str: string;
    status: string;
    tracking_history: TrackingHistory[];
    total_with_tax_18_percent: number;
    payment_status: 'Pending' | 'Approved' | 'Rejected' | null;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Delivered': return CheckCircle2;
        case 'Out for Delivery': return Truck;
        case 'In Transit': return Truck;
        case 'Booked': return PackageCheck;
        case 'Pending Payment': return CreditCard;
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
        case 'Pending Payment': return 'bg-orange-500 text-white';
        default: return 'bg-primary text-primary-foreground';
    }
}

export default function TrackingResultPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const idFromUrl = Array.isArray(params.trackingId) ? params.trackingId[0] : params.trackingId;
  const [trackingId, setTrackingId] = useState(idFromUrl || '');
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(!!idFromUrl);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const fetchShipmentDetails = async (id: string) => {
      if (!id) {
          setIsLoading(false);
          return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${id}`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Shipment not found');
        }
        const data: ShipmentDetails = await response.json();
        setShipmentDetails(data);
      } catch (err: any) {
        setError(err.message);
        setShipmentDetails(null);
      } finally {
        setIsLoading(false);
      }
  };


  useEffect(() => {
    if (idFromUrl) {
      fetchShipmentDetails(idFromUrl);
    }
  }, [idFromUrl]);

  const handleTrack = () => {
    if (trackingId) {
      router.push(`/track/${trackingId}`);
    }
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { utr: "" },
  });

  const onPaymentSubmit = async (values: PaymentFormValues) => {
      if (!shipmentDetails) return;
      setIsSubmittingPayment(true);
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  shipment_id_str: shipmentDetails.shipment_id_str,
                  utr: values.utr,
                  amount: shipmentDetails.total_with_tax_18_percent,
              })
          });
          const result = await response.json();
          if (response.ok) {
              toast({ title: "Success", description: result.message });
              // Refetch shipment details to get the new payment_status
              fetchShipmentDetails(shipmentDetails.shipment_id_str);
          } else {
              toast({ title: "Error", description: result.error || "Failed to submit payment.", variant: "destructive" });
          }
      } catch (err) {
          toast({ title: "Network Error", description: "Could not connect to server.", variant: "destructive" });
      } finally {
          setIsSubmittingPayment(false);
      }
  }

  const showPaymentForm = shipmentDetails?.status === 'Pending Payment' && !shipmentDetails.payment_status;
  const showPaymentPendingReview = shipmentDetails?.status === 'Pending Payment' && shipmentDetails.payment_status === 'Pending';


  return (
    <div className="space-y-8">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter your Tracking ID"
            className="text-base h-12 bg-background"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
          />
          <Button type="submit" onClick={handleTrack} size="lg" className="h-12">
            <Search className="mr-2 h-5 w-5" />
            Track Another
          </Button>
        </div>
        
        {isLoading && (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )}
        {error && (
            <Card className="text-center p-12 text-red-500 border-red-500">
                <CardHeader>
                    <CardTitle>Tracking Error</CardTitle>
                    <CardDescription className="text-red-500">{error}</CardDescription>
                </CardHeader>
            </Card>
        )}

        {showPaymentForm && (
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Payment</CardTitle>
                    <CardDescription>Your booking is confirmed. Please complete the payment of <span className="font-bold text-primary">₹{shipmentDetails.total_with_tax_18_percent.toFixed(2)}</span> to proceed.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Tabs defaultValue="upi" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upi"><QrCode className="mr-2 h-4 w-4"/>UPI / QR Code</TabsTrigger>
                        <TabsTrigger value="bank" disabled><Landmark className="mr-2 h-4 w-4"/>Bank Transfer</TabsTrigger>
                        <TabsTrigger value="card" disabled><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upi" className="mt-4">
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div className="flex flex-col items-center justify-center">
                                <p className="font-semibold mb-2">Scan to Pay</p>
                                <Image src="/images/logo/qr_code.png" alt="UPI QR Code" width={200} height={200} data-ai-hint="QR code" />
                                <p className="text-sm text-muted-foreground mt-2 text-center">Scan with any UPI app like Google Pay, PhonePe, or Paytm.</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">After completing the payment, please enter the 12-digit UTR/Transaction ID below to confirm your shipment.</p>
                                 <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onPaymentSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="utr"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>12-Digit UTR Number</FormLabel>
                                                <FormControl>
                                                <Input placeholder="Enter UTR here" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isSubmittingPayment}>
                                            {isSubmittingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                            Submit & Confirm Payment
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="bank">Bank transfer details coming soon.</TabsContent>
                      <TabsContent value="card">Card payment gateway coming soon.</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        )}

        {showPaymentPendingReview && (
             <Card>
                <CardHeader className="text-center">
                    <CardTitle>Payment Under Review</CardTitle>
                    <CardDescription>Thank you for submitting your payment details. An administrator will verify it shortly, and your shipment status will be updated to 'Booked'.</CardDescription>
                </CardHeader>
            </Card>
        )}


        {shipmentDetails && (
        <Card>
          <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="font-headline text-2xl">Shipment Progress</CardTitle>
                      <CardDescription>Tracking ID: <span className="font-bold text-primary">{idFromUrl}</span></CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                          <Link href={`/awb/${idFromUrl}`} target="_blank"><Download className="mr-2 h-4 w-4"/> AWB</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                          <Link href={`/invoice/${idFromUrl}`} target="_blank"><FileText className="mr-2 h-4 w-4"/> Invoice</Link>
                      </Button>
                  </div>
              </div>
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
        )}
    </div>
  );
}

    