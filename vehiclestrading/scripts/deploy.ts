import { writeFileSync } from 'fs'
import { VehicleTrading } from '../src/contracts/vehiclestrading'
import { privateKey } from './privateKey'
import { bsv, TestWallet, DefaultProvider, sha256, PubKey, hash160, toByteString } from 'scrypt-ts'

function getScriptHash(scriptPubKeyHex: string) {
    const res = sha256(scriptPubKeyHex).match(/.{2}/g)
    if (!res) {
        throw new Error('scriptPubKeyHex is not of even length')
    }
    return res.reverse().join('')
}

async function main() {
    await VehicleTrading.loadArtifact()

    // Prepare signer. 
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const signer = new TestWallet(privateKey, new DefaultProvider({
        network: bsv.Networks.testnet
    }))

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    
    const amount = 1
    const price = 10000n

    // Output that will pay the seller (you).
    
     const seller =   PubKey(hash160(privateKey.publicKey.toHex()))

    const instance = new VehicleTrading(
        seller,
        price,
        toByteString('',true),
        toByteString('', true)
        
        // TODO: Pass constructor parameter values.
        
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    // Save deployed contracts script hash.
    const scriptHash = getScriptHash(instance.lockingScript.toHex())
    const shFile = `.scriptHash`;
    writeFileSync(shFile, scriptHash);

    console.log('Vehiclestrading contract was successfully deployed!')
    console.log(`TXID: ${deployTx.id}`)
    console.log(`scriptHash: ${scriptHash}`)
}

main()
