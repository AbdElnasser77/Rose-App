export interface AdaptorModel<TInput,TOutput> {
    adapt(data:TInput):TOutput
}
