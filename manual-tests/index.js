import React from 'react'
import { render } from 'react-dom'
import Router from 'react-router/BrowserRouter'
import { Link, Match } from 'react-router'

import RouterSync from '../'

class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Router>
        <div>
          <RouterSync
            location={this.state.location}
            action={this.state.action}
            onChange={(location, action) => {
              // you must alwasy accept a `SYNC` action,
              // but only put the location in state
              if (action === 'SYNC') {
                this.setState({ location })
              } else if (!window.block) {
                this.setState({ location, action })
              } else {
                console.log('blocked!') // eslint-disable-line
              }
            }}
          />
          <div>
            <ul>
              <li><Link to='/one'>One</Link></li>
              <li><Link to='/two'>Two</Link></li>
              <li><Link to='/three'>Three</Link></li>
              <li><a href='https://google.com'>Google</a></li>
            </ul>
            <button onClick={() => {
              this.setState({
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
        </div>
      </Router>
    )
  }
}

var root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
