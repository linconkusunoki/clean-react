import { render, screen } from '@testing-library/react'

import { Login } from './login'

describe('Login component', () => {
  describe('initial state', () => {
    it('should not render any error', () => {
      render(<Login />)
      const errorMessage = screen.queryByText(/error/)
      expect(errorMessage).toBeNull()
    })

    it('should render email field correctly', () => {
      render(<Login />)
      const emailField = screen.getByRole('textbox', {
        name: /email/i
      }) as HTMLInputElement
      expect(emailField.value).toBe('')
      expect(emailField.required).toBeTruthy()
    })

    it('should render password field correctly', () => {
      render(<Login />)
      const passwordField = screen.getByLabelText(/senha/i) as HTMLInputElement
      expect(passwordField.value).toBe('')
      expect(passwordField.required).toBeTruthy()
    })
  })
})
