// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { loadAbi } from './../../contracts/abi/index'
// import { getPrivk, getProvider } from '../../lib/interfaces'
// import { ethers } from 'ethers'
// import { getContractAddress } from './../../contracts/addresses/index'
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { formatError } from '../../lib/errors'
// import { checkOrigin } from '../../lib/cors'
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     await checkOrigin(req)
//     const { network, type, account } = req.query
//     console.log(`[+] Initializing ${type} request on ${network}`)
//     const privk = getPrivk(network.toString())
//     if (!privk) {
//       throw new Error('cannot load wallet')
//     }
//     const provider = await getProvider(network.toString())
//     const wallet = await new ethers.Wallet(privk || '', provider)
//     if (type === 'matic') {
//       const maticFaucetAddress = getContractAddress(
//         network.toString(),
//         'fweb3MaticFaucet'
//       )
//       const maticFaucetAbi = loadAbi('fweb3MaticFaucet')
//       const maticFaucetContract = new ethers.Contract(
//         maticFaucetAddress,
//         maticFaucetAbi,
//         wallet
//       )
//       console.log('[+] dripping matic...')
//       const feeData = await provider.getFeeData()
//       console.log(`[+] Fee data: ${feeData}`)
//       const tx = await maticFaucetContract.dripMatic(account, {
//         gasPrice: feeData.gasPrice,
//       })
//       const receipt = await tx.wait()
//       const endBalance = await provider.getBalance(maticFaucetAddress)
//       console.log({
//         sent_matic_to: account,
//         matic_faucet_end_balance: endBalance.toString(),
//         tx_receipt: tx,
//       })
//       res.status(200).json(receipt)
//     } else {
//       const fweb3FaucetAddress = getContractAddress(
//         network.toString(),
//         'fweb3TokenFaucet'
//       )
//       const fweb3TokenAddress = getContractAddress(
//         network.toString(),
//         'fweb3Token'
//       )
//       const fweb3FaucetAbi = loadAbi('fweb3TokenFaucet')
//       const fweb3FaucetContract = new ethers.Contract(
//         fweb3FaucetAddress,
//         fweb3FaucetAbi,
//         wallet
//       )
//       const fweb3TokenAbi = loadAbi('fweb3Token')
//       const fweb3TokenContract = new ethers.Contract(
//         fweb3TokenAddress,
//         fweb3TokenAbi,
//         wallet
//       )
//       const fweb3FaucetBalance = await fweb3TokenContract.balanceOf(
//         fweb3FaucetContract.address
//       )
//       console.log('[+] dripping fweb3...')
//       // const gasRes = await fetch('https://gasstation-mainnet.matic.network/v2')
//       // const recommendedGas = await gasRes.json()
//       // const fastMaxPriority = recommendedGas.fast.fastMaxPriorityFee.toString()
//       // const standardFees = recommendedGas.standard
//       // const standardMaxFee = standardFees.maxFee.toString()
//       // const maxFeeFloor = Math.floor(standardMaxFee.toString())
//       // const fastMaxPriorityFloor = Math.floor(fastMaxPriority.toString())
//       // const fastFee = ethers.utils.parseUnits(fastMaxPriorityFloor.toString(), 'gwei')
//       // const standardFee = ethers.utils.parseUnits(maxFeeFloor.toString(), 'gwei')
//       // console.log({ fastFee: fastFee.toString(), standardFee: standardFee.toString() })
//       // const x = ethers.utils.parseEther(str.toString())
//       const tx = await fweb3FaucetContract.dripFweb3(account)
//       const receipt = await tx.wait()
//       console.log('[+] success!')
//       console.log({
//         sent_fweb3_to: account,
//         fweb3_faucet_balance: fweb3FaucetBalance.toString(),
//         tx: receipt.transactionHash,
//       })
//       res.status(200).json(receipt)
//     }
//   } catch (err: any) {
//     console.error(JSON.stringify(err, null, 2))
//     res.status(500).json({
//       error: formatError(err),
//       status: 'error',
//       code: err?.code || 'NO_CODE',
//     })
//   }
// }
//# sourceMappingURL=faucet.js.map