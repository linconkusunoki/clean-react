import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { Header } from 'presentation/components'
import { Validation } from 'presentation/protocols/validation'
import { AddAccount, Authentication, SaveAccessToken } from 'domain/usecases'

type SignUpProps = {
  validation: Validation
  addAccount: AddAccount
  saveAccessToken: SaveAccessToken
}

export const SignUp = ({
  validation,
  addAccount,
  saveAccessToken
}: SignUpProps) => {
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  const [errorState, setErrorState] = useState({
    main: '',
    email: '',
    name: '',
    password: '',
    passwordConfirmation: ''
  })

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state
    const formData = { name, email, password, passwordConfirmation }
    setErrorState({
      ...errorState,
      name: validation.validate('name', formData),
      email: validation.validate('email', formData),
      password: validation.validate('password', formData),
      passwordConfirmation: validation.validate(
        'passwordConfirmation',
        formData
      )
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      if (
        errorState.email ||
        errorState.password ||
        errorState.name ||
        errorState.passwordConfirmation
      ) {
        return
      }

      setState({ ...state, isLoading: true })
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })
      saveAccessToken.save(account.accessToken)
      history.replace('/')
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
              data-testid="form-sign-up"
            >
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Digite seu nome"
                  value={state.name}
                  onChange={handleChange}
                  required
                />
                {errorState.name && (
                  <Form.Text data-testid="error-name">
                    {errorState.name}
                  </Form.Text>
                )}
              </Form.Group>

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

              <Form.Group className="mb-3" controlId="passwordConfirmation">
                <Form.Label>Confirme sua Senha</Form.Label>
                <Form.Control
                  name="passwordConfirmation"
                  type="password"
                  placeholder="Digite sua senha"
                  value={state.passwordConfirmation}
                  onChange={handleChange}
                  required
                />
                {errorState.passwordConfirmation && (
                  <Form.Text data-testid="error-password-confirmation">
                    {errorState.passwordConfirmation}
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
                    Cadastrar
                  </span>
                </Button>

                <Button variant="secondary" type="button" as={Link} to="/login">
                  Voltar para Login
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
