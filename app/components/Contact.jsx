import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div
      className="flex flex-col boxed snap-start lg:min-h-screen py-20 justify-center gap-20 max-lg:gap-10"
      id="contact"
    >
      <h3 className="text-5xl max-lg:text-4xl  items-center text-center font-semibold">
        Contact
      </h3>

      <div className="md:max-w-md lg:max-w-max w-full mx-auto">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
