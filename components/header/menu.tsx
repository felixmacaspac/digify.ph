import Image from "next/image";
import Link from "next/link";
import AuthButton from "./auth-button";

const menu = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
];

const Header = () => {
  return (
    <div className="header border-b border-b-black w-full uppercase bg-secondary h-20">
      <div className="container h-full">
        <div className="flex items-center h-full">
          <Link href="/">
            <Image src="/digify-logo.png" alt="Logo" width={180} height={180} />
          </Link>
          <nav className="pl-20">
            <ul className="flex gap-10">
              {menu.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
