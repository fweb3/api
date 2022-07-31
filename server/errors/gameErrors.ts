export const parseResponse = (rawResponse) => {
  const { status, message } = rawResponse
  if (status !== '1') {
    throw new Error(message)
  }
  return rawResponse
}

export const formatGameErrors = (err) => {
  console.error('ERROR_DEBUG:', err)
  return {
    status: 'error',
    message: err.message,
  }
}
