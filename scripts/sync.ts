import fs from 'fs-extra'

const CONTRACT_REPO_DIR = '../fweb3-contracts'
const CONTRACT_ADDRESSES_DIR = `${CONTRACT_REPO_DIR}/deploy_addresses`
const CONTRACT_INTERFACES_DIR = `${CONTRACT_REPO_DIR}/deploy_interfaces`

const SYNC_BASE_DIR = 'server/faucet/contracts'
const SYNC_ADDRESS_DIR = `${SYNC_BASE_DIR}/addresses`
const SYNC_INTERFACE_DIR = `${SYNC_BASE_DIR}/abi`

const _backup = (network: string) => {
  const now = Date.now()
  const addressPath = `${SYNC_ADDRESS_DIR}/${network}.json`
  fs.copySync(
    `${addressPath}`,
    `${SYNC_BASE_DIR}/backups/${network}_${now}.json`
  )
  fs.copySync(SYNC_INTERFACE_DIR, `${SYNC_BASE_DIR}/backups/abi/${now}`)
}

const syncAndWrite = (network: string): void => {
  try {
    const addresses = {}
    const contractRepoAddresses = `${CONTRACT_ADDRESSES_DIR}/${network}`

    const syncAddressJsonPath = `${SYNC_ADDRESS_DIR}/${network}.json`
    const addressFile = fs.readdirSync(contractRepoAddresses)

    for (const filename of addressFile) {
      const camelFilename: string = filename.replace(
        /_([a-z])/g,
        (f) => `${f[1].toUpperCase()}`
      )
      const address = fs.readFileSync(
        `${contractRepoAddresses}/${filename}`,
        'utf-8'
      )
      addresses[camelFilename] = address.trim()
    }
    fs.writeFileSync(syncAddressJsonPath, JSON.stringify(addresses))
    fs.copySync(CONTRACT_INTERFACES_DIR, SYNC_INTERFACE_DIR)
    console.log(`[+] Synced ${network}`)
    console.log({ addresses })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

;(() => {
  const network = process.argv[2]
  _backup(network)
  syncAndWrite(network)
})()
