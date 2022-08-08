import { fetchAccountBalances } from './balances'
import { getFweb3Interfaces } from './../interfaces'
import { fetchNormalTransactions } from '../polygonscan'

const FWEB3_FAUCETS = [
  '0x82dB7fe5Cd26804E29534A7f648B780c313BC317', // fweb3
  '0x32Ba4765d6538944ef4324E55B94797a422C72F9', // fweb3
  '0x4a14ac36667b574b08443a15093e417db909d7a3', // fweb3
]

const MATIC_FAUCETS = [
  '0x67806adca0fd8825da9cddc69b9ba8837a64874b', // matic
  '0xe995b21d94638d81ae5123a65fc369f6aea429bc', // matic
  '0x92B4e3A9dB9700757Eb04C7Bf5908cAc57E07b50', // matic
  '0x351050Ac0AdC9bff0622c1c0525b3322C328517f', // matic
  '0xF2d86AEe11351D4396eE2Bd663977C91eE2b0F9b', // matic
]

export const hasTokens = async (network: string, account: string) => {
  const interfaces = await getFweb3Interfaces(network)
  const { fweb3_balance, matic_balance } = await fetchAccountBalances(
    interfaces,
    account
  )

  return {
    hasFweb3: parseFloat(fweb3_balance) > 0,
    hasMatic: parseFloat(matic_balance) > 0,
  }
}

export const hasUsedAFaucetBefore = async (account: string) => {
  const ADMIN = [
    '0x124341d2Ad6f8C9862b64e5d96EDc62E5d4B5DE4',
    '0xeFA27c8CD1b31B3ACc72ba814ff8B16258f837F9',
    '0x7D9C635220e59f949b69E8C5615702EE52dbCE86',
  ]
  const { result } = await fetchNormalTransactions('polygon', account)
  const fweb3FaucetAddresses = FWEB3_FAUCETS.map((a) => a.toLowerCase())
  const maticFaucetAddresses = MATIC_FAUCETS.map((a) => a.toLowerCase())

  const adminAddresses = ADMIN.map((a) => a.toLowerCase())
  if (adminAddresses.includes(account.toLowerCase())) {
    return {
      fweb3: false,
      matic: false,
    }
  }
  const hasUsedFweb3 =
    result?.filter((tx) => {
      const isError = tx.isError === '1'
      const badReceipt = tx.txreceipt_status === '0'
      const hasTx = fweb3FaucetAddresses.includes(tx.to.toLowerCase())
      return isError && badReceipt && hasTx
    }).length !== 0
  const hasUsedMatic =
    result?.filter((tx) => {
      const isError = tx.isError === '1'
      const badReceipt = tx.txreceipt_status === '0'
      const hasTx = maticFaucetAddresses.includes(tx.to.toLowerCase())
      return isError && badReceipt && hasTx
    }).length !== 0
  return {
    fweb: hasUsedFweb3,
    matic: hasUsedMatic,
  }
}
