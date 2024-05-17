import Link from "next/link";

const NavBar = () => {
  return (
    <div className="flex justify-between px-4 py-3 text-lg fixed top-0 left-0 w-full z-50 bg-white">
      <Link href={"/"} className="hover:underline">
        LOGO
      </Link>
      <div className="flex gap-6">
        <Link href={"/about"} className="hover:underline">
          About
        </Link>
        <Link href={"/projects"} className="hover:underline">
          Projects
        </Link>
        <Link href={"/"} className="hover:underline">
          Resume
        </Link>
        <Link href={"/contact"} className="hover:underline">
          Contact
        </Link>
        <p>DarkMode</p>
      </div>
    </div>
  );
};

export default NavBar;
