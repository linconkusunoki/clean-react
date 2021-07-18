import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { Header } from 'presentation/components'

export const Login = () => {
  const [state] = useState({
    isLoading: false
  })
  const [errorState] = useState({
    main: '',
    email: 'Campo obrigatório',
    password: 'Campo obrigatório'
  })

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col />

          <Col>
            <Form className="bg-white rounded-3 shadow-sm p-4">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Digite seu email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  required
                />
              </Form.Group>

              {errorState.main && <p className="text-danger">Error</p>}

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
                      aria-hidden="true"
                    />
                  )}
                  <span className={state.isLoading ? 'visually-hidden' : ''}>
                    Entrar
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
