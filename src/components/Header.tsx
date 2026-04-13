"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/caisey-logo-on-dark.svg"
            alt="CAiSEY"
            width={140}
            height={25}
            priority
          />
          <div className="hidden sm:block h-6 w-px bg-gray-700" />
          <span className="hidden sm:block text-sm font-medium text-gray-400">
            Strategy Lab
          </span>
        </Link>
        <div className="text-xs text-gray-500 text-right">
          <div>Technology Strategy</div>
          <div>Columbia Business School</div>
        </div>
      </div>
    </header>
  );
}
