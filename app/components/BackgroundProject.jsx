import Link from "next/link";
import { BackgroundGradient } from "./ui/background-gradient";
import Image from "next/image";

const BackgroundProject = ({ image, tools, title, description, link }) => {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-max min-h-[620px] p-6 bg-white flex flex-col justify-between dark:bg-black">
        <Image
          src={image}
          alt={title}
          height={420}
          width={400}
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
        <div className="w-full flex justify-end grow">
          <Link
            href={link}
            className="hover:underline text-sm self-end text-neutral-600 dark:text-neutral-300 "
            target="_blank"
          >
            Link to the project
          </Link>
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default BackgroundProject;
