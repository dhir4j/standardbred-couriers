import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function ShippingDeliveryPage() {
  return (
    <div className="bg-secondary py-16 sm:py-24">
        <div className="container">
            <Card className="max-w-4xl mx-auto shadow-lg border">
                <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                        <Truck className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Shipping & Delivery Policy</CardTitle>
                    <CardDescription className="text-lg">Information about our shipping and delivery process.</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <h3 className="font-semibold text-foreground text-xl pt-4">Shipping Process</h3>
                <p>We offer various shipping options to meet your business and personal needs, including standard, express, and international shipping. Shipping costs are calculated at the time of booking based on the weight, dimensions, and destination of your order. All shipments are assigned a unique tracking number for real-time monitoring.</p>
                
                <h3 className="font-semibold text-foreground text-xl pt-4">Delivery Times</h3>
                <p>Delivery times are estimates and commence from the date of shipping, rather than the date of order. Estimated delivery times are as follows:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Domestic Standard:</strong> 3-5 business days</li>
                    <li><strong>Domestic Express:</strong> 1-2 business days</li>
                    <li><strong>International:</strong> 7-14 business days (subject to customs clearance)</li>
                </ul>

                <h3 className="font-semibold text-foreground text-xl pt-4">Delivery Procedure</h3>
                <p>Our couriers will attempt delivery to the address provided. If the recipient is unavailable, a notice will be left with instructions for re-delivery or pickup. A signature is required for most deliveries to ensure secure receipt of your package.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
