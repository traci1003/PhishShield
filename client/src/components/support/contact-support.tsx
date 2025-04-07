import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { contactFormSchema as baseContactFormSchema } from "@shared/schema";

// Add issueType field to the form schema
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
  issueType: z.enum(["technical", "billing", "feature", "security", "other"], {
    required_error: "Please select an issue type",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: Partial<ContactFormValues> = {
  name: "",
  email: "",
  subject: "",
  message: "",
  issueType: "technical",
};

export default function ContactSupport() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onBlur", // Validate fields when they lose focus
  });
  
  const contactMutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      // Create the support request object that matches the API schema
      const contactRequest = {
        name: values.name,
        email: values.email,
        subject: `${values.issueType.toUpperCase()}: ${values.subject}`,
        message: values.message
      };
      
      // Send to our API endpoint
      return apiRequest("POST", "/api/contact-support", contactRequest);
    },
    onSuccess: (data: any) => {
      setSubmitted(true);
      
      // Check if email was actually sent
      if (data.emailSent) {
        toast({
          title: "Support request submitted",
          description: "We've received your message and will respond to your email soon.",
        });
      } else {
        toast({
          title: "⚠️ Support request logged",
          description: "Your request has been recorded, but there was an issue sending confirmation emails. Our team will still review your request.",
          variant: "default" // Using default variant with a warning emoji
        });
      }
      
      form.reset();
    },
    onError: (error) => {
      console.error("Contact support error:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again or email us directly at support@phishshield.example.com",
      });
    },
  });
  
  const onSubmit = (values: ContactFormValues) => {
    contactMutation.mutate(values);
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <Card className="mb-6 rounded-xl overflow-hidden border">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-[#1E1442]">Contact Support</CardTitle>
          <CardDescription className="text-gray-600">
            Need help with PhishShield AI? Fill out the form below and our team will get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center rounded-full bg-[#e8eafd] p-4 mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#1E1442"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1E1442] mb-3">Support Request Received</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you for contacting us. We've received your message and will respond to your email soon.
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                className="px-8 py-2 bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442] rounded-full font-medium"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1E1442] font-medium">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            className="rounded-lg border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]" 
                            {...field} 
                          />
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
                        <FormLabel className="text-[#1E1442] font-medium">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your email address" 
                            className="rounded-lg border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1E1442] font-medium">Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Support request subject" 
                            className="rounded-lg border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="issueType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1E1442] font-medium">Issue Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-lg border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]">
                              <SelectValue placeholder="Select an issue type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing & Subscription</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="security">Security Concern</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1E1442] font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your issue in detail" 
                          className="min-h-[120px] rounded-lg border-gray-300 focus:border-[#c1c8fb] focus:ring-[#c1c8fb]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="px-8 py-2 bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442] rounded-full font-medium"
                  >
                    {contactMutation.isPending ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
                        Submitting...
                      </div>
                    ) : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      <Card className="rounded-xl overflow-hidden border">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-[#1E1442]">Additional Contact Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="flex items-start">
            <div className="mr-5">
              <div className="w-12 h-12 flex items-center justify-center bg-[#f8f9fe] rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#1E1442"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E1442]">Email Support</h3>
              <p className="text-gray-600 mt-1">
                For direct support, email us at: <a href="mailto:support@phishshield.example.com" className="text-blue-600 font-medium">support@phishshield.example.com</a>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-5">
              <div className="w-12 h-12 flex items-center justify-center bg-[#f8f9fe] rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.07 18.28C7.5 17.38 10.12 16.5 12 16.5C13.88 16.5 16.51 17.38 16.93 18.28C15.57 19.36 13.86 20 12 20C10.14 20 8.43 19.36 7.07 18.28ZM18.36 16.83C16.93 15.09 13.46 14.5 12 14.5C10.54 14.5 7.07 15.09 5.64 16.83C4.62 15.49 4 13.82 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.82 19.38 15.49 18.36 16.83ZM12 6C10.06 6 8.5 7.56 8.5 9.5C8.5 11.44 10.06 13 12 13C13.94 13 15.5 11.44 15.5 9.5C15.5 7.56 13.94 6 12 6ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11Z" fill="#1E1442"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E1442]">Live Chat</h3>
              <p className="text-gray-600 mt-1">
                Available Monday to Friday, 9am - 5pm EST
              </p>
              <Button className="mt-4 bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442] rounded-full font-medium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="#1E1442"/>
                </svg>
                Start Chat
              </Button>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-5">
              <div className="w-12 h-12 flex items-center justify-center bg-[#f8f9fe] rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 18H13V16H11V18ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z" fill="#1E1442"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1E1442]">Knowledge Base</h3>
              <p className="text-gray-600 mt-1">
                Find answers to common questions in our help center
              </p>
              <Button className="mt-4 bg-[#c1c8fb] hover:bg-[#a8b0f8] text-[#1E1442] rounded-full font-medium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM9 13H15V15H9V13ZM9 16H15V18H9V16ZM9 10H11V12H9V10Z" fill="#1E1442"/>
                </svg>
                Browse Articles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}