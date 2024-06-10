import { iconlistdata } from "@/data/iconlistdata";
import Link from "next/link";

const IconList = () => {
  return (
    <div className="flex items-center bg-gray-100 p-2 shadow-2xl max-lg:hidden">
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
  );
};

export default IconList;
