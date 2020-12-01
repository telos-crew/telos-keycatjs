import 'jest'
import { Keycat } from '../index'

test('Test Keycat with static Telos', () => {
  const keycat = new Keycat.Telos(['test'])
  console.log('keycat: ', keycat)
  expect(keycat.keycatOrigin).toBe('https://sign.telos.net')
})

test('Test Keycat with static TelosTestnet', () => {
  const keycat = new Keycat.TelosTestnet(['test'])
  console.log('keycat: ', keycat)
  expect(keycat.keycatOrigin).toBe('https://sign-dev.telos.net')
})
