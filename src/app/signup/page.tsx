
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    const signupData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData),
        });

        const result = await response.json();

        if (!response.ok) {
            toast({
                title: "Signup Failed",
                description: result.error || "An unexpected error occurred.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Account Created",
            description: "You have successfully registered. Please log in.",
        });
        router.push('/login');
    } catch (error) {
        toast({
            title: "Network Error",
            description: "Could not connect to the server.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <Card className="w-full max-w-md shadow-2xl shadow-orange-500/10 border-2 border-orange-100 relative z-10 bg-white">
        <CardHeader className="text-center pb-6 sm:pb-8">
            <div className="mx-auto gradient-primary text-white rounded-2xl p-4 w-fit mb-6 shadow-lg shadow-orange-500/30">
                <UserPlus className="h-8 w-8" />
            </div>
          <CardTitle className="text-2xl sm:text-3xl font-headline">
            <span className="gradient-text">Create a Customer Account</span>
          </CardTitle>
          <CardDescription className="text-base sm:text-lg mt-2">Register for an account to book and manage shipments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-base sm:text-lg py-6 sm:py-7 gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            {"Already have an account? "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold">
              <Link href="/login">Login Here</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
