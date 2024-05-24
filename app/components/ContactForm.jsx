"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [disabled, setDisabled] = useState(false);

  const toastifySuccess = () => {
    toast.success("Message sent!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      className: "--toastify-color-success",
      toastId: "notifyToast",
    }),
      toast.error("Message failed to send", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        className: "--toastify-color-error",
        toastId: "notifyToast",
      });
  };

  const onSubmit = async (data) => {
    const { name, email, message } = data;
    try {
      setDisabled(true);

      const templateParams = {
        name,
        email,
        message,
      };
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_PUBLIC_KEY
      );
      reset();
      toastifySuccess();
      setDisabled(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className="text-2xl font-medium">Your name</label>
        <input
          type="text"
          name="name"
          {...register("name", {
            required: {
              value: true,
              message: "Please enter your name",
            },
            maxLength: {
              value: 30,
              message: "Please use 30 characters or less",
            },
          })}
          className="bg-black border p-2 rounded-lg w-[450px] border-white"
          placeholder="Name"
        />
        {errors.name && (
          <span className="text-red-500 italic text-sm p=0 m-0">
            {errors.name.message}
          </span>
        )}
        <label className="text-2xl font-medium">Email</label>
        <input
          type="email"
          name="email"
          {...register("email", {
            required: true,
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "Invalid email address",
            },
          })}
          className="bg-black border p-2 rounded-lg w-[450px] border-white"
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500 italic text-sm p=0 m-0">
            Please enter a valid email address
          </span>
        )}
        <label className="text-2xl font-medium">Your message</label>
        <textarea
          rows={3}
          name="message"
          {...register("message", {
            required: true,
          })}
          className="bg-black rounded-lg border p-2 border-white"
          placeholder="Enter your message"
        />
        {errors.message && (
          <span className="text-red-500 italic text-sm p=0 m-0">
            Please enter your message
          </span>
        )}
        <button
          type="submit"
          disabled={disabled}
          className={
            disabled
              ? " cursor-not-allowed rounded-lg p-3 w-40 hover:bg-black hover:text-white border border-white"
              : "bg-white text-black hover:bg-black hover:text-white border border-white rounded-lg p-3 w-40"
          }
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ContactForm;
