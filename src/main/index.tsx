import ReactDOM from 'react-dom'
import { Router } from 'presentation/components'
import { makeLogin } from './factories/pages/login/login-factory'
import { makeSignUp } from './factories/pages/sign-up/sign-up-factory'

ReactDOM.render(
  <Router makeLogin={makeLogin} makeSignUp={makeSignUp} />,
  document.getElementById('root')
)
