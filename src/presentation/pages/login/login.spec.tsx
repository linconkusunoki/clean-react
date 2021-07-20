import faker from 'faker'
import userEvent from '@testing-library/user-event'
import { render, RenderResult, screen } from '@testing-library/react'

import { AuthenticationSpy } from 'presentation/test/mock-authentication'
import { ValidationStub } from 'presentation/test/mock-validation'
import { Login } from './login'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  )
  return { sut, authenticationSpy }
}

const getEmailField = () => {
  return screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
}

const getPasswordField = () => {
  return screen.getByLabelText(/senha/i) as HTMLInputElement
}

const getSubmitButton = () => {
  return screen.getByText(/enviar/i)
}

const populateEmailField = (email = faker.internet.email()) => {
  const emailField = getEmailField()
  userEvent.type(emailField, email)
}

const populatePasswordField = (password = faker.internet.password()) => {
  const passwordField = getPasswordField()
  userEvent.type(passwordField, password)
}

const simulateFormSubmit = () => {
  const submitButton = getSubmitButton()
  userEvent.click(submitButton)
  return { submitButton }
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
      const emailField = getEmailField()
      expect(emailField.value).toBe('')
      expect(emailField.required).toBeTruthy()
    })

    it('should render password field correctly', () => {
      makeSut()
      const passwordField = getPasswordField()
      expect(passwordField.value).toBe('')
      expect(passwordField.required).toBeTruthy()
    })
  })

  describe('validation', () => {
    it('should show email error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      populateEmailField()
      const errorMessage = screen.getByTestId('error-email')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show password error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      populatePasswordField()
      const errorMessage = screen.getByTestId('error-password')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show valid email state if validation succeeds', () => {
      makeSut()
      populateEmailField()
      const errorMessage = screen.queryByTestId('error-email')
      expect(errorMessage).toBeNull()
    })

    it('should show valid password state if validation succeeds', () => {
      makeSut()
      populatePasswordField()
      const errorMessage = screen.queryByTestId('error-password')
      expect(errorMessage).toBeNull()
    })

    it('should disable and change content of submit button on submit', () => {
      makeSut()
      const { submitButton } = simulateFormSubmit()
      expect(submitButton.closest('button')).toBeDisabled()
      expect(submitButton.className).toBe('visually-hidden')
      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })
  })

  describe('authentication', () => {
    it('should call authentication with correct values', () => {
      const { authenticationSpy } = makeSut()
      const email = faker.internet.email()
      const password = faker.internet.password()

      populateEmailField(email)
      populatePasswordField(password)
      simulateFormSubmit()

      expect(authenticationSpy.params).toEqual({
        email,
        password
      })
    })
  })
})
