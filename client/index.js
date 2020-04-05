/* global WebSocket */

import { app } from 'hyperapp'
import { location } from '@hyperapp/router'

import state from './state'
import actions from './actions'
import { websocketUrl } from './config'

import App from './components/App'

require('@babel/polyfill')

const connection = new WebSocket(websocketUrl)

state.wsConnection = connection

const wiredActions = app(
  state,
  actions,
  App,
  document.getElementById('app')
)

location.subscribe(wiredActions.location)

connection.onmessage = (e) => {
  const message = JSON.parse(e.data)
  if (message.playerId) {
    wiredActions.setPlayerId(message.playerId)
  } else {
    wiredActions.setRoom(message)
  }
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}