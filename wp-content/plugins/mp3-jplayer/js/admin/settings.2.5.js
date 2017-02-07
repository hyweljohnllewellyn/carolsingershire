/*
	MP3-jPlayer 2.4
	Admin-Settings js
*/

var MP3jP = {
	
	
	panels:	{
		library: false
	},
	

//Media library pagination	
	tracks: {
		limit: 		20,
		offset:		0,
		order:		'title',
		direction:	'ASC',
		total:		'',
		pages:		'',
		selectID:	'#tNavControl_page',
		name:		'tracks',
		label:		'audio files',
		selectClass:	'.tNavSelect',
		prevClass:		'.tNavPrev',
		nextClass:		'.tNavNext',
		messageClass:	'.tNavMessage'
	},
	
	runTracksDisplay: function ( orderBy ) {
		var onSuccess = function ( response, status ) {
			jQuery('#tSpinner').removeClass('loader');
			var parts = response.split( '#DATA#' );
			jQuery('#libraryFilesTable').empty().append( parts[0] );
			MP3jP.tracks.total = parseInt( parts[1], 10 );
			MP3jP.buildTableNav( MP3jP.tracks );
		};
		var onError = function ( jqXHR, status, error ) {
			jQuery('#tSpinner').removeClass('loader');
			jQuery('#panel_trackSummaryTable').empty().append( "Timed out, try again." );
		};
		jQuery('#tSpinner').addClass('loader');
		this.request({ 
				limit: 		this.tracks.limit,
				offset:		this.tracks.offset,
				orderBy: 	orderBy,
				direction:	this.tracks.direction
			}, 
			'ax_mjp_liblist',
			onSuccess,
			onError
		);
		this.tracks.order = orderBy;
	},
	
	
	
	
	buildTableNav: function ( data ) {
		var numPages = ( data.total > 0 && data.limit !== 'all' ) ? Math.ceil( data.total / data.limit ) : 1;
		var currentPage = ( data.limit !== 'all' ) ? Math.ceil( (data.offset + 1) / data.limit ) : 1;
		
		var selectOps = this.makePageSelect( currentPage, numPages );
		jQuery( data.selectClass ).empty().append( selectOps );
		data.pages = numPages;
		
		this.setNavButtons( currentPage, data );
		this.writeNavMessage( data );
	},
	
	writeNavMessage: function ( data ) {
		var message = '';
		var to = data.offset + data.limit;
		to = ( to < data.total ) ? to : data.total;
		if ( data.total < 1 ) {
			message = 'No records';
		} else {
			message = 'Showing <span>' + ( data.offset + 1 ) + '</span> to <span>' + to + '</span> of <span>' + data.total + '</span> ' + data.label;
		}
		jQuery( data.messageClass ).empty().append( message );
	},
	
	makePageSelect: function ( current, total ) {
		var j;
		var html = '';
		for ( j = 1; j <= total; j += 1 ) {
			html += '<option value="' + j + '"' + ( current === j ? ' SELECTED' : '' ) + '>' + j + '</option>';
		}
		return html;
	},
	
	setNavButtons: function ( currentPage, data ) {
		if ( 1 === currentPage ) {
			jQuery( data.prevClass ).addClass( 'buttonDisabled' );
		} else {
			jQuery( data.prevClass ).removeClass( 'buttonDisabled' );
		}
		if ( data.pages === currentPage ) {
			jQuery( data.nextClass ).addClass( 'buttonDisabled' );
		} else {
			jQuery( data.nextClass ).removeClass( 'buttonDisabled' );
		}
	},
	
	changeTracksRows: function ( limit, hideID, showID ) {
		MP3jP.tracks.limit = limit;
		MP3jP.tracks.offset = 0;
		MP3jP.runTracksDisplay( MP3jP.tracks.order );
		jQuery( hideID ).hide();
		jQuery( showID ).show();
	},
	
	changeTracksPage: function ( page ) {
		var page = parseInt( page, 10 );
		this.tracks.offset = ( page - 1 ) * this.tracks.limit;
		this.runTracksDisplay( this.tracks.order );
	},
	
	initTableNav: function () {
		jQuery('#tNavControl_rows').on( 'blur', function ( e ) {
			var rows = jQuery('#tNavControl_rows').val().replace( /[^0-9]+/, '' );
			rows = ( ! rows ) ? 30 :  parseInt( rows, 10 );
			jQuery( this ).val( rows );
			MP3jP.changeTracksRows( rows, '#tNavControl_paged', '#tNavControl_all' );
		});
				
		jQuery( this.tracks.selectClass ).on( 'change', function ( e ) {
			var page = jQuery( this ).val();
			MP3jP.changeTracksPage( page );
		});
		jQuery('#tNavControl_prev, #tNavControl_prev2').click( function ( e ) {
			var page = parseInt( jQuery( MP3jP.tracks.selectID ).val(), 10 );
			if ( page > 1 ) {
				MP3jP.changeTracksPage( page - 1 );
			}
		});
		jQuery('#tNavControl_next, #tNavControl_next2').click( function ( e ) {
			var page = parseInt( jQuery( MP3jP.tracks.selectID ).val(), 10 );
			if ( page < MP3jP.tracks.pages ) {
				MP3jP.changeTracksPage( page + 1 );
			}
		});
		jQuery('#tNavControl_first, #tNavControl_first2').click( function ( e ) {
			var page = parseInt( jQuery( MP3jP.tracks.selectID ).val(), 10 );
			if ( page !== 1 ) {
				MP3jP.changeTracksPage( 1 );
			}
		});
		jQuery('#tNavControl_last, #tNavControl_last2').click( function ( e ) {
			var page = parseInt( jQuery( MP3jP.tracks.selectID ).val(), 10 );
			if ( page !== MP3jP.tracks.pages ) {
				MP3jP.changeTracksPage( MP3jP.tracks.pages );
			}
		});
		jQuery('#tNavControl_refresh').click( function ( e ) {
			MP3jP.runTracksDisplay( MP3jP.tracks.order );
		});
		jQuery('#tNavControl_rows').val( this.tracks.limit );
	},
	
	
//Tabs
	openTab: 1,
	
	add_tab_listener: function ( j ) {
		var that = this;
		jQuery('#mp3j_tabbutton_' + j).click( function (e) {
			that.changeTab( j );
		});
	},
	
	changeTab: function ( j ) {
		if ( j !== this.openTab ) {
			jQuery('#mp3j_tab_' + this.openTab).hide();
			jQuery('#mp3j_tabbutton_' + this.openTab).removeClass('active-tab');
			jQuery('#mp3j_tab_' + j).show();
			jQuery('#mp3j_tabbutton_' + j).addClass('active-tab');
			this.openTab = j;
		}
	},

	
//Counterpart messages
	counterpartsFeedback: function () {
		var noCP = [ 'ogg', 'webm', 'wav' ],
			isTicked = false,
			message = 'Auto-counterparting is switched off.',
			l = noCP.length,
			j;
		
		for ( j = 0; j < l; j += 1 ) {	
			if ( jQuery('#audioFormats_' + noCP[j]).prop( 'checked' ) === true ) {
				isTicked = true;
				break;
			}
		}
		
		if ( jQuery('#autoCounterpart').prop( 'checked' ) ) {
			if ( isTicked ) {
				message = 'Bulk auto-counterparting is not available with this format selection.';
			} else {
				message = '<span class="tick">&nbsp;</span>Bulk auto-counterparting is active.';
			}
		}
		jQuery('#feedCounterpartInfo').empty().append( message );
	},
	
	
//Colour pickers
	initSpectrumPicker: function ( elemID, ops ) {
		jQuery( '#' + elemID ).spectrum( ops );
	},
	
	
//Init
	init: function () {
		
		jQuery( '.mp3j-tabbutton').each( function ( j ) {
			MP3jP.add_tab_listener( j );
			if ( j !== MP3jP.openTab ) {
				jQuery('#mp3j_tab_' + j ).hide();
			}
		});
		jQuery('#mp3j_tabbutton_' + this.openTab ).addClass('active-tab');
		
		
		jQuery('.formatChecker, #autoCounterpart').on( 'change', function ( e ) {
			MP3jP.counterpartsFeedback();
		});
		MP3jP.counterpartsFeedback();
		
		
		this.initSpectrumPicker( 'mp3tColour', {
			clickoutFiresChange: true,
			preferredFormat: 'hex',
			move: function( color ) {
				jQuery('#mp3tColour').val( color );
				jQuery('#mp3tColour_on').prop( 'checked', true );
			},
			change: function ( colour ) {
				jQuery('#mp3tColour_on').prop( 'checked', true );
			},
			showInput: true,
			showAlpha: false	
		});
		this.initSpectrumPicker( 'mp3jColour', {
			clickoutFiresChange: true,
			preferredFormat: 'hex',
			move: function( color ) {
				jQuery('#mp3jColour').val( color );
				jQuery('#mp3jColour_on').prop( 'checked', true );
			},
			change: function ( colour ) {
				jQuery('#mp3jColour_on').prop( 'checked', true );
			},
			showInput: true,
			showAlpha: false
		});
		
		
		this.initTableNav();
		
		jQuery('#showLibFilesButton').on( 'click', function ( e ) {
			jQuery('#libraryViewerWrap').toggle();
			if ( ! MP3jP.panels.library ) {
				MP3jP.runTracksDisplay( MP3jP.tracks.order );
				MP3jP.panels.library = true;
			}
		});
		//this.runTracksDisplay( this.tracks.order )
	},


//Request	
	request: function ( info, action, onSuccess, onError ) {		
		var data = { 
			'action': 	action, 
			'info':		info
		};
		jQuery.ajax({
			type: 	"POST",
			data: 	data,
			url: 	MJPajax.WPajaxurl,
			success: function( response, status ) {
				onSuccess( response, status );
			},
			error: function ( jqXHR, status, error ) {
				onError( jqXHR, status, error );
			}
		});
	}
};



function HextoRGB(hexString) {  
	  if(hexString === null || typeof(hexString) != "string") {
		SetRGB(0,0,0);
		return;
	  }
	  if (hexString.substr(0, 1) == '#')
		hexString = hexString.substr(1);
	  if(hexString.length != 6) {
		SetRGB(0,0,0);
		return;
	  }  
	  var r = parseInt(hexString.substr(0, 2), 16);
	  var g = parseInt(hexString.substr(2, 2), 16);
	  var b = parseInt(hexString.substr(4, 2), 16);
	  if (isNaN(r) || isNaN(g) || isNaN(b)) {
		SetRGB(0,0,0);
		return;
	  }
	  SetRGB(r,g,b);  
}
function SetRGB(r, g, b){
	  red = r/255.0;
	  green = g/255.0;
	  blue = b/255.0;
}
function RGBtoHSV(){
	  var max = Math.max(Math.max(red, green), blue);
	  var min = Math.min(Math.min(red, green), blue);
	  value = max;
	  saturation = 0;
	  if(max !== 0)
		saturation = 1 - min/max;
	  hue = 0;
	  if(min == max)
		return;
	 
	  var delta = (max - min);
	  if (red == max)
		hue = (green - blue) / delta;
	  else if (green == max)
		hue = 2 + ((blue - red) / delta);
	  else
		hue = 4 + ((red - green) / delta);
	  hue = hue * 60;
	  if(hue < 0)
		hue += 360;
}




jQuery(document).ready( function () {
	MP3jP.init();
});



