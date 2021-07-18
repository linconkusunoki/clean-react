import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'

import { ValidationStub } from 'presentation/test/mock-validation'
import { Login } from './login'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words()
  const sut = render(<Login validation={validationStub} />)
  return { sut, validationStub }
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
    it('should show email error if Validation fails', () => {
      const { validationStub } = makeSut()

      const emailField = screen.getByRole('textbox', {
        name: /email/i
      }) as HTMLInputElement

      userEvent.type(emailField, faker.internet.email())
      const errorMessage = screen.getByTestId('error-email')
      expect(errorMessage.textContent).toBe(validationStub.errorMessage)
    })

    it('should show password error if Validation fails', () => {
      const { validationStub } = makeSut()

      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement

      userEvent.type(passwordField, faker.internet.password())
      const errorMessage = screen.getByTestId('error-password')
      expect(errorMessage.textContent).toBe(validationStub.errorMessage)
    })

    it('should show valid email state if validation succeeds', () => {
      const { validationStub } = makeSut()
      validationStub.errorMessage = null
      const emailField = screen.getByLabelText(/senha/i) as HTMLInputElement

      userEvent.type(emailField, faker.internet.email())
      const errorMessage = screen.queryByTestId('error-email')
      expect(errorMessage).toBeNull()
    })

    it('should show valid password state if validation succeeds', () => {
      const { validationStub } = makeSut()
      validationStub.errorMessage = null
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement

      userEvent.type(passwordField, faker.internet.password())
      const errorMessage = screen.queryByTestId('error-password')
      expect(errorMessage).toBeNull()
    })
  })
})
