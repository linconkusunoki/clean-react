import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, screen } from '@testing-library/react'

import {
  AddAccountSpy,
  ValidationStub,
  SaveAccessTokenMock,
  Helper
} from 'presentation/test'
import { SignUp } from './sign-up'
import { EmailInUseError } from 'domain/errors'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/sign-up'] })

const makeSut = (params?: SutParams): SutTypes => {
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return { sut, addAccountSpy, saveAccessTokenMock }
}

describe('Login component', () => {
  describe('initial state', () => {
    it('should not render any error', () => {
      makeSut()
      const errorMessage = screen.queryByText(/error/)
      expect(errorMessage).toBeNull()
    })

    it('should render name field correctly', () => {
      makeSut()
      const nameField = Helper.getNameField()
      expect(nameField.value).toBe('')
      expect(nameField.required).toBeTruthy()
    })

    it('should render email field correctly', () => {
      makeSut()
      const emailField = Helper.getEmailField()
      expect(emailField.value).toBe('')
      expect(emailField.required).toBeTruthy()
    })

    it('should render password field correctly', () => {
      makeSut()
      const passwordField = Helper.getPasswordField()
      expect(passwordField[0].value).toBe('')
      expect(passwordField[0].required).toBeTruthy()
    })

    it('should render password confirmation field correctly', () => {
      makeSut()
      const passwordField = Helper.getPasswordField()
      expect(passwordField[1].value).toBe('')
      expect(passwordField[1].required).toBeTruthy()
    })
  })

  describe('validation', () => {
    it('should show name error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      Helper.populateNameField()
      const errorMessage = screen.getByTestId('error-name')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show email error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      Helper.populateEmailField()
      const errorMessage = screen.getByTestId('error-email')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show password error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      Helper.populatePasswordField()
      const errorMessage = screen.getByTestId('error-password')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should show passwordConfirmation error if Validation fails', () => {
      const validationError = faker.random.words()
      makeSut({ validationError })
      Helper.populatePasswordConfirmationField()
      const errorMessage = screen.getByTestId('error-password-confirmation')
      expect(errorMessage.textContent).toBe(validationError)
    })

    it('should disable and change content of submit button on submit', async () => {
      makeSut()
      const { submitButton } = await Helper.simulateFormSubmit(
        'form-sign-up',
        /cadastrar/i
      )
      expect(submitButton.closest('button')).toBeDisabled()
      expect(submitButton.className).toBe('visually-hidden')
      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })
  })

  describe('add account', () => {
    it('should call AddAccount with correct values', async () => {
      const { addAccountSpy } = makeSut()
      const name = faker.internet.userName()
      const email = faker.internet.email()
      const password = faker.internet.password()

      Helper.populateNameField(name)
      Helper.populateEmailField(email)
      Helper.populatePasswordField(password)
      Helper.populatePasswordConfirmationField(password)
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)

      expect(addAccountSpy.params).toEqual({
        name,
        email,
        password,
        passwordConfirmation: password
      })
    })

    it('should call AddAccount only once', async () => {
      const { addAccountSpy } = makeSut()

      Helper.populateSignUpFields()
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)

      expect(addAccountSpy.callsCount).toBe(1)
    })

    it('should not call AddAccount if form is invalid', async () => {
      const validationError = faker.random.words()
      const { addAccountSpy } = makeSut({ validationError })

      Helper.populateEmailField()
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)

      expect(addAccountSpy.callsCount).toBe(0)
    })

    it('should present error if AddAccount fails', async () => {
      const { addAccountSpy } = makeSut()
      const error = new EmailInUseError()
      jest.spyOn(addAccountSpy, 'add').mockRejectedValue(error)

      Helper.populateSignUpFields()
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)

      const mainError = screen.getByTestId('login-error-message')
      expect(mainError.textContent).toBe(error.message)
    })

    it('should call SaveAccessToken on success', async () => {
      const { addAccountSpy, saveAccessTokenMock } = makeSut()
      const { accessToken } = addAccountSpy.account

      Helper.populateSignUpFields()
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)

      expect(saveAccessTokenMock.accessToken).toBe(accessToken)
      expect(history.length).toBe(1)
      expect(history.location.pathname).toBe('/')
    })

    it('should present error if SaveAccessToken fails', async () => {
      const { saveAccessTokenMock } = makeSut()
      const error = new EmailInUseError()
      jest.spyOn(saveAccessTokenMock, 'save').mockImplementationOnce(() => {
        throw error
      })

      Helper.populateSignUpFields()
      await Helper.simulateFormSubmit('form-sign-up', /cadastrar/i)

      const mainError = screen.getByTestId('login-error-message')
      expect(mainError.textContent).toBe(error.message)
    })
  })

  describe('navigation', () => {
    it('should go to login page', () => {
      makeSut()
      Helper.backToLogin()
      expect(history.length).toBe(2)
      expect(history.location.pathname).toBe('/login')
    })
  })
})
