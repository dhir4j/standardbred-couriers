
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
import { loginSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useSession } from "@/hooks/use-session";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { setSession } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials.",
          variant: "destructive",
        });
        return;
      }
      
      if (result.user?.isAdmin || result.user?.isEmployee) {
         toast({
          title: "Login Role Error",
          description: "This is a customer login page. Staff must log in via the employee portal.",
          variant: "destructive",
        });
        return;
      }

      setSession(result.user);
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push('/dashboard');

    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <Card className="w-full max-w-md shadow-2xl shadow-purple-500/10 border-2 border-purple-100 relative z-10 bg-white">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto gradient-primary text-white rounded-2xl p-4 w-fit mb-6 shadow-lg shadow-purple-500/30">
            <LogIn className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">
            <span className="gradient-text">Customer Login</span>
          </CardTitle>
          <CardDescription className="text-lg mt-2">Access your account to manage your shipments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full text-lg py-7 gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            {"Don't have an account? "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold">
              <Link href="/signup">Register Here</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
