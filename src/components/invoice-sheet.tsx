
"use client";

import Image from 'next/image';

interface GoodsDetail {
    description: string;
    quantity: number;
    hsn_code: string;
    value: number;
}

interface InvoiceSheetProps {
    shipment: {
        shipment_id_str: string;
        booking_date: string;
        sender_name: string;
        sender_address_street: string;
        sender_address_city: string;
        sender_address_state: string;
        sender_address_pincode: string;
        sender_address_country: string;
        sender_phone: string;
        receiver_name: string;
        receiver_address_street: string;
        receiver_address_city: string;
        receiver_address_state: string;
        receiver_address_pincode: string;
        receiver_address_country: string;
        receiver_phone: string;
        price_without_tax: number;
        tax_amount_18_percent: number;
        total_with_tax_18_percent: number;
        goods_details: GoodsDetail[];
    };
}

const toWords = (num: number): string => {
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const inWords = (n: number): string => {
        if (n < 20) return a[n];
        let digit = n % 10;
        let ten = Math.floor(n / 10);
        return `${b[ten]} ${a[digit]}`.trim();
    }

    const numToWords = (n: number): string => {
        if (n === 0) return 'zero';
        const crore = Math.floor(n / 10000000);
        n %= 10000000;
        const lakh = Math.floor(n / 100000);
        n %= 100000;
        const thousand = Math.floor(n / 1000);
        n %= 1000;
        const hundred = Math.floor(n / 100);
        n %= 100;
        
        let res = "";
        if (crore > 0) res += `${inWords(crore)} crore `;
        if (lakh > 0) res += `${inWords(lakh)} lakh `;
        if (thousand > 0) res += `${inWords(thousand)} thousand `;
        if (hundred > 0) res += `${inWords(hundred)} hundred `;
        if (n > 0) res += `and ${inWords(n)}`;
        return res.trim();
    }
    
    const [integerPart, decimalPart] = num.toFixed(2).split('.').map(part => parseInt(part, 10));
    let words = numToWords(integerPart);
    if(decimalPart > 0) {
        words += ` and ${numToWords(decimalPart)} paise`;
    }
    return words.replace(/\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Only';
};

export default function InvoiceSheet({ shipment }: InvoiceSheetProps) {
    const subtotal = shipment.price_without_tax;
    const tax = shipment.tax_amount_18_percent;
    const total = shipment.total_with_tax_18_percent;
    const totalInWords = toWords(total);
    const goods = shipment.goods_details && shipment.goods_details.length > 0
        ? shipment.goods_details 
        : [{ description: 'Courier Service Charge', quantity: 1, value: subtotal, hsn_code: '' }];
    
    const goodsTotalValue = goods.reduce((acc, item) => acc + item.value, 0);


    return (
        <div className="p-6 bg-white text-black font-sans text-xs">
            <div className="border border-gray-400 p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-400">
                    <div className="flex items-center space-x-4">
                        <Image src="/images/logo/logo.png" alt="HK Speed Couriers Logo" width={80} height={80} />
                        <div>
                            <h1 className="text-2xl font-bold">HK SPEED COURIERS</h1>
                            <p>SCF-148, FIRST FLOOR, URBAN ESTATE, PHASE-1, JALANDHAR, PUNJAB</p>
                            <p>Email: Hkspeedcouriersprivatelimited@gmail.com | Phone: +91-89689-27612</p>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-right">TAX INVOICE</h2>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-400">
                    <div>
                        <p><span className="font-bold">Invoice No:</span> {shipment.shipment_id_str}</p>
                        <p><span className="font-bold">Invoice Date:</span> {new Date(shipment.booking_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                         <p><span className="font-bold">GSTIN:</span> 03AAHCH9995D1ZA</p>
                    </div>
                </div>

                {/* Bill To / Ship To */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-400">
                    <div>
                        <h3 className="font-bold mb-2 underline">BILL TO:</h3>
                        <p className="font-bold">{shipment.sender_name}</p>
                        <p>{shipment.sender_address_street},</p>
                        <p>{shipment.sender_address_city}, {shipment.sender_address_state} - {shipment.sender_address_pincode}</p>
                        <p>{shipment.sender_address_country}</p>
                        <p>Phone: {shipment.sender_phone}</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2 underline">SHIP TO:</h3>
                        <p className="font-bold">{shipment.receiver_name}</p>
                        <p>{shipment.receiver_address_street},</p>
                        <p>{shipment.receiver_address_city}, {shipment.receiver_address_state} - {shipment.receiver_address_pincode}</p>
                        <p>{shipment.receiver_address_country}</p>
                        <p>Phone: {shipment.receiver_phone}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">#</th>
                            <th className="p-2">Description of Goods</th>
                            <th className="p-2 text-right">Qty</th>
                            <th className="p-2 text-right">HSN Code</th>
                            <th className="p-2 text-right">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                         {goods.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{item.description}</td>
                                <td className="p-2 text-right">{item.quantity}</td>
                                <td className="p-2 text-right">{item.hsn_code || 'N/A'}</td>
                                <td className="p-2 text-right">{item.value.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                 {/* Totals */}
                <div className="flex justify-end pt-4">
                    <div className="w-1/2 space-y-2">
                         <div className="flex justify-between">
                            <span className="font-bold">Goods Value:</span>
                            <span>₹{goodsTotalValue.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="font-bold">Freight Charge:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">IGST (18%):</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>Total Invoice Value:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Amount in Words */}
                <div className="pb-4 border-t border-gray-400 mt-4 pt-4">
                    <p><span className="font-bold">Amount in words:</span> {totalInWords}</p>
                </div>
                
                {/* Footer */}
                <div className="text-center pt-4 border-t border-gray-400">
                    <p className="font-bold">This is a computer-generated invoice.</p>
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </div>
    );
}
