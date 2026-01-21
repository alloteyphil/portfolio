import Link from "next/link";
import { BackgroundGradient } from "./ui/background-gradient";
import Image from "next/image";
import { LinkIcon } from "lucide-react";

const BackgroundProject = ({
  image,
  tools,
  title,
  description,
  link,
  priority = false,
  loading = "lazy",
  fetchPriority,
}) => {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] relative max-w-max min-h-[620px] p-6 bg-white flex flex-col justify-between dark:bg-black">
        <Image
          src={image}
          alt={title}
          height={420}
          width={400}
          sizes="(max-width: 768px) 80vw, 400px"
          quality={70}
          placeholder="blur"
          priority={priority}
          loading={loading}
          fetchPriority={fetchPriority}
          className="object-cover object-center rounded-[22px]"
        />
        <p className="text-base text-black mt-4 mb-2 dark:text-neutral-50">
          {title}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
        <div className="flex flex-wrap gap-x-3">
          {tools.split(",").map((tool) => (
            <div
              className="rounded-full py-1 px-3 max-w-max text-neutral-300 flex items-center bg-black mt-4 text-xs font-bold dark:bg-zinc-800"
              key={tool}
            >
              {tool}
            </div>
          ))}
        </div>

        <Link
          href={link}
          className="absolute top-7 right-8 bg-black p-2 rounded-full animate-pulse"
          target="_blank"
        >
          <LinkIcon size={16} className="text-white" />
        </Link>
      </BackgroundGradient>
    </div>
  );
};

export default BackgroundProject;
