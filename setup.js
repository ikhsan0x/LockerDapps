// PLEASE SETUP ALL THIS PARAMETER TO CORRECT NETWORK

let LOCKER = "0x90b5Bd0B9CbC634b5147662AAd3Fa27Bb56DC996";

var logoToken = 'bnb.png';
var RPC = "https://rpc.ankr.com/bsc_testnet_chapel";
var explorer = 'https://testnet.bscscan.com';
var baseChainId = 97;
var netName = "tBSC";
$('#runningNet').text(netName);

var paramNet = [{ chainId: '0x38' }];
var paramAdd = [
    {
        chainId: '0x38',
        chainName: 'BSC',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
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

var cids = 'binancecoin'; //this is API id, you can find this on coin info coingecko
var coingeckoAPI = `https://api.coingecko.com/api/v3/simple/price?ids=${cids}&vs_currencies=usd`;