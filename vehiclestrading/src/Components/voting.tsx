import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import {Voting  } from '../contracts/voting';
import { ScryptProvider, Scrypt, ContractCalledEvent, 
   PandaSigner, ByteString,} from 'scrypt-ts';
  import {
    TableContainer,Table,TableHead,TableRow,TableCell,Paper,Button,Snackbar,Alert,
    Link,Typography,Box,Divider,
  } from "@mui/material";

// `npm run deploycontract` to get deployment transaction id
const contract_id = {
  /** The deployment transaction id */
  txId: "1019644c60a3b77a68504af5f7c69ad3d4fa6c94586ab77440315c0b22ec795b",
  /** The output index */
  outputIndex: 0,
};
function byteString2utf8(b: ByteString) {
  return Buffer.from(b, "hex").toString("utf8");
}
function VoteBrand() {
  const [votingContract, setContract] = useState<Voting>();
  const signerRef = useRef<PandaSigner>();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState<{
    txId: string;
    candidate: string;
  }>({
    txId: "",
    candidate: "",
  });



  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        Voting,
        contract_id
      );
      setContract(instance);
    } catch (error: any) {
      console.error("fetchContract error: ", error);
      setError(error.message);
    }
  }

  useEffect(() => {

    const provider = new ScryptProvider();
    const signer = new PandaSigner(provider);

    signerRef.current = signer;
    
    fetchContract();

    const subscription = Scrypt.contractApi.subscribe(
      {
        clazz: Voting,
        id: contract_id,
      },
      (event: ContractCalledEvent<Voting>) => {
        setSuccess({
          txId: event.tx.id,
          candidate: event.args[0] as ByteString,
        });
        setContract(event.nexts[0]);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  
  

  async function voting(e: any) {
  
    const signer = signerRef.current as PandaSigner
    const { isAuthenticated, error } = await signer.requestAuth();

    if (!isAuthenticated) {
            throw new Error(error);
          }

    if(!signer) {
      alert("Please connect a wallet first!");
      return;
    }

    if (votingContract) {
      await votingContract.connect(signer);
      // create the next instance from the current
      const nextInstance = votingContract.next();

      const carBrand = e.target.name;

      // update state
      nextInstance.increaseVotesReceived(carBrand);

      // call the method of current instance to apply the updates on chain
      votingContract.methods
        .vote(carBrand, {
          next: {
            instance: nextInstance,
            balance: votingContract.balance,
          },
        })
        .then((result) => {
          console.log(`Voting call tx: ${result.tx.id}`);
        })
        .catch((e) => {
          setError(e.message);
          fetchContract();
          console.error("call error: ", e);
        });
    }
  }

    
  return (
    <div className="App">
        <h2>Vote for your favorite Car Brand</h2>
      <TableContainer
        component={Paper}
        variant="outlined"
        style={{ width: 1200, height: "220vh", margin: "auto" }}
      >
        <Table className='table-wrapper'>
          <TableHead >
            <TableRow className='table-head'>
              <TableCell align="center"><b>TOYOTA</b></TableCell>
              <TableCell align="center"><b>MAZDA</b></TableCell>
              <TableCell align="center"><b>BENZ</b></TableCell>
              <TableCell align="center"><b>HONDA</b></TableCell>
              <TableCell align="center"><b>AUDI</b></TableCell>
              <TableCell align="center"><b>BMW</b></TableCell>
              </TableRow>
          </TableHead>
          <TableRow>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"Toyota"}
                    src={`${process.env.PUBLIC_URL}/${"Toyota"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"mazda"}
                    src={`${process.env.PUBLIC_URL}/${"mazda"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"benz"}
                    src={`${process.env.PUBLIC_URL}/${"benz"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"honda"}
                    src={`${process.env.PUBLIC_URL}/${"honda"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"audi"}
                    src={`${process.env.PUBLIC_URL}/${"audi"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"bmw"}
                    src={`${process.env.PUBLIC_URL}/${"bmw"}.png`}
                  />
                </Box>
              </TableCell>
              </TableRow>
              <TableRow>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[0].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[0].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[1].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[1].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[2].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[2].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[3].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[3].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[4].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[4].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[5].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[5].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              </TableRow>
              <TableHead >
            <TableRow className='table-head'>
              <TableCell align="center"><b>CHEVROLET</b></TableCell>
              <TableCell align="center"><b>DODGE</b></TableCell>
              <TableCell align="center"><b>FERRARI</b></TableCell>
              <TableCell align="center"><b>FORD</b></TableCell>
              <TableCell align="center"><b>GMC</b></TableCell>
              <TableCell align="center"><b>INFINITY</b></TableCell>
              </TableRow>
              </TableHead>
              <TableRow>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"chevrolet"}
                    src={`${process.env.PUBLIC_URL}/${"chevrolet"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"dodge"}
                    src={`${process.env.PUBLIC_URL}/${"dodge"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"ferari"}
                    src={`${process.env.PUBLIC_URL}/${"ferari"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"ford"}
                    src={`${process.env.PUBLIC_URL}/${"ford"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"gmc"}
                    src={`${process.env.PUBLIC_URL}/${"gmc"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"infiniti"}
                    src={`${process.env.PUBLIC_URL}/${"infiniti"}.png`}
                  />
                </Box>
              </TableCell>
              </TableRow>
              <TableRow>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[6].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[6].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[7].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[7].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[8].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[8].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[9].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[9].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[10].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[10].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[11].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[11].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              </TableRow>
              <TableHead >
            <TableRow className='table-head'>
              <TableCell align="center"><b>JAGUAR</b></TableCell>
              <TableCell align="center"><b>JEEP</b></TableCell>
              <TableCell align="center"><b>KIA</b></TableCell>
              <TableCell align="center"><b>LAND ROVER</b></TableCell>
              <TableCell align="center"><b>LAMBORGHINI</b></TableCell>
              <TableCell align="center"><b>LEXUS</b></TableCell>
              </TableRow>
          </TableHead>
              <TableRow>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"jaguar"}
                    src={`${process.env.PUBLIC_URL}/${"jaguar"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"jeep"}
                    src={`${process.env.PUBLIC_URL}/${"jeep"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"kia"}
                    src={`${process.env.PUBLIC_URL}/${"kia"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"landrover"}
                    src={`${process.env.PUBLIC_URL}/${"landrover"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"lamboghini"}
                    src={`${process.env.PUBLIC_URL}/${"lamboghini"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"lexus"}
                    src={`${process.env.PUBLIC_URL}/${"lexus"}.png`}
                  />
                </Box>
              </TableCell>
              </TableRow>
              <TableRow>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[12].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[12].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[13].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[13].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[14].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[14].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[15].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[15].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[16].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[16].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[17].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[17].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              </TableRow>
          <TableHead >
            <TableRow className='table-head'>
              <TableCell align="center"><b>LOTUS</b></TableCell>
              <TableCell align="center"><b>PEUGEOT</b></TableCell>
              <TableCell align="center"><b>SATURN</b></TableCell>
              <TableCell align="center"><b>VOLVO</b></TableCell>
              <TableCell align="center"><b>MITSUBISHI</b></TableCell>
              <TableCell align="center"><b>OTHERS</b></TableCell>
            </TableRow>
          </TableHead>
          <TableRow>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"lotus"}
                    src={`${process.env.PUBLIC_URL}/${"lotus"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"peugeot"}
                    src={`${process.env.PUBLIC_URL}/${"peugeot"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"saturn"}
                    src={`${process.env.PUBLIC_URL}/${"saturn"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"volvo"}
                    src={`${process.env.PUBLIC_URL}/${"volvo"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"mitsubishi"}
                    src={`${process.env.PUBLIC_URL}/${"mitsubishi"}.png`}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Box
                    sx={{
                      height: 50,
                    }}
                    component="img"
                    alt={"others"}
                    src={`${process.env.PUBLIC_URL}/${"others"}.png`}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[18].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[18].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[19].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[19].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[20].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[20].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[21].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[21].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[22].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[22].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>

              <TableCell align="center">
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant={"h5"}>
                    {votingContract?.cars[23].votesReceived.toString()}
                  </Typography>
                  <Button
                  className='votingBtn'
                    variant="contained"
                    onClick={voting}
                    name={votingContract?.cars[23].name}
                  >
                    VOTE
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          
        </Table>

       
      </TableContainer>
      
      <Snackbar
        open={error !== ""}
        autoHideDuration={6000}
  
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={success.candidate !== "" && success.txId !== ""}
        autoHideDuration={6000}
    
      >
        <Alert severity="success">
          {" "}
          <Link
            href={`https://test.whatsonchain.com/tx/${success.txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {`"${byteString2utf8(success.candidate)}" got one vote,  tx: ${
              success.txId
            }`}
          </Link>
        </Alert>
      </Snackbar>
    </div>
      
  
  );

}
;
export default VoteBrand;
