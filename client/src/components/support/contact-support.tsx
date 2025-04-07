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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Need help with PhishShield AI? Fill out the form below and our team will get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-2 mb-4">
                <span className="material-icons text-green-600 text-3xl">check_circle</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Support Request Received</h3>
              <p className="text-gray-600 mb-4">
                Thank you for contacting us. We've received your message and will respond to your email soon.
              </p>
              <Button onClick={() => setSubmitted(false)}>Submit Another Request</Button>
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
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
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
                          <Input placeholder="Your email address" {...field} />
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
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Support request subject" {...field} />
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
                        <FormLabel>Issue Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your issue in detail" 
                          className="min-h-[120px]" 
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
                    className="px-6"
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
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Contact Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-primary-50 p-2">
              <span className="material-icons text-primary-600">email</span>
            </div>
            <div>
              <h3 className="font-medium">Email Support</h3>
              <p className="text-gray-600 text-sm">
                For direct support, email us at: <a href="mailto:support@phishshield.example.com" className="text-primary-600 font-medium">support@phishshield.example.com</a>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-primary-50 p-2">
              <span className="material-icons text-primary-600">support_agent</span>
            </div>
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-gray-600 text-sm">
                Available Monday to Friday, 9am - 5pm EST
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <span className="material-icons mr-1 text-sm">chat</span>
                Start Chat
              </Button>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 rounded-full bg-primary-50 p-2">
              <span className="material-icons text-primary-600">help_center</span>
            </div>
            <div>
              <h3 className="font-medium">Knowledge Base</h3>
              <p className="text-gray-600 text-sm">
                Find answers to common questions in our help center
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <span className="material-icons mr-1 text-sm">article</span>
                Browse Articles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}