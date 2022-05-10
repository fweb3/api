# API

![deploy](https://github.com/fweb3/api/actions/workflows/deploy.yml/badge.svg)
![tests](https://github.com/fweb3/api/actions/workflows/test.yml/badge.svg)

Development

1. use node v16
2. install dependencies
3. clone the [contracts repo](http://github.com/fweb3/contracts) and follow instructions
4. run in development mode `npm run dev`

```
ADMIN_ROLE_HASH: 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775
```

## Available Requests

note: CORs and access keys are enabled.

```bash
# Get current state of both faucets.
curl --location --request GET 'https://fweb3-api.herokuapp.com/api/faucet?network=<polygon|mumbai>' \
--header 'Authorization: Bearer foobar'

# Get current faucet balances for a network.
# Ex. Request
curl --location --request GET 'https://fweb3-api.herokuapp.com/api/balances?network=<polygon|mumbai>' \
--header 'Authorization: Bearer foobar'

# Ex. Response
{
    "fweb3": {
        "token_balance": "0.0",
        "matic_balance": "0.0",
        "drip_amount": "300.0"
    },
    "matic": {
        "matic_balance": "0.0",
        "drip_amount": "0.05"
    }
}

```
