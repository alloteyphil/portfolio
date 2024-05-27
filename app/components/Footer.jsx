import { iconlistdata } from "@/data/iconlistdata";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex justify-between boxed border-t px-4 py-3 text-sm">
      <p>© {new Date().getFullYear()} Philip Allotey</p>
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
