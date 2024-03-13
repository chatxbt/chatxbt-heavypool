# chatxbt-heavypool
this repo serves as submodule to enable users add new protocols - [Learn more](link-to-contribution-guidelines)

Sure! Below is a basic README.md version of the documentation we've outlined so far:

---

# DeFi Integration Platform

Welcome to our DeFi integration platform! This platform allows users to interact with various decentralized finance (DeFi) protocols using natural language commands.

## Contributing New Protocols

To contribute a new protocol to our platform, follow these steps:

1. **Fork the Submodule**: Start by forking the submodule repository from our main project repository.
2. **Clone the Forked Repository**: Clone your forked repository to your local machine using Git.
3. **Define Protocol Information**: Create a new JSON file in the `protocols` directory of the submodule repository. Fill in the required information for the protocol, including its name, ID, contract address, ABI, supported methods, and links to relevant resources.
4. **Define Method Mappings**: Define mappings for the methods supported by the protocol, specifying the required arguments and providing custom JavaScript functions for execution.
5. **Test Your Changes**: Test your changes locally to ensure that the new protocol integration works as expected.
6. **Submit a Pull Request**: Once you have completed your changes and tested them locally, submit a pull request to merge your modifications into the main project repository.

## Example Template

Here's an example template for adding a new protocol:

```json
{
    "name": "Uniswap",
    "id": "01-uniswap",
    "tags": ["Uniswap"],
    "website": "",
    "description": "Uniswap is a decentralized exchange (DEX) protocol on Ethereum that enables automated token swaps.",
    "explorer": "",
    "research": "",
    "contractAddress": {
        "goerli": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    "abi": [
        // ABI definitions...
    ],
    "symbol": "",
    "type": "DEX",
    "decimals": 18,
    "status": "active",
    "mapping": {
        // Method mappings...
    },
    "links": [
        // Additional links...
    ]
}
```

Replace the placeholder values with the relevant information for the protocol you are adding.


## Method Mappings

The mapping section of the protocol JSON file allows users to dynamically map NLP responses to actual functions within the application. Here's how it works:

```json
"mapping": {
    "swap": {
        // Arguments required for the method call
        "arg": ["amount", "amountOutMin", ["tokenIn", "tokenOut"], "recipient", "deadline"],
        // The method to be called
        "method": "swapExactTokensForTokens",
        // Custom JavaScript function for executing the method
        "customCall": "async ({ signer, receiverAddress, amountIn, toToken, fromToken, abi, router, chain, contract, ethers }) => {const recipient = receiverAddress; const tokenIn = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; const tokenOut = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; const slippageAdjustedMinAmountOut = 0; const deadline = Math.floor(Date.now() / 1000) + 60 * 5; let tx = await contract.swapExactTokensForTokens(ethers.parseUnits(amountIn, 18),slippageAdjustedMinAmountOut,[tokenIn, tokenOut],recipient,deadline,{gasLimit: 4000000});tx = await tx.wait(); return {status: true, message: 'swapped successfully', data: tx};}"
    },
    // Other mappings...
}
```

In the `mapping` section, users can specify actions (e.g., "swap") and define:

- **arg**: Arguments required for the method call.
- **method**: The method to be called within the application.
- **customCall**: A custom JavaScript function for executing the method. This function enables users to create a custom execution flow using the provided arguments such as `signer`, `receiverAddress`, `amountIn`, `toToken`, `fromToken`, `abi`, `router`, `chain`, `contract`, and `ethers`.

Users can write custom execution flows tailored to their specific requirements, leveraging the provided arguments to interact with the protocol's smart contract and perform the desired actions.


## Additional Resources

- [Contribution Guidelines](link-to-contribution-guidelines)
- [GitHub Issues](link-to-github-issues)
- [Community Chat](link-to-community-chat)

Thank you for your contributions to our DeFi integration platform!

---
