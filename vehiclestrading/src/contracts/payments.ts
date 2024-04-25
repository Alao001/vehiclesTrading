import {SmartContract,prop,method, assert,Utils,Addr,hash256,bsv,MethodCallOptions,
    ContractTransaction,
    } from 'scrypt-ts'
    // this payment system is for paying for inspection and testdrive service
    // where 10% of the payment will be for the developers.
    export class Payment extends SmartContract {
     @prop()
    inspector: Addr
     @prop()
    developers: Addr
    
    constructor(inspector: Addr,  developers: Addr) {
     super(...arguments)
     this.inspector = inspector
     this.developers = developers
 }
    
     @method()
     public pay(amount: bigint) {
        assert(amount > 0n, 'Amount must be greater than zero')
    
    const inspector_payout = Utils.buildPublicKeyHashOutput(
    this.inspector,
  (amount * 90n) / 100n
     )
     const developers_payout = Utils.buildPublicKeyHashOutput(
    this.developers,
  (amount * 10n) / 100n
     )
    
     const output = inspector_payout + developers_payout + this.buildChangeOutput()
     console.log('hashoutput:',this.debug.diffOutputs(output))
assert(hash256(output) == this.ctx.hashOutputs, 'HashOutput MissMatch')
 }
    
 static async buildTxForPay(
     current: Payment,
 options: MethodCallOptions<Payment>,
    amount: bigint
    ): Promise<ContractTransaction> {
     const defaultChangeAddress = await current.signer.getDefaultAddress()
     const inspector_payout = (amount * 90n) / 100n
     const developers_payout = (amount * 10n) / 100n
     const unsignedTx: bsv.Transaction = new bsv.Transaction()
     // add contract input
    .addInput(current.buildContractInput(options.fromUTXO))
    
    // build dev output
    .addOutput(
     new bsv.Transaction.Output({
    script: bsv.Script.fromHex(
    Utils.buildPublicKeyHashScript(current.inspector)
 ),
    satoshis: Number(inspector_payout),
    })
    )
    
 // build contractor output
     .addOutput(
    new bsv.Transaction.Output({
     script: bsv.Script.fromHex(
     Utils.buildPublicKeyHashScript(current.developers)
     ),
     satoshis: Number(developers_payout),
     })
     )
  // build change output
  .change(options.changeAddress || defaultChangeAddress)
    
    return {
    tx: unsignedTx,
     atInputIndex: 0,
    nexts: [],
     }
 }
    }
    