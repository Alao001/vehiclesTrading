import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import "../App.css";

interface ItemProps {
  item: any
  idx: number
  onList: (idx: number, priceSats: number, location: string, description: string) => void;
}

const VehicleViewWallet: React.FC<ItemProps> = ({ item, idx, onList }) => {
  const [textData, setTextData] = useState<string | null>(null);

  const [isListing, setIsListing] = useState(false);
  const [price, setPrice] = useState('0.001');
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (item.origin.data.insc.file.type === 'text/plain') {
      const url = `https://testnet.ordinals.gorillapool.io/content/${item.origin.outpoint}`;
      fetch(url)
        .then(response => response.text())
        .then(data => setTextData(data))
        .catch(error => console.error('Error fetching text data:', error));
    }
  }, [item]);

  const handleListForSale = () => {
    if (isListing) {
      const priceFloat = parseFloat(price);
      if (!isNaN(priceFloat) && priceFloat >= 0.00000001 ) {
        const priceSats = Math.floor(priceFloat * 10**8)
        onList(idx, priceSats, location, description);
        setIsListing(false);
        setLocation('');
        setDescription(''); 
        setPrice('');
      } else {
        console.error('Invalid input entered');
      }
    } else {
      setIsListing(true);
    }
  };

  return (
    
    <Card sx={
      
      {
        width: 350,
        height: 400,
        m: 2,
      }}>
        
      <CardContent style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '90%',
        height: '90%',
      }}>
        
        {item.origin.data.insc.file.type.startsWith('image/') && (
          <img style={{ maxWidth: 250 }} src={`https://testnet.ordinals.gorillapool.io/content/${item.origin.outpoint}`} alt={`Content #${item.origin.num}`} />
        )}
        {item.origin.data.insc.file.type === 'text/plain' && (
          <Typography variant="h5" component="div">
            {textData || 'Loading text...'}
          </Typography>
        )}
        {item.origin.num ? (
          <Typography variant="body2" color="text.secondary">
            #{item.origin.num}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Pending...
          </Typography>
          
        )}
        
         
          
        <Button variant="contained" onClick={handleListForSale}>
          {isListing ? 'Confirm' : 'List For Sale'}
        </Button>
        {isListing && (
          <>
          <TextField
            label="Set Price (BSV)"
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            inputProps={{ step: "0.01" }} // Allow decimal values
            style={{ marginTop: 10 }}
          />
          <TextField
          label=" input your address and contact"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type='string'
          fullWidth margin='normal'
          required
        />
          <TextField
          label=" Describe your vehicle"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type='string'
          fullWidth margin='normal'
          required
        />
        </>
        )}
      </CardContent>
    </Card>
   
  );
};

export default VehicleViewWallet;