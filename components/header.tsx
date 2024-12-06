import Image from "next/image";
import Link from "next/link";
import AuthButton from "./header-auth";

const menu = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  return (
    <div className="header py-10 border-b border-b-black w-full">
      <div className="container">
        <div className="flex items-center justify-between">
          <Image src="/digify-logo.png" alt="Logo" width={180} height={180} />
          <nav>
            <ul className="flex space-x-5">
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
