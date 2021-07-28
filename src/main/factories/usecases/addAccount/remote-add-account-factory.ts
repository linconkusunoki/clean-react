import { makeAxiosHttpAdapter } from 'main/factories/http/axios-http-adapter-factory'
import { AddAccount } from 'domain/usecases'
import { apiUrlFactory } from 'main/factories/http/api-url-factory'
import { RemoteAddAccount } from 'data/usecases/add-account/remote-add-account'

export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(apiUrlFactory('/signup'), makeAxiosHttpAdapter())
}
