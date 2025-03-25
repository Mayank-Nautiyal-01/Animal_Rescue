import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import Logo from "../../assets/logo.png";

const NavbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d09571;
  padding: 10px 20px;
`;

const NavbarBrand = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  img {
    width: 150px;
    margin-right: 8px;
    margin-top: 8px;
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

const DashboardNavbar = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth(null);
        navigate("/login/ngo");
    };

    return (
        <NavbarWrapper>
            <NavbarBrand onClick={() => navigate("/")} >
                <img src={Logo} alt="AnimalNGO Logo" />
            </NavbarBrand>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavbarWrapper>
    );
};

export default DashboardNavbar;
