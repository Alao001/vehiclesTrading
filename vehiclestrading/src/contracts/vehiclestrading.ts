import {
    Addr,
    prop,
    method,
    Utils,
    hash256,
    assert,
    ContractTransaction,
    bsv,
    PubKey,
    hash160,
    Sig,
    SigHash,
    ByteString,
} from 'scrypt-ts'
import { OrdiMethodCallOptions, OrdinalNFT } from 'scrypt-ord'

export class VehicleTrading extends OrdinalNFT {

    
    
    @prop()
    seller: PubKey

    @prop()
    amount: bigint

    @prop()
    seller_Location: ByteString  //Seller's company or house location where the buyers can come for inspection

    @prop()
    Vehicle_description: ByteString  // Details descriptions of the vehicles like proof if ownership details

    constructor(seller: PubKey, amount: bigint, seller_Location: ByteString, Vehicle_description: ByteString) {
        super()
        this.init(...arguments)
        this.seller = seller
        this.amount = amount
        this.seller_Location = seller_Location
        this.Vehicle_description = Vehicle_description
    }

    @method()
    public purchase(receiver: Addr) {
        const outputs =
            Utils.buildAddressOutput(receiver, 1n) + // ordinal to the buyer
            Utils.buildAddressOutput(hash160(this.seller), this.amount) + // fund to the seller
            this.buildChangeOutput()
        assert(
            this.ctx.hashOutputs == hash256(outputs),
            'hashOutputs check failed'
        )
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public cancel(sig: Sig, sellerPub: PubKey) {
        assert(this.checkSig(sig, sellerPub), 'seller signature check failed')
        const outputs = Utils.buildAddressOutput(hash160(this.seller), 1n) // ordinal back to the seller
        assert(
            this.ctx.hashOutputs == hash256(outputs),
            'hashOutputs check failed'
        )
    }

    static async buildTxForPurchase(
        current: VehicleTrading,
        options: OrdiMethodCallOptions<VehicleTrading>,
        receiver: Addr
    ): Promise<ContractTransaction> {
        const defaultAddress = await current.signer.getDefaultAddress()
        const tx = new bsv.Transaction()
            .addInput(current.buildContractInput())
            .addOutput(
                new bsv.Transaction.Output({
                    script: bsv.Script.fromHex(
                        Utils.buildAddressScript(receiver)
                    ),
                    satoshis: 1,
                })
            )
            .addOutput(
                new bsv.Transaction.Output({
                    script: bsv.Script.fromHex(
                        Utils.buildAddressScript(hash160(current.seller))
                    ),
                    satoshis: Number(current.amount),
                })
            )
            .change(options.changeAddress || defaultAddress)
        return {
            tx,
            atInputIndex: 0,
            nexts: [],
        }
    }

    static async buildTxForCancel(
        current: VehicleTrading,
        options: OrdiMethodCallOptions<VehicleTrading>
    ): Promise<ContractTransaction> {
        const defaultAddress = await current.signer.getDefaultAddress()
        const tx = new bsv.Transaction()
            .addInput(current.buildContractInput())
            .addOutput(
                new bsv.Transaction.Output({
                    script: bsv.Script.fromHex(
                        Utils.buildAddressScript(hash160(current.seller))
                    ),
                    satoshis: 1,
                })
            )
            .change(options.changeAddress || defaultAddress)
        return {
            tx,
            atInputIndex: 0,
            nexts: [],
        }
    }
}
// b0095335b1689e7f61fd296772c2cbf1851145ea4398f894aaf74c0db31b3f94