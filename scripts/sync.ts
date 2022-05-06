import fs from 'fs-extra'

const BASE_DIR = 'server/faucet/contracts'
const ADDRESS_DIR = `${BASE_DIR}/addresses`

const _backup = (network: string) => {
  const now = Date.now()
  const addressPath = `${ADDRESS_DIR}/${network}.json`
  const abiPath = `${BASE_DIR}/abi/`
  fs.copySync(
    `${addressPath}`,
    `${BASE_DIR}/backups/${network}/${network}_${now}.json`
  )
  fs.copySync(`${abiPath}`, `${BASE_DIR}/backups/abi/${now}`)
}

const syncAndWrite = (network: string): void => {
  try {
    const addresses = {}
    const addressesPath = `../fweb3-contracts/deploy_addresses/${network}`
    const jsonPath = `${ADDRESS_DIR}/${network}.json`
    const addressFile = fs.readdirSync(addressesPath)

    for (const filename of addressFile) {
      const camelFilename: string = filename.replace(
        /_([a-z])/g,
        (f) => `${f[1].toUpperCase()}`
      )
      const address = fs.readFileSync(`${addressesPath}/${filename}`, 'utf-8')
      addresses[camelFilename] = address.trim()
    }
    fs.writeFileSync(jsonPath, JSON.stringify(addresses))
    console.log('synced local')
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
