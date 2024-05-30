import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="px-32 py-6 text-lg max-w-max fixed top-2 left-1/2 -translate-x-1/2 rounded-full border border-white/30 z-50 bg-transparent after:absolute after:top-0 after:left-0 after:w-full after:h-full after:backdrop-blur after:z-20 after:bg-white/5 overflow-hidden max-lg:hidden">
      <div className="flex item-center justify-center gap-7">
        <Link href={"#about"} className="hover:underline z-50">
          About
        </Link>
        <Link href={"#skills"} className="hover:underline z-50">
          Skills
        </Link>
        <Link href={"#projects"} className="hover:underline z-50">
          Projects
        </Link>
        <Link href={"#contact"} className="hover:underline z-50">
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
