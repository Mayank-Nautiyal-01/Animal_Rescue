import React, { useState, useEffect } from "react";
import swal from "../utils/swal";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import Loader from "../components/Loader";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9f9f9;
    flex-direction: column;
`;

const Logo = styled.div`
    text-align: center;
    margin-bottom: 30px;

    img {
        width: 150px;
        height: auto;
    }
`;

const FormContainer = styled.div`
    display: flex;
    width: 70%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 90%;
    }
`;

const SignInLinkSection = styled.div`
    flex: 1;
    background: linear-gradient(135deg, #d9a98d, #c37a65);
    padding: 40px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    p {
        margin-bottom: 20px;
        text-align: center;
    }

    button {
        padding: 12px 24px;
        background-color: transparent;
        color: #fff;
        border: 2px solid #fff;
        border-radius: 20px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        width: fit-content;

        &:hover {
            background-color: #fff;
            color: #d9a98d;
        }
    }
`;

const SignUpSection = styled.div`
    flex: 1;
    background: #fff;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    p {
        margin-bottom: 20px;
        color: #555;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 400px;
    }

    input {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
    }

    button {
        padding: 10px 2rem;
        background-color: black;
        color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
        width: fit-content;
        margin: auto;

        &:hover {
            background-color: #555;
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }

    .error {
        color: red;
        margin-bottom: 10px;
    }
`;

const SignupPage = ({ type }) => {
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phNo: "",
        email: "",
        password: "",
        ngoName: type === "ngo" ? "" : undefined,
        location: undefined,
    });
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");

    useEffect(() => {
        if (auth) {
            navigate(`/dashboard/${type}`);
        }
    }, [auth, navigate, type]);

    useEffect(() => {
        if (type === "ngo") {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prevData) => ({
                        ...prevData,
                        location: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                    }));
                    setLocationError("");
                },
                (error) => {
                    setLocationError("Unable to fetch location. Please enable location access.");
                }
            );
        }
    }, [type]);

    const validateForm = () => {
        if (!formData.name) {
            setError("Name is required.");
            return false;
        }
        if (type === "ngo") {
            if (!formData.ngoName) {
                setError("NGO Name is required for NGOs.");
                return false;
            }
            if (!formData.location) {
                setError("Location is required. Please enable location access.");
                return false;
            }
        }
        if (!(formData.email || formData.phNo)) {
            setError("Either Email or Phone Number is required.");
            return false;
        }
        if (!formData.password) {
            setError("Password is required.");
            return false;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            setError("Please enter a valid email.");
            return false;
        }
        if (formData.phNo && !/^\d{10}$/.test(formData.phNo)) {
            setError("Please enter a valid phone number.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await signup({ ...formData, type });
            swal.success(response.message);
            navigate(`/login/${type}`);
        } catch (error) {
            swal.error(error.response?.data?.message || "An error occurred while signing up.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Logo>
                <img src={logo} alt="Logo" />
            </Logo>
            <FormContainer>
                <SignInLinkSection>
                    <h1>Already have an account?</h1>
                    <p>Go back to sign in page and login.</p>
                    <button onClick={() => navigate(`/login/${type}`)}>Sign In</button>
                </SignInLinkSection>
                <SignUpSection>
                    <h1>Sign Up</h1>
                    <p>Create your account to get started!</p>
                    <form onSubmit={handleSubmit}>
                        {isLoading && <Loader />}
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={formData.phNo}
                            onChange={(e) => setFormData({ ...formData, phNo: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {type === "ngo" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="NGO Name"
                                    value={formData.ngoName || ""}
                                    onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                                />
                                {locationError && <div className="error">{locationError}</div>}
                            </>
                        )}

                        {error && <div className="error">{error}</div>}

                        <button type="submit" disabled={isLoading || !!locationError}>Sign Up</button>
                    </form>
                </SignUpSection>
            </FormContainer>
        </Container>
    );
};

export default SignupPage;
