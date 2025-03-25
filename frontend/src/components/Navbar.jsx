import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const NavbarContainer = styled.nav`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border: 3px solid #ae6335a7;
`;

const NavPart1 = styled.div`
  width: 35%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavPart2 = styled.div`
  width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Logo = styled.img`
  height: 47px;
  cursor: pointer;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 16px;
  color: black;
  font-weight: 600;
`;

const DropdownToggle = styled.h4`
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const DropdownMenu = styled.ul`
  display: ${({ open }) => (open ? "block" : "none")};
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
`;

const DropdownItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Button = styled.button`
  padding: 11px 13px;
  font-weight: 600;
  border: none;
  background-color: black;
  color: white;
  border-radius: 50px;
  font-size: 16px;
  margin: 0px 8px;

  &:nth-child(1) {
    background-color: transparent;
    color: black;
  }

  &:hover {
    background-color: #c55626;
    color: white;
  }
`;

const LogoutButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: red;
  }
`;

const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth(null);
        navigate("/login/ngo");
    };

    const handleTypeSelection = (type) => {
        setModalOpen(false);
        navigate(`${redirectPath}/${type}`);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <>
            <NavbarContainer>
                <NavPart1>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/report">Report</NavLink>
                    <div className="dropdown" onClick={toggleDropdown}>
                        <DropdownToggle>Get Involved</DropdownToggle>
                        <DropdownMenu open={dropdownOpen}>
                            <DropdownItem>- Adopt a Friend</DropdownItem>
                            <DropdownItem>- Donate for Care</DropdownItem>
                            <DropdownItem>- Volunteer with Us</DropdownItem>
                        </DropdownMenu>
                    </div>
                    <NavLink to="/stories">Stories</NavLink>
                    <NavLink to="/about-us">About Us</NavLink>
                </NavPart1>

                <Logo src={logo} alt="AniCare" onClick={() => navigate("/")} />

                <NavPart2>
                    {!auth ?
                        <>
                            <Button
                                id="loginBtn"
                                onClick={() => {
                                    setRedirectPath("/login");
                                    setModalOpen(true);
                                }}
                            >
                                Log in
                            </Button>
                            <Button
                                id="registerBtn"
                                onClick={() => {
                                    setRedirectPath("/signup");
                                    setModalOpen(true);
                                }}
                            >
                                Sign up
                            </Button>
                        </> :
                        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                    }
                </NavPart2>
            </NavbarContainer>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleTypeSelection} />
        </>
    );
};

export default Navbar;
