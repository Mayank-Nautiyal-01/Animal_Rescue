import React from 'react';
import { RotatingLines } from 'react-loader-spinner';
import styled from 'styled-components';

const LoaderOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const Loader = () => (
    <LoaderOverlay>
        <RotatingLines
            visible={true}
            height="96"
            width="96"
            color="#c55626"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
        />
    </LoaderOverlay>
);

export default Loader;
