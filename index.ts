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
    toNetworkId = 109,
    toNetworkName,
    lib,
    environment = 'test'
}) => {

    const poolId = {
        "ethereum": {
            "usdc": 1,
            "usdt": 2,
            "dai": 3,
            "frax": 7,
            "usdd": 11,
            "eth": 13,
            "susd": 14,
            "lusd": 15,
            "mai": 16,
            "metis": 17,
            "metis.usdt": 19,
            "meth": 22
        },
        "chatxbt": {
            "usdc": 1,
            "usdt": 2,
            "dai": 3,
            "frax": 7,
            "usdd": 11,
            "eth": 13,
            "susd": 14,
            "lusd": 15,
            "mai": 16,
            "metis": 17,
            "metis.usdt": 19,
            "meth": 22
        },
        "bsc": {
            "usdt": 2,
            "busd": 5,
            "usdd": 11,
            "mai": 16,
            "metis.usdt": 19
        },
        "avalanche": {
            "usdc": 1,
            "usdt": 2,
            "frax": 7,
            "mai": 16,
            "metis.usdt": 19
        },
        "polygon": {
            "usdc": 1,
            "usdt": 2,
            "dai": 3,
            "mai": 16
        },
        "arbitrum": {
            "usdc": 1,
            "usdt": 2,
            "frax": 7,
            "eth": 13,
            "lusd": 15,
            "mai": 16
        },
        "optimism": {
            "usdc": 1,
            "dai": 3,
            "frax": 7,
            "eth": 13,
            "susd": 14,
            "lusd": 15,
            "mai": 16
        },
        "fantom": {
            "usdc": 21
        },
        "metis": {
            "metis": 17,
            "metis.usdt": 19
        },
        "base": {
            "usdc": 1,
            "eth": 13
        },
        "linea": {
            "eth": 13
        },
        "kava": {
            "usdt": 2
        },
        "mantle": {
            "usdc": 1,
            "usdt": 2,
            "meth": 22
        }
    };
    
    const chainId = {
        "ethereum": 101,
        "chatxbt": 101,
        "bnb": 102,
        "avalanche": 106,
        "polygon": 109,
        "arbitrum": 110,
        "optimism": 111,
        "fantom": 112,
        "metis": 151,
        "base": 184,
        "linea": 183,
        "kava": 177,
        "mantle": 181,
        "sepolia": 10161,
        "bsc-testnet": 10102
    };    
      

    const destinationNetwork = chainId[toNetworkName.toLowerCase()] || chain["bsc-testnet"];
    const source_pool_id = poolId[toNetworkName.toLowerCase()][fromToken.toLowerCase()] || poolId['ethereum']['eth'];
    const dest_pool_id = poolId[toNetworkName.toLowerCase()][toToken.toLowerCase()] || poolId['polygon']['usdt'];
      
    let tx = await contract.swap(
        destinationNetwork, 
            source_pool_id, 
            dest_pool_id, 
            receiverAddress, 
            ethers.parseEther(amountIn), 
            ethers.parseEther(amountIn), 
            { dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: '0x' }, 
            receiverAddress, 
            '0x', 
            {gasLimit: 4000000, value: ethers.parseEther(amountIn)}
        );
    tx = await tx.wait(); 
    return { status: true, message: 'Your asset has been bridged successfully', data: tx}
}


/// uniswap


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
    toNetworkId = 109,
    toNetworkName,
    lib,
    environment = 'test'
}) => { 
    let tx;
    const tokens = {
        'usdt': {
            "ethereum": '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            "chatxbt": '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            "sepolia": '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
        },
        'dai': {
            "ethereum": '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            "chatxbt": '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            "sepolia": '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6'
        },
        'eth': {
            "ethereum": '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            "chatxbt": '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            "sepolia": '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
        } 
    };

    const path = [
        tokens[fromToken.toLowerCase()][networkname.toLowerCase()] || tokens.eth[networkname.toLowerCase()], 
        tokens[toToken.toLowerCase()][networkname.toLowerCase()] || tokens.usdt[networkname.toLowerCase()]
    ];
    const amountsOut = await contract.getAmountsOut(ethers.parseEther(String(amountIn)), path);
    const now = new Date();
        
    if(fromToken.toLowerCase() === 'eth'){
        tx = await contract.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountsOut[1],
            path,
            receiverAddress,
            new Date(now.setMinutes(now.getMinutes() + 5)).getTime(), 
            { value: ethers.parseEther(String(amountIn)) }
        );
    } else {
        tx = await contract.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountsOut[0],
            0,
            path,
            receiverAddress,
            new Date(now.setMinutes(now.getMinutes() + 5)).getTime(),
            {gasLimit: 4000000}
        );
    }
    tx = await tx.wait(); 
    return { status: true, message: 'swapped successfully', data: tx };
}

///////// hop  //////////////////////

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
        "ethereum": 101,
        "chatxbt": 101,
        "bnb": 102,
        "avalanche": 106,
        "polygon": 80001,
        "arbitrum": 110,
        "optimism": 111,
        "fantom": 112,
        "metis": 151,
        "base": 184,
        "linea": 183,
        "kava": 177,
        "mantle": 181,
        "sepolia": 10161,
        "bsc-testnet": 10102
    }

    const router2 = bridges[fromNetworkName][fromToken?.toLowerCase()]; 
    const destNetwork = destinationNetwork[toNetworkName?.toLowerCase()] || destinationNetwork.polygon;
    if (!router2) { 
        return { status: false, message: `bridge asset: only assets allowed on this network is eth and usdt`, }; 
    } 
    const contract2 = new ethers.Contract( router2, abi, signer ); 
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5; 
    tx = await contract2.sendToL2( 
        destNetwork,
        receiverAddress, 
        ethers.parseEther(amountIn), 
        ethers.parseEther(amountIn), 
        deadline, 
        '0x0000000000000000000000000000000000000000', 
        0, 
        { gasLimit: 4000000, value: ethers.parseEther(amountIn), } 
    ); 
    tx = await tx.wait(); 
    return {status: true, message: `Your asset has been bridged from ${networkname} to ${toNetworkName}  successfully`, data: tx}; 
}


//////////////// 1inch /////////////////

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
            "ethereum": '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            "chatxbt": '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            "sepolia": '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
        },
        'dai': {
            "ethereum": '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            "chatxbt": '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            "sepolia": '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6'
        },
        'eth': {
            "ethereum": '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            "chatxbt": '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            "sepolia": '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
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


//////////////// compound /////////////////

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
    const abis = {
        "cEthAbi": [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"repayBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialExchangeRateMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"}],"name":"repayBorrowBehalf","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isCToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"comptroller_","type":"address"},{"name":"interestRateModel_","type":"address"},{"name":"initialExchangeRateMantissa_","type":"uint256"},{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"interestAccumulated","type":"uint256"},{"indexed":false,"name":"borrowIndex","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"minter","type":"address"},{"indexed":false,"name":"mintAmount","type":"uint256"},{"indexed":false,"name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"redeemer","type":"address"},{"indexed":false,"name":"redeemAmount","type":"uint256"},{"indexed":false,"name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"borrowAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"liquidator","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"cTokenCollateral","type":"address"},{"indexed":false,"name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPendingAdmin","type":"address"},{"indexed":false,"name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldComptroller","type":"address"},{"indexed":false,"name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldInterestRateModel","type":"address"},{"indexed":false,"name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"admin","type":"address"},{"indexed":false,"name":"reduceAmount","type":"uint256"},{"indexed":false,"name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"info","type":"uint256"},{"indexed":false,"name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Approval","type":"event"}],
        "comptrollerAbi": [{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x26782247"},{"constant":false,"inputs":[{"name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb71d1a0c"},{"constant":true,"inputs":[],"name":"comptrollerImplementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xbb82aa5e"},{"constant":false,"inputs":[],"name":"_acceptImplementation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc1e80334"},{"constant":true,"inputs":[],"name":"pendingComptrollerImplementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdcfbc0c7"},{"constant":false,"inputs":[{"name":"newPendingImplementation","type":"address"}],"name":"_setPendingImplementation","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe992a041"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe9c714f2"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf851a440"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPendingImplementation","type":"address"},{"indexed":false,"name":"newPendingImplementation","type":"address"}],"name":"NewPendingImplementation","type":"event","signature":"0xe945ccee5d701fc83f9b8aa8ca94ea4219ec1fcbd4f4cab4f0ea57c5c3e1d815"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldImplementation","type":"address"},{"indexed":false,"name":"newImplementation","type":"address"}],"name":"NewImplementation","type":"event","signature":"0xd604de94d45953f9138079ec1b82d533cb2160c906d1076d1f7ed54befbca97a"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPendingAdmin","type":"address"},{"indexed":false,"name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event","signature":"0xca4f2f25d0898edd99413412fb94012f9e54ec8142f9b093e7720646a95b16a9"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event","signature":"0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc"},{"anonymous":false,"inputs":[{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"info","type":"uint256"},{"indexed":false,"name":"detail","type":"uint256"}],"name":"Failure","type":"event","signature":"0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"},{"constant":true,"inputs":[],"name":"isComptroller","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x007e3dd2"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"payer","type":"address"},{"name":"borrower","type":"address"},{"name":"repayAmount","type":"uint256"},{"name":"borrowerIndex","type":"uint256"}],"name":"repayBorrowVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1ededc91"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"payer","type":"address"},{"name":"borrower","type":"address"},{"name":"repayAmount","type":"uint256"}],"name":"repayBorrowAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x24008a62"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x26782247"},{"constant":false,"inputs":[{"name":"newCloseFactorMantissa","type":"uint256"}],"name":"_setCloseFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x317b0b77"},{"constant":false,"inputs":[{"name":"unitroller","type":"address"},{"name":"_oracle","type":"address"},{"name":"_closeFactorMantissa","type":"uint256"},{"name":"_maxAssets","type":"uint256"},{"name":"reinitializing","type":"bool"}],"name":"_become","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x32000e00"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"minter","type":"address"},{"name":"mintAmount","type":"uint256"},{"name":"mintTokens","type":"uint256"}],"name":"mintVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x41c728b9"},{"constant":false,"inputs":[{"name":"cTokenBorrowed","type":"address"},{"name":"cTokenCollateral","type":"address"},{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"repayAmount","type":"uint256"},{"name":"seizeTokens","type":"uint256"}],"name":"liquidateBorrowVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x47ef3b3b"},{"constant":true,"inputs":[],"name":"liquidationIncentiveMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x4ada90af"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"minter","type":"address"},{"name":"mintAmount","type":"uint256"}],"name":"mintAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x4ef4c3e1"},{"constant":false,"inputs":[{"name":"newLiquidationIncentiveMantissa","type":"uint256"}],"name":"_setLiquidationIncentive","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x4fd42e17"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"redeemer","type":"address"},{"name":"redeemAmount","type":"uint256"},{"name":"redeemTokens","type":"uint256"}],"name":"redeemVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x51dff989"},{"constant":false,"inputs":[{"name":"newOracle","type":"address"}],"name":"_setPriceOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x55ee1fe1"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"borrower","type":"address"},{"name":"borrowAmount","type":"uint256"}],"name":"borrowVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x5c778605"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getAccountLiquidity","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5ec88c79"},{"constant":false,"inputs":[{"name":"cTokenBorrowed","type":"address"},{"name":"cTokenCollateral","type":"address"},{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"repayAmount","type":"uint256"}],"name":"liquidateBorrowAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x5fc7e71e"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"transferTokens","type":"uint256"}],"name":"transferVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6a56947e"},{"constant":false,"inputs":[{"name":"cTokenCollateral","type":"address"},{"name":"cTokenBorrowed","type":"address"},{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"seizeTokens","type":"uint256"}],"name":"seizeVerify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6d35bf91"},{"constant":true,"inputs":[],"name":"oracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7dc0d1d0"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"markets","outputs":[{"name":"isListed","type":"bool"},{"name":"collateralFactorMantissa","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8e8f294b"},{"constant":true,"inputs":[{"name":"account","type":"address"},{"name":"cToken","type":"address"}],"name":"checkMembership","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x929fe9a1"},{"constant":true,"inputs":[],"name":"maxAssets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x94b2294b"},{"constant":false,"inputs":[{"name":"cToken","type":"address"}],"name":"_supportMarket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa76b3fda"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getAssetsIn","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xabfceffc"},{"constant":true,"inputs":[],"name":"comptrollerImplementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xbb82aa5e"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"transferTokens","type":"uint256"}],"name":"transferAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xbdcdc258"},{"constant":false,"inputs":[{"name":"cTokens","type":"address[]"}],"name":"enterMarkets","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc2998238"},{"constant":true,"inputs":[{"name":"cTokenBorrowed","type":"address"},{"name":"cTokenCollateral","type":"address"},{"name":"repayAmount","type":"uint256"}],"name":"liquidateCalculateSeizeTokens","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc488847b"},{"constant":false,"inputs":[{"name":"cTokenCollateral","type":"address"},{"name":"cTokenBorrowed","type":"address"},{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"seizeTokens","type":"uint256"}],"name":"seizeAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd02f7351"},{"constant":false,"inputs":[{"name":"newMaxAssets","type":"uint256"}],"name":"_setMaxAssets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd9226ced"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"borrower","type":"address"},{"name":"borrowAmount","type":"uint256"}],"name":"borrowAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xda3d454c"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"accountAssets","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdce15449"},{"constant":true,"inputs":[],"name":"pendingComptrollerImplementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdcfbc0c7"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"newCollateralFactorMantissa","type":"uint256"}],"name":"_setCollateralFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe4028eee"},{"constant":true,"inputs":[],"name":"closeFactorMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xe8755446"},{"constant":false,"inputs":[{"name":"cToken","type":"address"},{"name":"redeemer","type":"address"},{"name":"redeemTokens","type":"uint256"}],"name":"redeemAllowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xeabe7d91"},{"constant":false,"inputs":[{"name":"cTokenAddress","type":"address"}],"name":"exitMarket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xede4edd0"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf851a440"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cToken","type":"address"}],"name":"MarketListed","type":"event","signature":"0xcf583bb0c569eb967f806b11601c4cb93c10310485c67add5f8362c2f212321f"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cToken","type":"address"},{"indexed":false,"name":"account","type":"address"}],"name":"MarketEntered","type":"event","signature":"0x3ab23ab0d51cccc0c3085aec51f99228625aa1a922b3a8ca89a26b0f2027a1a5"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cToken","type":"address"},{"indexed":false,"name":"account","type":"address"}],"name":"MarketExited","type":"event","signature":"0xe699a64c18b07ac5b7301aa273f36a2287239eb9501d81950672794afba29a0d"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldCloseFactorMantissa","type":"uint256"},{"indexed":false,"name":"newCloseFactorMantissa","type":"uint256"}],"name":"NewCloseFactor","type":"event","signature":"0x3b9670cf975d26958e754b57098eaa2ac914d8d2a31b83257997b9f346110fd9"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cToken","type":"address"},{"indexed":false,"name":"oldCollateralFactorMantissa","type":"uint256"},{"indexed":false,"name":"newCollateralFactorMantissa","type":"uint256"}],"name":"NewCollateralFactor","type":"event","signature":"0x70483e6592cd5182d45ac970e05bc62cdcc90e9d8ef2c2dbe686cf383bcd7fc5"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldLiquidationIncentiveMantissa","type":"uint256"},{"indexed":false,"name":"newLiquidationIncentiveMantissa","type":"uint256"}],"name":"NewLiquidationIncentive","type":"event","signature":"0xaeba5a6c40a8ac138134bff1aaa65debf25971188a58804bad717f82f0ec1316"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldMaxAssets","type":"uint256"},{"indexed":false,"name":"newMaxAssets","type":"uint256"}],"name":"NewMaxAssets","type":"event","signature":"0x7093cf1eb653f749c3ff531d6df7f92764536a7fa0d13530cd26e070780c32ea"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPriceOracle","type":"address"},{"indexed":false,"name":"newPriceOracle","type":"address"}],"name":"NewPriceOracle","type":"event","signature":"0xd52b2b9b7e9ee655fcb95d2e5b9e0c9f69e7ef2b8e9d2d0ea78402d576d22e22"},{"anonymous":false,"inputs":[{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"info","type":"uint256"},{"indexed":false,"name":"detail","type":"uint256"}],"name":"Failure","type":"event","signature":"0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"}],
        "priceFeedAbi": [{"inputs":[{"internalType":"contract OpenOraclePriceData","name":"priceData_","type":"address"},{"internalType":"address","name":"reporter_","type":"address"},{"internalType":"uint256","name":"anchorToleranceMantissa_","type":"uint256"},{"internalType":"uint256","name":"anchorPeriod_","type":"uint256"},{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig[]","name":"configs","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"anchorPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTimestamp","type":"uint256"}],"name":"AnchorPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"reporter","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"anchor","type":"uint256"}],"name":"PriceGuarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"PriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"reporter","type":"address"}],"name":"ReporterInvalidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"oldTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"UniswapWindowUpdated","type":"event"},{"inputs":[],"name":"anchorPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ethBaseUnit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"expScale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getTokenConfig","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"cToken","type":"address"}],"name":"getTokenConfigByCToken","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"getTokenConfigBySymbol","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"symbolHash","type":"bytes32"}],"name":"getTokenConfigBySymbolHash","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"underlying","type":"address"}],"name":"getTokenConfigByUnderlying","outputs":[{"components":[{"internalType":"address","name":"cToken","type":"address"},{"internalType":"address","name":"underlying","type":"address"},{"internalType":"bytes32","name":"symbolHash","type":"bytes32"},{"internalType":"uint256","name":"baseUnit","type":"uint256"},{"internalType":"enum UniswapConfig.PriceSource","name":"priceSource","type":"uint8"},{"internalType":"uint256","name":"fixedPrice","type":"uint256"},{"internalType":"address","name":"uniswapMarket","type":"address"},{"internalType":"bool","name":"isUniswapReversed","type":"bool"}],"internalType":"struct UniswapConfig.TokenConfig","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"cToken","type":"address"}],"name":"getUnderlyingPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"invalidateReporter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lowerBoundAnchorRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"newObservations","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"acc","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"oldObservations","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"acc","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"messages","type":"bytes[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"},{"internalType":"string[]","name":"symbols","type":"string[]"}],"name":"postPrices","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"symbol","type":"string"}],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceData","outputs":[{"internalType":"contract OpenOraclePriceData","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"prices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reporter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reporterInvalidated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"source","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"upperBoundAnchorRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
        "cErcAbi": [{"inputs":[{"internalType":"address","name":"underlying_","type":"address"},{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address payable","name":"admin_","type":"address"},{"internalType":"address","name":"implementation_","type":"address"},{"internalType":"bytes","name":"becomeImplementationData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cashPrior","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interestAccumulated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"borrowIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"error","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"info","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"cTokenCollateral","type":"address"},{"indexed":false,"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ComptrollerInterface","name":"oldComptroller","type":"address"},{"indexed":false,"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldImplementation","type":"address"},{"indexed":false,"internalType":"address","name":"newImplementation","type":"address"}],"name":"NewImplementation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract InterestRateModel","name":"oldInterestRateModel","type":"address"},{"indexed":false,"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldPendingAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"redeemer","type":"address"},{"indexed":false,"internalType":"uint256","name":"redeemAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"benefactor","type":"address"},{"indexed":false,"internalType":"uint256","name":"addAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"},{"indexed":false,"internalType":"uint256","name":"reduceAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"addAmount","type":"uint256"}],"name":"_addReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"implementation_","type":"address"},{"internalType":"bool","name":"allowResign","type":"bool"},{"internalType":"bytes","name":"becomeImplementationData","type":"bytes"}],"name":"_setImplementation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"internalType":"contract ComptrollerInterface","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"data","type":"bytes"}],"name":"delegateToImplementation","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"data","type":"bytes"}],"name":"delegateToViewImplementation","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"internalType":"contract InterestRateModel","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isCToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"repayAmount","type":"uint256"},{"internalType":"contract CTokenInterface","name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"mintAmount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"repayAmount","type":"uint256"}],"name":"repayBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"repayAmount","type":"uint256"}],"name":"repayBorrowBehalf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"underlying","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}],
        "erc20Abi": [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
    }

    const {
        cEthAbi,
        comptrollerAbi,
        priceFeedAbi,
        cErcAbi,
        erc20Abi,
    } = abis


    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                               //
    //                                                                              //
    // Example to supply ETH as collateral and borrow a supported ERC-20 token //////
    //                                                                         /////
    ///////////////////////////////////////////////////////////////////////////////


    // Mainnet Contract for cETH (the collateral-supply process is different for cERC20 tokens)
    const cEthAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';
    const cEth = new ethers.Contract(cEthAddress, cEthAbi, signer);

    // Mainnet Contract for the Compound Protocol's Comptroller
    const comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';
    const comptroller = new ethers.Contract(comptrollerAddress, comptrollerAbi, signer);

    // Mainnet Contract for the Open Price Feed
    const priceFeedAddress = '0x6d2299c48a8dd07a872fdd0f8233924872ad1071';
    const priceFeed = new ethers.Contract(priceFeedAddress, priceFeedAbi, signer);

    // Mainnet address of underlying token (like DAI or USDC)
    const underlyingAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // Dai
    const underlying = new ethers.Contract(underlyingAddress, erc20Abi, signer);

    // Mainnet address for a cToken (like cDai, https://compound.finance/docs#networks)
    const cTokenAddress = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'; // cDai
    const cToken = new ethers.Contract(cTokenAddress, cErcAbi, signer);
    const assetName = 'DAI'; // for the log output lines
    const underlyingDecimals = 18; // Number of decimals defined in this ERC20 token's contract

    const logBalances = () => {
    return new Promise(async (resolve, reject) => {
        // let myWalletEthBalance = await provider.getBalance(myWalletAddress) / 1e18;
        // let myWalletCEthBalance = await cEth.callStatic.balanceOf(myWalletAddress) / 1e8;
        // let myWalletUnderlyingBalance = await underlying.callStatic.balanceOf(myWalletAddress) / Math.pow(10, underlyingDecimals);

        // console.log("My Wallet's  ETH Balance:", myWalletEthBalance);
        // console.log("My Wallet's cETH Balance:", myWalletCEthBalance);
        // console.log(`My Wallet's  ${assetName} Balance:`, myWalletUnderlyingBalance);

        // resolve();
    });
    };

    const main = async () => {
    await logBalances();

    const ethToSupplyAsCollateral = 1;

    console.log('\nSupplying ETH to the protocol as collateral (you will get cETH in return)...\n');
    let mint = await cEth.mint({
        value: (ethToSupplyAsCollateral * 1e18).toString()
    });

    await logBalances();

    console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
    let markets = [ cEthAddress ]; // This is the cToken contract(s) for your collateral
    let enterMarkets = await comptroller.enterMarkets(markets);
    await enterMarkets.wait(1);

    console.log('Calculating your liquid assets in the protocol...');
    let { 1:liquidity } = await comptroller.callStatic.getAccountLiquidity(receiverAddress);
    liquidity = liquidity / 1e18;

    console.log('Fetching cETH collateral factor...');
    let { 1:collateralFactor } = await comptroller.callStatic.markets(cEthAddress);
    collateralFactor = (collateralFactor / 1e18) * 100; // Convert to percent

    console.log(`Fetching ${assetName} price from the price feed...`);
    let underlyingPriceInUsd = await priceFeed.callStatic.price(assetName);
    underlyingPriceInUsd = underlyingPriceInUsd / 1e6; // Price feed provides price in USD with 6 decimal places

    console.log(`Fetching borrow rate per block for ${assetName} borrowing...`);
    let borrowRate = await cToken.callStatic.borrowRatePerBlock();
    borrowRate = borrowRate / Math.pow(10, underlyingDecimals);

    console.log(`\nYou have ${liquidity} of LIQUID assets (worth of USD) pooled in the protocol.`);
    console.log(`You can borrow up to ${collateralFactor}% of your TOTAL collateral supplied to the protocol as ${assetName}.`);
    console.log(`1 ${assetName} == ${underlyingPriceInUsd.toFixed(6)} USD`);
    console.log(`You can borrow up to ${liquidity/underlyingPriceInUsd} ${assetName} from the protocol.`);
    console.log(`NEVER borrow near the maximum amount because your account will be instantly liquidated.`);
    console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetName} per block.\nThis is based on the current borrow rate.\n`);

    const underlyingToBorrow = 50;
    console.log(`Now attempting to borrow ${underlyingToBorrow} ${assetName}...`);
    const scaledUpBorrowAmount = (underlyingToBorrow * Math.pow(10, underlyingDecimals)).toString();
    const trx = await cToken.borrow(scaledUpBorrowAmount);
    await trx.wait(1);
    // console.log('Borrow Transaction', trx);

    await logBalances();

    console.log(`\nFetching ${assetName} borrow balance from c${assetName} contract...`);
    let balance = await cToken.callStatic.borrowBalanceCurrent(receiverAddress);
    balance = balance / Math.pow(10, underlyingDecimals);
    console.log(`Borrow balance is ${balance} ${assetName}`);

    console.log(`\nThis part is when you do something with those borrowed assets!\n`);

    console.log(`Now repaying the borrow...`);
    console.log(`Approving ${assetName} to be transferred from your wallet to the c${assetName} contract...`);
    const underlyingToRepay = (underlyingToBorrow * Math.pow(10, underlyingDecimals)).toString();
    const approve = await underlying.approve(cTokenAddress, underlyingToRepay);
    await approve.wait(1);

    const repayBorrow = await cToken.repayBorrow(underlyingToRepay);
    const repayBorrowResult = await repayBorrow.wait(1);

    const failure = repayBorrowResult.events.find(_ => _.event === 'Failure');
    if (failure) {
        const errorCode = failure.args.error;
        console.error(`repayBorrow error, code ${errorCode}`);
        // process.exit(1);
        return { status: true, message: `repayBorrow error, code ${errorCode}`, data: {} };
    }

    console.log(`\nBorrow repaid.\n`);
    await logBalances();
    };

    return { status: true, message: 'swapped successfully', data: {} };
}