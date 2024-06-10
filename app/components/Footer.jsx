import { iconlistdata } from "@/data/iconlistdata";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-nowrap justify-between items-center snap-start boxed border-t lg:px-4 py-3 max-lg:py-6 text-sm">
      <p className="text-nowrap">© {new Date().getFullYear()} Philip Allotey</p>
      <div className="flex items-center gap-3 bg-neutral-50 p-1 shadow-2xl">
        {iconlistdata.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            target="blank"
            className="hvr-buzz"
          >
            {link.image}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
