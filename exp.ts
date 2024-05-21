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
    environment = 'test',
    axios,
    oauth,
    action,
    quantity
}) => { 
    const baseUrl = 'https://chatxbt-2y3i3.ondigitalocean.app/api/v1/binance-ticker-price';

    const options = {
        headers: {'Authorization': `Bearer ${oauth}`}
    };

    const { data } = axios.post(baseUrl, {
        symbol: fromToken,
        action,
        quantity
    }, options);

    console.log(data);
 
    return {status: data?.status || false, message: data?.message, data: data?.data || {}}; 
}