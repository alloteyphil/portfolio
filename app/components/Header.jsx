/* eslint-disable react/no-unescaped-entities */
import React from "react";

export const Header = () => {
  return (
    <div className="boxed grid place-items-center h-screen relative z-10">
      <div className="flex flex-col items-center gap-10">
        <p className="text-8xl uppercase">Hey, I'm Philip Allotey</p>
        <p className="text-lg text-center max-w-2xl mx-auto leading-loose">
          A front-end developer passionate about crafting user-centric digital
          experiences.
        </p>
      </div>
    </div>
  );
};
