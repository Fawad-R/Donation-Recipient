import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { BsHouse, BsGear, BsPower } from 'react-icons/bs';

const Sidebar = () => {
  return (
    <div className="col-md-3 d-md-block bg-light sidebar position-sticky">
      <Nav className="flex-column">
        <Nav.Link href="#menu1">
          <BsHouse /> Home
        </Nav.Link>
        <Nav.Link href="#menu2">
          <BsGear /> Settings
        </Nav.Link>
        <Nav.Link href="#menu3">
          <BsPower /> LogOut
        </Nav.Link>
        {/* Add more menu items with icons as needed */}
      </Nav>
    </div>
  );
};

export default Sidebar;
