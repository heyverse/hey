import { APP_NAME } from "@hey/data/constants";
import { Link } from "react-router";
const currentYear = new Date().getFullYear();

const links = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "https://discord.gg/PaewZGkkBr", label: "Discord" },
  { href: "/u/hey", label: APP_NAME },
  { href: "https://status.hey.xyz", label: "Status" },
  { href: "https://github.com/heyverse/hey", label: "GitHub" },
  { href: "/support", label: "Support" }
];

const Footer = () => {
  return (
    <footer className="flex flex-wrap gap-x-[12px] gap-y-2 px-3 text-sm lg:px-0">
      <span className="font-bold text-gray-500 dark:text-gray-200">
        &copy; {currentYear} {APP_NAME}.xyz
      </span>
      {links.map((link) => (
        <Link
          className="outline-offset-4"
          to={link.href}
          key={link.href}
          rel="noreferrer noopener"
          target={link.href.startsWith("http") ? "_blank" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
