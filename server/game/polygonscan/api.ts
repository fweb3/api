import fetch from 'node-fetch'
import { polygonUrl } from './uris'

export const fetchNormalTransactions = async (
  network: string,
  account: string
) => {
  return fetcher(polygonUrl(network, account, 'txlist'))
}

export const fetchInternalTransactions = async (
  network: string,
  account: string
) => {
  return fetcher(polygonUrl(network, account, 'txlistinternal'))
}

export const fetchERC20TransferEvents = async (
  network: string,
  account: string,
  contractAddress: string
) => {
  const url = polygonUrl(network, account, 'tokentx')
  const newurl = `${url}&contractaddress=${contractAddress}`
  return fetcher(newurl)
}

export const fetcher = async (url) => {
  try {
    const res = await fetch(url)
    const json = await res.json()
    return json
  } catch (error) {
    console.error({ error })
  }
}
