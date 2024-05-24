"use client";

import { skillData } from "@/data/skilldata";
import { InfiniteMovingCards } from "./ui/moving-cards";

export function MovingCardSkills() {
  const skills1 = skillData.slice(0, 6);
  const skills2 = skillData.slice(6);
  return (
    <>
      <div className="rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards items={skills2} direction="right" speed="slow" />
      </div>
      <div className="rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards items={skills1} speed="slow" />
      </div>
    </>
  );
}
