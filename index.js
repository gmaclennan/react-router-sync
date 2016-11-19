import React, { PropTypes } from 'react'
import { location, historyContext } from 'react-router/PropTypes'
import Redirect from 'react-router/Redirect'
import { LocationSubscriber } from 'react-router/Broadcasts'
import { createRouterLocation } from 'react-router/LocationUtils'
import { locationsAreEqual } from 'history/LocationUtils'
import invariant from 'invariant'

class RouterSync extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    this.sync(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.sync(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextState.pendingSync
  }

  sync (nextProps) {
    const { location, routerLocation, onChange } = nextProps
    const routerLocationChanged = !locationsAreEqual(this.props.routerLocation, routerLocation)
    const inSync = locationsAreEqual(location || {}, routerLocation)
    const syncNeeded = !location || routerLocationChanged && !inSync
    invariant(!(syncNeeded && this.state.pendingSync), 'You must accept "SYNC" actions into your state')
    if (syncNeeded) {
      onChange(nextProps.routerLocation, 'SYNC')
    }
    this.setState({
      redirectNeeded: location && !inSync && !routerLocationChanged,
      pendingSync: syncNeeded
    })
  }

  render () {
    const { location, action } = this.props
    if (!this.state.redirectNeeded) return null
    return <Redirect to={createRouterLocation(location)} push={action === 'PUSH'} />
  }
}

RouterSync.contextTypes = {
  history: historyContext
}

RouterSync.propTypes = {
  routerLocation: location.isRequired,
  location: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  action: PropTypes.string
}

module.exports = (props) => (
  <LocationSubscriber>
    {(location) => <RouterSync routerLocation={location} {...props} />}
  </LocationSubscriber>
)
