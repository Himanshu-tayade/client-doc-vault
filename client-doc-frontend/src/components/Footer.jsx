import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-5 shadow-sm">
      <div className="container text-center">
        <small>© {new Date().getFullYear()} Whitecircle Group. All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;
