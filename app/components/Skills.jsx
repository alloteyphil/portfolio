import { MovingCardSkills } from "./MovingCardSkills";

const Skills = () => {
  return (
    <div
      className="flex flex-col justify-center boxed snap-start min-h-screen py-20 max-lg:py-0"
      id="skills"
    >
      <h3 className="text-5xl max-lg:text-4xl  items-center text-center mb-20 max-lg:mb-10 font-semibold">
        Skills
      </h3>

      <MovingCardSkills />
    </div>
  );
};

export default Skills;
