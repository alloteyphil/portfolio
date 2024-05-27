"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import emailjs from "@emailjs/browser";
import { BackgroundGradient } from "./ui/background-gradient";

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
      <BackgroundGradient className="rounded-[22px] w-[500px] max-h-max flex flex-col my-auto p-6 pb-10 bg-white dark:bg-black">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="text-2xl font-medium mt-4">Your name</label>
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
            className="bg-black border-b p-2 border-white focus:outline-none"
            placeholder="Name"
          />
          {errors.name && (
            <span className="text-red-500 italic text-sm p=0 m-0">
              {errors.name.message}
            </span>
          )}
          <label className="text-2xl font-medium mt-4">Email</label>
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
            className="bg-black border-b p-2 border-white focus:outline-none"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500 italic text-sm p=0 m-0">
              Please enter a valid email address
            </span>
          )}
          <label className="text-2xl font-medium mt-4">Your message</label>
          <textarea
            rows={6}
            name="message"
            {...register("message", {
              required: true,
            })}
            className="bg-black border-b p-2 border-white focus:outline-none"
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
      </BackgroundGradient>
    </div>
  );
};

export default ContactForm;
