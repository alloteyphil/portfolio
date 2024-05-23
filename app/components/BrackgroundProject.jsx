import { BackgroundGradient } from "./ui/background-gradient";
import Image from "next/image";

const BrackgroundProject = ({ image, tools, title, description }) => {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm min-h-[620px] p-6 bg-white dark:bg-black">
        <Image
          src={image}
          alt={title}
          height={420}
          width={400}
          className="object-cover object-center rounded-[22px]"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-50">
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
      </BackgroundGradient>
    </div>
  );
};

export default BrackgroundProject;
