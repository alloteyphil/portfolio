import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div
      className="flex flex-col boxed snap-start min-h-screen gap-20 py-20"
      id="contact"
    >
      <h3 className="text-5xl items-center text-center font-semibold">
        Contact
      </h3>

      <div className="max-w-max">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
