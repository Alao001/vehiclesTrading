import React, { useState } from 'react';
import styles from './contact.module.css';

const Contact: React.FC = () => {
  
  const [faqOpenId, setFaqOpenId] = useState<number | null>(null);

  const handleFaqClick = (id: number) => {
    setFaqOpenId(id === faqOpenId ? null : id);
  };

  const faqs = [
    {
      question: 'How can I start Tading in this Platform?',
      answer: 'Having download panda wallet and created an account, you can buying and selling of your vehicles.',
    },
    {
      question: 'How can I list my vehicle for sale?',
      answer: 'Before you list your vehicle for sale, you should inscribe the proof of ownership details or Image of the vehicle as ordinal, check the About section for guidance. ;.',
    },
    {
      question: 'what is Ordinals?',
      answer: 'Ordinals stored on the BSV blockchain are designed to exist as long as anyone around the globe is willing to keep a copy of the blockchain. This creates a reliable backup and maintains the files’ integrity..',
    },
    {
      question: 'why Ordinals on Bsv?',
      answer: 'Ordinals on the BSV blockchain provide an accessible way to use as a timestamp server or a public database (https://academy.bsvblockchain.org/blog/the-bitcoin-white-paper-timestamp-server). It’s akin to having a global, ultra-secure hard drive at your disposal that you can access anytime, anywhere, through any device connected to the BSV blockchain. They offer problem-solving benefits for everyone—from individuals to businesses to governments. Individuals can use them to create, collect, and share unique digital art, music, and memories that will exist ‘forever.’.',
    },
    {
      question: 'How can I buy a Vehicle i the market place?',
      answer: 'You can check the market place to check th your vafourite cars listed by seller in form of ordinals.',
    },
    {
      question: 'How can I get the address of the seller ?',
      answer: 'The address and contacts of the seller should be listed with the ordinal, you are advisded not to pay for any vehicle unless you contact the seller.  .',
    },
    {
      question: 'Why is this platform different from other platform?',
      answer: 'This platform is different because of it decentralisation and it is user-Friendlly for both the seller and buyer.',
 },
    {
      question: 'Is the listing of vehicle only for Dealers?',
      answer: 'No, The platform is open for all vehicle owners who wishes to sell his vehicle .',
    },
    {
      question: 'What is the purpose of the Voting section?',
      answer: 'The voting section is for the buyer to vote for there favourite car brand to give the dealers or sellers the insight about the buyers favourite cars. .',
    },
  ];
  

    return (
    <>
      <header className={styles.header}>
        <div className={styles.companyName}>
          <h1>AutoChainTrading</h1>
        </div>
      </header>
      <section id="contact" className={styles.contact}>
  <div className={styles.container}>
    <h2 className={styles.heading}>Contact Us</h2>
    <div className={styles["contact-intro"]}>Have a question or feedback? We would love to hear from you!</div>
    <h3>Alao Muideen Abiola</h3>
    <a style={{ color: "#FE9C2F",display: "centre", padding: "50px" }} 
    href="https://www.linkedin.com/in/alao-muideen-abiola-741051236?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
      <img src={('./linkedin.png')} alt="Linkedin" height={100} width={100} />
      
      </a>
      <a style={{ color: "#FE9C2F", display: "centre", padding: "50px" }} 
    href="https://x.com/Maatech001?t=DaluRwFQXqFaj6d3lRvHcA&s=09">
      <img src={('./twitter.png')} alt="twitter" height={100} width={100} />
      
      </a>
      <h3>Chidi Micheal</h3>
      <a style={{ color: "#FE9C2F",display: "centre", padding: "50px" }} 
    href="https://x.com/chidimykel1">
      <img src={('./linkedin.png')} alt="Linkedin" height={100} width={100} />
      
      </a>
      <a style={{ color: "#FE9C2F", display: "centre", padding: "50px" }} 
    href="https://x.com/chidimykel1">
      <img src={('./twitter.png')} alt="twitter" height={100} width={100} />
      
      </a>
  </div>
</section>

      <section id="faq" className={styles.faq}>
        <div className={`${styles.container} container`}>
          <h2 className={styles.heading}>Frequently Asked Questions</h2>
          <p className={styles.subHeading}>Here are some of the most frequently asked questions from our users:</p>
          
          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div key={index} onClick={() => handleFaqClick(index)} className={`${styles.faqItem} ${faqOpenId === index ? styles.open : ''}`}>
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2024 AutoChaintrade</p>
      </footer>
    </>
  );
};

export default Contact;