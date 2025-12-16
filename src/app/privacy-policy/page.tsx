import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-secondary py-16 sm:py-24">
        <div className="container">
            <Card className="max-w-4xl mx-auto shadow-lg border">
                <CardHeader className="text-center pb-8">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                        <ShieldAlert className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
                    <CardDescription className="text-lg">Our commitment to your data security.</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 text-base leading-relaxed">
                <p><strong>Last Updated: [Date]</strong></p>
                <p>HK SPEED COURIERS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. By using our services, you agree to the collection and use of information in accordance with this policy.</p>
                
                <h3 className="font-semibold text-foreground text-xl pt-4">Information Collection and Use</h3>
                <p>We collect various types of information for various purposes to provide and improve our Service to you. This may include personal identification information (Name, email address, phone number, address) and tracking data.</p>
                
                <h3 className="font-semibold text-foreground text-xl pt-4">Use of Data</h3>
                <p>We use the collected data to provide and maintain our service, to notify you about changes to our service, to provide customer support, and to monitor the usage of our service.</p>

                <h3 className="font-semibold text-foreground text-xl pt-4">Data Security</h3>
                <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                
                <h3 className="font-semibold text-foreground text-xl pt-4">Changes to This Privacy Policy</h3>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
