// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Addr, PandaSigner, PubKey, UTXO, bsv, findSig, toByteString, ScryptProvider } from 'scrypt-ts';
import { OneSatApis, OrdiMethodCallOptions, OrdiNFTP2PKH, OrdiProvider } from 'scrypt-ord';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import VehicleViewWallet from './Components/VehicleViewWallet';
import { VehicleTrading } from './contracts/vehiclestrading';
import VehicleViewMarket from './Components/VehicleViewMarket';
import NavBar from './Components/NavBar';
import About from './Components/About';
import "./App.css";
import Inspection from './Components/Inspection';
import PaymentPage from './Components/payment';
import VoteBrand from './Components/voting';
import Comments from './Components/Comments/comments';
import Contact from './Components/contact';


const App: React.FC = () => {
  const signerRef = useRef<PandaSigner>();

  const [isConnected, setIsConnected] = useState(false)

  const [connectedOrdiAddress, setConnectedOrdiAddress] = useState(undefined)

  const [walletItems, setWalletItems] = useState([])
  const [marketItems, setMarketItems] = useState([])

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadMarketItems()
  }, []);

  async function loadWalletItems() {
    const signer = signerRef.current as PandaSigner;

    if (signer) {
      try {
        const connectedOrdiAddressStr = connectedOrdiAddress.toString();
        const url = `https://testnet.ordinals.gorillapool.io/api/txos/address/${connectedOrdiAddressStr}/unspent?bsv20=false`;

        const response = await fetch(url);
        const data = await response.json();

        const filteredData = data.filter(e => e.origin.data.insc.file.type !== 'application/bsv-20')
          .filter(e => marketItems[e.origin.outpoint] ==  undefined);

        setWalletItems(filteredData);
      } catch (error) {
        console.error('Error fetching wallet items:', error);
      }
    }
  }

  async function loadMarketItems() {
    const marketItemsRaw = localStorage.getItem('marketItems')
    if (marketItemsRaw) {
      const marketItems = JSON.parse(marketItemsRaw)
      setMarketItems(marketItems)
    }
  }

  function storeMarketItem(ordLockTx: bsv.Transaction, price: number, seller: string, location: string, description : string, item: any) {
    let marketItems: any = localStorage.getItem('marketItems')
    if (!marketItems) {
      marketItems = {}
    } else {
      marketItems = JSON.parse(marketItems)
    }

    marketItems[item.origin.outpoint] = {
      txId: ordLockTx.id, //'f324791f4f452aac77eea210d84c437539a1e8b9ea461b21ac992dce914cf88e',   
      vout: 0,
      price: price,
      seller: seller,
      location : toByteString(location, true),
      description : toByteString(description, true),
      item: item

    }

    localStorage.setItem('marketItems', JSON.stringify(marketItems));
    setMarketItems(marketItems)
  }

  function removeMarketItem(originOutpoint: string) {
    let marketItems: any = localStorage.getItem('marketItems')
    if (!marketItems) {
      marketItems = {}
    } else {
      marketItems = JSON.parse(marketItems)
    }

    delete marketItems[originOutpoint]

    localStorage.setItem('marketItems', JSON.stringify(marketItems));
    setMarketItems(marketItems)
  }

  const handleList = async (idx: number, priceSats: number, location: string, description: string) => {
    const signer = signerRef.current as PandaSigner;

    const item = walletItems[idx]
    const outpoint = item.outpoint

    // Create a P2PKH object from a UTXO.
    const Network = bsv.Networks.testnet
    //OneSatApis.setNetwork(bsv.Networks.testnet)
    const utxo: UTXO = await OneSatApis.fetchUTXOByOutpoint(outpoint, Network)
    const p2pkh = OrdiNFTP2PKH.fromUTXO(utxo)

    // Construct recipient smart contract - the ordinal lock.
    const ordPublicKey = await signer.getOrdPubKey()
    const seller = PubKey(ordPublicKey.toByteString())
    const amount = BigInt(priceSats)
    const Seller_location = toByteString(location, true)
    const Vehicle_description = toByteString(description, true)
    const ordLock = new VehicleTrading(seller, amount, Seller_location, Vehicle_description)
    await ordLock.connect(signer)

    // Unlock deployed NFT and send it to the recipient ordinal lock contract.
    await p2pkh.connect(signer)

    const { tx: transferTx } = await p2pkh.methods.unlock(
      (sigResps) => findSig(sigResps, ordPublicKey),
      seller,
      {
        transfer: ordLock,
        pubKeyOrAddrToSign: ordPublicKey,
      } as OrdiMethodCallOptions<OrdiNFTP2PKH>
    );

    console.log("LIsting NFT: ", transferTx.id);
    alert('listing called TxId:' + transferTx.id)

    // Store reference in local storage.
    storeMarketItem(transferTx, priceSats, seller, location, description, item)
  };

  const handleBuy = async (marketItem: any) => {
    const signer = signerRef.current as PandaSigner;
    
    const { isAuthenticated, error } = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }

    const tx = await signer.provider.getTransaction(marketItem.txId)
    const instance = VehicleTrading.fromTx(tx, 0)

    await instance.connect(signer)

    const buyerPublicKey = await signer.getOrdPubKey()
    
    const receiverAddr = Addr(buyerPublicKey.toAddress().toByteString())
    
    const callRes = await instance.methods.purchase(
      receiverAddr
    )

    console.log("Purchase call: ", callRes.tx.id);
    alert('Purchase called TxId:' + callRes.tx.id)

    // Remove market item.
    removeMarketItem(marketItem.item.origin.outpoint)
  }

  const handleCancel = async (marketItem: any) => {
    const signer = signerRef.current as PandaSigner;
    
    const { isAuthenticated, error } = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }

    const tx = await signer.provider.getTransaction(marketItem.txId)
    const instance = VehicleTrading.fromTx(tx, 0)

    await instance.connect(signer)

    const seller = await signer.getOrdPubKey()
    const sellerPublicKey = PubKey(seller.toByteString())

    const callRes = await instance.methods.cancel(
      (sigResps) => findSig(sigResps, seller), sellerPublicKey,
      {
        pubKeyOrAddrToSign: seller,
      } as OrdiMethodCallOptions<VehicleTrading>
    )

    console.log("Cancel call: ", callRes.tx.id);
    alert('Cancel listing called TxId:' + callRes.tx.id)

    // Remove market item.
    removeMarketItem(marketItem.item.origin.outpoint)
  }
  const handleConnect = async () => {
    const provider = new ScryptProvider();
    const signer = new PandaSigner(provider);

    signerRef.current = signer;
    const { isAuthenticated, error } = await signer.requestAuth()
    if (!isAuthenticated) {
      throw new Error(`Unauthenticated: ${error}`)
    }

    setConnectedOrdiAddress(await signer.getOrdAddress())
    setIsConnected(true)
    loadWalletItems()
  };

  const handleTabChange = (e, tabIndex) => {
    if (tabIndex == 1) {
      loadWalletItems()
    } else if (tabIndex == 2) {
      loadMarketItems()
    }
    setActiveTab(tabIndex);
  };

  
  return (
    <div>
    <NavBar />
      {isConnected ? (
        <div style={{ padding: '20px' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="About" style={{ color: 'red' }}/>
              <Tab label="Seller's Assets" style={{ color: 'red' }} />
              <Tab label="Trading Platform" style={{ color: 'red' }} />
              <Tab label="Pre Shipment Inspection & Testdrive" style={{ color: 'red' }}/>
              <Tab label=" Voting section" style={{ color: 'red' }} />
              <Tab label=" Contact Us" style={{ color: 'red' }} />
            </Tabs>
          </Box>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', height:"220vh",width: 1000, margin: "auto"  }}>
              <div>
                
                <About />
              
              </div>
            </Box>
          )}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {walletItems.map((item, idx) => {
                return <VehicleViewWallet key={idx} item={item} idx={idx} onList={handleList} />
              })}
            </Box>
          )}
          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {Object.entries(marketItems).map(([key, val], idx) => {
                const isMyListing = val.item.owner == connectedOrdiAddress.toString()
                return <VehicleViewMarket key={key} marketItem={val} isMyListing={isMyListing} idx={idx} onBuy={handleBuy} onCancel={handleCancel} />
              })}
            </Box>
          )}
           {activeTab === 3 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div>
                <Inspection />
                <PaymentPage />
              </div>
            </Box>
          )}
          {activeTab === 4 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <VoteBrand />
                <Comments />
            </Box>
          )}
          {activeTab === 5 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div>
                <Contact />
          
              </div>
            </Box>
          )}
        </div>
      ) : (
        <div style={{ height: '100vh', display: 'center', justifyContent: 'center', alignItems: 'center',textAlign:'center' }}>
          <img src={('./Carfleet.png')} alt="car" height={200} width={500} />
          <h1>AutoChainTrade</h1>
          <h2>A Platform for Selling and Buying Vehicles</h2>
          <h3>To Get Started, Download a panda wallet and connect below</h3>
          <Typography align="center">
                  Do not have a Panda Wallet?
                </Typography>
                <br />
                <Typography align="center">
                  👉 <a href="https://chromewebstore.google.com/detail/panda-wallet/mlbnicldlpdimbjdcncnklfempedeipj" style={{ color: 'brown' }} target="_blank" rel="noreferrer">Get it here</a>
                </Typography>
          <Button variant="contained" size="large" onClick={handleConnect}>
            Connect Panda Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;