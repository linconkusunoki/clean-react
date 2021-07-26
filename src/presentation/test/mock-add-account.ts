import { AccountModel } from 'domain/models'
import { mockAccountModel } from 'domain/test'
import { AddAccount, AddAccountParams } from 'domain/usecases'

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  params: AddAccountParams
  callsCount = 0

  add(params: AddAccountParams): Promise<AccountModel> {
    this.callsCount++
    this.params = params
    return Promise.resolve(this.account)
  }
}
