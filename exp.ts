///////// across  //////////////////////

async ({
    signer, 
    receiverAddress, 
    amountIn, 
    toToken, 
    fromToken, 
    abi, 
    router, 
    chain, 
    networkname,
    contract, 
    ethers, 
    fromNetworkId = 109,
    fromNetworkName,
    toNetworkId = 80001,
    toNetworkName,
    lib,
    environment = 'test'
}) => { 
    let tx;
    const bridges = { 
        goerli: { 
            'usdt': '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6', 
            'eth': '0xb8901acB165ed027E32754E0FFe830802919727f'
        },
        ethereum: { 
            'usdt': '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6', 
            'eth': '0xb8901acB165ed027E32754E0FFe830802919727f'
        },
        chatxbt: { 
            'usdt': '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6', 
            'eth': '0xb8901acB165ed027E32754E0FFe830802919727f'
        }
    }; 

    const destinationNetwork = {
        'ethereum': 101,
        'chatxbt': 101,
        'bnb': 102,
        'avalanche': 106,
        'polygon': 80001,
        'arbitrum': 110,
        'optimism': 111,
        'fantom': 112,
        'metis': 151,
        'base': 184,
        'linea': 183,
        'kava': 177,
        'mantle': 181,
        'sepolia': 10161,
        'bsc-testnet': 10102
    };

    const assetAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const amount = ethers.utils.parseUnits('1.0', 6); // Example: 1 USDC
    const destinationChainId = 999; // Example: Base chain ID
    const destinationAddress = receiverAddress; 
    tx = await contract.deposit(assetAddress, amount, destinationChainId, destinationAddress, {
        gasLimit: 1000000,
    });
    tx = await tx.wait(); 
    return {status: true, message: `Your asset has been bridged from ${networkname} to ${toNetworkName}  successfully`, data: tx}; 
}