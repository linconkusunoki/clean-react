import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { Header } from 'presentation/components'
import styles from './login.styles.scss'

export const Login = () => {
  return (
    <div className={styles.login}>
      <Header />
      <Container>
        <Row>
          <Col />

          <Col>
            <Form className="bg-white rounded-3 shadow-sm p-4">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Digite seu email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Digite sua senha" />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Entrar
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
