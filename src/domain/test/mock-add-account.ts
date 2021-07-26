import faker from 'faker'
import { AddAccountParams } from 'domain/usecases'

export const mockAddAccountParams = (): AddAccountParams => {
  const password = faker.internet.password()
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    passwordConfirmation: password,
    password
  }
}
