"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  return (
    <nav className="flex justify-between items-center lg:hidden w-full py-4 px-6 bg-black fixed top-0 left-0 z-50">
      <p className="text-2xl">Portfolio</p>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <MenuIcon size={30} color="#fff" />
        </SheetTrigger>
        <SheetContent className="bg-black text-white border-neutral-700">
          <SheetHeader>
            <SheetDescription>
              <div className="flex flex-col gap-7 items-start pt-20 text-2xl text-white">
                <Link
                  href="#about"
                  className="active:text-neutral-400"
                  onClick={closeSheet}
                >
                  About
                </Link>
                <Link
                  href="#skills"
                  className="active:text-neutral-400"
                  onClick={closeSheet}
                >
                  Skills
                </Link>
                <Link
                  href="#projects"
                  className="active:text-neutral-400"
                  onClick={closeSheet}
                >
                  Projects
                </Link>
                <Link
                  href="#contact"
                  className="active:text-neutral-400"
                  onClick={closeSheet}
                >
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

export default Navbar;
