"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";
import Image from "next/image";

export const EvervaultCard = ({ id, photo, className }) => {
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 200, damping: 30, mass: 0.5 });
  const mouseY = useSpring(rawMouseY, { stiffness: 200, damping: 30, mass: 0.5 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    rawMouseX.set(clientX - left);
    rawMouseY.set(clientY - top);
  }

  function onMouseLeave() {
    rawMouseX.set(0);
    rawMouseY.set(0);
  }

  return (
    <div
      className={cn(
        "p-0.5  bg-transparent aspect-square group/card flex items-center justify-center w-40 max-lg:w-24 h-full max-lg:h-24 relative",
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
        />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <Image
              src={photo}
              key={id}
              width={50}
              className="max-lg:h-12 max-lg:w-12"
              height={50}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY }) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage, willChange: "mask-image" };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500 will-change-[mask-image]"
        style={style}
      />
    </div>
  );
}

export const Icon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
