/* eslint-disable react/no-unescaped-entities */

"use client";

import Link from "next/link";

const About = () => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-16 boxed snap-start min-h-screen max-lg:gap-10"
      id="about"
    >
      <h3 className="text-5xl max-lg:text-4xl font-semibold">About me</h3>
      <p className="text-center lg:text-lg leading-10 max-w-3xl max-lg:max-w-lg">
        Hey there, I'm Philip, a front-end engineer with a passion for crafting
        seamless digital experiences. With a keen eye for design and a knack for
        coding, I specialize in bringing user interfaces to life. Whether it's
        creating responsive layouts, optimizing performance, or implementing
        interactive features, I'm dedicated to delivering intuitive solutions
        that engage and delight users. Let's build something amazing together!
      </p>

      <button className="inline-flex h-12 p-8 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <Link
          target="_blank"
          href={
            "https://drive.google.com/file/d/1n7zeNdLTOvFEYQQB0oK7FW_V3gxnu6rf/view?usp=sharing"
          }
          className=""
        >
          View resume
        </Link>
      </button>
    </div>
  );
};

export default About;
