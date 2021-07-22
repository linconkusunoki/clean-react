import { RemoteAuthentication } from 'data/usecases/authentication/remote-authentication'
import { makeAxiosHttpAdapter } from 'main/factories/http/axios-http-adapter-factory'
import { Authentication } from 'domain/usecases'
import { apiUrlFactory } from 'main/factories/http/api-url-factory'

export const makeRemoteAuthentication = (): Authentication => {
  return new RemoteAuthentication(
    apiUrlFactory('/login'),
    makeAxiosHttpAdapter()
  )
}
