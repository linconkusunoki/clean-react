import { AxiosHttpAdapter } from 'infra/http/axios-http-client/axios-http-client'

export const makeAxiosHttpAdapter = (): AxiosHttpAdapter => {
  return new AxiosHttpAdapter()
}
