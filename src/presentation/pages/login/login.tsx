import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import styles from './login.styles.scss'

export const Login: React.FC = () => {
  return (
    <div className={styles.login}>
      <header className={styles.header}></header>
      <Container>
        <header className="py-3 mb-4 border-bottom">
          <a href="/" className="mb-3 text-dark text-decoration-none">
            <h4>Enquete para programadores</h4>
          </a>
        </header>
      </Container>

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

      <footer className={styles.footer}></footer>
    </div>
  )
}
