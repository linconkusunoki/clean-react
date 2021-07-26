import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { SignUp } from 'presentation/pages'

type Props = {
  makeLogin: React.FC
}

export const Router = ({ makeLogin }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={makeLogin} exact />
        <Route path="/sign-up" component={SignUp} exact />
      </Switch>
    </BrowserRouter>
  )
}
