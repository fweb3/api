const { POLYGONSCAN_API_KEY } = process.env

export const polygonUrl = (
  network: string,
  account: string,
  action: string
) => {
  const url = `${_getBaseURL(network)}?${_accountModuleQueryParams(
    account
  )}&action=${action}`
  return url
}

const _getBaseURL = (network: string) => {
  if (network === 'mumbai') {
    return 'https://api-testnet.polygonscan.com/api'
  }
  if (network === 'polygon') {
    return 'https://api.polygonscan.com/api'
  }
  throw new Error('network not supported for api')
}

const _accountModuleQueryParams = (account: string) => {
  const obj = {
    module: 'account',
    address: account,
    startBlock: 24445719, // first fweb3 minted
    endblock: 99999999,
    page: 1,
    offset: 500,
    sort: 'desc',
    apiKey: POLYGONSCAN_API_KEY,
  }
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}

// "normal" tx
// https://api.polygonscan.com/api
//    ?module=account
//    &action=txlist
//    &address=0xb91dd8225Db88dE4E3CD7B7eC538677A2c1Be8Cb
//    &startblock=0
//    &endblock=99999999
//    &page=1
//    &offset=10
//    &sort=asc
//    &apikey=YourApiKeyToken

// "internal" tx
// https://api-testnet.polygonscan.com/api
//    ?module=account
//    &action=txlistinternal
//    &address=0xDFAB03C9fbDbef66dA105B88776B35bfd7743D39
//    &startblock=0
//    &endblock=99999999
//    &page=1
//    &offset=10
//    &sort=asc
//    &apikey=YourApiKeyToken

// ERC-20 TX
// https://api.polygonscan.com/api
//    ?module=account
//    &action=tokentx
//    &contractaddress=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
//    &address=0x6813ad11cca98e15ff181a257a3c2855d1eee69e
//    &startblock=0
//    &endblock=99999999
//    &page=1
//    &offset=5
//    &sort=asc
//    &apikey=YourApiKeyToken

// ERC-721 Transfers
// https://api.polygonscan.com/api
//    ?module=account
//    &action=tokennfttx
//    &contractaddress=0x7227e371540cf7b8e512544ba6871472031f3335
//    &address=0x30b32e79ed9c4012a71f4235f77dcf90a6f6800f
//    &startblock=0
//    &endblock=99999999
//    &page=1
//    &offset=100
//    &sort=asc
//    &apikey=YourApiKeyToken
