import faker from 'faker'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, screen } from '@testing-library/react'

import {
  AuthenticationSpy,
  ValidationStub,
  SaveAccessTokenMock,
  Helper
} from 'presentation/test'
import { SignUp } from './sign-up'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return { sut, authenticationSpy, saveAccessTokenMock }
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
  })
})
