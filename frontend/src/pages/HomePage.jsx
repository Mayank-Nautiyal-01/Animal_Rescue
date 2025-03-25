import React from 'react';
import styled from 'styled-components';
import Navbar from "../components/Navbar";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f0f0e3;
`;

const Content = styled.div`
  min-height: calc(100% - 100px);
  width: 100%;
  padding-top: 85px;
  overflow: auto;
`;

const ContentTitle = styled.h3`
  background-color: #d09571a7;
  padding: 6px 12px;
  width: fit-content;
  border-radius: 50px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.4vw;
  font-weight: 700;
`;

const MainTitle = styled.h1`
  font-size: 4.1vw;
  text-align: center;
  margin: 15px 0px;
  font-weight: bold;
  color: rgb(67, 54, 54);
`;

const HelpButton = styled.button`
  padding: 11px 13px;
  font-weight: 600;
  border: none;
  background-color: black;
  color: white;
  border-radius: 50px;
  font-size: 15px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin: 22px 0px;
`;

const BottomSection = styled.div`
  height: 230px;
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: center;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Elem = styled.div`
  flex-shrink: 0;
  height: 100%;
  width: 210px;
  border-radius: 22px;
  overflow: hidden;
`;

const ElemImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
`;

const DiscoverSection = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 50px;
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
  font-size: 2.7vw;
`;

const Box = styled.div`
  height: 210px;
  width: 250px;
  border-radius: 7px;
  overflow: hidden;
  display: inline-block;
  margin: 18px;
  position: relative;
  overflow: hidden;
`;

const BoxImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const BoxBottom = styled.div`
  height: 30%;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.829));
  position: absolute;
  bottom: -30%;
  transition: all ease 0.3s;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const HoverBox = styled(Box)`
  &:hover {
    box-shadow: 3.6px 3.6px 10px black;
  }

  &:hover ${BoxBottom} {
    bottom: 0;
  }
`;

const SectionContainer = styled.div`
  width: 100%;
  height: 80%;
`;

const SectionWrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  background: #d09571a7;

  h1{
    margin-top: 40px;
    text-align: center;
    font-size: 5vw;
    font-weight: 600;
    font-family: sans-serif;
    color: rgb(42, 39, 39);
  }

  h4{
    text-align: center;
    margin-top: 65px;
  }

  p{
    margin-top: 22px;
    text-align: center;
    font-weight: 300;
    font-size: 1.3vw;
    word-spacing: 4px;
    color: rgb(106, 98, 98);
   }
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const CustomButton = styled.button`
    padding: 11px 13px;
    font-weight: 600;
    border: none;
    background-color: ${(props) => props.isWhite ? 'rgba(255, 255, 255, 0.541)' : 'black'};
    color: ${(props) => props.isWhite ? 'black' : 'white'};
    border-radius: 50px;
    font-size: 15px;
    margin: 0 10px;
`;

const FlexRow = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
`;

const HomePage = () => {
    return (
        <PageContainer>
            <Navbar />
            <Content>
                <ContentTitle>Join us in saving millions of injured and homeless animals!</ContentTitle>
                <MainTitle>
                    Rescue and care for injured animals.<br />
                    Be a part of the change.
                </MainTitle>
                <HelpButton>Help now</HelpButton>

                <BottomSection>
                    <Elem>
                        <ElemImage src="https://plus.unsplash.com/premium_photo-1681882818664-f2a38235b6be?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3" />
                    </Elem>
                    <Elem>
                        <ElemImage src="https://plus.unsplash.com/premium_photo-1663127588537-96aacaef7b13?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.0.3" />
                    </Elem>
                    <Elem>
                        <ElemImage src="https://images.unsplash.com/photo-1511478907007-2f761980416b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" />
                    </Elem>
                    <Elem>
                        <ElemImage src="https://images.unsplash.com/photo-1689184379275-496af05a36b1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3" />
                    </Elem>
                    <Elem>
                        <ElemImage src="https://images.unsplash.com/photo-1570049496599-e68d2db27f40?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3" />
                    </Elem>
                </BottomSection>

                <DiscoverSection>
                    <Heading>Discover How We Help</Heading>
                    <FlexRow>
                        <HoverBox>
                            <BoxImage src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3" />
                            <BoxBottom>Report an Animal</BoxBottom>
                        </HoverBox>

                        <HoverBox>
                            <BoxImage src="https://images.unsplash.com/photo-1534243510675-3c687393caff?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3" />
                            <BoxBottom>Adopt a Friend</BoxBottom>
                        </HoverBox>

                        <HoverBox>
                            <BoxImage src="https://plus.unsplash.com/premium_photo-1661962834814-2086d028cda1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" />
                            <BoxBottom>Donate for Care</BoxBottom>
                        </HoverBox>

                        <HoverBox>
                            <BoxImage src="https://plus.unsplash.com/premium_photo-1681195079271-cbfd9ba1cbc7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" />
                            <BoxBottom>Volunteer with Us</BoxBottom>
                        </HoverBox>

                        <HoverBox>
                            <BoxImage src="https://vakilsearch.com/blog/wp-content/uploads/2021/05/VS_Blog-Images_3-05.png" />
                            <BoxBottom>NGO Connect</BoxBottom>
                        </HoverBox>

                        <HoverBox>
                            <BoxImage src="https://plus.unsplash.com/premium_photo-1720503242835-b537741c9736?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" />
                            <BoxBottom>Transparency Dashboard</BoxBottom>
                        </HoverBox>

                        <HoverBox>
                            <BoxImage src="https://images.unsplash.com/photo-1556484687-30636164638b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" />
                            <BoxBottom>Community Voices</BoxBottom>
                        </HoverBox>
                    </FlexRow>
                </DiscoverSection>

                <SectionContainer>
                    <SectionWrapper>
                        <h1>Join us in rescuing and caring for injured animals</h1>
                        <p>Millions of animals are waiting for help. Connect with compassionate individuals and organizations<br /> to make a difference in their lives and offer them a second chance.</p>
                        <ButtonContainer>
                            <CustomButton isWhite={true}>Start Helping Today</CustomButton>
                            <CustomButton isWhite={false} >Learn More About Volunteering</CustomButton>
                        </ButtonContainer>
                        <h4>Are you an animal lover? <u>Join</u></h4>
                    </SectionWrapper>
                </SectionContainer>
            </Content>
        </PageContainer>
    );
};

export default HomePage;
