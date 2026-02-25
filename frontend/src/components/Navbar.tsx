import React from 'react';
import './Styles/NavbarStyle.css';
import { Outlet, useNavigate } from 'react-router';

export type NavBarLink = {
  text: string;
  url: string;
  onClickAction?: () => void;
};

type NavbarProps = {
  links: NavBarLink[];
};

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  const navigator = useNavigate();
  return (
    <>
      <nav>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <button className={`nav-${link.text.toLowerCase()}`}
                onClick={() => {
                  if (link.onClickAction) {
                    link.onClickAction();
                  }
                  navigator(link.url)
                }}>
                {link.text}</button>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;