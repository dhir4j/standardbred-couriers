"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { contactSchema } from "@/lib/schemas";

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactUsPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
    });
    form.reset();
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="container relative z-10">
        <div className="bg-white p-12 rounded-3xl shadow-2xl shadow-orange-500/10 border-2 border-orange-100">
            <div className="text-center pb-12">
              <h1 className="text-4xl sm:text-5xl font-headline font-bold">
                <span className="gradient-text">Get in Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-4">We're here to help with any questions you may have.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-headline font-bold">Send us a Message</h2>
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="your.email@example.com" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Inquiry about shipping" {...field} className="h-11" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Please type your message here..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" size="lg" className="w-full text-lg py-7 gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-headline font-bold">Contact Information</h2>
                <p className="text-muted-foreground text-lg">You can also reach us through the following channels. We're available during standard business hours.</p>

                <div className="space-y-6">
                    <div className="flex items-start gap-5 p-6 rounded-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary text-white shrink-0 shadow-lg shadow-orange-500/30">
                          <MapPin className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2">Address</h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">123 Logistics Boulevard,<br/>Suite 500, New York, NY 10001</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5 p-6 rounded-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary text-white shrink-0 shadow-lg shadow-orange-500/30">
                          <Phone className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2">Phone</h3>
                          <p className="text-muted-foreground text-lg"><a href="tel:18005551234" className="hover:text-primary transition-colors">+1-800-555-1234</a></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-5 p-6 rounded-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary text-white shrink-0 shadow-lg shadow-orange-500/30">
                          <Mail className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-2">Email</h3>
                          <p className="text-muted-foreground text-lg"><a href="mailto:contact@standardbredcouriers.com" className="hover:text-primary transition-colors">contact@standardbredcouriers.com</a></p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
