// PLEASE SETUP ALL THIS PARAMETER TO CORRECT NETWORK

let LOCKER = "0x2aa8eF542AAe3b4e7ef5626562e2f6015f76cF31";

var logoToken = 'bnb.png';
var RPC = "https://developer-access-mainnet.base.org";
var explorer = 'https://basescan.org';
var baseChainId = 8453;
var netName = "BASE MAINNET";
$('#runningNet').text(netName);

var paramNet = [{ chainId: '0x2105' }];
var paramAdd = [
    {
        chainId: '0x2105',
        chainName: 'ETH',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },					
        rpcUrls: [RPC],
        blockExplorerUrls: [explorer],
    },
];

var walletOption = {
    network: "binance",
    rpc: {56:'https://rpc.ankr.com/bsc'},
    chainId: 56
};
