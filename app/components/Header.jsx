/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";

export const Header = () => {
  const words = `Philip Allotey`;
  const words2 = `Frontend Engineer`;
  return (
    <div
      id="header"
      className="w-full snap-start h-screen dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center"
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <TextGenerateEffect
        className="text-[100px] uppercase font-bold relative z-20 dark:text-neutral-400 py-8"
        words={words}
        opacity={1}
        duration={2}
        gradient={true}
      />
      <TextGenerateEffect
        className="text-xl text-center max-w-2xl mx-auto leading-loose uppercase tracking-widest text-neutral-400"
        words={words2}
        opacity={1}
        duration={2}
        startDelay={0.2}
      />
    </div>
  );
};
