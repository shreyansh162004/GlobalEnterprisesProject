import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SEO, { localBusinessSchema } from "@/components/SEO";
import { getContactInfo, phoneToTelHref, ContactInfo } from "@/data/products";

const Contact = () => {
  const [contact, setContact] = useState<ContactInfo>(getContactInfo);
  useEffect(() => {
    const sync = () => setContact(getContactInfo());
    window.addEventListener("ge-contact-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ge-contact-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
  <div className="min-h-screen pt-24 pb-24 md:pb-16">
    <SEO
      title="Contact Global Enterprises – Laptop Shop Jabalpur"
      description={`Visit Global Enterprises at ${contact.address}. Call ${contact.phone} for second hand laptops with warranty.`}
      path="/contact"
      jsonLd={localBusinessSchema}
    />
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium mb-3 tracking-wider">CONTACT</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold">Get in Touch</h1>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <ScrollReveal direction="left">
          <div className="glass-card p-8 md:p-10 space-y-6">
            <h2 className="text-xl font-heading font-bold">Contact Information</h2>
            <div className="space-y-5">
              <a href={`tel:${phoneToTelHref(contact.phone)}`} className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm">{contact.phone}</p>
                </div>
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm">{contact.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-sm">{contact.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Working Hours</p>
                  <p className="text-sm">{contact.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="glass-card overflow-hidden rounded-2xl h-full min-h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.0!2d79.9556!3d23.1687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b1a5a04ff23%3A0x1f0062505c97cb!2sGlobal+Enterprises!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 300 }}
              allowFullScreen
              loading="lazy"
              title="Global Enterprises Location"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  </div>
  );
};

export default Contact;
