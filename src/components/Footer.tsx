import {
  githubProfile,
  linkedinProfile,
  personName,
  profileEmail,
} from "../app/seo";
import Link from "next/link";

export default function Footer() {
  const email = profileEmail.replace("mailto:", "");

  return (
    <footer className="border-t border-neutral-800 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {personName}. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-5">
          <a
            href={githubProfile}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>

          <a
            href={linkedinProfile}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            LinkedIn
          </a>

          <a
            href={`mailto:${email}`}
            className="transition-colors hover:text-white"
          >
            Email
          </a>
          <Link href="/login" className="transition-colors hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
