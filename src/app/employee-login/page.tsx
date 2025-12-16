
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ShieldCheck } from "lucide-react";
import { adminLoginSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function EmployeeLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { setSession } = useSession();
  
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "employee",
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password }),
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

      const user = result.user;
      const isFormAdmin = data.role === 'admin';

      if (isFormAdmin) {
        if (!user.isAdmin) {
            toast({ title: "Access Denied", description: "You are not an administrator.", variant: "destructive" });
            return;
        }
        // If the user is an admin and trying to log in as admin, that's fine.
      } else { // Form role is 'employee'
        if (user.isAdmin) {
             toast({ title: "Role Mismatch", description: "Administrators must log in via the 'Admin' role selection.", variant: "destructive" });
             return;
        }
        if (!user.isEmployee) {
            toast({ title: "Access Denied", description: "This account is for customers only. Please use the customer login page.", variant: "destructive" });
            return;
        }
      }


      setSession(user);
      toast({
          title: "Login Successful",
          description: "Redirecting...",
      });

      if (user.isAdmin) {
          router.push('/admin/dashboard');
      } else {
          router.push('/employee/dashboard');
      }

    } catch (error) {
        toast({
            title: "Network Error",
            description: "Could not connect to the server.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-18rem)] items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-md border">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-sm p-3 w-fit mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">Staff Login</CardTitle>
          <CardDescription>Enter your credentials to access the appropriate portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select your role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel className="font-normal">Admin</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="employee" />
                          </FormControl>
                          <FormLabel className="font-normal">Employee</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} className="h-11"/>
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
              <Button type="submit" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
