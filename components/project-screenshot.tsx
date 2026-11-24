"use client";

import { useState } from "react";
import Image from "next/image";

type ProjectScreenshotProps = {
  name: string;
  screenshotUrl: string | null;
};

/** Minimal client leaf so only the image error fallback hydrates; card text and links stay server-rendered. */
export function ProjectScreenshot({ name, screenshotUrl }: ProjectScreenshotProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(screenshotUrl) && failedUrl !== screenshotUrl;

  if (!showImage) {
    return (
      <div className="display flex aspect-2/1 items-center justify-center bg-brand p-6 text-center text-3xl text-white">
        {name}
      </div>
    );
  }

  return (
    <Image
      src={screenshotUrl!}
      alt=""
      width={1200}
      height={600}
      sizes="(max-width: 768px) 100vw, 580px"
      className="aspect-2/1 w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.035]"
      onError={() => setFailedUrl(screenshotUrl)}
    />
  );
}
