var gia = function(gia, $){
	
	gia.fullDisplay = true;
	var navShowing = false,
		allowFullScreenElements = true,
		allowSmoothResize = true,
		currentLightbox = undefined;
		
	gia.init = function(){

		setDisplayParams();
		$(window).resize(setDisplayParams)
		$('head link').each(function(){

			
			if( $(this).attr('id') != 'css-gia' && $(this).attr('type') == 'text/css'){
				$(this).remove()
			}
		})
		// var divs = [
		// 	'header',
		// 	'article-header',
		// 	'content-info',
		// 	'wide-comment-wrapper',
		// 	'promo',
		// 	'footer-container'
		// ]
		// 
		// for(var i = 0; i < divs.length; i++){
		// 	$('#' + divs[i]).css('display', 'none')
		// }
		

					
	}
	
	gia.wranglePageContent = function(){
		$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
		//$('body').prepend( $('#gia-content')  )
		//$('#wrapper').remove()
		$('#dialogue').remove()
		
		$('#content-actions').appendTo('#social-tools');
		$('.google-plus').remove();
		$('.linked-in').remove();
		$('.email').remove();
		
		$('#header-more-content .nav-content').clone().appendTo('#footer-links');
	}
	
	gia.initPageContent = function(){
			setDisplayParams();
			
			$('#mobile-nav-btn').click(function(){
				if( $('#header-more-content').css('display') == 'none'){
					$('#header-more-content').show();
					$('#social-tools').show();
			
				} else {
					$('#header-more-content').hide();
					$('#social-tools').hide();
				
				}
			})
			
			$(window).resize(function(){
				setFullScreenSwitch();
			})
			setFullScreenSwitch();
			
			if($.browser.mozilla){
				allowSmoothResize = false;
			}
			
			$('#gia-lightbox').click(function(){
				if( currentLightbox != undefined){
					currentLightbox.hidePlayer();
				}
			})
		
	}
	
	
	var setFullScreenSwitch = function(){

		if( $(window).width()> 768){
			allowFullScreenElements = true;
		} else {
			allowFullScreenElements = false;
		}
	}
	
	
		
	gia.initVideo = function(videoObj,container, videoelement, resizeable){
			var vp = {
				'videoObj': videoObj,
				'container': container,
				'videoelement': videoelement,
				'resizeable': resizeable,
				'resized': false,
				'origW': 940
			}

			vp.player = jwplayer(videoelement).setup({
				'flashplayer': 'https://static.guim.co.uk/flash/jwplayer/jwplayer-5.10.swf',
		        'file': videoObj['file'],
				 image: videoObj['image'],
				"controlbar.idlehide": true,
				events: {
					onBeforePlay: function(){
						
						if(allowFullScreenElements){
							$('.' + vp.videoelement + '-content').hide();
						} 
						
				
						if(vp.resizeable){
							if(!vp.resized && allowFullScreenElements){
								vp.resized = true;
								vp.moveToLightBox();
							}
						}
						
					},
					onReady: function(){
						jwplayer(videoelement).getPlugin("display").hide();
					},
					// onPause: function(){
					// 					$('.' + vp.videoelement + '-content').fadeIn(100);
					// 				},
					onComplete: function(){
						$('.' + vp.videoelement + '-content').fadeIn(100);
					}
				}
				
		    });
			
			vp.resizePlayer = function(){
				if(gia.fullDisplay){
					jwplayer(videoelement).getPlugin("display").hide();
				} else {
					jwplayer(videoelement).getPlugin("display").show();
				}
				
				
				var w = $('#' + vp.container).width()
				jwplayer(vp.videoelement).resize(w,w * 9/16);
			}

		
			$(window).resize(function(){
						vp.resizePlayer()

					})
					
			vp.resizePlayer()	
			$(window).ready(function(){
				vp.resizePlayer()	
				
				$('#' + vp.container + ' .video-play').click(function(){
					jwplayer(vp.videoelement).play();
				})
				
				$('#' + vp.container + ' .video-close-btn').click(function(){
					vp.hidePlayer();
				})
				
				
			})
			
			vp.hidePlayer = function(){
				jwplayer(vp.videoelement).stop();
				$('#' + vp.container).width(vp.origW)
				vp.resizePlayer()
				
				$('#gia-lightbox').fadeOut(500)
				
				$('#' + vp.container + ' .video-close-btn').hide()
				
				vp.resized = false;
				$('.' + vp.videoelement + '-content').show();
			}
			
			vp.moveToLightBox = function(){
					currentLightbox = vp;
					vp.origW = $('#' + vp.container).width()
					$('#' + this.container).css('z-index', 11)
					
					if( allowSmoothResize){
		
						vp.giavptimer = setInterval(vp.resizePlayer,1)
						 $('#' + vp.container).animate({
								width: 940,
							}, {
								duration: 1000,
						
								complete: function() {
										clearInterval(vp.giavptimer)
								}
						});
						
						
					} else {
						$('#' + vp.container).width(940)
						vp.resizePlayer()
					}

					
					$('#' + vp.container + ' .video-close-btn').show()
					$('#gia-lightbox').fadeIn(500)
				
			}			
		}

	
	var setDisplayParams = function(){
		if($(window).width() > 700){
			gia.fullDisplay = true;
		} else {
			gia.fullDisplay = false;
		}
	}
	

	
	return gia;
	
}(gia || {}, jQuery);

jQuery(document).ready(function(){
	gia.wranglePageContent();
	gia.initPageContent();
})

gia.init();
