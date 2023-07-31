<!DOCTYPE html>
<html lang="en">
<?php 
    include 'config.php';
?>
<head>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Token Locker</title>
    <meta name="description" content="Simple token locker free to use">
    <meta name="keywords" content="token lock, dapps, token erc20">
    <meta name="author" content="kevin">  
    
    <link rel="icon" href="<?php print $favicons; ?>" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="stylesheet" href="css/all.min.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/ionicons.min.css">
    <link rel="stylesheet" href="css/jquery.mcustomscrollbar.min.css">
    <link rel="stylesheet" href="css/doogle.css">
	<link rel='stylesheet' href='css/magnific-popup.css'>
	<link rel='stylesheet' href='css/modal_popup.css?v=<?php print rand(); ?>'>
    <link rel="stylesheet" href="css/style.css?v=<?php print rand(); ?>">
    <link rel="stylesheet" href="css/my.css?v=<?php print rand(); ?>">
    <link rel="stylesheet" type="text/css" href="css/notify.css">
    
	<!--  web3 lib -->
	<script type="text/javascript" src="web3/web3.min.js"></script>
	<script type="text/javascript" src="web3/index.js"></script>
	<script type="text/javascript" src="web3/index.min.js"></script>
</head>

<style>
.stakeBg {<?php print $stakeBg; ?>}
.wrapedStat {<?php print $refBg; ?>}
.unlocks a {<?php print $btnUnlockBg; ?>}
.base_btn {<?php print $baseBtn; ?>}
.grid-item {<?php print $statBg; ?>}
.refText {<?php print $textRefBg; ?>}
</style>

<body id="dark" style="<?php print $mainBg ?>">
    <div class="preloader">
      <div class="loading">
        <img src="<?php print $favicons; ?>" width="100">
      </div>
    </div>  
    <header class="dark-bb">
    <nav class="navbar navbar-expand-lg" style="<?php print $headerBg ?>">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#headerMenu" aria-controls="headerMenu" aria-expanded="false" aria-label="Toggle navigation">
        <i><img src="img/menu.png" width="36"></i>
        </button>
        <span class="netsNow" id="runningNet"></span>
        <div class="collapse navbar-collapse newFont" id="headerMenu">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/" role="button">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/create" role="button">Create Lock</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/claim" role="button">Claim Token</a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link ws account"></a>
                </li>                
                <li class="nav-item">
                    <span class="nonSelect nav-link ws btn_connect">Connect</span>
                    <span class="nonSelect nav-link ws btn_logout">Disconnect</span>
                </li>
            </ul>
        </div>
    </nav>
    </header>
  
    <div class="pt70 pb40">
        <center>
            <span class="base_btn nonSelect usercoin"></span>
        </center>
        <br>
        <div class="container">
            
            <div class="wrapedStat gradient-border">
                <div class="row">
                    <div class="col-md-12 newFont">
                        <div class="grid-container">
                            
                            <div class="grid-item">
                                <span>Total Locked</span>
                                <br>
                                <b id="tlock">-</b>
                            </div>
                            <div class="grid-item">
                                <span>Total User</span>
                                <br>
                                <b id="tuser">-</b>
                            </div>    
                            <div class="grid-item">
                                <span>$Total Value Locked</span>
                                <br>
                                <b id="tvl">-</b>
                            </div>

                        </div>
                    </div>
                </div> 
            </div> 
            
            <div class="wrapNFT">
                <center>
                    <span class="base_btn nonSelect" id="loadMore">Load More</span> 
                </center>
                <br>
                <div id="scrollable">
                    <div id="noData"></div>
                    <div class="nft-row" id="locklist"></div>
                </div>
            </div>             
        </div>
    </div>

    <div class="footer-are">
        <div class="container">
            <div class="extras row">
                <div class="col-md-12">
                    <div class="bodar"></div>
                </div>
                <div class="col-md-6">
                    <div class="footer-text">
                        <p>Copyright © <?php echo date("Y"); ?> Locker Dapps v1.0.0</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="footer-menu">
                        <ul>
                            <li><a href="<?php print $telegram ?>"><i class="fab fa-telegram-plane"></i></a></li>
                            <li><a href="<?php print $twitter ?>"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="<?php print $github ?>"><i class="fab fa-medium"></i></a></li>
                            <li><a href="<?php print $reddit ?>"><i class="fab fa-reddit"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

	<!-- Modal -->
	<div id="Error" class="zoom-anim-dialog mfp-hide modal textBlack">
		<button class="modal__close" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path></svg></button>
		<span class="modal__text" id="val_err"></span>
	</div>
	
	<a id="btntop"><img src="img/arrowupw.png"></a>
  
    <script src="js/jquery-3.4.1.min.js"></script>
    <script src="js/jquery.magnific-popup.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
	<script src="js/notify.js"></script>    
    <script src="js/axios.min.js"></script>
    
    <script src="web3/abi.js?v=<?php print rand(); ?>"></script>
    <script src="setup.js?v=<?php print rand(); ?>"></script>
    
    <script src="web3/helper.js?v=<?php print rand(); ?>"></script>
    <script src="web3/lock.js?v=<?php print rand(); ?>"></script>
</body>
</html>