import { iconlistdata } from "@/data/iconlistdata";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-nowrap justify-between snap-start boxed border-t lg:px-4 py-3 max-lg:py-6 text-sm">
      <p className="text-nowrap">© {new Date().getFullYear()} Philip Allotey</p>
      <div className="space-x-5">
        {iconlistdata.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            target="blank"
            className="hover:underline"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
