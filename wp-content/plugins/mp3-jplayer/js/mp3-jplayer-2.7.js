/* 
	MP3-jPlayer
	Version 2.7.2
   	http://mp3-jplayer.com
*/
var MP3_JPLAYER = {
	
	tID:			'',
	state:			'',	
	pl_info:		[],	
	load_pc:		0,	
	played_t:		0,
	total_t:		0,
	pp_abs:			0,
	dl_dialogs:		[],
	timeoutIDs:		[],
	intervalIDs:	[],
	jperrorIDs:		[],
	dl_domain:		'',
	jp_audio: 		{},
	jp_seekable:	0,
	sliding:		false,
	jpID:			'#mp3_jplayer_1_8',
	plugin_path:	'',
	lastformats:	'mp3',
	popoutformats:	'mp3',
	allowRanges:	true,
	extCalls:		{ 
		init:[],
		change_pre:			[],
		change_begin:		[],
		change_end:			[],
		change_post:		[],
		button_playpause:	[],
		button_popout:		[],
		update_time:		[],
		write_titles:		[],
		write_download:		[],
		download:			[],
		download_dialog:	[],
		error:				[]
	},
	extStyles:		[],
	extJS:			[],
	skinJS:			'',
	mutes:			[],
	preSlideVol:	false,
	exData:			false,
	exThresh:		2,
	showErrors:		false,
	factors:		{ vol: 1 },
	hasListMeta:	true,
	pickup:			true,
	pRefs:			{ id: false, tr: false, pt: 0, vol: 100 },
	
	vars: {
		play_f:				true,
		stylesheet_url:		'',
		dload_text:			'',
		force_dload:		true,
		message_interval:	'<h2>Download Audio</h2><p style="margin-top:34px !important;">Your download should start in a second!</p>',
		message_ok:			'',
		message_indark:		'<h2>Download Audio</h2><p>Your download should start in a second!</p>',
		message_promtlink:	'<h2>Download Audio</h2><p>Link to the file:</p><h3><a target="_blank" href="#1">#2</a></h3><p>Depending on your browser settings, you may need to right click the link to save it.</p>',
		message_fail:		'<h2>Download Failed</h2><p>Sorry, something went wrong!</p>',
		message_timeout:	'<h2>Download<br />Unavailable</h2><p>please try again later!</p>',
		message_nosolution:		 'Unable to play this item, please update your browser or try another.',
		message_nosolution_mpeg: 'To play this item please update your browser or get the <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.',
		message_bad_url:	'Can\'t locate audio.',
		dl_remote_path:		''
	},

	eID: {
		play:		'#playpause_mp3j_',
		playW:		'#playpause_wrap_mp3j_',
		stp: 		'#stop_mp3j_',
		prev: 		'#Prev_mp3j_',
		next: 		'#Next_mp3j_',
		vol: 		'#vol_mp3j_',
		loader:		'#load_mp3j_',
		pos: 		'#posbar_mp3j_',
		poscol: 	'#poscol_mp3j_',
		title: 		'#T_mp3j_',
		caption:	'#C_mp3j_',
		pT: 		'#P-Time-MI_',
		tT: 		'#T-Time-MI_',
		dload: 		'#download_mp3j_',
		plwrap: 	'#L_mp3j_',
		ul:			'#UL_mp3j_',
		li:			'li_mp3j_', //No hash!
		a:			'mp3j_A_', //No hash!
		indiM:		'#statusMI_',
		toglist:	'#playlist-toggle_',
		lPP:		'#lpp_mp3j_',
		pplink:		'#mp3j_popout_',
		img:		'#MI_image_'
	},
	
	runExternals: function ( hookname, data ) {
		var l = this.extCalls[ hookname ].length;
		for ( var x = 0; x < l; x += 1 ) {
			( this.extCalls[ hookname ][ x ] )( data );
		}
	},
	
	findFile: function ( file ) {
		var i,
			p, 
			list,
			l,			
			j,
			id = false,
			tr = false;
			
		//if ( typeof MP3jPLAYERS  !== "undefined" ) {
			//for ( i in MP3jPLAYERS ) {
				//p = MP3jPLAYERS[ i ];
		if ( typeof this.pl_info  !== "undefined" ) {
			for ( i in this.pl_info ) {
				p = this.pl_info[ i ];
				list = p.list;
				if ( p.type === 'MI' ) {
					l = list.length;
					for ( j = 0; j < l; j += 1 ) { 
						if ( file === list[ j ].mp3 ) {
							id = i;
							tr = j;
							break;
						}						
					}
				} else if ( p.type === 'single' ) {
					if ( file === list[ p.tr ].mp3 ) {
						id = i;
						tr = p.tr;
						break;
					}
				}
				if ( id !== false ) {
					break;
				}
			}
		}
		return { id: id, tr: tr };
	},
	
	getFormats: function ( player ) {
		return player.list[ player.tr ].formats[0] + ( ( typeof player.list[ player.tr ].formats[1] !== 'undefined' ) ? ',' + player.list[ player.tr ].formats[1] : '' );
	},
	
	initialise_jp: function ( supplied, track, vol ) { 
		var that = this;
		jQuery(this.jpID).jPlayer({
			ready: function () {
				if ( track === true ) { 
					var dinfo = that.deviceInfo();
					if ( dinfo.device === 'Desk/Laptop' ) {
						if ( that.pickup ) {
							if ( that.pRefs.id === false ) {
								that.startup();
							} else {
								var puVol = parseFloat( that.pRefs.vol );
								that.pl_info[ that.pRefs.id ].vol = puVol;
								jQuery( that.eID.vol + that.pRefs.id ).slider({ value: puVol });  
								
								that.E_change_track( that.pRefs.id, that.pRefs.tr, parseFloat( that.pRefs.pt ) );
								that.write_cookie( 'mjp_pickup', '', -1 );
							}
						} else {
							that.startup();
						}
					} else { //just remove first autolay if there's any
						var j;
						for ( j in that.pl_info ) {
							if ( that.pl_info[j].autoplay ) {
								that.pl_info[j].autoplay = false;
								break;
							}
						}
					}
				} else {
					that.setAudio( track );
					that.playit();
					jQuery(that.jpID).jPlayer("volume", that.factors.vol * vol/100 ); //Set to player vol
					if ( track === false ) { //silence
						that.clearit();
					}
				}
			},
			swfPath: that.plugin_path + '/js/Jplayer271.swf',
			volume: 1,
			supplied: supplied,
			wmode: "window",
			solution:"html, flash",
			error: function( event ) {
				that.check_show_jperrors( event );
			},
			preload: "none"
		});
		jQuery(this.jpID).bind(jQuery.jPlayer.event.ended, function(event) {
			that.E_complete(that.tID);
		});	
		jQuery(this.jpID).bind(jQuery.jPlayer.event.timeupdate, function(event) {
			var lp = that.get_loaded(event);
			var ppA = event.jPlayer.status.currentPercentAbsolute;
			var pt = event.jPlayer.status.currentTime;
			var tt = event.jPlayer.status.duration;
			that.E_update(that.tID, lp, ppA, pt, tt);
		});
		jQuery(this.jpID).bind(jQuery.jPlayer.event.ready, function(event) {
			if(event.jPlayer.html.used && event.jPlayer.html.audio.available) {
				that.jp_audio = jQuery(that.jpID).data("jPlayer").htmlElement.audio;
			} else {
				that.jp_audio = 'flash';
			}
		});
		jQuery(this.jpID).bind(jQuery.jPlayer.event.progress, function(event) {
			var lp = that.get_loaded(event);
			var pt = event.jPlayer.status.currentTime;
			var tt = event.jPlayer.status.duration;
			that.E_loading( that.tID, lp, tt, pt );
		});
		
		that.lastformats = supplied;
	},	
	
	writePickupData: function () {
		if ( 'playing' === this.state ) {
			var p = this.pl_info[ this.tID ];
			var preppedurl = p.list[ p.tr ].mp3.replace( /;/, ':::' );
			var valuestring = this.played_t + '?' + p.vol + '?' + preppedurl;
			this.write_cookie( 'mjp_pickup', valuestring, 0.0001 );
		} else {
			this.write_cookie( 'mjp_pickup', '', -1 );
		}
	},
	
	getPlayerRefs: function () {
		var playerRefs = { id: false, tr: false, pt: false, vol:false };
		var cvals = this.read_cookie( 'mjp_pickup' );
		if ( cvals !== false ) {
			var cparts = cvals.split('?');
			var depreppedurl = cparts[2].replace( /:::/, ';' );
			playerRefs = ( typeof cparts[2] !== 'undefined' ) ? this.findFile( depreppedurl ) : playerRefs;
			playerRefs.pt = ( typeof cparts[0] !== 'undefined' ) ? cparts[0] : 0;
			playerRefs.vol = ( typeof cparts[1] !== 'undefined' ) ? cparts[1] : 100;
		}
		return playerRefs;					
	},
	
	init: function () {
		var plpath;
		plpath = this.plugin_path.split('/');
		this.dl_domain = plpath[2].replace(/^www./i, "");
		this.unwrap();
		if ( this.pickup ) {
			jQuery('a').on( 'click', function ( e ) {
				MP3_JPLAYER.writePickupData();
			});
			var prefs = this.getPlayerRefs();
			if ( prefs.id !== false ) {
				var p = this.pl_info[ prefs.id ];
				this.lastformats = this.getFormats( p );
				this.pRefs.id = prefs.id;
				this.pRefs.tr = prefs.tr;
				this.pRefs.pt = prefs.pt;
				this.pRefs.vol = prefs.vol;
			}
		}
		
		this.write_controls();
		this.add_jpconstruct_div();
		this.runExternals( 'init', {} );
		this.addExtStyles();
		this.initialise_jp( this.lastformats, true, 1 );		
	},
	
	addExtStyles: function () {
		var j;
		var l = this.extStyles.length;
		for ( j = 0; j < l; j += 1 ) {
			jQuery( '<style type="text/css">' + this.extStyles[ j ] + '</style>' ).appendTo( 'head' );
		}
	},
		
	destroy_jp: function () {
		jQuery(this.jpID).unbind();
		jQuery(this.jpID).jPlayer("destroy");
		jQuery(this.jpID).empty();
	},
	
	check_show_jperrors: function ( event ) {
		if ( this.tID !== '' && ! this.jperrorIDs[ this.tID ] ) {
			if ( this.showErrors === true ) {
				this.show_nosolution( this.tID, event.jPlayer.error.type );
			}
			this.jperrorIDs[ this.tID ] = event.jPlayer.error.type;
		}
	},
	
	show_nosolution: function ( j, errortype ) {
		var p = this.pl_info[j];
		var track = p.tr;
		var formats = p.list[track].formats;
		var message = '';
		
		if ( errortype === 'e_no_solution' || errortype === 'e_no_support' ) {
			message = this.vars.message_nosolution;
			if ( formats === 'mp3' || formats === 'm4a' ) {
				message = this.vars.message_nosolution_mpeg;
			}
		} else if ( errortype === 'e_url' ) {
			message = this.vars.message_bad_url;
		}
		jQuery('#mp3j_nosolution_' + j).empty().append(message).fadeIn(200);
		
		if ( this.exData !== false ) {
			this.exData.jperror = errortype;
			this.runExternals( 'change_post', this.exData );
			this.exData = false;
		}
	},
	
	add_jpconstruct_div: function () {
		var html = '<div id="mp3_jplayer_items" style="position:relative; overflow:hidden; margin:0; padding:0; border:0; width:0px; height:0px;"><div id="mp3_jplayer_1_8" style="left:-999em;"></div></div>';
		jQuery('body').prepend( html );
	},
		
	get_loaded: function (event) {
		var lp;
		if ( typeof this.jp_audio.buffered === "object" ) {
			if( this.jp_audio.buffered.length > 0 && this.jp_audio.duration > 0 ) {
					lp = 100 * this.jp_audio.buffered.end(this.jp_audio.buffered.length-1) / this.jp_audio.duration;
			} else {
				lp = 0; 
			}
		} else {
			lp = event.jPlayer.status.seekPercent;
		}
		this.jp_seekable = event.jPlayer.status.seekPercent; //use this for slider calcs for both html/flash solution 
		this.load_pc = lp;
		return lp;
	},
	
	Tformat: function ( sec ) { 
		var t = sec,
			s = Math.floor((t)%60),
			m = Math.floor((t/60)%60),
			h = Math.floor(t/3600);
		return ((h > 0) ? h+':' : '') + ((m > 9) ? m : '0'+m) + ':' + ((s > 9) ? s : '0'+s);
	},

	E_loading: function ( j, lp, tt, pt ) {
		if (j !== '') {		
			jQuery(this.eID.loader + j).css( "width", lp + '%' );
			if (this.pl_info[j].type === 'MI') {
				if (tt > 0 && this.played_t > 0) { 
					jQuery(this.eID.tT + j).text(this.Tformat(tt)); 
				}
			}
			if ( this.jp_audio !== 'flash' && lp < 100 ) {
				if ( pt === this.played_t && this.state === 'playing' && pt > 0 && !this.sliding ) {
					if (this.pl_info[j].type === 'MI') {
						jQuery(this.eID.indiM + j).empty().append('<span class="mp3-finding"></span><span class="mp3-tint"></span><span class="mjp-buffering">Buffering</span>');
					}
					if (this.pl_info[j].type === 'single' ) {
						jQuery(this.eID.indiM + j).empty().append('<span class="Smp3-finding"></span><span class="mp3-gtint"></span> ' + this.Tformat(pt));
					}
				}
				this.played_t = pt;
				this.total_t = tt;
			}
		}
	},
	
	E_update: function (j, lp, ppA, pt, tt) {
		if (j !== '') {		
			jQuery(this.eID.loader + j).css( "width", lp + '%' );
			jQuery(this.eID.poscol + j).css( "width", ppA + '%' );
			if ( jQuery(this.eID.pos + j + ' div.ui-widget-header').length > 0 ) {
				jQuery(this.eID.pos + j).slider('option', 'value', 10*ppA);
			}
			if (pt > 0) { 
				jQuery(this.eID.pos + j).css( 'visibility', 'visible' ); 
			}
			if (this.pl_info[j].type === 'MI') {
				jQuery(this.eID.pT + j).text(this.Tformat(pt));
			}
			if ('playing' === this.state) {
				if ('MI' === this.pl_info[j].type) {
					if (tt > 0 && this.played_t === pt && lp < 99 && !this.sliding ) {
						jQuery(this.eID.indiM + j).empty().append('<span class="mp3-finding"></span><span class="mp3-tint"></span><span class="mjp-buffering">Buffering</span>');
						jQuery(this.eID.tT + j).text(this.Tformat(tt));
					} else if (pt > 0) {
						jQuery(this.eID.indiM + j).empty().append('<span class="mjp-playing">Playing</span>');
						jQuery(this.eID.tT + j).text(this.Tformat(tt));
					}
				}
				if ('single' === this.pl_info[j].type){
					if (pt > 0 ) {
						if (this.played_t === pt && lp < 99 && !this.sliding ) {
							jQuery(this.eID.indiM + j).empty().append('<span class="Smp3-finding"></span><span class="mp3-gtint"></span> ' + this.Tformat(pt));
						} else {
							jQuery(this.eID.indiM + j).empty().append('<span class="Smp3-tint tintmarg"></span> ' + this.Tformat(pt));
						}
					}
				}
			}
			this.runExternals( 'update_time', { pt: pt, id: j } );
			if ( pt >= this.exThresh && this.exData !== false ) { 
				this.runExternals( 'change_post', this.exData );
				this.exData = false;
			}	
			this.played_t = pt;
			this.total_t = tt;
			this.pp_abs = ppA;
		}
	},
	
	E_complete: function (j) {
		var p = this.pl_info[j];
		if ('MI' === p.type) {
			if (p.loop || p.tr+1 < p.list.length) {
				this.E_change_track(j, 'next');
			} else {
				this.E_dblstop(j);
				this.startup();
			}
		}
		if ('single' === p.type) {
			if (p.loop) {
				this.E_change_track(j, 'next');
			} else {
				this.E_stop(j);
				this.startup();
			}
		}
	},
	
	write_controls: function () {
		var j;
		for ( j in this.pl_info ) {
			this.setup_a_player(j);
			this.mutes[j] = false;
		}
	},
	
	startup: function () {
		var j;
		for ( j in this.pl_info ) {
			if ( this.pl_info[j].autoplay && (this.pl_info[j].type === 'single' || this.pl_info[j].type === 'MI') ) {
				this.pl_info[j].autoplay = false;
				this.E_change_track(j, this.pl_info[j].tr);
				return;
			}
		}
	},
	
	setup_a_player: function (j) {
		var i, li, sel, that = this, p = this.pl_info[j];
		
		//PLAYLISTERS and SINGLES
		if ('MI' === p.type || 'single' === p.type) { 
			jQuery(this.eID.vol + j).slider({ 
				value : p.vol,
				max: 100,
				range: 'min',
				start: function ( event, ui ) {
					that.preSlideVol = p.vol;
				},
				stop: function ( event, ui ) {
					that.preSlideVol = false;
				},
				slide: function (event, ui) {
					if (j === that.tID) {
						jQuery(that.jpID).jPlayer("volume", that.factors.vol * ui.value/100);
					}
					if ( ui.value === 0 ) {
						jQuery('#innerExt1_' + j).addClass('vol-muted');
						that.mutes[ j ] = that.preSlideVol;
					} else {
						jQuery('#innerExt1_' + j).removeClass('vol-muted');
						that.mutes[ j ] = false;
					}
					p.vol = ui.value;
				}
			});
			
			jQuery(this.eID.vol + j).click( function ( e ) {
				e.stopPropagation();
			});
			
			sel = ('MI' === p.type) ? this.eID.play : this.eID.playW;
			jQuery(sel + j).click(function () { //play-pause click
				that.E_change_track(j, p.tr);
				jQuery(this).blur();
			});
			jQuery(sel + j).dblclick(function () { //play-pause dbl click
				if (that.state !== "playing") {
					that.E_change_track(j, p.tr);
				}
				jQuery(this).blur();
			});
				
			this.titles(j, p.tr);
		}
		
		//PLAYLISTERS
		if ('MI' === p.type) {
			jQuery(this.eID.pT + j).text('00:00');
			jQuery(this.eID.indiM + j).empty().append('<span class="mjp-ready">Ready</span>');
			jQuery(this.eID.stp + j).click(function () {
				that.E_stop(j);
			});
			jQuery(this.eID.stp + j).dblclick(function () {
				that.E_dblstop(j);
			});
			
			jQuery(this.eID.plwrap + j).hide();
			if (p.list.length > 1) {
				jQuery(this.eID.next + j).click(function () {
					that.E_change_track(j, 'next');
				});
				jQuery(this.eID.prev + j).click(function () {
					that.E_change_track(j, 'prev');
				});
				
				var liClass = '';
				var l = p.list.length;
				jQuery(this.eID.ul + j).empty(); 
				for (i = 0; i < l; i += 1) {
					liClass = ( i === l-1 ) ? ' mjp-li-last' : '';
					li = '<li class="li-mjp' + liClass + '" id="' + this.eID.li + j + '_' + i + '"><a class="a-mjp" href="#" id="' + this.eID.a + j + '_' + i + '">';
					li += p.list[i].name;
					if ( this.hasListMeta && p.list[i].artist !== '' ) {
						li += '<br><span>' + p.list[i].artist + '</span>';
					}
					li += '</a>';
					li += '<div class="mjp_ext_li" id="mjp_ext_li_' + j + '_' + i + '"></div><div class="emjp_clear"></div>';
					li += '</li>';
					
					
					jQuery(this.eID.ul + j).append(li);
					this.add_ul_click(j, i);
				}
				jQuery('#' + this.eID.a + j + '_' + p.tr).addClass('mp3j_A_current');
				jQuery('#' + this.eID.li + j + '_' + p.tr).addClass('mp3j_LI_current');
				jQuery(this.eID.toglist + j).click(function () {
					that.togglelist(j);
				});
				if (p.lstate === true) {
					jQuery(this.eID.plwrap + j).show();
				}	
			}
			
			this.writedownload(j, p.tr);	
			if ( this.vars.force_dload === true ) {
				this.dl_closeinfo_click(j);
			}
			
			jQuery(this.eID.lPP + j).click(function () {
				return that.E_launchPP(j);
			});
			
			jQuery( '#innerExt1_' + j ).click( function ( e ) {
				if ( that.mutes[j] === false ) {	
					if ( j === that.tID ) {
						jQuery( that.jpID ).jPlayer( 'volume', 0 ); 
					} 
					jQuery( '#innerExt1_' + j ).addClass( 'vol-muted' );
					jQuery( that.eID.vol + j ).slider( 'value', 0 ); 
					that.mutes[j] = p.vol;
					p.vol = 0;
				} else {
					if ( j === that.tID ) {
						jQuery( that.jpID ).jPlayer( 'volume', that.factors.vol * that.mutes[j]/100 ); 
					} 
					jQuery( '#innerExt1_' + j ).removeClass( 'vol-muted' );
					jQuery( that.eID.vol + j ).slider( 'value', that.mutes[j] ); 
					p.vol = that.mutes[j];
					that.mutes[j] = false;
				}
			});
		}
		
		//POPOUT LINKS
		if ('popout' === p.type) {
			jQuery(this.eID.pplink + j).click(function () {
				return that.E_launchPP(j);
			});
		}
	},
	
	add_ul_click: function (j, i) { //playlist item click
		var that = this;
		jQuery('#' + this.eID.a + j + "_" + i).click(function (e) {
			that.E_change_track(j, i);
			e.preventDefault();
		});
	},
		
	unwrap: function () {
		var i, j, arr;
		if ( this.vars.play_f === true && typeof MP3jPLAYLISTS  !== "undefined" ) {
			for ( var key in MP3jPLAYLISTS ) {
				if ( MP3jPLAYLISTS.hasOwnProperty( key ) ) {
					arr = MP3jPLAYLISTS[key];
					for ( j = 0; j < arr.length; j += 1 ) { 
						arr[j].mp3 = this.f_undo.f_con( arr[j].mp3 );
						if ( arr[j].counterpart !== '' ) {
							arr[j].counterpart = this.f_undo.f_con( arr[j].counterpart );
						}
					}
				}
			}
		}
	},
	
	f_undo: {
		keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		f_con : function (input) {
			var output = "", i = 0, chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = this.keyStr.indexOf(input.charAt(i++)); enc2 = this.keyStr.indexOf(input.charAt(i++));
				enc3 = this.keyStr.indexOf(input.charAt(i++)); enc4 = this.keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4); chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 !== 64) { output = output + String.fromCharCode(chr2); }
				if (enc4 !== 64) { output = output + String.fromCharCode(chr3); }
			}
			output = this.utf8_f_con(output);
			return output;
		},
		utf8_f_con : function (utftext) {
			var string = "", i = 0, c, c1, c2, c3;
			while (i < utftext.length) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c); i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1); string += String.fromCharCode(((c & 31) << 6) | (c2 & 63)); i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1); c3 = utftext.charCodeAt(i + 2); string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); i += 3;
				}
			}
			return string;
		}
	},
	
	E_stop: function ( j, caller ) {
		var exData = { pT:'', tT:'', pState: '', pU: '', lp:'', ppA:'', jperror:'' };
		if (j === this.tID && j !== '') {
			var preL = (this.tID !== '' ) ? this.pl_info[this.tID].list : false;
			var pU = ( preL !== false ) ? preL[ this.pl_info[this.tID].tr ].mp3 : '';

			if ( this.exData === false ) {
				exData.pT = this.played_t;
				exData.tT = this.total_t;
				exData.pState = this.state;
				exData.pU = pU;
				exData.lp = this.load_pc;
				exData.ppA = this.pp_abs;
			} else {
				exData = this.exData;
			}
			
			if ( caller !== 'Echange' && this.jperrorIDs[j] === false ) {
				this.runExternals( 'change_pre', exData );
			}
			
			this.clearit();
			if ( jQuery(this.eID.pos + j + ' div.ui-widget-header').length > 0 ) {
				jQuery(this.eID.pos + j).off( 'click', MP3_JPLAYER.stopProp );
				jQuery(this.eID.pos + j).slider('destroy');
			}
			jQuery(this.eID.loader + j).css( "width", '0%' );
			this.button(j, 'play');
			if (this.pl_info[j].type === 'MI') {
				jQuery(this.eID.poscol + j).css( "width", '0%' );
				jQuery(this.eID.tT + j).empty();
				jQuery(this.eID.indiM + j).empty().append('<span class="mjp-stopped">Stopped</span>');
				jQuery(this.eID.pT + j).text(this.Tformat(0));
			} else {
				jQuery(this.eID.indiM + j).empty();
			}
			this.load_pc = 0;
			this.played_t = 0;
			jQuery('#mp3j_nosolution_' + j).empty().hide();
		}
		return exData;
	},
	
	E_dblstop: function (j) { //playlisters only
		this.listclass(j, this.pl_info[j].tr, 0);
		if ( this.pl_info[j].tr !== 0 ) {
			this.titles(j, 0);
		}
		this.writedownload(j, 0);
		this.E_stop(j);
		jQuery(this.eID.indiM + j).empty().append('<span class="mjp-ready">Ready</span>');
		this.pl_info[j].tr = 0;
	},
	
	E_change_track: function ( j, change, secsIn ) {
		var track;
		var txt;
		var p = this.pl_info[j];
		
		this.runExternals( 'change_begin', { id: j, change: change } );		
		
		if (j === this.tID && change === p.tr) {
			if ('playing' === this.state) {
				if (this.load_pc === 0) {
					this.E_stop( j, 'Echange');
				} else {
					this.pauseit();
					this.button(j, 'play');
					if ('MI' === p.type) {
						jQuery(this.eID.indiM + j).empty().append('<span class="mjp-paused">Paused</span>');
					}
				}
				return;
			} else if ('paused' === this.state || 'set' === this.state) {
				this.playit();
				this.button(j, 'pause');
				return;
			}
		}
		
		var exData = this.E_stop( this.tID, 'Echange' );
		
		if ('prev' === change) {
			track = (p.tr-1 < 0) ? p.list.length-1 : p.tr-1;
		} else if ('next' === change) {
			track = (p.tr+1 < p.list.length) ? p.tr+1 : 0;
		} else {
			track = change;
		}
		
		jQuery(this.jpID).jPlayer("volume", 1 ); //Vol scaling fix
		jQuery('#mp3j_nosolution_' + j).hide();
		txt = ('MI' === p.type) ? '<span class="mp3-finding"></span><span class="mp3-tint"></span><span class="mjp-connecting">Connecting</span>' : '<span class="Smp3-finding"></span><span class="mp3-gtint"></span>';
		jQuery(this.eID.indiM + j).empty().append(txt);
		this.button(j, 'pause');
		this.makeslider(j);
		if ('MI' === p.type) {
			this.listclass(j, p.tr, track);
			if ( p.tr !== track ) {
				this.titles(j, track);
			}
			if (p.download) {
				this.writedownload(j, track);
				jQuery(this.eID.dload + j).hide().addClass('whilelinks').fadeIn(400);
			}
		}
		p.tr = track;
		this.tID = j;
		
		var formatString = this.getFormats( p );
		if ( formatString !== this.lastformats || this.jperrorIDs[ j ] ) {
			this.jperrorIDs[ j ] = false;
			this.destroy_jp();
			this.initialise_jp( formatString, p.list[track], p.vol );
		} else {
			this.jperrorIDs[ j ] = false;
			this.setAudio( p.list[track] );
			this.playit( secsIn );
			jQuery(this.jpID).jPlayer("volume", this.factors.vol * p.vol/100 ); //Reset to correct vol
		}
		exData.mp3 = p.list[track].mp3;
		exData.name = p.list[track].name;
		exData.artist = p.list[track].artist;
		this.exData = exData;
		this.runExternals( 'change_end', exData );
	},
	
	E_launchPP: function (j) {
		this.writePickupData();
		this.popoutformats = this.lastformats;
		this.launched_ID = j;
		this.was_playing = ( this.state === "playing" ) ? true : false;
		var data = { id: this.launched_ID, playing: this.was_playing };
		this.runExternals( 'button_popout', data );
		
		if ( this.tID !== '' ) {
			this.E_stop(this.tID);
			if ( 'mp3,oga' !== this.lastformats ) {
				this.destroy_jp();
				this.initialise_jp( 'mp3,oga', false, 100 );
			} else {
				this.setAudio( false );
				this.playit(); //make chrome let go of last track (incase it didn't finish loading)
				this.clearit();
			}			
		}
		
		var newwindow = window.open( this.plugin_path + '/popout.php', 'mp3jpopout', 'height=' +this.pl_info[j].popout_css.colours[13]+ ', width=' +this.pl_info[j].popout_css.colours[12]+ ', location=1, status=1, scrollbars=1, resizable=1, left=25, top=25' );
		if ( window.focus ) { 
			newwindow.focus(); 
		}
		return false;
	},	
	
	setAudio: function ( track ) {		
		var media = {};
		this.state = 'set';
		if ( false === track ) {
			media['mp3'] = this.plugin_path + '/mp3/silence.mp3';
			media['ogg'] = this.plugin_path + '/mp3/silence.ogg';
		} else {
			media[ track.formats[0] ] = track.mp3;
			if ( typeof track.formats[1] !== 'undefined' ) {
				media[ track.formats[1] ] = track.counterpart;
			}
		}
		jQuery(this.jpID).jPlayer( "setMedia", media );
	},
	
	playit: function ( secs ) {
		this.state = 'playing';
		if ( typeof secs === 'undefined' ) {
			jQuery( this.jpID ).jPlayer("play");
		} else {
			jQuery( this.jpID ).jPlayer( "play",  secs );
		}
	},
	pauseit: function () {
		this.state = 'paused';
		jQuery(this.jpID).jPlayer("pause");
	},
	clearit: function () {
		this.state = '';
		jQuery(this.jpID).jPlayer("clearMedia");
	},
			
	button: function (j, type) {
		if (j !== '') { 
			if ('pause' === type) {
				jQuery( this.eID.play + j ).removeClass( 'play-mjp' ).addClass( 'pause-mjp' ).empty().append( this.pl_info[j].pause_txt );
			}
			if ('play' === type) {
				jQuery( this.eID.play + j ).removeClass( 'pause-mjp' ).addClass( 'play-mjp' ).empty().append( this.pl_info[j].play_txt );
			}
		}
		this.runExternals( 'button_playpause', { type: type } );
	},
	
	listclass: function ( j, rem, add ) {
		jQuery('#'+ this.eID.a + j +'_'+ rem).removeClass('mp3j_A_current');
		jQuery('#'+ this.eID.li + j +'_'+ rem).removeClass('mp3j_LI_current');
		jQuery('#'+ this.eID.a + j +'_'+ add).addClass('mp3j_A_current');
		jQuery('#'+ this.eID.li + j +'_'+ add).addClass('mp3j_LI_current');
	},
	
	titles: function ( j, track ) {
		var data;
		var p = this.pl_info[j], Olink = '', Clink = '';	
		var img = p.list[track].image;
		if (p.type === "MI") {
			jQuery(this.eID.title + j).empty().append(p.list[track].name).append('<br /><div>' + p.list[track].artist + '</div>');
			var lastImg = jQuery(this.eID.img + j + ' img').attr('src');			
			if ( img === 'false' || img === 'true' || img === '' ) {
				jQuery(this.eID.img + j).empty();
			} else if ( img !== lastImg ) {
				if (p.list[track].imgurl !== '') {
					Olink = '<a href="' + p.list[track].imgurl + '">';
					Clink = '</a>';
				}
				jQuery(this.eID.img + j).empty().hide().append(Olink + '<img src="' + p.list[track].image + '" />' + Clink).fadeIn(300);
			}
		}
		data = { title: p.list[track].name, caption: p.list[track].artist, id: j, track: track };
		this.runExternals( 'write_titles', data );
	},
	
	writedownload: function ( j, track, text ) {
		var data;
		var p = this.pl_info[j];
		text = ( typeof text === 'undefined' ) ? this.vars.dload_text : text;
		if ( p.download ) {
			jQuery(this.eID.dload + j).empty().removeClass('whilelinks').append('<a id="mp3j_dlanchor_' + j + '" href="' + p.list[track].mp3 + '" target="_blank">' + text + '</a>');
			if ( this.vars.force_dload === true ) {
				this.dl_button_click( j );
			}
		}
		data = { is_download: p.download , url: p.list[track].mp3 };
		this.runExternals( 'write_download', data );
	},
	
	togglelist: function ( j ) {
		if (this.pl_info[j].lstate === true) {
			jQuery(this.eID.plwrap + j).fadeOut(300);
			jQuery(this.eID.toglist + j).text('SHOW');
			this.pl_info[j].lstate = false;
		} else if (this.pl_info[j].lstate === false) {
			jQuery(this.eID.plwrap + j).fadeIn("slow");
			jQuery(this.eID.toglist + j).text('HIDE');
			this.pl_info[j].lstate = true;
		}
	},
		
	makeslider: function ( j ) {
		var phmove, cssmove, that = this;
		jQuery(this.eID.pos + j).css( 'visibility', 'hidden' );
		
		jQuery(this.eID.pos + j).slider({
			max: 1000,
			range: 'min',
			slide: function (event, ui) { 
				if ( that.allowRanges || (ui.value/10) < that.load_pc ) {
					cssmove = ui.value/10;
					phmove = ui.value*(10.0/that.jp_seekable);
				} else {
					cssmove = 0.99*that.load_pc;
					phmove = (9.9*that.load_pc)*(10.0/that.jp_seekable);
				}
				jQuery(that.eID.poscol + j).css('width', cssmove + '%');
				jQuery(that.jpID).jPlayer("playHead", phmove );
				if (that.state === 'paused') { 
					that.button(j, 'pause');
					that.playit();
				}
				that.state = 'playing';
			},
			start: function ( event, ui ) {
				that.sliding = true;
			},
			stop: function ( event, ui ) {
				that.sliding = false;
			}
		});
		
		jQuery(this.eID.pos + j).on( 'click', MP3_JPLAYER.stopProp );
	},
	
	stopProp: function ( e ) {
		e.stopPropagation();
	},
	
	deviceInfo: function () {
		var isMobile = false;
		var os = '';
		var device = '';
		var ua = navigator.userAgent;
		var p = navigator.platform;
		var matched;
		
		if ( /bot|spider/i.test( ua ) ) {
			os = 'spider';
		} else {
			if ( /iPhone|iPod|iPad/.test( p ) ) { 
				os = 'iOS';
				device = p;
				isMobile = true; 
			} else {
				var matched = /Android|BlackBerry|IEMobile|Opera Mini|Mobi|Tablet/.exec( ua );
				if ( matched ) {
					device = ( matched[0] === 'Mobi' ) ? 'Mobile' : matched[0];
					isMobile = true;
				}
			}
			if ( ! isMobile ) {
				if ( /Mac/.test( p ) ) {
					os = 'Mac';
					device = 'Desk/Laptop';
				} else if ( /Linux/.test( p ) ) {
					os = 'Linux';
					device = 'Desk/Laptop';
				} else if ( /Win|Pocket PC/.test( p ) ) {
					os = 'Windows';
					device = 'Desk/Laptop';
				}
			}
		}
		return { os:os, device:device, isMobile:isMobile }; 
	}
};

MP3_JPLAYER.dl_button_click = function ( j ) {
	var that = this, p = this.pl_info[j];
	jQuery('#mp3j_dlanchor_' + j).click(function (e) {
		that.dl_runinfo( p.list[p.tr].mp3, j, e );
		that.runExternals( 'download', p.list[p.tr] );
		e.preventDefault();
	});
};

MP3_JPLAYER.dl_closeinfo_click = function ( j ) {
	var that = this;
	jQuery('#mp3j_finfo_close_' + j).click(function () {
		that.dl_dialogue( j, '', 'close');
		that.clear_timers( j );
	});
};	

MP3_JPLAYER.dl_runinfo = function ( get, j, e ) {
	var can_write,  
		dlpath,
		message,
		that = this,
		dlframe = false,
		p = this.pl_info[j],
		is_local = this.is_local_dload( get );
	
	var enc_get;
	if ( !this.intervalIDs[ j ] && !this.timeoutIDs[ j ] ) { //if timers not already running for this player
		can_write = this.write_cookie('mp3Download' + j, 'waiting', '');
		if ( is_local ) {
			if ( can_write !== false ) {
				this.dl_dialogue( j, this.vars.message_interval, 'check');
			} else {
				this.dl_dialogue( j, this.vars.message_indark, 'indark');
			}
			this.intervalIDs[ j ] = setInterval( function(){ that.dl_interval_check( j, can_write ); }, 500);
			this.timeoutIDs[ j ] = setTimeout( function(){ that.dl_timeout( j, can_write ); }, 7000);
			dlframe = true;
		} else {
			if ( this.vars.dl_remote_path === '' ) {
				message = this.vars.message_promtlink.replace('#1', get);
				message = message.replace('#2', p.list[p.tr].name);
				this.dl_dialogue( j, message, 'indark');
			} else {
				message = this.vars.message_indark.replace('#1', get);
				message = message.replace('#2', p.list[p.tr].name);
				this.dl_dialogue( j, message, 'indark');
				dlframe = true;
			}
		}
		this.dl_dialogs[ j ] = 'false';
		if ( dlframe ) {
			dlpath = this.get_dloader_path( get );
			enc_get = encodeURIComponent( get );
			jQuery('#mp3j_dlf_' + j).empty().append('<iframe id="mp3j_dlframe_' + j + '" name="mp3j_dlframe_' + j + '" class="mp3j-dlframe" src="' + dlpath + '?mp3=loc' + enc_get + '&pID=' + j + '" style="display:none;"></iframe>');
		}	
	}
};

MP3_JPLAYER.dl_interval_check = function  ( j, can_write ) {
	if ( can_write !== false && this.read_cookie('mp3Download' + j) === 'true' ) {	//got cookie back, all should be good	
		this.dl_dialogue( j, this.vars.message_ok, 'hide');
		this.clear_timers( j );
	} else if ( this.dl_dialogs[ j ] !== 'false' ) { //got a message back
		this.dl_dialogue( j, this.dl_dialogs[ j ], 'add');		
		this.clear_timers( j );	
	}																		
};

MP3_JPLAYER.dl_timeout = function ( j, can_write  ) {
	this.clear_timers( j );
	if ( can_write !== false ) {
		this.dl_dialogue( j, this.vars.message_timeout, 'add');
	}
};

MP3_JPLAYER.clear_timers = function ( j ) {
	if ( this.intervalIDs[ j ] !== null && this.timeoutIDs[ j ] !== null ) {
		clearInterval( this.intervalIDs[j] );
		clearTimeout( this.timeoutIDs[j] );
		this.intervalIDs[ j ] = null;
		this.timeoutIDs[j] = null;
	}
	jQuery('#mp3j_dlf_' + j).empty(); //ditch iframe
	this.write_cookie('mp3Download' + j, '', -1); //clear any cookie
};

MP3_JPLAYER.dl_dialogue = function ( j, text, state ) {
	if ( 'check' === state ) {
		jQuery('#mp3j_finfo_gif_' + j).show();
		jQuery('#mp3j_finfo_txt_' + j).empty().append(text).show();
		jQuery('#mp3j_finfo_' + j).show();
	} else if ( 'add' === state ) {
		jQuery('#mp3j_finfo_gif_' + j).hide();
		jQuery('#mp3j_finfo_txt_' + j).empty().append(text).show();
	} else if ( 'indark' === state ) {
		jQuery('#mp3j_finfo_gif_' + j).hide();
		jQuery('#mp3j_finfo_txt_' + j).empty().append(text).show();
		jQuery('#mp3j_finfo_' + j).fadeIn(100);
	} else if ( 'close' === state ) {
		jQuery('#mp3j_finfo_gif_' + j).hide();
		jQuery('#mp3j_finfo_' + j).hide();
	} else {
		jQuery('#mp3j_finfo_gif_' + j).hide();
		if ( text !== '' ) {
			jQuery('#mp3j_finfo_txt_' + j).empty().append(text).show();
		}
		jQuery('#mp3j_finfo_' + j).fadeOut(1000);
	}
	this.runExternals( 'download_dialog', { id: j, text: text, state: state } );
};

MP3_JPLAYER.read_cookie = function ( name ) {
	var i, cookie, allCookies = document.cookie.split('; ');
	if ( allCookies.length > 0 ) {
		for ( i = 0; i < allCookies.length; i += 1 ) {
			cookie = allCookies[i].split( '=' );
			if ( cookie[0] === name ) {
				return cookie[1];
			}
		}
	}
	return false;
};

MP3_JPLAYER.write_cookie = function ( name, value, days ) {
	var date, expires = "";
	if ( days ) {
		date = new Date();
		date.setTime( date.getTime() + (days*24*60*60*1000) );
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
	return this.read_cookie( name );
};

MP3_JPLAYER.get_dloader_path = function ( loc ) {
	var k, path = "", file = "", chunks; 
	chunks = loc.split('/');
	file = chunks[chunks.length-1];
	if ( loc.charAt(0) === '/' ) {
		path = this.plugin_path + '/download.php';
	} else {
		path = chunks[2].replace(/^www./i, "");
		if ( path === this.dl_domain ) {
			path = this.plugin_path + '/download.php';
		} else {
			path = chunks[0] + '//' + chunks[2] + this.vars.dl_remote_path;
		}
	}
	return path;
};

MP3_JPLAYER.is_local_dload = function ( loc ) {
	var domain = "", file = "", chunks, is_local = false; 
	chunks = loc.split('/');
	file = chunks[chunks.length-1];
	if ( loc.charAt(0) === '/' ) {
		is_local = true;
	} else {
		domain = chunks[2].replace(/^www./i, "");
		if ( domain === this.dl_domain ) {
			is_local = true;
		}
	}
	return is_local;
};
