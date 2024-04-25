import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    toByteString,
    fill,
    FixedArray,
} from 'scrypt-ts'
export type Comment = {
    commentTitle: ByteString,
    commentDescription : ByteString,
    

}
export class Commentsection extends SmartContract {
    static readonly MAX_TASKCOUNT = 10

    @prop(true)
    comments: FixedArray<Comment, typeof Commentsection.MAX_TASKCOUNT>
    
   
    constructor() {
        super(...arguments)
        this.comments = fill(
            {
                commentTitle: toByteString(''),
                commentDescription: toByteString(''),
            },
            Commentsection.MAX_TASKCOUNT
        )
    }

    @method()
    public addComment(comment: Comment, commentIdx: bigint) {
         this.comments[Number(commentIdx)] = comment
        const output: ByteString =
            this.buildStateOutput(this.ctx.utxo.value) +
            this.buildChangeOutput()
            this.debug.diffOutputs(output)
        assert(hash256(output) == this.ctx.hashOutputs, 'Hashoutput mismatched')
    }
    
}
