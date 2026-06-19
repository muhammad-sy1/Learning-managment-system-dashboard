"use client";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";

const NavLink = ({
  children,
  href,
  activeClassName,
  nonActiveClassName,
  className,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  activeClassName?: string;
  nonActiveClassName?: string;
  className?: string;
}) => {
  const pathname = usePathname();

  // remove query
  const cleanHref = href.split("?")[0];

  const baseHref = cleanHref.split("/")[1]
    ? `/${cleanHref.split("/")[1]}`
    : "/";

  const isActive = (() => {
    if (baseHref === "/") {
      return pathname === "/";
    }
    return pathname === cleanHref || pathname.startsWith(baseHref + "/");
  })();

  const newClassName = `${isActive ? activeClassName : nonActiveClassName} ${
    className ?? ""
  }`;

  return (
    <Link href={href}  className={newClassName} {...rest}>
      {children}
    </Link>
  );
};

export default NavLink;
