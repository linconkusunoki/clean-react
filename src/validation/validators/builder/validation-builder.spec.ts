import faker from 'faker'
import { RequiredFieldValidation } from 'validation/validators'
import { CompareFieldsValidation } from '../compare-fields/compare-fields-validation'
import { EmailValidation } from '../email/email-validation'
import { MinLengthValidation } from '../min-length/min-length-validator'
import { ValidationBuilder as sut } from './validation-builder'

describe('ValidationBuilder', () => {
  it('should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  it('should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).email().build()
    expect(validations).toEqual([new EmailValidation(field)])
  })

  it('should return MinLengthValidation', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = sut.field(field).min(length).build()
    expect(validations).toEqual([new MinLengthValidation(field, length)])
  })

  it('should return CompareFieldsValidation', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const validations = sut.field(field).sameAs(fieldToCompare).build()
    expect(validations).toEqual([
      new CompareFieldsValidation(field, fieldToCompare)
    ])
  })

  it('should return a list of Validations', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = sut.field(field).min(length).required().email().build()
    expect(validations).toEqual([
      new MinLengthValidation(field, length),
      new RequiredFieldValidation(field),
      new EmailValidation(field)
    ])
  })
})
