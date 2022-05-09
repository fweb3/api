// {
//     "status": "1",
//     "message": "OK",
//     "result": [
//         {
//             "blockNumber": "26030649",
//             "timeStamp": "1650578260",
//             "hash": "0x0680afda95f35602f1c299977dc79d2f7f55a132e2c3ed2bf943da43273911e6",
//             "nonce": "571",
//             "blockHash": "0xa341766308d3842c252d45f867a7a374a411fade72c335b038bf1abe325f904a",
//             "transactionIndex": "18",
//             "from": "0x2031832e54a2200bf678286f560f49a950db2ad5",
//             "to": "0x124341d2ad6f8c9862b64e5d96edc62e5d4b5de4",
//             "value": "1000000000000000000",
//             "gas": "42000",
//             "gasPrice": "4000000002",
//             "isError": "0",
//             "txreceipt_status": "1",
//             "input": "0x",
//             "contractAddress": "",
//             "cumulativeGasUsed": "4065941",
//             "gasUsed": "21000",
//             "confirmations": "237531"
//         }

//     ]
// }

export interface IPolygonResponse {
  status: string
  message: string
  result: Record<string, string>[]
}
