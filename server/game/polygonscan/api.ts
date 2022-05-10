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
  const baseUrl = polygonUrl(network, account, 'tokentx')
  const url = `${baseUrl}&contractaddress=${contractAddress}`
  return fetcher(url)
}

export const fetchERC721TransferEvents = async (
  network: string,
  account: string,
  contractAddress?: string
) => {
  const baseUrl = polygonUrl(network, account, 'tokennfttx')
  const url = contractAddress
    ? `${baseUrl}&contractaddress=${contractAddress}`
    : baseUrl
  return fetcher(url)
}

export const fetcher = async (url) => {
  const res = await fetch(url)
  const json = await res.json()
  return json
}
