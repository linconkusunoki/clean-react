import faker from 'faker'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const getNameField = () => {
  return screen.getByRole('textbox', {
    name: /nome/i
  }) as HTMLInputElement
}

export const getEmailField = () => {
  return screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
}

export const getPasswordField = () => {
  return screen.getAllByLabelText(/senha/i) as HTMLInputElement[]
}

export const getSubmitButton = (text: RegExp) => {
  return screen.getByText(text)
}

export const populateNameField = (name = faker.internet.email()) => {
  const nameField = getNameField()
  userEvent.type(nameField, name)
}

export const populateEmailField = (email = faker.internet.email()) => {
  const emailField = getEmailField()
  userEvent.type(emailField, email)
}

export const populatePasswordField = (password = faker.internet.password()) => {
  const passwordField = getPasswordField()
  userEvent.type(passwordField[0], password)
}

export const populatePasswordConfirmationField = (
  password = faker.internet.password()
) => {
  const passwordField = getPasswordField()
  userEvent.type(passwordField[1], password)
}

export const simulateFormSubmit = async (
  formId: string,
  buttonText: RegExp
) => {
  const submitButton = getSubmitButton(buttonText)
  userEvent.click(submitButton)
  await waitFor(() => screen.getByTestId(formId))
  return { submitButton }
}
