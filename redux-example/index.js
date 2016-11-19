import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import Router from 'react-router/BrowserRouter'
import { Link, Match } from 'react-router'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

import RouterSync from '../'

const NAVIGATE = 'NAVIGATE'

const initialState = {
  router: {}
}

const reducer = (state = initialState, action) => {
  if (action.type === NAVIGATE) {
    return Object.assign({}, state, {
      router: {
        location: action.location,
        action: action.action
      }
    })
  } else {
    return state
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

class App extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (location, action) {
    // you must always dispatch a `SYNC` action,
    // because, guess what? you can't actual control the browser history!
    // anyway, use your current action not 'SYNC'
    if (action === 'SYNC') {
      this.props.dispatch({
        type: NAVIGATE,
        location,
        action: this.props.action
      })
    } else {
      this.props.dispatch({
        type: NAVIGATE,
        location,
        action
      })
    }
  }

  render () {
    return (
      <Router>
        <div>
          <RouterSync
            location={this.props.location}
            action={this.props.action}
            onChange={this.handleChange}
          />
          <ul>
            <li><Link to='/one'>One</Link></li>
            <li><Link to='/two'>Two</Link></li>
            <li><Link to='/three'>Three</Link></li>
            <li><a href='https://google.com'>Google</a></li>
          </ul>
          <button onClick={() => {
            // navigating in a button click is not accessible,
            // don't do it in apps, use a <Link>.
            // You might do this though after a form is submit,
            // or the user session is expired, etc.
            this.props.dispatch({
              type: NAVIGATE,
              location: { pathname: '/three' },
              action: 'PUSH'
            })
          }}>Go to /three</button>

          <div style={{ padding: 10 }}>
            <Match pattern='/' exactly render={() => <div>Home</div>} />
            <Match pattern='/one' render={() => <div>One</div>} />
            <Match pattern='/two' render={() => <div>Two</div>} />
            <Match pattern='/three' render={() => <div>Three</div>} />
          </div>
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  location: PropTypes.object,
  action: PropTypes.string,
  dispatch: PropTypes.func
}

const ConnectedApp = connect((state) => {
  return {
    location: state.router.location,
    action: state.router.action
  }
})(App)

const root = document.createElement('div')
document.body.appendChild(root)
render(<Provider store={store}><ConnectedApp /></Provider>, root)
