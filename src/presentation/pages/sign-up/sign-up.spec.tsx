import faker from 'faker'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'

import { AuthenticationSpy } from 'presentation/test/mock-authentication'
import { ValidationStub } from 'presentation/test/mock-validation'
import { SaveAccessTokenMock } from 'presentation/test/mock-save-access-token'
import { InvalidCredentialsError } from 'domain/errors'
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

const getNameField = () => {
  return screen.getByRole('textbox', {
    name: /nome/i
  }) as HTMLInputElement
}

const getEmailField = () => {
  return screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
}

const getPasswordField = () => {
  return screen.getAllByLabelText(/senha/i) as HTMLInputElement[]
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
      const nameField = getNameField()
      expect(nameField.value).toBe('')
      expect(nameField.required).toBeTruthy()
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
      expect(passwordField[0].value).toBe('')
      expect(passwordField[0].required).toBeTruthy()
    })

    it('should render password confirmation field correctly', () => {
      makeSut()
      const passwordField = getPasswordField()
      expect(passwordField[1].value).toBe('')
      expect(passwordField[1].required).toBeTruthy()
    })
  })
})
