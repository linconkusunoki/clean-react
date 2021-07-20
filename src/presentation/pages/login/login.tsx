import { ChangeEvent, FormEvent, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { Header } from 'presentation/components'
import { Validation } from 'presentation/protocols/validation'
import { useEffect } from 'react'
import { Authentication } from 'domain/usecases'

type LoginProps = {
  validation?: Validation
  authentication?: Authentication
}

export const Login = ({ validation, authentication }: LoginProps) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: ''
  })
  const [errorState, setErrorState] = useState({
    main: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    setErrorState({
      ...errorState,
      email: validation.validate('email', state.email),
      password: validation.validate('password', state.password)
    })
  }, [state.email, state.password])

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    try {
      event.preventDefault()

      if (errorState.email || errorState.password) {
        return
      }

      setState({ ...state, isLoading: true })
      await authentication.auth({
        email: state.email,
        password: state.password
      })
    } catch (error) {
      setState({ ...state, isLoading: false })
      setErrorState({ ...errorState, main: error.message })
    }
  }

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col />

          <Col>
            <Form
              onSubmit={handleSubmit}
              className="bg-white rounded-3 shadow-sm p-4"
            >
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={state.email}
                  onChange={handleChange}
                  required
                />
                {errorState.email && (
                  <Form.Text data-testid="error-email">
                    {errorState.email}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={state.password}
                  onChange={handleChange}
                  required
                />
                {errorState.password && (
                  <Form.Text data-testid="error-password">
                    {errorState.password}
                  </Form.Text>
                )}
              </Form.Group>

              {errorState.main && (
                <p className="text-danger" data-testid="login-error-message">
                  {errorState.main}
                </p>
              )}

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={state.isLoading}
                >
                  {state.isLoading && (
                    <span
                      className="spinner-grow spinner-grow-sm"
                      role="status"
                      data-testid="spinner"
                      aria-hidden="true"
                    />
                  )}
                  <span className={state.isLoading ? 'visually-hidden' : ''}>
                    Enviar
                  </span>
                </Button>

                <Button variant="secondary" type="button">
                  Criar conta
                </Button>
              </div>
            </Form>
          </Col>

          <Col />
        </Row>
      </Container>
    </div>
  )
}
