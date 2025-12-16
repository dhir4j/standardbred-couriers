
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookUser, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useSession } from "@/hooks/use-session";
import { Loader2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const addressSchema = z.object({
  nickname: z.string().min(2, "Nickname is required."),
  name: z.string().min(2, "Name is required."),
  address_street: z.string().min(5, "Street address is required."),
  address_city: z.string().min(2, "City is required."),
  address_state: z.string().min(2, "State is required."),
  address_pincode: z.string().min(5, "Pincode is required."),
  address_country: z.string().min(2, "Country is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  address_type: z.enum(['sender', 'receiver']),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface SavedAddress extends AddressFormValues {
    id: number;
}

export default function AddressBookPage() {
    const { session } = useSession();
    const { data: addresses, isLoading, mutate } = useApi<SavedAddress[]>(session ? '/api/customer/addresses' : null);
    const { toast } = useToast();
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
    });

    const handleOpenForm = (address: SavedAddress | null = null) => {
        setEditingAddress(address);
        form.reset(address || {
            address_type: 'sender',
            nickname: '', name: '', address_street: '', address_city: '',
            address_state: '', address_pincode: '', address_country: 'India', phone: ''
        });
        setFormOpen(true);
    };

    const onSubmit = async (values: AddressFormValues) => {
        const url = editingAddress
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/customer/addresses/${editingAddress.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/customer/addresses`;
        const method = editingAddress ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'X-User-Email': session!.email },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            if (response.ok) {
                toast({ title: `Address ${editingAddress ? 'updated' : 'saved'} successfully.` });
                mutate();
                setFormOpen(false);
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', description: 'Could not save address.', variant: 'destructive' });
        }
    };
    
    const handleDelete = async (addressId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/addresses/${addressId}`, {
                method: 'DELETE',
                headers: { 'X-User-Email': session!.email },
            });
            if (response.ok) {
                toast({ title: 'Address deleted successfully.' });
                mutate();
            } else {
                 const result = await response.json();
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', description: 'Could not delete address.', variant: 'destructive' });
        }
    }
    
    const senderAddresses = addresses?.filter(a => a.address_type === 'sender') || [];
    const receiverAddresses = addresses?.filter(a => a.address_type === 'receiver') || [];

    const AddressCard = ({ address }: { address: SavedAddress }) => (
        <Card className="flex flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">{address.nickname}</CardTitle>
                <CardDescription>{address.name}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex-grow">
                <p>{address.address_street}</p>
                <p>{address.address_city}, {address.address_state} {address.address_pincode}</p>
                <p>{address.address_country}</p>
                <p>Phone: {address.phone}</p>
            </CardContent>
            <div className="flex justify-end gap-2 p-4 pt-0">
                <Button variant="ghost" size="icon" onClick={() => handleOpenForm(address)}><Edit className="h-4 w-4" /></Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this address.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(address.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Address Book</h1>
                <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenForm()}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to save an address for future use.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="address_type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="sender">Sender</SelectItem>
                                        <SelectItem value="receiver">Receiver</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                                <FormField control={form.control} name="nickname" render={({ field }) => ( <FormItem><FormLabel>Nickname</FormLabel><FormControl><Input {...field} placeholder="e.g., Home, Office" /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="address_street" render={({ field }) => ( <FormItem><FormLabel>Street Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="address_city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="address_state" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="address_pincode" render={({ field }) => ( <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="address_country" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem> )}/>
                                <DialogFooter>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Saving...' : 'Save Address'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            
             <Tabs defaultValue="sender" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sender">Sender Addresses ({senderAddresses.length})</TabsTrigger>
                    <TabsTrigger value="receiver">Receiver Addresses ({receiverAddresses.length})</TabsTrigger>
                </TabsList>
                {isLoading ? (
                     <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <>
                        <TabsContent value="sender">
                            {senderAddresses.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {senderAddresses.map(address => <AddressCard key={address.id} address={address} />)}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-muted-foreground">
                                    <BookUser className="mx-auto h-12 w-12 mb-4" />
                                    <p>No sender addresses saved yet.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="receiver">
                             {receiverAddresses.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {receiverAddresses.map(address => <AddressCard key={address.id} address={address} />)}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-muted-foreground">
                                    <BookUser className="mx-auto h-12 w-12 mb-4" />
                                    <p>No receiver addresses saved yet.</p>
                                </div>
                            )}
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
}
