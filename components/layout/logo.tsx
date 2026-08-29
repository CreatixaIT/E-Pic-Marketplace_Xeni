import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-baseline gap-1 text-lg font-semibold tracking-tight"
      aria-label={`${siteConfig.name} home`}
    >
      <span>E</span>
      <span className="h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent transition-transform group-hover:scale-125" />
      <span>pic</span>
    </Link>
  );
}
