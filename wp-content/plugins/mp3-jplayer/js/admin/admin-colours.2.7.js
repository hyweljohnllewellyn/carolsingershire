/**
*	Admin Colours Page JS
*	MP3-jPlayer 2.0
*/

var MP3jP = {


	/** Tabs */
	openTab: 0,
	addTabListener: function ( j ) {
		jQuery('#mp3j_tabbutton_' + j).click( function (e) {
			MP3jP.changeTab( j ); 
		});
	},
	changeTab: function ( j ) {
		if ( j !== this.openTab ) {
			if ( this.pickID !== false ) { //clear active picking
				this.clickPlus( this.pickID );
			}
			jQuery('#mp3j_tab_' + this.openTab).hide();
			jQuery('#mp3j_tabbutton_' + this.openTab).removeClass('active-tab');
			jQuery('#mp3j_tab_' + j).show();
			jQuery('#mp3j_tabbutton_' + j).addClass('active-tab');
			this.openTab = j;
		}
	},

	
	extCalls: { 
		init:			[],
		update_colour:	[]
	},
	runExternals: function ( hookname, data ) {
		var l = this.extCalls[ hookname ].length;
		for ( var x = 0; x < l; x += 1 ) {
			( this.extCalls[ hookname ][ x ] )( data );
		}
	},
	
	
	/** Colour Picking */
	pickID:	 false,
	CSSprop: false,
	partID:	 false,
	clickPatch: function ( ID, handle ) {
		var colour =  jQuery('#'+ID).val();
		this.setPicker( colour, handle );
		if ( this.pickID !== ID ) {
			this.updateColours( colour, this.pickID );
		}
	},
	setPicker: function ( colour, handle ) {
		if ( colour !== 'transparent' && colour !== 'inherit' ) {
			jQuery( '#spectrumPicker' + handle ).spectrum( "set", colour );
		}
	},
	clickMinus: function ( ID, property, partID ) {
		var value = ( 'color' === property ) ? 'inherit' : 'transparent';
		jQuery('#'+ID).val( value ); //field
		jQuery('#patch'+ID).css({ 'background-color' : 'transparent' }); //patch
		var style = {};
		style[ property ] = value;
		jQuery('#player' + partID).css( style ); //player
	},
	clickPlus: function ( ID, property, partID ) {
		if ( ID === this.pickID ) {
			jQuery( '#plus' + this.pickID ).removeClass('activePicker');
			this.pickID = false;
			this.CSSprop = false;
			this.partID = false;
		} else {
			if ( this.pickID !== false ) {
				jQuery( '#plus' + this.pickID ).removeClass('activePicker');
				this.pickID = false;
				this.CSSprop = false;
				this.partID = false;
			}
			var handle = ( this.openTab === 1 ) ? 'Alpha' : '';
			var colour =  jQuery('#'+ID).val();
			this.setPicker( colour, handle );
			
			jQuery( '#plus' + ID).addClass('activePicker');	
			this.pickID = ID;
			this.CSSprop = property;
			if ( typeof partID !== 'undefined' ) {
				this.partID = partID;
			}
		}
	},
	updateColours: function ( colour, pickID ) {
		if ( pickID !== false ) {
			jQuery( '#' + pickID ).val( colour ); //field 
			jQuery('#patch' + pickID ).css({ 'background-color': colour }); //patch
			var partid = ( this.partID === false ) ? pickID : this.partID; 
			var style = {};
			style[this.CSSprop] = colour;
			jQuery('#player' + partid ).css( style ); //player
			this.runExternals( 'update_colour', { pickID: pickID, colour: colour, partID: this.partID } );
		}
	},
	
	
	
	
	
	
	
	
	
	
	/** stylesheet */
	stylesheetControls: function () {
		jQuery('#player-select').on('change', function ( e ) {
			var value = jQuery( this ).val();
			var url = '';
			
			MP3jP.showhideCustomCSS( value );
			
			if ( value === "styleI" ) { 
				jQuery('#mp3fcss').removeClass('quietInput');
				jQuery('#player-csssheet, #reload_stylesheet_button').removeClass('quietText');
				//url = styleI;
				
			} else {
				jQuery('#mp3fcss').addClass('quietInput');
				jQuery('#player-csssheet, #reload_stylesheet_button').addClass('quietText');
				//if ( value === "styleF" ) { url = styleF; }
				//if ( value === "styleG" ) { url = styleG; }
				//if ( value === "styleH" ) { url = styleH; }
			}
			url = SKINDATA[ value ];
			MP3jP.reload_stylesheet( url );
		});
		jQuery('#reload_stylesheet_button').click( function ( e ) {
			var field_val = jQuery('#mp3fcss').val();
			var select_val = jQuery('#player-select').val();
			if ( field_val !== MP3J_THEME_PATH && select_val === 'styleI' ) {
				MP3jP.reload_stylesheet( field_val );
			}		
		});
		jQuery('#mp3fcss').on('keyup', function ( e ) {
			styleI = jQuery( this ).val();
		});
	},
	reload_stylesheet: function ( url ) {
		jQuery( 'link[rel=stylesheet][href~="' + MP3J_THEME_PATH + '"]' ).remove();
		jQuery( 'head' ).append( '<link rel="stylesheet" type="text/css" href="' + url + '" />' );
		MP3J_THEME_PATH = url;
	},
	showhideCustomCSS: function ( value ) {
		if ( value === "styleI" ) {
			jQuery( '#customCSSrow' ).fadeIn( 400 );
		} else {
			jQuery( '#customCSSrow' ).fadeOut( 400 );
		}
	},
	
	/** fonts */
	families: {
		arial: 		'Arial, "Helvetica Neue", Helvetica, sans-serif',
		verdana: 	'Verdana, Geneva, sans-serif',
		times: 		'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif',
		palatino:	'Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif',
		lucida: 	'"Lucida Console", "Lucida Sans Typewriter", Monaco, "Bitstream Vera Sans Mono", monospace',
		courier: 	'"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
		gill: 		'"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
		theme: 		'inherit'
	},
	initFontSlider: function ( j ) {
		var val = jQuery('#font_size_' + j).val();
		jQuery( '#fontSlider_' + j ).slider({ 
			value : val,
			max: 70,
			min: 8,
			range: 'min',
			animate: false,
			slide: function (event, ui) {
				jQuery('#font_size_' + j).val( ui.value );
				MP3jP.setFontSize( j, ui.value );
			}
		});
		this.setFontSize( j, val );
	},
	setFontSize: function ( j, val ) {
		if ( val !== 'auto' ) {			
			if ( j == 1 ) {
				jQuery('#trackTitles').css({ 'font-size' : val + 'px' });
				jQuery('#trackTitles div').css({ 'font-size' : (val*0.7) + 'px' });
			}
			if ( j == 2 ) {
				jQuery('a.a-mjp').css({ 'font-size' : val + 'px' });	
			}
		} else {
			if ( j == 1 ) {
				jQuery('#trackTitles').css({ 'font-size' : '100%' });
				jQuery('#trackTitles div').css({ 'font-size' : '85%' });
			}
			if ( j == 2 ) {
				jQuery('a.a-mjp').css({ 'font-size' : '100%' });	
			}
			
		}
	},
	setFontFamily: function ( j, selector ) {
		var selected = jQuery('#font_family_' + j).val();
		jQuery( selector ).css({ 'font-family': MP3jP.families[ selected ] });
	},
	fontCheckers: function ( ID, selector, onClass, offClass ) {
		var ext = '-mjp';
		var isChecked = jQuery( ID ).prop('checked');
		//console.log(isChecked);
		if ( isChecked ) {
			jQuery( selector ).removeClass( offClass + ext ).addClass( onClass + ext );
			jQuery( ID + '_label').addClass('formatOn');
		} else {
			jQuery( selector ).removeClass( onClass + ext ).addClass( offClass + ext );
			jQuery( ID + '_label').removeClass('formatOn');
		}
	},
	
	
	/** selects */
	dividersSelect: function () {
		jQuery('#list_divider').on('change', function ( e ) {
			var value = jQuery(this).val();
			jQuery('.ul-mjp').removeClass('light-mjp med-mjp dark-mjp');
			if ( 'none' !== value ) {
				jQuery('.ul-mjp').addClass( value + '-mjp' );
			}
		});
	},
	listgradSelect: function () {
		jQuery('#playlist_tint').on('change', function ( e ) {
			var value = jQuery(this).val();
			jQuery('.ul-mjp').removeClass('lighten1-mjp darken1-mjp lighten2-mjp darken2-mjp');
			if ( 'none' !== value ) {
				jQuery('.ul-mjp').addClass( value + '-mjp' );
			}
		});
	},
	posgradSelect: function () {
		jQuery('#posbar_tint').on('change', function ( e ) {
			var value = jQuery(this).val();
			jQuery('.poscolMI_mp3j').removeClass('soften-mjp softenT-mjp darken-mjp');
			if ( 'none' !== value ) {
				jQuery('.poscolMI_mp3j').addClass( value + '-mjp' );
			}
		});
	},
	alignmentSelect: function ( ID, partID ) {
		jQuery( ID ).on('change', function ( e ) {
			var value = jQuery(this).val();
			jQuery( partID ).removeClass('left-mjp centre-mjp right-mjp').addClass( value + '-mjp' );;
		});
	},
	
	
	/** test image */
	imageControls: function () {
		jQuery('#adminCheckerIMG').on('change', function ( e ) {
			jQuery('#image-mjp').empty();
			if ( jQuery( this ).is(':checked') ) {
				MP3jP.updateTestImg();
			}
		});
		jQuery('#reloadIMG').click( function ( e ) {
			jQuery('#image-mjp').empty();
			jQuery('#adminCheckerIMG').prop( 'checked', true );
			MP3jP.updateTestImg();
		});
		if ( jQuery('#adminCheckerIMG').is(':checked') ) {
			this.updateTestImg();
		}
	},
	updateTestImg: function () {
		var url = jQuery('#adminIMG').val();
		if ( url !== '' ) {
			jQuery('#image-mjp').append('<img id="i-mjp" src="' + url + '"/>');
		}
	},
	
	
	/** offset sliders */
	offsetSlider: function ( sliderID, fieldID, partID, HV ) {
		var max = 500;
		var field1 = jQuery(fieldID + '1').val().replace( /px|%/, '');
		var field2 = max - (this.toInt( jQuery(fieldID + '2').val().replace( /px|%/, '') ));
		var orientation = ( HV === 'V' ) ? 'vertical' : 'horizontal';
		jQuery( sliderID ).slider({ 
			values : [field1, field2],
			max: max,
			min: 0,
			orientation: orientation,
			range: true,
			animate: false,
			slide: function ( event, ui ) {
				var j = jQuery(ui.handle).index();
				var fieldCurrent = jQuery( fieldID + j ).val();
				var fieldInt = ( j == 2 ) ? max - ui.values[(j-1)] : ui.values[(j-1)]; //ui handles are indexed from 1, but values from 0!
				var fieldNew = fieldCurrent.replace( /[0-9]+/, fieldInt );
				jQuery( fieldID + j ).val( fieldNew );
				var style = {};
				var prop = ( j == 1 ) ? ( HV=='V' ? 'height':'left' ) : ( HV=='V' ? 'bottom':'right' );
				style[ prop ] = fieldNew; 
				jQuery( partID ).css( style );
			}
		});
	},
	
	
	vSlider: function ( sliderID, fieldID, partID, property ) {
		var max = 250;
		var field = jQuery( fieldID ).val().replace( /px|%/, '');
		jQuery( sliderID ).slider({ 
			value: field,
			max: max,
			min: 0,
			range: 'min',
			//orientation: 'vertical',
			slide: function ( event, ui ) {
				var fieldCurrent = jQuery( fieldID ).val();
				var fieldInt = ui.value;
				var fieldNew = fieldCurrent.replace( /[0-9]+/, fieldInt );
				jQuery( fieldID).val( fieldNew );
				var style = {};
				if ( fieldID === '#barsOffsetVT' ) { //choose top or height
					property = jQuery('input[name=barsTopOrHeight]:checked').val();
					//console.log(property);
					if ( 'top' === property ) {
						jQuery('#bars-mjp').css({ 'height': 'auto' });
					} else {
						jQuery('#bars-mjp').css({ 'top': 'auto' });
					}
				}
				if ( fieldID === '#playerHeight' ) {
					var ph = jQuery('#imageSize').val();
					if ( 'autoW' === ph || 'autoH' === ph || 'full' === ph ) {
						var h = jQuery( fieldID ).val();
						jQuery('#playerT1').css({ 'height' : h });
						jQuery('#image-mjp').css({ 'height' : h });
					}
				}
				style[ property ] = fieldNew; 
				jQuery( partID ).css( style );
			}
		});
	},
	
	
	
	showhideTitle: function () {
		if ( jQuery('#titleHide').is(':checked') ) {
			jQuery('#trackTitles').css({'display':'none'});
		} else {
			jQuery('#trackTitles').css({'display':'block'});
		}
	},
	
	
	/** helpers */
	isWithin: function ( x, lo, hi ) {
		return ( ( lo <= x && x <= hi ) ? true : false );
	},
	toInt: function ( s ) {
		s = parseInt( s, 10 );
		return ( ! isNaN( s ) ? s : 0 );
	},
	
	
	/** Initialise */
	init: function () {
		
		//# pickers
		jQuery("#spectrumPicker").spectrum({
			flat: true,
			preferredFormat: "hex",
			containerClassName: 'sp-buttons-disabled',
			clickoutFiresChange: true,
			//showInput: true,
			//showInitial: true,
			move: function( color ) { 
				MP3jP.updateColours( color, MP3jP.pickID ); 
			},
			change: function(color) {}
		});
		jQuery("#spectrumPickerAlpha").spectrum({
			flat: true,
			showAlpha: true,
			preferredFormat: "rgb",
			//showInput: true,
			containerClassName: 'sp-buttons-disabled',
			clickoutFiresChange: true,
			//showInitial: true,
			move: function( color ) { 
				MP3jP.updateColours( color, MP3jP.pickID );
			},
			change: function(color) {}
		});
		jQuery("#adminBG").spectrum({
			preferredFormat: "hex",
			clickoutFiresChange: true,
			containerClassName: 'sp-buttons-disabled mini',
			move: function( color ) {
				jQuery('#sizer').css({ 'background-color': color });
				jQuery('#adminBG').val( color );
			},
			change: function( color ) { }
		});
		
		
		
		
		//# preset
		//jQuery('#presetSelect').on('change', function ( e ) {
		//	this.changePreset( jQuery( this ).val() );
		//});
		
		//# sizeable
		jQuery('#sizer').resizable({
			resize: function ( event, ui ) {
				jQuery('#adminSizer_w').val(ui.size.width + 'px');
				jQuery('#adminSizer_h').val(ui.size.height + 'px');
			}
		});

		//# tabs
		jQuery( '.mp3j-tabbutton').each( function ( j ) {
			MP3jP.addTabListener( j );
			if ( j !== MP3jP.openTab ) {
				jQuery('#mp3j_tab_' + j ).hide();
			}
		});
		jQuery('#mp3j_tabbutton_' + this.openTab ).addClass('active-tab');
		
		//# overflow
		jQuery('#imgOverflow').on('change', function ( e ) {
			var value = 'hidden';
			if ( jQuery( this ).is(':checked') ) {
				value = 'visible';
			}
			jQuery('#image-mjp').css({'overflow' : value });
		});
		
		//# hide title
		jQuery('#titleHide').on('change', function ( e ) {
			//if ( jQuery( this ).is(':checked') ) {
			//	jQuery('#trackTitles').css({'display':'none'});
			//} else {
			//	jQuery('#trackTitles').css({'display':'block'});
			//}
			MP3jP.showhideTitle();
		});
		this.showhideTitle();
		
		jQuery('#listtog-mjp').click( function ( e ) {
			jQuery('#listwrap-mjp').toggle();
		});
		
		
		//# test image
		this.imageControls();
		
		//# selects
		this.dividersSelect();
		this.listgradSelect();
		this.posgradSelect();
		this.alignmentSelect( '#titleAlign', '#trackTitles' ); 	//titles alignment
		this.alignmentSelect( '#listAlign', '#ul-mjp' );		//playlist alignment 
		this.alignmentSelect( '#imageAlign', '#image-mjp' );	//image alignment
		
		//# sliders
		//offsets (2 handle)
		this.offsetSlider( '#offsetSlider_1', '#titleOffset', '#trackTitles' );
		//this.offsetSlider( '#offsetSlider_2', '#barsOffsetH', '#bars-mjp' );
		
		//this.vSlider('#offsetSlider_3', '#barsOffsetVB', '#bars-mjp', 'bottom');
		//this.vSlider('#offsetSlider_4', '#barsOffsetVT', '#bars-mjp', 'height');
		this.vSlider('#offsetSlider_5', '#playerHeight', '#playerT1', 'height');
		this.vSlider('#offsetSlider_6', '#titleTop', '#trackTitles', 'top');
		
		this.initFontSlider( 1 );
		this.initFontSlider( 2 );
		
		//# font family onchange
		this.setFontFamily( 1, '.interface-mjp' );
		jQuery('#font_family_1').on('change', function ( e ) {
			MP3jP.setFontFamily( 1, '.interface-mjp' );
		});
		
		this.setFontFamily( 2, 'a.a-mjp' );
		//this.setFontFamily( 2, '#ul-mjp' );
		jQuery('#font_family_2').on('change', function ( e ) {
			MP3jP.setFontFamily( 2, 'a.a-mjp' );
			//MP3jP.setFontFamily( 2, '#ul-mjp' );
		});
		
		//# imageSize onchange
		jQuery('#imageSize').on('change', function ( e ) {
			var value = jQuery(this).val();
			var Pcss = {};
			var IWcss = {};
			if ( value === "thumbnail" || value === "medium" || value === "large" ) { 
				jQuery('#playerHeight').addClass('quietInput');
				jQuery('#playerHeightWrap1, #playerHeightWrap2').addClass('quietText');
				Pcss['height'] = imgDimsWP[ value + '_h'] + 'px'; 
				IWcss['width'] = imgDimsWP[ value + '_w'] + 'px';
				IWcss['height'] = Pcss.height;
				jQuery('#image-mjp').removeClass('Himg Fimg');
				jQuery('#offsetSlider_5').slider( "disable" );
			} else {
				jQuery('#playerHeight').removeClass('quietInput');
				jQuery('#playerHeightWrap1, #playerHeightWrap2').removeClass('quietText');
				Pcss['height'] = jQuery('#playerHeight').val(); 
				IWcss['width'] = ( value === 'autoW' ) ? '100%' : 'auto';
				if ( 'autoH' === value ) {
					jQuery('#image-mjp').removeClass('Fimg').addClass('Himg');
				} else if ( 'full' === value ) {
					jQuery('#image-mjp').removeClass('Himg').addClass('Fimg');
				} else {
					jQuery('#image-mjp').removeClass('Himg Fimg');
				}
				IWcss['height'] = Pcss.height;
				jQuery('#offsetSlider_5').slider( "enable" );
			}
			jQuery('#playerT1').css( Pcss );
			jQuery('#image-mjp').css( IWcss );
		});
		
		
	
		//# stylesheet
		if ( MP3J_THEME_PATH !== false ) {
			MP3jP.reload_stylesheet( MP3J_THEME_PATH );
		}
		this.stylesheetControls();
	}
};

