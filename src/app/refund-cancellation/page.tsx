import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";

export default function RefundCancellationPage() {
  return (
    <div className="bg-secondary py-16 sm:py-24">
        <div className="container">
            <Card className="max-w-4xl mx-auto shadow-lg border">
                <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                        <CircleDollarSign className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Refund & Cancellation Policy</CardTitle>
                    <CardDescription className="text-lg">Our commitment to a fair and transparent process.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-2">1. Cancellation Policy</h2>
                      <p>A shipment booking can be cancelled for a full refund provided the cancellation request is made at least 2 hours before the scheduled pickup time. To cancel a booking, please log in to your account and navigate to your shipments or contact our customer care team directly with your booking reference number.</p>
                      <p className="mt-2">Cancellations made less than 2 hours before the scheduled pickup may be subject to a cancellation fee equivalent to 25% of the total booking amount. Once a shipment has been picked up, it cannot be cancelled.</p>
                    </section>
                    
                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-2">2. Refund Policy</h2>
                      <p>Refunds for eligible cancellations will be processed within 5-7 business days and credited to the original method of payment. You will receive an email confirmation once the refund has been processed.</p>
                      <p className="mt-2">For service-related issues, such as significant delays caused by our operational failures or non-delivery, you may be eligible for a partial or full refund. Each case will be investigated thoroughly by our team.</p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-2">3. Claims for Lost or Damaged Goods</h2>
                      <p>In the unfortunate event that your package is lost or arrives damaged, please file a claim within 30 days of the scheduled delivery date. To initiate a claim, you must provide the tracking ID, a description of the contents, proof of value (invoice), and photographic evidence of any damage.</p>
                       <p className="mt-2">Claims can be submitted through our customer care portal or by contacting our support team. Our team will investigate the claim and provide a resolution within 14 business days. The liability for lost or damaged goods is limited as per our Terms of Service unless additional insurance was purchased at the time of booking.</p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold text-foreground mb-2">4. Non-Refundable Situations</h2>
                      <p>Refunds will not be issued in the following situations:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Delays caused by incorrect or incomplete address information provided by the shipper.</li>
                        <li>Delays due to unforeseen circumstances such as natural disasters, adverse weather conditions, or regulatory holds.</li>
                        <li>Shipments containing prohibited items.</li>
                        <li>Shipments that are refused by the recipient.</li>
                      </ul>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Contact Us</h2>
                        <p>If you have any questions about our Refund and Cancellation Policy, please do not hesitate to <Link href="/contact-us" className="text-primary font-semibold hover:underline">contact us</Link>. Our team is here to assist you.</p>
                    </section>
                  </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
