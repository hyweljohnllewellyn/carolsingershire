<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width">
		<title></title>
		
		<!-- 
		MP3-jPlayer
		http://mp3-jplayer.com
		--->
		
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/popout/jquery.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/popout/core.min.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/popout/widget.min.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/popout/mouse.min.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/popout/slider.min.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/wp-backwards-compat/jquery.ui.touch-punch.min.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/jquery.jplayer.min.2.7.1.js'></script>
		<script type='text/javascript' src='https://www.carolsingershire.uk/wp-content/plugins/mp3-jplayer/js/mp3-jplayer-2.7.js'></script>
				
		<script type='text/javascript'>
		function loadcss(filename) {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
			if (typeof fileref !== "undefined") { 
				document.getElementsByTagName("head")[0].appendChild(fileref); 
			}
		};
		
		function getParentInfo ( j ) {
			jQuery.getScript( window.opener.MP3_JPLAYER.extJS[ j ].loc, function(){} );
		};
	
		if( window.opener && !window.opener.closed && window.opener.MP3_JPLAYER && window.opener.MP3_JPLAYER.launched_ID !== null ) {
			
			if ( typeof window.opener.MP3_JPLAYER.vars.stylesheet_url !== 'undefined' ) {
				loadcss( window.opener.MP3_JPLAYER.vars.stylesheet_url );			
			}
			
			MP3_JPLAYER.vars.play_f = false; // always set false!
			MP3_JPLAYER.plugin_path = window.opener.MP3_JPLAYER.plugin_path;
			MP3_JPLAYER.launched_ID = window.opener.MP3_JPLAYER.launched_ID;
			MP3_JPLAYER.vars.dload_text = window.opener.MP3_JPLAYER.vars.dload_text;
			MP3_JPLAYER.vars.force_dload = window.opener.MP3_JPLAYER.vars.force_dload;
			MP3_JPLAYER.vars.dl_remote_path = window.opener.MP3_JPLAYER.vars.dl_remote_path;
			MP3_JPLAYER.pickup = window.opener.MP3_JPLAYER.pickup;
						
			var pl_info_wo = window.opener.MP3_JPLAYER.pl_info; //copy
			var auto_play = ( typeof window.opener.MP3_JPLAYER.was_playing !== 'undefined' && window.opener.MP3_JPLAYER.was_playing === true ) ? true : pl_info_wo[MP3_JPLAYER.launched_ID].autoplay;
			window.opener.MP3_JPLAYER.was_playing = false;
			
			MP3_JPLAYER.pl_info = [{ 	
				list:		pl_info_wo[MP3_JPLAYER.launched_ID].list, 
				tr:			pl_info_wo[MP3_JPLAYER.launched_ID].tr,
				type:		'MI', 
				lstate:		pl_info_wo[MP3_JPLAYER.launched_ID].lstate, 
				loop:		pl_info_wo[MP3_JPLAYER.launched_ID].loop, 
				play_txt:	pl_info_wo[MP3_JPLAYER.launched_ID].play_txt, 
				pause_txt:	pl_info_wo[MP3_JPLAYER.launched_ID].pause_txt, 
				pp_title:	pl_info_wo[MP3_JPLAYER.launched_ID].pp_title, 
				autoplay:	auto_play,
				download:	pl_info_wo[MP3_JPLAYER.launched_ID].download, 
				vol:		pl_info_wo[MP3_JPLAYER.launched_ID].vol,
				height:		pl_info_wo[MP3_JPLAYER.launched_ID].height,
				cssclass:	pl_info_wo[MP3_JPLAYER.launched_ID].cssclass,
				popout_css:	pl_info_wo[MP3_JPLAYER.launched_ID].popout_css
			}];
			
			if ( ! MP3_JPLAYER.pickup ) {
				MP3_JPLAYER.lastformats = window.opener.MP3_JPLAYER.popoutformats;
			}
			
			MP3_JPLAYER.vars.pp_playerheight = window.opener.MP3_JPLAYER.vars.pp_playerheight;
			MP3_JPLAYER.vars.pp_windowheight = window.opener.MP3_JPLAYER.vars.pp_windowheight;
			
			MP3_JPLAYER.extStyles = window.opener.MP3_JPLAYER.extStyles;
			MP3_JPLAYER.skinJS =  window.opener.MP3_JPLAYER.skinJS;
			
			MP3_JPLAYER.exThresh = window.opener.MP3_JPLAYER.exThresh;
			MP3_JPLAYER.showErrors = window.opener.MP3_JPLAYER.showErrors;
			MP3_JPLAYER.hasListMeta = window.opener.MP3_JPLAYER.hasListMeta;
			
			if ( typeof window.opener.statsMJPajax !== 'undefined' ) {
				var wos = window.opener.statsMJPajax;
				var statsMJPajax = {};
				statsMJPajax.WPajaxurl = wos.WPajaxurl;
				statsMJPajax.page = ( typeof wos.page !== 'undefined' ) ? wos.page : '';
				statsMJPajax.vID = ( typeof wos.vID !== 'undefined' ) ? wos.vID : '';
				statsMJPajax.rfr = ( typeof wos.rfr !== 'undefined' ) ? wos.rfr : '';
			}
		}

		jQuery(document).ready(function () {
		
			if( window.opener && !window.opener.closed && window.opener.MP3_JPLAYER && window.opener.MP3_JPLAYER.launched_ID !== null ) { 
				var j;
				var l = window.opener.MP3_JPLAYER.extJS.length;
				if ( l > 0 ) {
					for ( j = 0; j < l; j +=1 ) {
						getParentInfo( j );
					}
				}
				if ( MP3_JPLAYER.skinJS !== '' ) {
					jQuery.getScript( MP3_JPLAYER.skinJS, function () {
						MJP_SKINS_INIT();
						MP3_JPLAYER.init();
					});
				} else {
					MP3_JPLAYER.init();
				}
				
			} else {
				jQuery("body").empty();
				jQuery("body").css("background", '#222');
				jQuery("*").css("color", '#ddd');
				jQuery("body").append("<h4 style='margin-left:10px; font:normal normal 700 14px arial,sans-serif;'>Please launch a playlist from the site to use me, I've been refreshed and can't find my parent window.</h4>");
				return; 
			}
			
		});
		</script>

		<style type="text/css"> 
			body { 
				padding:5px 4px 0px 4px; 
				margin:0px; 
				font-family:arial, sans-serif;
			}
			
			@-ms-viewport {
				width: device-width;
			}

			@viewport {
				width: device-width;
			}
		</style>

	</head>
	<body>
				
		<div class="wrap-mjp" style="position:relative; padding:0; margin:0px auto 0px auto; width:100%;">
			<div style="display:none;" class="Eabove-mjp"></div>
			<div class="subwrap-MI">
			
				<div class="jp-innerwrap">
					<div class="innerx"></div>
					<div class="innerleft"></div>
					<div class="innerright"></div>
					<div class="innertab"></div>
					
					<div class="interface-mjp">
						<div class="MI-image" id="MI_image_0"></div>
						<div id="T_mp3j_0" class="player-track-title" style="padding-left:16px;"></div>
						<div class="bars_holder">
							<div class="loadMI_mp3j" id="load_mp3j_0"></div>
							<div class="poscolMI_mp3j" id="poscol_mp3j_0"></div>
							<div class="posbarMI_mp3j" id="posbar_mp3j_0"></div>
						</div>
						<div id="P-Time-MI_0" class="jp-play-time"></div>
						<div id="T-Time-MI_0" class="jp-total-time"></div>
						<div id="statusMI_0" class="statusMI"></div>
						<div class="transport-MI"><div class="play-mjp" id="playpause_mp3j_0">Play</div><div class="stop-mjp" id="stop_mp3j_0">Stop</div><div class="next-mjp" id="Next_mp3j_0">Next&raquo;</div><div class="prev-mjp" id="Prev_mp3j_0">&laquo;Prev</div></div>
						<div class="buttons-wrap-mjp" id="buttons-wrap-mjp_0">
							<div class="playlist-toggle-MI" id="playlist-toggle_0"></div>						
							<div id="download_mp3j_0" class="dloadmp3-MI" style="visibility: visible;"></div>
						</div>
					</div>
					<div class="mjp-volwrap">
						<div class="MIsliderVolume" id="vol_mp3j_0"></div>
						<div class="innerExt1" id="innerExt1_0"></div>
						<div class="innerExt2" id="innerExt2_0"></div>
					</div>
				</div>
				
				<div style="display:none;" class="Ebetween-mjp"></div>
				<div class="listwrap_mp3j" id="L_mp3j_0">
					<div class="wrapper-mjp">
						<div class="playlist-colour"></div>
						<div class="wrapper-mjp">
							<ul class="ul-mjp" id="UL_mp3j_0"><li class="li-mjp"></li></ul>
						</div>
					</div>
				</div>
				
			</div>
			<div id="mp3j_finfo_0" class="mp3j-finfo" style="display:none;">
				<div class="mp3j-finfo-sleeve">
					<div id="mp3j_finfo_gif_0" class="mp3j-finfo-gif"></div>
					<div id="mp3j_finfo_txt_0" class="mp3j-finfo-txt"></div>
					<div class="mp3j-finfo-close" id="mp3j_finfo_close_0">X</div>
				</div>
			</div>
			<div id="mp3j_dlf_0" class="mp3j-dlframe" style="display:none;"></div>
			<div class="mp3j-nosolution" id="mp3j_nosolution_0" style="display:none;"></div>
			<div style="display:none;" class="Ebelow-mjp"></div>
		</div>

		<script type="text/javascript">
		if( window.opener && ! window.opener.closed ) {				
			
			if ( MP3_JPLAYER.pl_info[0].height !== false ) {
				jQuery(".interface-mjp").css({ "height": MP3_JPLAYER.pl_info[0].height+"px" });
			}
			if ( !MP3_JPLAYER.pl_info[0].download ) { 
				jQuery("div.dloadmp3-MI").hide(); 
			}
			if ( MP3_JPLAYER.pl_info[0].list.length < 2 ) {
				jQuery("#Prev_mp3j_0").hide();
				jQuery("#Next_mp3j_0").hide();
				jQuery("#playlist-toggle_0").hide(); 
			}
			
			if ( MP3_JPLAYER.pl_info[0].lstate ) {
				jQuery("#playlist-toggle_0").append("HIDE PLAYLIST");
			} else {
				jQuery("#playlist-toggle_0").append("SHOW PLAYLIST");
			}
			
			jQuery(".wrap-mjp").addClass(MP3_JPLAYER.pl_info[0].cssclass);
			
			if ( MP3_JPLAYER.pl_info[0].popout_css.enabled === true ) {
				var PPcss =  MP3_JPLAYER.pl_info[0].popout_css;
				
				jQuery("body").css( "background" , PPcss.colours[0] + " url('" + PPcss.colours[11] + "')");
				jQuery(".innertab").css({ "background-color" : PPcss.colours[1] });
				
				jQuery(".interface-mjp").css({ "color": PPcss.colours[7] });
				jQuery(".interface-mjp").addClass( PPcss.classes.interface );
				jQuery(".interface-mjp").css( PPcss.cssInterface );
				
				jQuery(".player-track-title").css( PPcss.cssTitle );
				jQuery(".player-track-title").addClass( PPcss.classes.title );
				
				jQuery(".MI-image").css( PPcss.cssImage );
				jQuery(".MI-image").addClass( PPcss.classes.image );
				
				jQuery(".ul-mjp").addClass( PPcss.classes.ul );
				jQuery(".playlist-colour").css({ "background-color" : PPcss.colours[2] });
				
				jQuery(".loadMI_mp3j").css({ "background-color" : PPcss.colours[3] });
				jQuery(".poscolMI_mp3j").css({ "background-color" : PPcss.colours[4] });		
				jQuery(".poscolMI_mp3j").addClass( PPcss.classes.poscol );
				
				jQuery('<style type="text/css"> a.a-mjp { color:' + PPcss.colours[8] + '; font-size:' + PPcss.cssFontSize.list + '; } </style>').appendTo('head');
				jQuery('<style type="text/css"> a.a-mjp:hover { color:' + PPcss.colours[9] + '; background-color:' + PPcss.colours[5] + '; } </style>').appendTo('head');
				jQuery('<style type="text/css"> a.mp3j_A_current { color:' + PPcss.colours[10] + '; background-color:' + PPcss.colours[6] + '; } </style>').appendTo('head');
				jQuery('<style type="text/css"> div.transport-MI div:hover { background-color:' + PPcss.colours[10] + '; } </style>').appendTo('head');
				jQuery('<style type="text/css"> .player-track-title { font-size:' + PPcss.cssFontSize.title + '; } </style>').appendTo('head');
				jQuery('<style type="text/css"> .player-track-title div { font-size:' + PPcss.cssFontSize.caption + '; } </style>').appendTo('head');
				
				jQuery("div.transport-MI div").css({ "color": PPcss.colours[10] });
				jQuery("div.transport-MI div").mouseover(function () {
					 jQuery(this).css( "color" , PPcss.colours[10] );
				});
				jQuery("div.transport-MI div").mouseout(function () {
					 jQuery(this).css("color", PPcss.colours[10] );
				});
			}
			
			jQuery("title").text(MP3_JPLAYER.pl_info[0].pp_title);
		}
		</script>

	</body>
</html>