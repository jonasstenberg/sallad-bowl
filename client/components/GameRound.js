import { h } from 'hyperapp'

import { timeout } from '../config'

const teamScore = (players, team) => Object.keys(players)
  .reduce((acc, playerId) => {
    if (players[playerId].team === team) {
      acc += players[playerId].score
    }
    return acc
  }, 0)

const formatTimeRemaining = (timeRemaining) => {
  const minutes = Math.floor(timeRemaining / 60)
  let seconds = timeRemaining - minutes * 60
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return `${minutes}:${seconds}`
}

export default (state, actions) => {
  return h('div', {
    class: 'game',
    oncreate: () => {
      console.log('gameround', state)
    }
  }, [
    h('span', {}, `Round ${state.room.activeRound}`),
    h('h4', {}, `Round ${state.games[state.room.activeRound].name}`),
    h('span', {}, `Team fire: ${teamScore(state.room.players, 'fire')}`),
    h('span', {}, `Team ice: ${teamScore(state.room.players, 'ice')}`),
    state.room.endTime
      ? h('span', { class: `game__word ${state.playerId !== state.room.activePlayer ? ' game__word--blurred' : ''}` }, state.room.activeWord)
      : '',
    state.playerId === state.room.activePlayer && state.room.endTime
      ? h('button', {
        onclick: async () => {
          await actions.correctGuess({
            playerId: state.room.activePlayer,
            roomId: state.room.roomId
          })
        }
      }, 'Correct!')
      : '',
    h('span', {}, `${state.room.players[state.room.activePlayer].team}`),
    h('span', {}, `${state.room.players[state.room.activePlayer].name}`),
    state.room.endTime
      ? state.timeRemaining >= 0
        ? h('span', {
          oncreate: () => {
            console.log('oncreate')
          }
        }, `${formatTimeRemaining(state.timeRemaining)}`)
        : ''
      : h('span', {}, '01:00'),
    !state.room.endTime
      ? state.playerId === state.room.activePlayer
        ? [
          h('button', {
            class: 'button button--orange',
            onclick: async () => {
              console.log('starting turn')
              const endTime = new Date()
              endTime.setSeconds(endTime.getSeconds() + timeout)

              await actions.updateRoom({
                name: state.room.players[state.playerId].name,
                salladBowl: state.room.salladBowl,
                endTime,
                gameState: state.room.gameState
              })
            }
          }, 'Start your turn')
        ]
        : h('span', {}, `${state.room.players[state.room.activePlayer].name} is up next`)
      : ''
  ])
}