import React, { useState } from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import react_image from '../assets/images/react.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    let navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    let Logout = async (e) => {
        let val = await axios.get('/logoutt');
        if (val.status == 200) {
            localStorage.setItem('keyId', JSON.stringify(null))
            localStorage.setItem('userType', JSON.stringify(null))
            let keyId = JSON.parse(localStorage.getItem('keyId'));
            alert('Logged Out!')
            navigate('/login')
        }
        else {
            alert('error while logging you out!')
        }
    }
    return (
        <>
            <Navbar bg="light" expand="lg" sticky="top">
                <Button
                    variant="light"
                    onClick={toggleSidebar}
                    className="d-lg-none mr-3"
                >
                    &#9776; {/* Unicode for the "hamburger" icon */}
                </Button>
                <Navbar.Brand href="#home">
                    <img
                        src={react_image}
                        alt="Profile"
                        width="30"
                        height="30"
                        className="rounded-circle"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/* Add your navigation links here */}
                    </Nav>
                    <Dropdown alignRight>
                        <Dropdown.Toggle id="dropdown-basic">
                            <img
                                src={react_image}
                                alt="Profile"
                                width="30"
                                height="30"
                                className="rounded-circle"
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                            <Dropdown.Item onClick={Logout} href="#logout">LogOut</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
            {/* Your logo goes here */}
        </>
    );
};

export default Header;
