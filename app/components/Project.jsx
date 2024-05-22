"use client";

import React from "react";
import BrackgroundProject from "./BrackgroundProject";
import { projectdata } from "@/data/projectdata";

const Project = () => {
  return (
    <div
      className="flex flex-col boxed snap-start min-h-screen gap-20 py-20"
      id="projects"
    >
      <h3 className="text-5xl items-center text-center font-semibold">
        Projects
      </h3>

      <div className="grid grid-cols-3 max-w-sm min-w-max gap-[52px] mx-auto h-max">
        {projectdata.map((project) => (
          <BrackgroundProject
            key={project.id}
            image={project.image}
            title={project.title}
            description={project.description}
            tools={project.Tools}
          />
        ))}
      </div>
    </div>
  );
};

export default Project;
