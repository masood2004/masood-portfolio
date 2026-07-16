"use client";

import { useState } from "react";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-lg font-bold tracking-tight text-white">
          SMH
        </a>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded border border-neutral-700 px-3 py-2 text-sm text-neutral-300 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-neutral-800 bg-neutral-950 px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-neutral-300"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
