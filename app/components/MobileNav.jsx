import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const MobileNav = () => {
  return (
    <nav
      className={`flex justify-between items-center lg:hidden w-full py-4 px-6 bg-black fixed top-0 left-0 z-50`}
    >
      <p className="text-2xl">Portfolio</p>
      <Sheet>
        <SheetTrigger>
          <MenuIcon size={30} color="#fff" />
        </SheetTrigger>
        <SheetContent className="bg-black text-white border-neutral-700">
          <SheetHeader>
            <SheetDescription>
              <div className="flex flex-col gap-7 items-start pt-20 text-2xl text-white">
                <Link href={"#about"} className="active:text-neutral-400">
                  About
                </Link>
                <Link href={"#skills"} className="active:text-neutral-400">
                  Skills
                </Link>
                <Link href={"#projects"} className="active:text-neutral-400">
                  Projects
                </Link>
                <Link href={"#contact"} className="active:text-neutral-400">
                  Contact
                </Link>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
