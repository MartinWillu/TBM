import React from 'react';
import './Styles/NavbarStyle.css';
import { Outlet, useNavigate } from 'react-router';
import { Footer } from './Footer';

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
    <div className="app-layout">
      <nav className="navbar">
        <ul className="navbar-list">
          {links.map((link, index) => (
            <li key={index} className="navbar-item">
              <button className={`nav-button nav-${link.text.toLowerCase()}`}
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
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Navbar;