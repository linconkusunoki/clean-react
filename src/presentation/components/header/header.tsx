import Container from 'react-bootstrap/Container'

export const Header = () => {
  return (
    <Container>
      <header className="py-3 mb-4 border-bottom">
        <a href="/" className="mb-3 text-dark text-decoration-none">
          <h4>Enquete para programadores</h4>
        </a>
      </header>
    </Container>
  )
}
