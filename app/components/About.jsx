/* eslint-disable react/no-unescaped-entities */
import React from "react";

const About = () => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-10 boxed snap-start min-h-screen"
      id="about"
    >
      <h3 className="text-5xl font-semibold">About me</h3>
      <p className="text-center text-lg leading-8 max-w-3xl">
        Hey there, I'm Philip, a front-end engineer with a passion for crafting
        seamless digital experiences. With a keen eye for design and a knack for
        coding, I specialize in bringing user interfaces to life. Whether it's
        creating responsive layouts, optimizing performance, or implementing
        interactive features, I'm dedicated to delivering intuitive solutions
        that engage and delight users. Let's build something amazing together!
      </p>
    </div>
  );
};

export default About;
