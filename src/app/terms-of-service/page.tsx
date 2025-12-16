import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-secondary py-16 sm:py-24">
        <div className="container">
            <Card className="max-w-4xl mx-auto shadow-lg border">
                <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                        <FileText className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Terms of Service</CardTitle>
                    <CardDescription className="text-lg">The regulations for using our courier services.</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <p><strong>1. Acceptance of Terms</strong></p>
                <p>By accessing or using the services of HK SPEED COURIERS, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
                
                <p><strong>2. Services</strong></p>
                <p>We provide courier and logistics services as described on our website. We reserve the right to refuse service for any item that is prohibited by law or our company policy.</p>

                <p><strong>3. User Accounts</strong></p>
                <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
                
                <p><strong>4. Limitation of Liability</strong></p>
                <p>In no event shall HK SPEED COURIERS, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

                <p><strong>5. Governing Law</strong></p>
                <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
