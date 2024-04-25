import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { VehicleTrading } from './contracts/vehiclestrading';
import { Payment } from './contracts/payments';
import { Voting } from './contracts/voting';
import { Commentsection } from './contracts/comments';

import artifact1 from '../artifacts/vehiclestrading.json'
import artifact2 from '../artifacts/payments.json'
import artifact3 from '../artifacts/voting.json'
import artifact4 from '../artifacts/comments.json'
import { Scrypt, bsv } from 'scrypt-ts';


VehicleTrading.loadArtifact(artifact1)
Payment.loadArtifact(artifact2)
Voting.loadArtifact(artifact3)
Commentsection.loadArtifact(artifact4)

Scrypt.init({
  apiKey:process.env
  .REACT_APP_API_KEY || 'testnet_Kc6yPayPTPMti3Ss2T87FTlIv6fFWaE0n4N2gAZXE1tFTmie',
  network :bsv.Networks.testnet
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log)).
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
