import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Validation } from 'presentation/protocols/validation'
import { Login } from './login'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
  errorMessage: string
  fieldName: string
  fieldValue: string

  validate(fieldName: string, fieldValue: string): string {
    this.fieldName = fieldName
    this.fieldValue = fieldValue
    return this.errorMessage
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy} />)
  return { sut, validationSpy }
}

describe('Login component', () => {
  describe('initial state', () => {
    it('should not render any error', () => {
      makeSut()
      const errorMessage = screen.queryByText(/error/)
      expect(errorMessage).toBeNull()
    })

    it('should render email field correctly', () => {
      makeSut()
      const emailField = screen.getByRole('textbox', {
        name: /email/i
      }) as HTMLInputElement
      expect(emailField.value).toBe('')
      expect(emailField.required).toBeTruthy()
    })

    it('should render password field correctly', () => {
      makeSut()
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement
      expect(passwordField.value).toBe('')
      expect(passwordField.required).toBeTruthy()
    })
  })

  describe('validation', () => {
    it('should call Validation with correct email', () => {
      const { validationSpy } = makeSut()
      const emailField = screen.getByRole('textbox', {
        name: /email/i
      }) as HTMLInputElement

      userEvent.type(emailField, 'any_email')
      expect(validationSpy.fieldName).toBe('email')
      expect(validationSpy.fieldValue).toBe('any_email')
    })

    it('should call Validation with correct password', () => {
      const { validationSpy } = makeSut()
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement

      userEvent.type(passwordField, 'any_password')
      expect(validationSpy.fieldName).toBe('password')
      expect(validationSpy.fieldValue).toBe('any_password')
    })
  })
})
