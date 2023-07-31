let account;
let web3Modal;
let provider;
let walletConnector;

$(".btn_logout").hide();			    
$('.account').hide();
$('.usercoin').hide();
$('.approv').hide();
 
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
        await loadToken();
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
            await loadToken();
        });
        provider.on("chainChanged", async (chainId) => {
            await fetchAccountData();
            await loadToken();
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
	
	async function checkAllowance(tContract, account, amounts){
	    const allowCon = new web3.eth.Contract(lesABI, tContract);
	    const allow = await allowCon.methods.allowance(account, LOCKER).call();
	    
	    console.log(allow);
	    console.log(amounts);
	    
	    if(Number(allow) >= Number(amounts)){
	        return true;
	    }
	    return false;
	}
    
    function numToBig(num , dec){
        const tamountBigNumber = new BigNumber(num);
        const multiplier = new BigNumber(10).exponentiatedBy(dec);
        const multipliedAmount = tamountBigNumber.times(multiplier);
        const plainStringAmount = multipliedAmount.integerValue().toFixed(0);
        return plainStringAmount;
    }
    
    async function getAllERC20(accn) {
        try{
	    const apiKey = "cqt_rQWbfpWKPqdwqyyccvC9YGHmMhr8";	
	    const headers = {
		Authorization: `Bearer ${apiKey}`
	    };
            let networkId = web3.utils.toHex(await web3.eth.getChainId());
            console.log(networkId);
            const getERCAll = await axios.get(`https://api.covalenthq.com/v1/base-mainnet/address/${accn}/balances_v2/?`, { headers });
	    console.log(getERCAll.data);	
            return getERCAll.data;
        }
        catch(e){
            console.log(e);
        }	    
    }

    async function resetBtn() {
        if(account){
            let tc = $("#selectToken").find(':selected').attr('data');
            let tamount = $("#tokenAmount").val();
            let decimals = $("#selectToken").find(':selected').attr('decimal');
            let convertToWei = numToBig(tamount , decimals);
            let checkAll = await checkAllowance(tc, account, convertToWei); 
            
            const checkTimeout = setTimeout(checkAll, 5000);
            if(checkTimeout){
                $('.approv').hide();
                $('.clocks').show();
            }
            else{
                $('.approv').show();
                $('.clocks').hide();
            }
        }
    }

    $('#selectToken').change(async function() {
        await resetBtn();
    });
  
    function getEpochTime() {
      var startDate = $('#lockingStart').val();
      var time = $('#lockingTime').val();
      if (startDate && time) {
        var dateTimeString = startDate + ' ' + time;
        var epochTime = new Date(dateTimeString).getTime() / 1000;
        var currentTime = Math.floor(Date.now() / 1000);
        if (epochTime <= currentTime) {
          nError("Selected date and time is not in the future.");
          return;
        }
        return epochTime;
      }
      else {
        nError("Please select both date and time.");
      }
    }
    
    async function createLocker(tAddress, rAddress, start, tAmount, interval, tPercent, dec){
        if(account){
            try{
                await clock.methods.createLocker(tAddress, rAddress, start, tAmount, interval, tPercent, dec).send({
                    from: account,
                })
                .on("transactionHash", function(hash) {
                    nInfo("Transaction submited to the network <br>" + `<a href='${explorer}/tx/${hash}' target='_blank'>Check on Explorer</a>`);			
                })
                .then(async function(receipt){
                    await fetchAccountData();
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
    
    async function approves(tContract, tAmount) {
        if(account){
            try{
                const ctoken = new web3.eth.Contract(lesABI, tContract);
                let amountInHex = web3.utils.toHex(tAmount);
                await ctoken.methods.approve(LOCKER, amountInHex).send({
                    from: account,
                })
                .on("transactionHash", function(hash) {
                    nInfo("Transaction submited to the network <br>" + `<a href='${explorer}/tx/${hash}' target='_blank'>Check on Explorer</a>`);			
                })
                .then(async function(receipt){
                    await resetBtn();
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
    
	$(document).on('click', '.clocks', async function() {
	    if(account){
            let tc = $("#selectToken").find(':selected').attr('data');
            let tvalue = $("#network").val();
            
            let receiver = $("#receiverAddress").val();
            let tamount = $("#tokenAmount").val();
            let decimals = $("#selectToken").find(':selected').attr('decimal');
            
            let interval = $("#interval").val();
            let percents = $("#percent").val();
            
            let convertToWei = numToBig(tamount , decimals);
            let checkAll = await checkAllowance(tc, account, convertToWei);

            let startDate = $('#lockingStart').val();
            let time = $('#lockingTime').val();
            let dateTimeString = startDate + ' ' + time;
            let epochTime = new Date(dateTimeString).getTime() / 1000;
            let currentTime = Math.floor(Date.now() / 1000);
        
	        if(tamount > 0){
    	        if(checkAll){
    	            let checkR = web3.utils.isAddress(receiver);
                    if(checkR == false){
    	                nError("invalid address");
    	            }
    	            else if(percents < 1 && percents > 100){
    	                nError("percent must be between 1 - 100");
    	            }
    	            else if(startDate == null && time == null){
    	                console.log(startDate);
    	                console.log(time);
    	                nError("Please select both date and time.");
    	            }
    	            else if(epochTime <= currentTime){
    	                nError("Selected date and time is not in the future.");
    	            }
    	            else{
    	                await createLocker(tc, receiver, getEpochTime(),convertToWei, interval, percents, decimals);   
    	            }
    	        }
    	        else{
    	            $('.approv').show();
    	            $('.clocks').hide();
    	        }	           
	        }
	        else{
    	        nError("token amount must be more than 0"); 
	        }
	    }
	    else{
	        nError("account not connected!");
	    }
	});

	$(document).on('click', '.approv', async function() {
	    if(account){
	        let tc = $("#selectToken").find(':selected').attr('data');
	        let tamount = $("#tokenAmount").val();
	        let decimals = $("#selectToken").find(':selected').attr('decimal');
	        let convertToWei = numToBig(tamount , decimals);
            await approves(tc, convertToWei);
	    }
	    else{
	        nError("account not connected!");
	    }
	});
   
    async function loadToken(){
        try{
            $('#selectToken').html(''); 
            $('#balanceList').html(''); 
            if(account){
                let getAllToken = await getAllERC20(account);
                console.log(getAllToken);
                if(getAllToken[0]){
                    for (const tlist of getAllToken) {
                        var ctabItm = []; // Initialize a new array for each iteration
                        ctabItm.push("<tr>");
                        ctabItm.push(`<td><img src="${checkLogo(tlist.logo)}" alt="" class="token-logo">${tlist.name}</td>`);
                        ctabItm.push(`<td>${(tlist.balance / (10 ** tlist.decimals))}</td>`);
                        ctabItm.push("</tr>");
                        $('#balanceList').append(ctabItm.join("")); // Append the joined array to the element  
                        let dselect = `<option value="${tlist.balance}" decimal="${tlist.decimals}" data="${tlist.token_address}">${tlist.name} (${tlist.symbol})</option>`;
                        $('#selectToken').append(dselect);                             
                    }                     
                }
            }
        }
        catch(e){
            console.log(e);
        }        
    }
    await checkChains();
});
