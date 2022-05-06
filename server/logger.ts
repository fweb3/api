const { DEBUG_LOG } = process.env

const _isDebugEnabled = () => DEBUG_LOG === 'true'

export const log = {
  debug: (msg: string | Record<string, unknown>) => {
    _isDebugEnabled() && console.log(msg)
  },
  error: (msg: string | Record<string, unknown>) => {
    _isDebugEnabled() && console.error(msg)
  },
}
