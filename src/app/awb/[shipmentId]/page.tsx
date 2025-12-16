
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer, Download } from 'lucide-react';
import AwbSheet from '@/components/awb-sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    goods_details: any[];
}


export default function AwbPage() {
    const params = useParams();
    const shipmentId = Array.isArray(params.shipmentId) ? params.shipmentId[0] : params.shipmentId;
    const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const awbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (shipmentId) {
            const fetchDetails = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${shipmentId}`);
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error || 'Shipment not found');
                    }
                    const data: ShipmentDetails = await response.json();
                    setShipmentDetails(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDetails();
        }
    }, [shipmentId]);

    const handleDownloadPdf = async () => {
        const input = awbRef.current;
        if (!input) {
            toast({ title: "Error", description: "Could not find AWB content to download.", variant: "destructive" });
            return;
        }

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
    
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2">Loading AWB...</p>
            </div>
        );
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-500 bg-secondary">Error: {error}</div>;
    }

    if (!shipmentDetails) {
        return <div className="flex h-screen items-center justify-center bg-secondary">No shipment details found.</div>;
    }

    return (
        <div className="bg-secondary min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-end gap-2 mb-4 no-print">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button onClick={handleDownloadPdf}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
                <div ref={awbRef} className="bg-white rounded-sm shadow-lg">
                    <AwbSheet shipment={shipmentDetails} />
                </div>
            </div>
        </div>
    );
}

