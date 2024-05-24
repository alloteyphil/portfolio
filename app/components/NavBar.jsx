import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex justify-between px-4 py-3 text-lg fixed top-0 left-0 w-full z-50 bg-transparent">
      <Link href={"#header"} className="hover:underline uppercase">
        Portfolio
      </Link>
      <div className="flex gap-6">
        <Link href={"#about"} className="hover:underline">
          About
        </Link>
        <Link href={"#skills"} className="hover:underline">
          Skills
        </Link>
        <Link href={"#projects"} className="hover:underline">
          Projects
        </Link>
        <Link href={"#contact"} className="hover:underline">
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
