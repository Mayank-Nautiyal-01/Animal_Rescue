import styled from 'styled-components';
import { FaMapMarkerAlt, FaClipboard, FaExclamationCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const StyledCallCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  border: 2px solid #c55626;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LocationWrapper = styled.div`
  h4 {
    color: #c55626;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TimeAgo = styled.div`
  color: #777;
  font-size: 0.9rem;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ImageWrapper = styled.div`
  flex: 0 0 250px;
  height: 250px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const CallImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;

  p {
    margin: 0.5rem 0;
    color: #333;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &.take-action {
    background-color: #f39c12;

    &:hover {
      background-color: #e67e22;
    }
  }

  &.mark-complete {
    background-color: #2ecc71;

    &:hover {
      background-color: #27ae60;
    }
  }

  &.cancel {
    background-color: #e74c3c;

    &:hover {
      background-color: #c0392b;
    }
  }
`;

export default function CallCard({ call, filterStatus, handleTakeAction, handleMarkAsComplete, handleCancel, copyToClipboard }) {
    const openGoogleMaps = (location) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        window.open(url, '_blank');
    };

    return (
        <StyledCallCard>
            <TopRow>
                <LocationWrapper>
                    <h4 onClick={() => openGoogleMaps(call.distressLocation)}>
                        <FaMapMarkerAlt /> {call.distressLocation}
                    </h4>
                </LocationWrapper>
                <TimeAgo>
                    {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
                </TimeAgo>
            </TopRow>

            <ContentRow>
                <ImageWrapper>
                    {call.imgLink && <CallImage src={call.imgLink} alt="Distress call" />}
                </ImageWrapper>

                <DetailsWrapper>
                    <div>
                        <p>
                            <strong>Created By:</strong> {call.createdBy || 'Unknown'}
                        </p>
                        <p>{call.desc}</p>
                    </div>
                    <p>
                        <strong>Contact:</strong>{' '}
                        <span
                            onClick={() => copyToClipboard(call.userEmail || call.userPhNo)}
                            style={{ cursor: 'pointer', color: '#c55626', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {call.userEmail || call.userPhNo || 'Not Provided'} <FaClipboard />
                        </span>
                    </p>
                    <ButtonWrapper>
                        {filterStatus === 'Pending' && (
                            <ActionButton className="take-action" onClick={() => handleTakeAction(call._id)}>
                                <FaExclamationCircle /> Take Action
                            </ActionButton>
                        )}
                        {filterStatus === 'InProgress' && (
                            <>
                                <ActionButton className="mark-complete" onClick={() => handleMarkAsComplete(call._id)}>
                                    <FaCheckCircle /> Mark as Complete
                                </ActionButton>
                                <ActionButton className="cancel" onClick={() => handleCancel(call._id)}>
                                    <FaTimesCircle /> Cancel
                                </ActionButton>
                            </>
                        )}
                    </ButtonWrapper>
                </DetailsWrapper>
            </ContentRow>
        </StyledCallCard>
    );
}
