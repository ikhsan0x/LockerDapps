$(document).ready(function(){
    $(".preloader").fadeOut();
});

let btn = $('#btntop');
$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
    e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});

function getCurrentEpochTime() {
  return Math.floor(Date.now() / 1000);
}

function timeConverter(UNIX_timestamp){
    var a = new Date(Number(UNIX_timestamp) * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
} 

function toPlainNum(num) {
  return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function(a,b,c,d,e) {
      return e < 0
        ? b + '0.' + Array(1-e-c.length).join(0) + c + d
        : b + c + d + Array(e-d.length+1).join(0);
    });
}

function secondsToDay(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " Day " : " Day ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function getRandString(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function checkNumber(num) {
  if (num === undefined || num === null) {
    return null;
  }
  const numString = num.toString();
  if (numString.length <= 10) {
    return parseInt(numString);
  }
  return parseInt(numString.substr(0, 10));
}

function nSuccess(t){
  new Notify ({
    title: 'Info',
    text: t,
    status: 'success',
    autoclose: true,
    autotimeout: 5000
  });
}

function nInfo(t){
  new Notify ({
    title: 'Info',
    text: t,
    status: 'info',
    autoclose: true,
    autotimeout: 5000
  });
}

function nError(t){
  new Notify ({
    title: 'Info',
    text: t,
    status: 'error',
    autoclose: true,
    autotimeout: 5000
  });
}

function countdownFromEpoch(epochTimestamp, targetElement) {
  if (epochTimestamp === "0") {
    targetElement.textContent = "00:00:00:00";
    return;
  }
  const targetDate = new Date(epochTimestamp * 1000).getTime();
  const now = new Date().getTime();
  const interval = setInterval(() => {
    let delta = Math.floor((targetDate - Date.now()) / 1000);
    if (delta <= 0) {
      targetElement.textContent = "00:00:00:00";
      clearInterval(interval);
    } else {
      const days = Math.floor(delta / 86400);
      delta -= days * 86400;
      const hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      const minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      const seconds = delta % 60;
      const remainingTime = `${days < 10 ? `0${days}` : days}:${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      targetElement.textContent = remainingTime;
    }
  }, 1000);
}

function getDeadlineEpochTimestamp(minutes) {
  const now = new Date();
  const deadline = new Date(now.getTime() + minutes * 60000);
  return Math.floor(deadline.getTime() / 1000);
}

async function checkChains() {
    if(window.ethereum){
        if(account){
            const getChain = await web3.eth.getChainId();
            if (getChain != baseChainId) {
                try {
                  await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: paramNet,
                  });
                } 
                catch (switchError) {
                  if (switchError.code === 4902) {
                    try {
                      await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: paramAdd,				
                      });
                    } 
                    catch (addError) {
                        console.log(addError);
                    }
                  }
                }
            }             
        }
    }     
}

// Function to get the network symbol based on network ID
function getNetworkSymbol(networkId) {
  switch (networkId) {
    case 1:
      return 'ETH'; // Ethereum Mainnet
    case 56:
      return 'BNB'; 
    case 42161:
        return 'ETH'; 
    case 97:
      return 'BNB'; 
    case 137:
        return 'MATIC';
    case 80001:
      return 'tMATIC'; 
    case 10:
        return 'ETH';
    case 25:
      return 'CRO'; 
    case 250:
        return 'FTM'; 
    case 8453:
          return 'ETH';
    default:
      return 'UNKNOWN'; // Unknown network
  }
}

async function generateNumberArray(start, end) {
  var numbers = [];
  for (var i = start; i <= end; i++) {
    var obj = { id: i };
    numbers.push(obj);
  }
  return numbers;
}

function checkLogo(img){
    if(img == null){
        return "img/question-mark.png";
    }
    return img;
}
