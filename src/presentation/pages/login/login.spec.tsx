import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountModel } from 'domain/models'
import { mockAccountModel } from 'domain/test'
import { Authentication, AuthenticationParams } from 'domain/usecases'
import faker from 'faker'

import { ValidationStub } from 'presentation/test/mock-validation'
import { Login } from './login'

class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    return Promise.resolve(this.account)
  }
}

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
      const validationError = faker.random.words()
      makeSut({ validationError })
      const emailField = screen.getByRole('textbox', {
        name: /email/i
      }) as HTMLInputElement

      userEvent.type(emailField, faker.internet.email())
      const errorMessage = screen.getByTestId('error-email')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show password error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement
      userEvent.type(passwordField, faker.internet.password())
      const errorMessage = screen.getByTestId('error-password')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show valid email state if validation succeeds', () => {
      makeSut()
      const emailField = screen.getByLabelText(/senha/i) as HTMLInputElement
      userEvent.type(emailField, faker.internet.email())
      const errorMessage = screen.queryByTestId('error-email')
      expect(errorMessage).toBeNull()
    })

    it('should show valid password state if validation succeeds', () => {
      makeSut()
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement
      userEvent.type(passwordField, faker.internet.password())
      const errorMessage = screen.queryByTestId('error-password')
      expect(errorMessage).toBeNull()
    })

    it('should disable and change content of submit button on submit', () => {
      makeSut()
      const submitButton = screen.getByText(/enviar/i)
      userEvent.click(submitButton)
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
      const submitButton = screen.getByText(/enviar/i)
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement
      const emailField = screen.getByRole('textbox', {
        name: /email/i
      }) as HTMLInputElement

      userEvent.type(emailField, email)
      userEvent.type(passwordField, password)
      userEvent.click(submitButton)

      expect(authenticationSpy.params).toEqual({
        email,
        password
      })
    })
  })
})
