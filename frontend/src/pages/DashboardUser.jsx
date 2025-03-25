import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import swal from '../utils/swal';
import Loader from '../components/Loader';
import DashboardNavbar from '../components/DashboardNavbar';

const Container = styled.div`
  padding: 2rem;
  background-color: #f8f8f8;
`;

const DistressCalls = styled.div`
  padding: 1.5rem;
  min-height: 80vh;
  border-radius: 8px;
  h3 {
    color: #c55626;
    margin-bottom: 1rem;
  }
`;

const CallsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const CallCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const CallImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  object-fit: contain;
`;

const CallInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.1rem;
`;

const Desc = styled.p`
  font-size: 1rem;
  color: #555;
`;

const Location = styled.a`
  font-size: 1rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover {
    color: #c55626;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusIcon = styled.span`
  font-size: 1.5rem;
  color: ${props =>
        props.status === 'Pending' ? 'red' :
            props.status === 'InProgress' ? 'orange' :
                'green'};
`;

const NoDataText = styled.p`
  color: #555;
  font-size: 1.2rem;
`;

const UserDashboard = () => {
    const [distressCalls, setDistressCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
    const { phNo, email } = userDetails;

    const fetchDistressCalls = async () => {
        try {
            setLoading(true);
            const requestData = {
                phNo: phNo || undefined,
                email: email || undefined,
            };

            const response = await axios.post('http://localhost:5000/api/distress/fetch-user-calls', requestData);

            if (response.data.distressCalls) {
                setDistressCalls(response.data.distressCalls || []);
            } else {
                setDistressCalls([]);
            }
        } catch (error) {
            swal.error('Error fetching distress calls');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDistressCalls();
    }, []);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    };

    if (loading) return <Loader />;

    return (
        <>
            <DashboardNavbar />
            <Container>
                <DistressCalls>
                    <h3>Your Distress Calls</h3>
                    {distressCalls.length === 0 ? (
                        <NoDataText>No distress calls found</NoDataText>
                    ) : (
                        <CallsList>
                            {distressCalls.map((call) => (
                                <CallCard key={call._id}>
                                    {call.imgLink && <CallImage src={call.imgLink} alt="Distress Call" />}
                                    <CallInfo>
                                        <TopRow>
                                            <Location
                                                href={`https://www.google.com/maps?q=${call.distressLocation}`}
                                                target="_blank"
                                            >
                                                <span role="img" aria-label="location">📍</span>
                                                Reported Location
                                            </Location>
                                            <span>{formatDate(call.createdAt)}</span>
                                        </TopRow>
                                        <Desc>{call.desc || 'No description available'}</Desc>
                                        <span>{call.userPhNo || call.userEmail}</span>
                                        <StatusContainer>
                                            <span>{call.assignedNGO ? `Accepted by ${call.assignedNGO.ngoName}` : 'Accepted by None'}</span>
                                            <StatusIcon status={call.status}>
                                                {call.status === 'Pending' ? '🔴' :
                                                    call.status === 'InProgress' ? '🟠' : '🟢'}
                                            </StatusIcon>
                                        </StatusContainer>
                                    </CallInfo>
                                </CallCard>
                            ))}
                        </CallsList>
                    )}
                </DistressCalls>
            </Container>
        </>
    );
};

export default UserDashboard;
