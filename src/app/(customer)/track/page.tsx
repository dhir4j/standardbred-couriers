
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from 'lucide-react';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrack = () => {
    if (trackingId) {
      router.push(`/track/${trackingId}`);
    }
  };

  return (
    <div>
        <h1 className="text-2xl font-bold mb-6">Track Shipment</h1>
        <Card className="max-w-2xl mx-auto shadow-md border">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary rounded-sm p-3 w-fit mb-4">
            <Search className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-headline">Track Your Shipment</CardTitle>
            <CardDescription>Enter your tracking ID to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex w-full items-center space-x-2">
            <Input
                type="text"
                placeholder="Enter your Tracking ID, e.g., RS..."
                className="text-base h-12"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
            <Button type="submit" onClick={handleTrack} size="lg" className="h-12">
                <Search className="mr-2 h-5 w-5" />
                Track
            </Button>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
