/*
 * MOBILE NAVIGATION
 * Source: http://maxfoundry.com/articles/116/responsive-mobile-navigation-in-wordpress
 * Copyright author: John Hartley
 * License: GNU General Public License v3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 */

jQuery(document).ready(function() { 
	// build <select> dropdown
	jQuery("<select />").appendTo("div.nav-head");

	// create option Menu
	jQuery("<option />", {
		"selected": "selected",
		"value": "",
		"text": objectL10n.navText  
	}).appendTo(".nav-head select");

	// populate
	jQuery(".nav-head ul li a").each(function() {
		var el = jQuery(this);
		if(el.parents(".nav-head ul ul ul").length) {
			// if subpage level two
			jQuery("<option />", {
				"value": el.attr("href"),
				"text":  "- - " + el.text()
			}).appendTo(".nav-head select");
		} 
		else if(el.parents(".nav-head ul ul").length) {
			// if subpage level one
			jQuery("<option />", {
				"value": el.attr("href"),
				"text":  "- " + el.text()
			}).appendTo(".nav-head select");
		} 
		else { 
			// if no subpage
			jQuery("<option />", {
				"value": el.attr("href"),
				"text": el.text()
			}).appendTo(".nav-head select");
		}
	});

	// make links work 
	jQuery(".nav-head select").change(function() { 
		window.location = jQuery(this).find("option:selected").val();
	});
});