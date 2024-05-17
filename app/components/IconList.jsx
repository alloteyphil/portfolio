import { iconlistdata } from "@/data/iconlistdata";
import Link from "next/link";

const IconList = () => {
  return (
    <div className="flex flex-col fixed -translate-y-1/2 top-1/2 right-4 gap-7 items-center bg-gray-100 p-2">
      {iconlistdata.map((link) => (
        <Link key={link} href={link.href} className="hvr-buzz">
          {link.link}
        </Link>
      ))}
    </div>
  );
};

export default IconList;
