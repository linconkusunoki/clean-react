import faker from 'faker'
import { InvalidFieldError } from 'validation/errors'
import { MinLengthValidation } from './min-length-validator'

const makeSut = (): MinLengthValidation => {
  return new MinLengthValidation(faker.database.column(), 5)
}

describe('MinLengthValidation', () => {
  it('should return error if value is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(4))
    expect(error).toEqual(new InvalidFieldError())
  })

  it('should return falsy if value is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
})
