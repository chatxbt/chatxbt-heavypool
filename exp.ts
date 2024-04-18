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
    const tokens = {
        'usdt': {
            'ethereum': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            'sepolia': '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
        },
        'dai': {
            'ethereum': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            'sepolia': '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6'
        },
        'eth': {
            'ethereum': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            'sepolia': '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
        } 
    };

    const recipient = receiverAddress; 
    const tokenIn = tokens[fromToken][networkname] || tokens.eth[networkname]; 
    const tokenOut = tokens[toToken][networkname] || tokens.usdt[networkname]; 
    const slippageAdjustedMinAmountOut = 0; 
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5; 
    let tx = await contract.swapExactTokensForTokens(
        ethers.parseUnits(amountIn, 18),
        slippageAdjustedMinAmountOut,
        [tokenIn, tokenOut],
        recipient,
        deadline,
        { gasLimit: 4000000 }
    );
    tx = await tx.wait(); 
    return { status: true, message: 'swapped successfully', data: tx };
}