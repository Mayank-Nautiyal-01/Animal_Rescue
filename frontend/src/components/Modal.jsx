import React from "react";
import styled from "styled-components";

const Modal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <CloseButton onClick={onClose}>X</CloseButton>
                <ModalContent>
                    <h3>Select Account Type</h3>
                    <ModalButton onClick={() => onSelect("ngo")}>NGO</ModalButton>
                    <ModalButton onClick={() => onSelect("user")}>User</ModalButton>
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

// Styled Components

const ModalOverlay = styled.div`
    background-color: rgba(67, 54, 54, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 300px;
    position: relative;
    font-family: Arial, sans-serif;
`;

const CloseButton = styled.button`
    background-color: #ae6335a7;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 16px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #c55626;
    }
`;

const ModalContent = styled.div`
    h3 {
        color: #ae6335a7;
    }
`;

const ModalButton = styled.button`
    background-color: #d09571a7;
    color: rgb(67, 54, 54);
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c55626;
        color: white;
    }
`;

export default Modal;
