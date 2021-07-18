import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Login } from 'presentation/pages/login/login'

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
