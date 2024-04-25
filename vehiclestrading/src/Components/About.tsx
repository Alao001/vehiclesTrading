import React from 'react';
import { Typography } from '@mui/material';
import '../App.css';

const AboutSection: React.FC = () => {
  return (
    <section id="about">
      <div className="container">
        <div className="about-content">
          <h2> WELCOME TO AUTOCHAINTRADE, A DECENTRALISED AUTOMOTIVE TRADING PLATFORM</h2>
          <h3 className="heading3">Buying and selling a car? The platform is here to help</h3>
<p>Buying or selling a car can be a leap into the unknown, however knowledgeable you are. 
That’s where The Platform comes in. It the easiest and most trusted way to buy and sell a car on-chain.</p>
          <p>
            Where innovation meets tradition in the world of automotive
            ownership. We're not just another car trading platform; we're
            revolutionizing the way people buy, sell, and own cars through the
            power of NFTs (Non-Fungible Tokens).
          </p>
          <p>
            At this platform, we understand that owning a
            car is more than just possessing a vehicle; it's about the
            experiences, memories, and pride that come with it. That's why
            we've integrated cutting-edge blockchain technology to offer NFT
            car images, serving as digital certificates of ownership.
          </p>
          <p>
            Each car listed on the platform comes with its unique NFT Ordinal,
            providing indisputable proof of ownership stored securely on the
            blockchain. Say goodbye to paper certificates and hello to the
            future of ownership authentication.
          </p>
          <p>
            But we're not just focused on ownership; we're passionate about
            creating a seamless and transparent trading experience for our
            users. With our user-friendly interface and advanced search
            features, finding your dream car or selling your current one has
            never been easier.
          </p>
          <p>
            Whether you're a seasoned car enthusiast or a first-time buyer,
            Automotive Trading Platform  is here to redefine the way you
            interact with the automotive world. Join us on this journey as we
            drive forward into the future of car ownership.
          </p>
      
    <h3 className="heading3">How The Platform Works </h3>
    <p>- After SignUp and Login with your panda wallet either as a Seller or Buyer</p>
    <p>- If you are seller that want to list your vehicle for sale</p>
    <p>Click below to inscribe your Vehicle's Image or Proof of Ownership details</p>
    <Typography variant="body1" align="center">

          <a style={{ color: "#FE9C2F",  }} href="https://inscribe.scrypt.io/">Inscribe Here</a>&nbsp; &nbsp;
          <h3>Watch Video Tutorial on How To Inscribe</h3>
          <a style={{ color: "#FE9C2F" }} href="https://youtu.be/f-7p7uryuCM?si=ypYzMVDY6xCAG8TT">Video Tutorial</a>

        </Typography>
    
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
