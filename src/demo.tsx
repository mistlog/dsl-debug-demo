export class CoreService {
    Call<C extends Call>(args: CallInput<C>): Result<C['Out']> {
        const { CallType, Type, In } = args
        const _type = Type as Call['Type']
        let method: (In: C['In']) => C['Out']
        {
            "use match";
            ["CancelSubscribe", "SetKV", "DeleteByKey"].map(_type => method = this[_type]);
        }
    }
}