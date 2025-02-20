import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);
  const [faqOpen, setFaqOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false); // State for shipping submenu

  const [menuOpen, setMenuOpen] = useState(false); // State to toggle navbar menu in mobile view

  const menus = [
    // { name: "Elite Jeans", path: "" },
    { name: "WORK ORDER", path: "/work-order" },
    { name: "TECH PACK", path: "/" },
    { name: "TRIMS", path: "/trim" },
    { name: "PICTURES", path: "/picture" },
    { name: "SHIPPING", path: "" }, // SHIPPING menu
    { name: "RECEIVING", path: "/receiving" },
    { name: "CONFIGURATIONS", path: "" },
    { name: "VENDOR PO", path: "/vendor-po" },
    { name: "QUOTES", path: "/quotes" },
    { name: "SALES CONTRACTS", path: "/sales-contract" },
    { name: "USERS", path: "/users" },
  ];

  const faqSubMenus = [
    { name: "CONFIGURATIONS", path: "/Configuration" },
    { name: "POM LIBRARY", path: "/POM" },
    { name: "SIZE SCALE ASSIGNMENTS", path: "/new-scale-assignment" },
    { name: "Specs Templates", path: "/spec-template" },
  ];

  const shippingSubmenus = [
    { name: "SHIPPING", path: "/shipping" },
    { name: "Arrangements", path: "/arrangments" },
  
  ];

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <div className="navbar-right">
        <span className="elite_logo">Elite Jeans</span>
      </div>
      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        {menus.map((menu) =>
          menu.name === "SHIPPING" ? (
            <div key={menu.name} className="menu-item">
              <div
                onClick={() => setShippingOpen(!shippingOpen)} 
                className={`shipping-title title_shipping ${
                  location.pathname === menu.path ? "selected" : ""
                }`}
              >
                {menu.name}
                <span className={`dropdown-arrow ${shippingOpen ? "open" : ""}`}>
                  &#9662;
                </span>
              </div>
              {shippingOpen && (
                <div className="submenu">
                  {shippingSubmenus.map((submenu) => (
                    <Link
                      key={submenu.name}
                      to={submenu.path}
                      className={`submenu-item ${
                        location.pathname === submenu.path ? "selected" : ""
                      }`}
                    >
                      {submenu.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : menu.name === "CONFIGURATIONS" ? (
            <div key={menu.name} className="menu-item">
              <div
                onClick={() => setFaqOpen(!faqOpen)} 
                className={`faq-title title_faq ${
                  location.pathname === menu.path ? "selected" : ""
                }`}
              >
                {menu.name}
                <span className={`dropdown-arrow ${faqOpen ? "open" : ""}`}>
                  &#9662;
                </span>
              </div>
              {faqOpen && (
                <div className="submenu">
                  {faqSubMenus.map((submenu) => (
                    <Link
                      key={submenu.name}
                      to={submenu.path}
                      className={`submenu-item ${
                        location.pathname === submenu.path ? "selected" : ""
                      }`}
                    >
                      {submenu.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={menu.name}
              to={menu.path}
              className={`menu-item ${
                location.pathname === menu.path ? "selected" : ""
              }`}
            >
              {menu.name}
            </Link>
          )
        )}
      </div>

      <div className="navbar-left">
        {/* <img src="logo.png" alt="Logo" className="logo" /> */}
        <span className="email">email@example.com</span>
      </div>
    </nav>
  );
};

export default Navbar;
