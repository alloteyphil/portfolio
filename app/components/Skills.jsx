import React from "react";
import { skilldata } from "@/data/skilldata";
import { EvervaultCard, Icon } from "./ui/evervault-card";

const Skills = () => {
  return (
    <div
      className="flex flex-col boxed snap-start min-h-screen gap-20 py-20"
      id="skills"
    >
      <h3 className="text-5xl items-center text-center font-semibold">
        Skills
      </h3>
      <div className="grid grid-cols-4 gap-7">
        {skilldata.map((skill) => (
          <div key={skill.id}>
            <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[17rem]">
              <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

              <EvervaultCard icon={`/${skill.icon}`} />

              <h4 className="text-lg font-normal">{skill.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
