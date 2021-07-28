import faker from 'faker'
import { InvalidFieldError } from 'validation/errors'
import { EmailValidation } from './email-validation'

const makeSut = (field: string): EmailValidation => {
  return new EmailValidation(field)
}

describe('EmailValidation', () => {
  it('should return error if email is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new InvalidFieldError())
  })

  it('should return falsy if email valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.internet.email() })
    expect(error).toBeFalsy()
  })

  it('should return falsy if email empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: '' })
    expect(error).toBeFalsy()
  })
})
