export interface HttpGetParams {
  url: string
}

export interface HttpGetClient {
  get(params: HttpGetParams)
}
