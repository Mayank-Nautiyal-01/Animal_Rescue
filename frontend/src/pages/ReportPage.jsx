import React, { useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import swal from '../utils/swal';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Webcam from 'react-webcam';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  font-family: 'Roboto', Arial, sans-serif;
  color: #333;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const ListContainer = styled.div`
  flex: 1;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  text-align: center;
  color: #c55626;
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #ae6335;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #c55626;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #c55626;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#c55626')};
  color: #fff;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#ae6335')};
  }
`;

const NGOList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NGOItem = styled.li`
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  strong {
    display: block;
    font-weight: 700;
    margin-bottom: 5px;
    color: #d09571a7;
  }

  p {
    margin: 0;
    color: #555;
    font-size: 14px;
  }
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #c55626;
  }
`;

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex: 1;
`;

const ImagePreview = styled.div`
  margin: 20px auto;
  text-align: center;
  max-width: 250px;

  img {
    object-fit: contain;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RightPart = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
const ImgWrapper = styled.div`
    position: relative;
    display: flex; 
    flex-direction: column;
    flex: 1;
    background: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    border-radius: 10px;
`;
const ReportPage = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [proximity, setProximity] = useState(5);
    const [location, setLocation] = useState(null);
    const [ngos, setNgos] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const handleCapture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImagePreview(imageSrc);
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
                    setImage(file);
                });

            setIsCameraActive(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const fetchLocation = async () => {
        return new Promise((resolve, reject) => {
            if ('permissions' in navigator) {
                navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
                    if (permission.state === 'denied') {
                        swal.error('Location access is blocked. Please enable it in your browser settings.');
                        reject('Permission denied');
                    } else {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const coords = [position.coords.latitude, position.coords.longitude];
                                setLocation(coords);
                                resolve(coords);
                            },
                            (error) => {
                                swal.error('Error fetching location. Please allow location access.');
                                reject(error.message);
                            }
                        );
                    }
                }).catch((err) => {
                    swal.error('Error checking location permission. Please try again.');
                    reject(err.message);
                });
            } else {
                swal.error('Permissions API is not supported in this browser.');
                reject('Unsupported browser');
            }
        });
    };

    const fetchNGOs = async () => {
        try {
            const userLocation = location || await fetchLocation();
            if (!userLocation) {
                swal.error('Unable to determine location. Please enable location access.');
                return;
            }

            setLoading(true);

            const localAPIUrl = `http://localhost:5000/api/ngos/nearby?longitude=${userLocation[1]}&latitude=${userLocation[0]}&radius=${proximity}`;

            const response = await axios.get(localAPIUrl);

            const combinedNgos = response.data.map((ngo) => ({
                ngo: ngo.name || "Unknown",
                phNo: ngo.phone || null,
                email: ngo.email || null,
                location: ngo.location || null,
            }));

            setNgos(combinedNgos);
            swal.success('NGOs fetched successfully!');
        } catch (error) {
            swal.error('Error fetching NGOs.');
            console.error('Error fetching NGOs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!image || !description || !animalType || !userName || !userEmail) {
            swal.error('Please fill all the required fields.');
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        let imageLink = '';
        try {
            const formData = new FormData();
            formData.append('file', image);

            const response = await axios.post('http://localhost:5000/api/images/upload', formData);
            imageLink = response.data.url;
        } catch (error) {
            swal.error('Error uploading image. Please try again.');
            setIsSubmitting(false);
            setLoading(false);
            return;
        }

        const payload = {
            userName,
            location,
            description,
            imgLink: imageLink,
            userContact: {
                phone: userPhone,
                email: userEmail,
            },
            animalType,
            nearByNGOs: ngos,
        };

        try {
            await axios.post('http://localhost:5000/api/distress/submit', payload);
            swal.success('Report submitted successfully!');
            navigate("/");
        } catch (error) {
            swal.error('Error submitting report.');
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <FormContainer>
                    <Title>Report an Injured Animal</Title>
                    <FormGroup>
                        <Label>Upload Image:</Label>
                        <FlexRow>
                            <div>
                                {!isCameraActive && (
                                    <Button
                                        onClick={() => {
                                            setIsCameraActive(true);
                                            setImagePreview(null);
                                        }}
                                    >
                                        Use Camera
                                    </Button>
                                )}
                                <Input
                                    style={{ display: 'none' }}
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) setImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                            </div>
                            <div>
                                <Button onClick={() => document.getElementById('fileInput').click()}>Choose from Files</Button>
                                <Input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </FlexRow>
                        {loading && <Loader />}
                    </FormGroup>
                    <FormGroup>
                        <Label>Description:</Label>
                        <TextArea
                            maxLength={100}
                            placeholder="Describe the animal's injury (max 100 words)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Animal Type:</Label>
                        <Input
                            type="text"
                            placeholder="e.g., Dog, Cat"
                            value={animalType}
                            onChange={(e) => setAnimalType(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Proximity (km):</Label>
                        <Dropdown value={proximity} onChange={(e) => setProximity(Number(e.target.value))}>
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={25}>25 km</option>
                        </Dropdown>
                        <Button onClick={fetchNGOs}>Find NGOs</Button>
                    </FormGroup>
                    <FormGroup>
                        <Label>Your Name:</Label>
                        <Input
                            type="text"
                            placeholder="Your full name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Your Email:</Label>
                        <Input
                            type="email"
                            placeholder="Your email address"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Your Phone:</Label>
                        <Input
                            type="tel"
                            placeholder="Your phone number (optional)"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                        />
                    </FormGroup>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !description || !animalType || !userName || !userEmail || !location}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </FormContainer>
                <RightPart>
                    {isCameraActive && (
                        <ImgWrapper>
                            <AiOutlineClose
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    color: "#c55626",
                                    cursor: "pointer",
                                    fontSize: "32px",
                                    fontWeight: "700",
                                }}
                                onClick={() => setIsCameraActive(false)}
                            />
                            <Webcam
                                style={{
                                    margin: "10px auto",
                                    maxWidth: "300px"
                                }}
                                ref={webcamRef}
                                audio={false}
                                width={"100%"}
                                screenshotFormat="image/png"
                                videoConstraints={{
                                    facingMode: "environment",
                                }}
                            />
                            <Button onClick={handleCapture}>Capture</Button>
                        </ImgWrapper>
                    )}
                    {imagePreview && (
                        <ImgWrapper>
                            <Title>Uploaded Image</Title>
                            <ImagePreview>
                                <img src={imagePreview} alt="Preview" />
                            </ImagePreview>
                        </ImgWrapper>
                    )}
                    <ListContainer>
                        <Title>Nearby NGOs</Title>
                        <NGOList>
                            {ngos.map((ngo, index) => (
                                <NGOItem key={index}>
                                    <strong>{ngo.ngo}</strong>
                                    <p>Phone: {ngo.phNo || 'N/A'}</p>
                                    <p>Email: {ngo.email || 'N/A'}</p>
                                </NGOItem>
                            ))}
                        </NGOList>
                        {ngos.length === 0 && !loading && <p>No NGOs found. Please try increasing the proximity range.</p>}
                    </ListContainer>
                </RightPart>
            </Container>
        </>
    );
};

export default ReportPage;
