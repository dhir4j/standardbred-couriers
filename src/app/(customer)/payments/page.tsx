"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This feature to manage your invoices and payments is currently under construction.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                    <CreditCard className="h-12 w-12 mb-4" />
                    <p>You will be able to view and download invoices and see your payment history here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
