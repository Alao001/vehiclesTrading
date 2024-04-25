import {
    assert,
    ByteString,
    hash256,
    method,
    prop,
    SmartContract,
    FixedArray,
    fill,
    toByteString,
} from 'scrypt-ts'

export type CarBrand = ByteString

export type Car = {
    name: CarBrand 
    votesReceived: bigint
}
export const N = 25

export type Cars = FixedArray<Car, typeof N>

export class Voting extends SmartContract {
    @prop(true)
    cars: Cars

    constructor(carBrands: FixedArray<CarBrand, typeof N>) {
        super(...arguments)
        this.cars = fill(
            {
                name: toByteString(''),
                votesReceived: 0n,
            },
            N
        )

        for (let i = 0; i < N; i++) {
            this.cars[i] = {
                name: carBrands[i],
                votesReceived: 0n,
            }
        }
    }

    /**
     * vote for a candidate
     * @param candidate candidate's name
     */
    @method()
    public vote(car: CarBrand) {
        this.increaseVotesReceived(car)
        // output containing the latest state and the same balance
        let outputs: ByteString = this.buildStateOutput(this.ctx.utxo.value)
        outputs += this.buildChangeOutput()
        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    increaseVotesReceived(car: CarBrand): void {
        for (let i = 0; i < N; i++) {
            if (this.cars[i].name == car) {
                this.cars[i].votesReceived++
            }
        }
    }
}