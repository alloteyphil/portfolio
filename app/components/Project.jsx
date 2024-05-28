"use client";

import { projectData } from "@/data/projectdata";
import BackgroundProject from "./BackgroundProject";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Project = () => {
  return (
    <div
      className="flex flex-col boxed snap-start min-h-screen justify-center gap-20 py-20"
      id="projects"
    >
      <h3 className="text-5xl items-center text-center font-semibold">
        Projects
      </h3>

      <Carousel>
        <CarouselContent>
          {projectData.map((project) => (
            <CarouselItem key={project.id} className="basis-1/3">
              <BackgroundProject
                key={project.id}
                image={project.image}
                title={project.title}
                description={project.description}
                tools={project.tools}
                link={project.link}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Project;
