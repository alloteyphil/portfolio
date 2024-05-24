/* eslint-disable react/no-unescaped-entities */

"use client";

import Link from "next/link";

const About = () => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-16 boxed snap-start min-h-screen"
      id="about"
    >
      <h3 className="text-5xl font-semibold">About me</h3>
      <p className="text-center text-lg leading-10 max-w-3xl">
        Hey there, I'm Philip, a front-end engineer with a passion for crafting
        seamless digital experiences. With a keen eye for design and a knack for
        coding, I specialize in bringing user interfaces to life. Whether it's
        creating responsive layouts, optimizing performance, or implementing
        interactive features, I'm dedicated to delivering intuitive solutions
        that engage and delight users. Let's build something amazing together!
      </p>
      <Link
        target="_blank"
        href={
          "https://drive.google.com/file/d/12F2QVi11Ngy113Ug2swXQoiS-tdlOuiQ/view?usp=drive_link"
        }
        className="bg-white text-black hover:bg-black hover:text-white border border-white rounded-lg p-4"
      >
        View resume
      </Link>
    </div>
  );
};

export default About;
