import faker from 'faker'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import 'jest-localstorage-mock'

import { AuthenticationSpy } from 'presentation/test/mock-authentication'
import { ValidationStub } from 'presentation/test/mock-validation'
import { Login } from './login'
import { InvalidCredentialsError } from 'domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory()

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
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

beforeEach(() => {
  jest.resetAllMocks()
})

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

    it('should call authentication only once', () => {
      const { authenticationSpy } = makeSut()
      const email = faker.internet.email()
      const password = faker.internet.password()

      populateEmailField(email)
      populatePasswordField(password)
      simulateFormSubmit()
      simulateFormSubmit()

      expect(authenticationSpy.callsCount).toBe(1)
    })

    it('should not call authentication if form is invalid', () => {
      const validationError = faker.random.words()
      const { authenticationSpy } = makeSut({ validationError })

      populateEmailField()
      simulateFormSubmit()

      expect(authenticationSpy.callsCount).toBe(0)
    })

    it('should present error if authentication fails', async () => {
      const { authenticationSpy } = makeSut()
      const error = new InvalidCredentialsError()
      jest.spyOn(authenticationSpy, 'auth').mockRejectedValue(error)

      populateEmailField()
      populatePasswordField()
      simulateFormSubmit()

      await waitFor(() => {
        const mainError = screen.getByTestId('login-error-message')
        expect(mainError.textContent).toBe(error.message)
      })
    })

    it('should add access token to localStorage on success', async () => {
      const { authenticationSpy } = makeSut()

      populateEmailField()
      populatePasswordField()
      simulateFormSubmit()

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'accessToken',
          authenticationSpy.account.accessToken
        )
      })
    })
  })

  describe('navigation', () => {
    it('should go to register page', () => {
      makeSut()
      userEvent.click(screen.getByText(/criar conta/i))
      expect(history.length).toBe(2)
      expect(history.location.pathname).toBe('/register')
    })
  })
})
