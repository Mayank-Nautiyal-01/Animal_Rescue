import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import swal from '../utils/swal';
import Loader from '../components/Loader';
import CallCard from '../components/CallCard';
import DashboardNavbar from '../components/DashboardNavbar';

const Container = styled.div`
  padding: 2rem;
  background-color: #f8f8f8;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NgoInfo = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  h2 {
    margin-bottom: 1rem;
    color: #c55626;
  }
  p {
    margin: 0.5rem 0;
    color: #555;
  }
`;

const ChartWrapper = styled.div`
  flex-basis: 300px;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DistressCalls = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  margin-top: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  h3 {
    color: #c55626;
    margin-bottom: 1rem;
  }
`;

const CallsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => (props.active ? '#c55626' : '#fff')};
  color: ${props => (props.active ? '#fff' : '#555')};
  border: 2px solid #c55626;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f39c12;
    color: #fff;
  }
`;

const NoDataText = styled.p`
  color: #555;
  font-size: 1.2rem;
`;

const colors = ['#ae6335a7', '#c55626', '#d9a98d', '#c37a65'];

const DashboardNgo = () => {
    const [distressCalls, setDistressCalls] = useState([]);
    const [ngoDetails, setNgoDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('Pending');
    const [chartData, setChartData] = useState([]);

    const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
    const ngoName = userDetails.ngoName || "Default NGO";

    const fetchDistressCalls = async (status) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/distress/fetch-distress-calls?status=${status}`, {
                ngoName,
            });
            if (response.data.distressCalls) {
                const newDistressCalls = response.data.distressCalls;
                setDistressCalls(newDistressCalls || []);
                await updateChartData();
            } else {
                setDistressCalls([]);
            }
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDistressCalls([]);
                setLoading(false);
            } else {
                swal.error('Error fetching distress calls');
                setLoading(false);
            }
        }
    };

    const updateChartData = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/distress/fetch-distress-calls`, {
                ngoName,
            });
            const { Pending, Completed, InProgress } = response.data.distressCalls;
            const newChartData = [
                { name: 'Pending', value: Pending },
                { name: 'InProgress', value: InProgress },
                { name: 'Completed', value: Completed },
            ];
            setChartData(newChartData);
        } catch (error) {
            swal.error('Error fetching distress call data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchNgoDetails = async () => {
            try {
                setLoading(true);
                setNgoDetails(userDetails);
                await fetchDistressCalls(filterStatus);
                await updateChartData();
            } finally {
                setLoading(false);
            }
        };

        fetchNgoDetails();
    }, [filterStatus]);

    useEffect(() => {
        console.log("Chart Data: ", chartData);
    }, [chartData])
    const handleTakeAction = async (distressCallID) => {
        try {
            await axios.patch('http://localhost:5000/api/distress/status', {
                distressCallID,
                status: 'InProgress',
                ngoID: ngoDetails.id,
            });
            swal.success('Distress call is now In Progress');
            setLoading(true);
            fetchDistressCalls(filterStatus);
            updateChartData();
        } catch (error) {
            swal.error('Error updating distress call');
        }
    };

    const handleMarkAsComplete = async (distressCallID) => {
        try {
            await axios.patch('http://localhost:5000/api/distress/status', {
                distressCallID,
                status: 'Completed',
                ngoID: ngoDetails.id,
            });
            swal.success('Distress call marked as Completed');
            setLoading(true);
            fetchDistressCalls(filterStatus);
            updateChartData();
        } catch (error) {
            swal.error('Error marking distress call as complete');
        }
    };

    const handleCancel = async (distressCallID) => {
        try {
            await axios.patch('http://localhost:5000/api/distress/status', {
                distressCallID,
                status: 'Pending',
                ngoID: ngoDetails.id,
            });
            swal.success('Distress call has been canceled');
            setLoading(true);
            fetchDistressCalls(filterStatus);
            updateChartData();
        } catch (error) {
            swal.error('Error canceling distress call');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const getChartData = () => chartData || [];

    if (loading) return <Loader />;

    return (
        <>
            <DashboardNavbar />
            <Container>
                <DashboardHeader>
                    <NgoInfo>
                        <h2>{ngoDetails.ngoName}</h2>
                        <p>Total Requests: {(chartData[0]?.value || 0) + (chartData[1]?.value || 0) + (chartData[2]?.value || 0)}</p>
                        {ngoDetails?.email && <p>Email: {ngoDetails?.email || 'N/A'}</p>}
                        {ngoDetails?.phNo && <p>Phone: {ngoDetails?.phNo || 'N/A'}</p>}
                    </NgoInfo>
                    <ChartWrapper>
                        {chartData.length > 0 ? (
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={getChartData().filter(entry => entry.value > 0)}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={120}
                                    label
                                >
                                    {getChartData()
                                        .filter(entry => entry.value > 0)
                                        .map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        ) : (
                            <NoDataText>No data available to display</NoDataText>
                        )}
                    </ChartWrapper>
                </DashboardHeader>

                <FilterWrapper>
                    <FilterButton
                        active={filterStatus === 'Pending'}
                        onClick={() => setFilterStatus('Pending')}
                    >
                        Pending ({chartData.find(item => item.name === 'Pending')?.value || 0})
                    </FilterButton>
                    <FilterButton
                        active={filterStatus === 'InProgress'}
                        onClick={() => setFilterStatus('InProgress')}
                    >
                        InProgress ({chartData.find(item => item.name === 'InProgress')?.value || 0})
                    </FilterButton>

                    <FilterButton
                        active={filterStatus === 'Completed'}
                        onClick={() => setFilterStatus('Completed')}
                    >
                        Completed ({chartData.find(item => item.name === 'Completed')?.value || 0})
                    </FilterButton>

                </FilterWrapper>

                <DistressCalls>
                    <h3>{filterStatus} Distress Calls</h3>
                    {distressCalls.length === 0 ? (
                        <NoDataText>No {filterStatus} requests found</NoDataText>
                    ) : (
                        <CallsList>
                            {distressCalls.map(call => (
                                <CallCard
                                    call={call}
                                    filterStatus={filterStatus}
                                    handleTakeAction={handleTakeAction}
                                    handleMarkAsComplete={handleMarkAsComplete}
                                    handleCancel={handleCancel}
                                    copyToClipboard={copyToClipboard}
                                />
                            ))}
                        </CallsList>
                    )}
                </DistressCalls>
            </Container>
        </>
    );
};

export default DashboardNgo;