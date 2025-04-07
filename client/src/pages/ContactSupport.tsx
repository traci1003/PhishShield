import ContactSupportComponent from "@/components/support/contact-support";

export default function ContactSupport() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h1>
        <p className="text-gray-600">
          Get help from our dedicated support team
        </p>
      </div>
      
      <ContactSupportComponent />
    </div>
  );
}