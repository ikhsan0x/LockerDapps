let account;
let web3Modal;
let provider;
let walletConnector;

$(".btn_logout").hide();			    
$('.account').hide();
$('.usercoin').hide();

let web4 = new Web3(RPC);
let clock2 = new web4.eth.Contract(abiLocker, LOCKER);

window.addEventListener('DOMContentLoaded', async (event) => {
    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: walletOption
        },
        binancechainwallet: {
            package: true
        },
        opera: {
            package: true
        },
        clvwallet: {
            package: true
        },
        bitkeep: {
            package: true
        },
        starzwallet: {
            package: true
        }
    }; 
    web3Modal = new Web3Modal({
        network: 'mainnet',	    
        cacheProvider: true,
        providerOptions,
        disableInjectedProvider: false,
    });
    const getLoaded = async () => {
        try {
            if (account) {
                $(".btn_connect").hide();
                $(".btn_logout").show();
                $('.account').show();
                $('.usercoin').show();
                
                const networkId = await web3.eth.getChainId();
                console.log(networkId);
                
                let users = account.substring(0, 12) + '...' + account.substring(36, 42);
                $('.account').html(users);
                
         	    const coinBalance = await web3.eth.getBalance(account);
                const coinWei = web3.utils.fromWei(coinBalance, "ether");
                let userCoin = parseFloat(coinWei).toFixed(6);
                $('.usercoin').html(getNetworkSymbol(networkId) + ' Balance: ' + userCoin);
            }
            else {
                $(".btn_connect").show();
                $(".btn_logout").hide();			    
                $('.account').hide();
                $('.usercoin').hide();
            }
        }
        catch(e){
            nError(e);
        }
    } 
    const fetchAccountData = async () => {
        web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        clock = new web3.eth.Contract(abiLocker, LOCKER);
        getLoaded();
    }
    const onConnect = async () => {
        try {
            provider = await web3Modal.connect();
        } 
        catch(e) {
            console.log(e);
            return;
        }
        provider.on("accountsChanged", async (accounts) => {
            await fetchAccountData();
            await loadLocker();
        });
        provider.on("chainChanged", async (chainId) => {
            await fetchAccountData();
            await loadLocker();
        });
        return await fetchAccountData();
    }
	if (web3Modal.cachedProvider) {
		onConnect();
	}
    $(document).on('click', '.btn_connect', onConnect);
	$(document).on('click', '.btn_logout', async function() {
		if (provider.disconnect) {
			await provider.disconnect();
			await web3Modal.clearCachedProvider();
		}
		provider = null;
		account = null;
		getLoaded();
	});
	
    let startIndex = 0;
    async function loadLocker(){
        try{
            $("#noData").html('');
            
            let totalUser = await clock2.methods.totalUser().call();
            let totalLock = await clock2.methods.getLockerCount().call();
            let endIndex = Math.min(startIndex + 11, totalLock - 1);
            let toArray = await generateNumberArray(startIndex, endIndex);
            
            $('#tlock').html(totalLock);
            $('#tuser').html(totalUser);
            
            if(Number(totalLock) > 0){
                if(toArray.length > 0){
                    for(let item of toArray){
                        let lockers = await clock2.methods.lockers(item.id).call();
                        let itemNFT = `
                            <div class="lcard" data-token-contract="${lockers.token_address}">
                              <div class="lcard-header">
                                <h2>Index ${item.id}</h2>
                              </div>
                              <div class="lcard-body">
                                <p><b>StartTime:</b> ${await timeConverter(lockers.startTime)}</p>
                                <p><b>Token:</b> <a href='${explorer}/address/${lockers[0]}' target='_blank'>${lockers[0].substring(0, 12) + '...' + lockers[0].substring(36, 42)}</a></p>
                                <p><b>Receiver:</b> <a href='${explorer}/address/${lockers[1]}' target='_blank'>${lockers[1].substring(0, 12) + '...' + lockers[1].substring(36, 42)}</a></p>
                                <p><b>TotalAmount:</b> ${ ( lockers.totalAmount / (10 ** lockers.decimals) ) }</p>
                                <p><b>Claimed:</b> ${ ( lockers.claimedAmount / (10 ** lockers.decimals) ) }</p>
                                <p><b>Release Percent:</b> ${lockers.releasePercentage}%</p>
                                <p><b>Interval:</b> ${secondsToDay(lockers.releaseInterval)}</p>
                              </div>
                            </div>                
                        `;
                        $("#locklist").append(itemNFT);
                    }  
                    startIndex = endIndex + 1;                    
                }
                else{
                    nError("no more data");
                }
            }
            else{
                let noData = `
                    <center class="notAvailable">No data available</center>                
                `;
                $("#noData").append(noData);                      
            }
        }
        catch(e){
            console.log(e);
        }        
    }
    $(document).on('click', '#loadMore', loadLocker);
    await loadLocker();
    await checkChains();
});