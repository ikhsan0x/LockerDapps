let account;
let web3Modal;
let provider;
let walletConnector;

$(".btn_logout").hide();			    
$('.account').hide();
$('.usercoin').hide();

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
        await loadMyLocker();
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
            await loadMyLocker();
        });
        provider.on("chainChanged", async (chainId) => {
            await fetchAccountData();
            await loadMyLocker();
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
    
    async function claimToken(tIndex){
        if(account){
            try{
                await clock.methods.releaseTokens(tIndex).send({
                    from: account,
                })
                .on("transactionHash", function(hash) {
                    nInfo("Transaction submited to the network <br>" + `<a href='${explorer}/tx/${hash}' target='_blank'>Check on Explorer</a>`);			
                })
                .then(async function(receipt){
                    await fetchAccountData();
                    await loadMyLocker();
                    nSuccess("Transaction confirmed");			
                });                 
            }   
            catch(e){
                nError(e.message);	
            }
        }
        else{
     		nError("wallet not connected");			
        }        
    }
    
    async function loadMyLocker() {
      try {
        if (account) {
            $("#locklist").html('');
            $("#noData").html('');
            let totalLock = await clock.methods.getLockerIndexes(account).call();
            if (Number(totalLock.length) > 0) {
                for (let item of totalLock) {
                    let lockers = await clock.methods.lockers(item).call();
                    let claimAble = await clock.methods.getClaimableTokens(item).call();
                    let nextclaim = await clock.methods.getTimeUntilNextRelease(item).call();
                    
                    console.log(lockers);
                    let itemLock = `
                      <div class="lcard" data-token-contract="${lockers[0]}">
                        <div class="lcard-header">
                          <h2>Index ${item}</h2>
                        </div>
                        <div class="lcard-body">
                          <p><b>StartTime:</b> ${await timeConverter(lockers.startTime)}</p>
                          <p><b>Token:</b> <a href='${explorer}/address/${lockers[0]}' target='_blank'>${lockers[0].substring(0, 12) + '...' + lockers[0].substring(36, 42)}</a></p>
                          <p><b>Receiver:</b> <a href='${explorer}/address/${lockers[1]}' target='_blank'>${lockers[1].substring(0, 12) + '...' + lockers[1].substring(36, 42)}</a></p>
                          <p><b>TotalAmount:</b> ${ (lockers.totalAmount / (10 ** lockers.decimals) ) }</p>
                          <p><b>Claimed:</b> ${ (lockers.claimedAmount / (10 ** lockers.decimals) ) }</p>
                          <p><b>Release Percent:</b> ${lockers.releasePercentage}%</p>
                          <p><b>Interval:</b> ${secondsToDay(lockers.releaseInterval)}</p>
                    
                          <p><b>Next time Claim:</b> <b id="nextClaim" data="${nextclaim}"></b></p>
                          <p><b>Available to Claim:</b> <b id="claimable${lockers[2]}">${ (claimAble / (10 ** lockers.decimals) ) }</b></p>
                          <center><span class="base_btn noSelect tclaims${lockers[2]}">Claim</span></center>
                        </div>
                      </div>
                    `;
                    $("#locklist").append(itemLock);
                    
                    $(".tclaims" + lockers[2]).click(async function(e){
                        console.log(lockers[2]);
                        console.log(item);
                        let clam = $('#claimable' + lockers[2]).text();
                        console.log(clam);
                        if(Number(clam) > 0){
                            await claimToken(item);    
                        }else{
                            nError("There no amount to claim");
                        }
                    });                       
                }
                const nextClaimElements = document.querySelectorAll("#locklist #nextClaim[data]");
                nextClaimElements.forEach(element => {
                    const epochTimestamp = element.getAttribute("data");
                    countdownFromEpoch(epochTimestamp, element);
                });
            } 
            else {
                let noData = `
                  <center class="notAvailable">No data available</center>
                `;
                $("#noData").append(noData);
            }
        } 
        else {
          nError("account not connected");
        }
      } 
      catch (e) {
        console.log(e);
      }
    }
    await checkChains();
});