import React, { useState, useRef } from 'react';
import { Payment } from '../contracts/payments';
import { Addr, PandaSigner, ScryptProvider, bsv,MethodCallOptions, 
  getRandomAddress, Utils,  } from 'scrypt-ts';



function PaymentPage  ()  {
  const signerRef = useRef<PandaSigner>();
  const [amount, setAmount] = useState('0');

  const handlePayment = async () => {
    
    try {
      const provider = new ScryptProvider()
      const signer = new PandaSigner(provider)
      const { isAuthenticated, error } = await signer.requestAuth()
    if (!isAuthenticated) {
      throw new Error(`Unauthenticated: ${error}`)
    }
const inspector_payout = getRandomAddress()
    const developers_payout = getRandomAddress()
        const priceFloat = parseFloat(amount);
        const priceSats = Math.floor(priceFloat * 10**8)
//create an P2PKH instance
const instance = new Payment(Addr(inspector_payout.toByteString()),
Addr(developers_payout.toByteString()))
// connect the contract instance to a signer
await instance.connect(signer) 
   instance.bindTxBuilder(
    'pay', 
    async(
      current : Payment,
        options: MethodCallOptions<Payment>,
        amount : bigint,
    ) =>{
        const defaultChangeAddress = await current.signer.getDefaultAddress()
        const inspector_payout = (Number(amount) * 90)/100
        const developers_payout = (Number(amount) * 10)/100
        
        const unsignedTx: bsv.Transaction = new bsv.Transaction()
        //add contract input
        .addInput(current.buildContractInput(options.fromUTXO))
        //build father output
        .addOutput( new bsv.Transaction.Output({
            script: bsv.Script.fromHex(Utils.buildPublicKeyHashScript(current.inspector)),
            satoshis : Number(inspector_payout)
        }))
        //build mother output
        .addOutput( new bsv.Transaction.Output({
            script: bsv.Script.fromHex(Utils.buildPublicKeyHashScript(current.developers)),
            satoshis : Number(developers_payout)
        }))
        //build change output
        .change(options.changeAddress || defaultChangeAddress)
        return {
            tx: unsignedTx,
            atInputIndex : 0,
            nexts:[]
        }
      });
// deploy the contract instance.bindTxBuilder('pay', Payment.buildTxForPay) 
 const depolyTx = await instance.deploy(10) 
 console.log('the contract deployed successfully', depolyTx.id) 

 const { tx: callTx } = await instance.methods.pay(priceSats) 

      console.log('contract called: ', callTx.id)
      alert('contract called TxId:' + callTx.id)
           return callTx.id
    }  
    catch (error: any) {
      console.error("Payment not successful: ", error)
      alert('Payment not successful')
    }   
  }
  ;

  return (
    <div>
      <h1>Inspection Service Payment</h1>
      <h3>Use the below input to pay for your Inspection fee and test drive</h3>
      <h3>From the Recognised Company</h3>
      <label>
        Amount:
        <input
          value={amount}
          onChange={e => setAmount((e.target.value))}
          type="number"
        />
      </label>
      <button onClick={handlePayment}>Pay Now</button>
      <p>Note: 10% of your payment will be directed to the developers account</p>
      <p>maintenance of the Platform</p>
    </div>
  );
  };

export default PaymentPage;