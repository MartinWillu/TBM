import React from 'react';
import './Styles/NavbarStyle.css';
import { Outlet, useNavigate } from 'react-router';

type NavbarProps = {
  links: { text: string; url: string }[];
  onLogout?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ links, onLogout }) => {
    const navigator = useNavigate();
  return (
    <>
      <nav>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <button onClick={() => navigator(link.url)}>{link.text}</button>
              
            </li>
          ))}
          
          {onLogout && (
            <li>
              <button className="logout-button" onClick={onLogout}>
                Log Out
              </button>
            </li>
          )}

        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;