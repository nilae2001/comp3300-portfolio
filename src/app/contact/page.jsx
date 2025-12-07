import ContactForm from "@/components/contact-me";

export default async function ContactPage() {
  return (
    <div className="flex justify-center w-full">
      <ContactForm className="w-[50%] mb-4" />
    </div>
  );
}