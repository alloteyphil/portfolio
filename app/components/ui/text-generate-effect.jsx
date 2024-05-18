"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/utils/cn";

export const TextGenerateEffect = ({
  words,
  className,
  opacity = 1,
  duration = 2,
  delay = 0.1,
  startDelay = 0,
  gradient = false,
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity,
      },
      {
        duration,
        delay: stagger(delay, { startDelay }),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div
        ref={scope}
        transition={{ delay: 0.5, duration: 1 }}
        variants={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`${
                gradient
                  ? "text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-500"
                  : ""
              } opacity-0`}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="">{renderWords()}</div>
      </div>
    </div>
  );
};
