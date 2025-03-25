import React, { useEffect, useState } from "react";
import { login } from "../api/auth";
import Loader from "../components/Loader";
import swal from "../utils/swal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import logo from "../../assets/logo.png";

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

const SignInSection = styled.div`
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
`;

const SignUpSection = styled.div`
    flex: 1;
    background: linear-gradient(135deg, #d9a98d, #c37a65);
    padding: 40px;
    color: #000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 2rem;
        margin-bottom: 10px;
        text-align: center;
    }

    p {
        margin-bottom: 20px;
        text-align: center;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ButtonContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`;

const StyledButton = styled.button`
    padding: 12px 20px;
    background-color: ${(props) => (props.selected ? "#d9a98d" : "#f9f9f9")};
    color: ${(props) => (props.selected ? "#fff" : "#333")};
    border: 2px solid #d9a98d;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    width: 150px;
    text-align: center;

    &:hover {
        background-color: #d9a98d;
        color: #fff;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
`;

const Button = styled.button`
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
`;

const Error = styled.div`
    color: red;
    margin-bottom: 10px;
`;

const SignUpButton = styled.button`
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
`;

const LoginPage = ({ type }) => {
    const [credentials, setCredentials] = useState({ emailOrPhNo: "", password: "", loginWith: "email" });
    const [error, setError] = useState("");
    const { auth, setAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate(`/dashboard/${type}`);
        }
    }, [auth, navigate, type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!credentials.emailOrPhNo || !credentials.password) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        let payload = {};
        if (credentials.loginWith === "email") {
            if (!/\S+@\S+\.\S+/.test(credentials.emailOrPhNo)) {
                setError("Please enter a valid email.");
                setIsLoading(false);
                return;
            }
            payload = {
                email: credentials.emailOrPhNo,
                password: credentials.password,
                type: type,
            };
        } else if (credentials.loginWith === "phone") {
            if (!/^\d{10}$/.test(credentials.emailOrPhNo)) {
                setError("Please enter a valid phone number (10 digits).");
                setIsLoading(false);
                return;
            }
            payload = {
                phNo: credentials.emailOrPhNo,
                password: credentials.password,
                type: type,
            };
        }

        try {
            const response = await login(payload);
            swal.success(response.message);
            setAuth(true);

            localStorage.setItem('token', response.token);
            localStorage.setItem('userDetails', JSON.stringify(response.userDetails));

            navigate(`/dashboard/${type}`);
        } catch (error) {
            swal.error(error.response.data.message);
        } finally {
            setCredentials((prev) => ({
                emailOrPhNo: "",
                password: "",
                ...prev,
            }));
            setIsLoading(false);
        }
    };

    const handleLoginTypeChange = (e, type) => {
        e.preventDefault();
        setCredentials({ ...credentials, loginWith: type, emailOrPhNo: "" });
    };

    return (
        <Container>
            {isLoading && <Loader />}
            <Logo>
                <img src={logo} alt="Logo" />
            </Logo>
            <FormContainer>
                <SignInSection>
                    <h1>Sign in</h1>
                    <p>or use your account</p>
                    <Form onSubmit={handleSubmit}>
                        <ButtonContainer>
                            <StyledButton
                                selected={credentials.loginWith === "email"}
                                onClick={(e) => handleLoginTypeChange(e, "email")}
                            >
                                Use Email
                            </StyledButton>
                            <StyledButton
                                selected={credentials.loginWith === "phone"}
                                onClick={(e) => handleLoginTypeChange(e, "phone")}
                            >
                                Use PhNo
                            </StyledButton>
                        </ButtonContainer>
                        <Input
                            type={credentials.loginWith === "email" ? "email" : "text"}
                            placeholder={credentials.loginWith === "email" ? "Email" : "Phone Number"}
                            value={credentials.emailOrPhNo}
                            onChange={(e) => setCredentials({ ...credentials, emailOrPhNo: e.target.value })}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                        {error && <Error>{error}</Error>}
                        <Button type="submit" disabled={isLoading}>
                            Login
                        </Button>
                    </Form>
                </SignInSection>
                <SignUpSection>
                    <h1>Hello, Friend!</h1>
                    <p>Share your details and join us in making a difference for injured animals!</p>
                    <SignUpButton onClick={() => navigate(`/signup/${type}`)}>Sign Up</SignUpButton>
                </SignUpSection>
            </FormContainer>
        </Container>
    );
};

export default LoginPage;
