import faker from 'faker'
import { InvalidFieldError } from 'validation/errors'
import { EmailValidation } from './email-validation'

const makeSut = (): EmailValidation => {
  return new EmailValidation(faker.database.column())
}

describe('EmailValidation', () => {
  it('should return error if email is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  it('should return falsy if email valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
