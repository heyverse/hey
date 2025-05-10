import { Link } from "react-router";
const currentYear = new Date().getFullYear();

const links = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "https://hey.xyz/discord", label: "Discord" },
  { href: "/u/hey", label: "Hey" },
  { href: "https://github.com/heyverse/hey", label: "GitHub" },
  { href: "/support", label: "Support" },
  { href: "https://hey.xyz/donate", label: "Donate" }
];

const Footer = () => {
  return (
    <footer className="flex flex-wrap gap-x-[12px] gap-y-2 px-3 text-sm lg:px-0">
      <span className="font-bold text-gray-500 dark:text-gray-200">
        &copy; {currentYear} Hey.xyz
      </span>
      {links.map(({ href, label }) => (
        <Link
          className="outline-offset-4"
          to={href}
          key={href}
          rel="noreferrer noopener"
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {label}
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
