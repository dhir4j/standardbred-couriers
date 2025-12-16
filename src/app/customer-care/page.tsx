import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Headset } from "lucide-react";

const faqs = [
    { question: "How can I track my package?", answer: "You can track your package by entering the tracking ID provided at the time of booking on our homepage. Real-time updates will be available as your package progresses through our network." },
    { question: "What are your standard delivery hours?", answer: "Our standard delivery hours are from 9:00 AM to 6:00 PM, Monday to Saturday. Special arrangements can be made for deliveries outside these hours by contacting customer care." },
    { question: "Is it possible to change the delivery address after shipping?", answer: "Address changes may be possible depending on the shipment's current status. Please contact our customer care team immediately with your tracking ID and new address details to inquire about the possibility." },
    { question: "What is the procedure if my package is lost or damaged?", answer: "In the rare event of a lost or damaged package, please file a claim through our customer care portal or contact us directly. We will initiate an investigation and guide you through the claims process." }
]

export default function CustomerCarePage() {
  return (
    <div className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-background p-8 border shadow-sm">
            <div className="text-center pb-8">
              <div className="mx-auto bg-primary/10 text-primary rounded-sm p-3 w-fit mb-4">
                <Headset className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-headline font-bold">Customer Care</h1>
              <p className="text-lg text-muted-foreground mt-2">Find answers to frequently asked questions below.</p>
            </div>
            <div className="space-y-6 text-base">
              <p className="text-muted-foreground text-center">
                Our customer care team is available to assist you with any inquiries or issues. You can reach us via <a href="/contact-us" className="text-primary hover:underline font-semibold">phone or email</a> during our business hours. We are dedicated to providing you with professional support.
              </p>
              <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
            </div>
        </div>
      </div>
    </div>
  );
}
