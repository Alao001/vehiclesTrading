// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import NewComment from './newComment';
import CommentView from './commentView';
import { ScryptProvider, Scrypt, bsv, ContractCalledEvent, toByteString, PandaSigner,} from 'scrypt-ts';
import { Commentsection } from '../../contracts/comments';
import { Comment } from '../../contracts/comments';
import '../../App.css';

// `npm run deploycontract` to get deployment transaction id
const contract_id = {
  /** The deployment transaction id */
  txId: "058524faabd597675f2735e623837c784b042a93b63d21e4862fbe53b5f9850c",
  /** 058524faabd597675f2735e623837c784b042a93b63d21e4862fbe53b5f9850c 
   * f5664fc9bd16f5b6cb3da82721b03b1b61d83a0878fb249c6dbc82851d82bebd
  */
  
  outputIndex: 0,
};

const Comments: React.FC = () => {
  const signerRef = useRef<PandaSigner>();
  const [contractInstance, setContract] = useState<Commentsection>();
  const [error, setError] = React.useState("");

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        Commentsection,
        contract_id
      );
      setContract(instance);
    } catch (error: any) {
      console.error("fetchContract error: ", error);
      setError(error.message);
    }
  }
  
  
  useEffect(() => {
    fetchContract();

    const subscription = Scrypt.contractApi.subscribe(
      {
        clazz: Commentsection,
        id: contract_id,
      },
        (event: ContractCalledEvent<Commentsection>) => {
        console.log('Got event from sCrypt service:', event)
        setContract(event.nexts[0]);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAdd = async (item: { commentTitle: string; commentDescription: string })=> {

     const provider = new ScryptProvider()
      const signer = new PandaSigner(provider)
      signerRef.current = signer
      if (contractInstance && signer) {
      const { isAuthenticated, error } = await signer.requestAuth()
      if (!isAuthenticated) {
        throw new Error(`Unauthenticated: ${error}`)
      }
      await contractInstance.connect(signer); 
      const nextInstance = contractInstance.next();
 
      const toAdd: Comment = {
        commentTitle: toByteString(item.commentTitle,true),
      commentDescription: toByteString(item.commentDescription,true),
    }  
  let commentIdx = undefined
  for (let i = 0; i < Commentsection.MAX_TASKCOUNT; i++) {
    const comment = contractInstance.comments[i]
    if (!comment.commentTitle ) {
      commentIdx = BigInt(i)
      nextInstance.comments[i] = toAdd
      break
    }
  }
  if (commentIdx === undefined) {
    console.error('All comment slots are filled.')
    return
  
  }
 contractInstance.methods
      .addComment(
        toAdd,
        commentIdx,
        {
          next: {
            instance: nextInstance,
            balance: contractInstance.balance,
          },
        }
      )
      .then((result) => {
        console.log(`Add comment call tx: ${result.tx.id}`);
        alert('comment called TxId:' + result.tx.id)
      })
      .catch((e) => {
        console.error("Add comment call error: ", e);
      });
  }
  }
  ;
  

  return (
    (
      <div className="App">
      <h1>PLEASE ADD YOUR COMMENTS AND COMPLAIN BELOW</h1>
     
      <NewComment onAdd={handleAdd} />
      {contractInstance && contractInstance.comments.map((item, idx) => {
                return <CommentView key={idx}  comment={item} commentIdx={idx} />
              })}
       
    </div>
    
    
  ) 
  );
};

export default Comments;