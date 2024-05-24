import { MovingCardSkills } from "./MovingCardSkills";

const Skills = () => {
  return (
    <div
      className="flex flex-col justify-center boxed snap-start min-h-screen py-20"
      id="skills"
    >
      <h3 className="text-5xl items-center text-center mb-20 font-semibold">
        Skills
      </h3>

      <MovingCardSkills />
    </div>
  );
};

export default Skills;
