var eventName;

$(function(){
	FastClick.attach(document.body);

	// fix Feed not display on Nexus 7 (Android 4.4.2)
	if (OS_ANDROID) {
		var ua = navigator.userAgent.toLowerCase(),
			androidVersion = parseFloat(ua.slice(ua.indexOf("android")+8));
		if (androidVersion > 4.3) {
			$(document.body).css({
				'height': window.innerHeight,
				'position': 'relative'
			});
		}
	}

	// prevent default long press (long press on links will show open dialog)
	// http://atmarkplant.com/ios-wkwebview-tips/#longpress
	document.body.style.webkitTouchCallout='none';
});

var UTILS = {
	init: function(_eventName) {
		eventName = _eventName;
	},

	fireEvent: function(e, type, data) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		data == null && (data = {});
		data.etype = type;

	  	Ti.App.fireEvent(eventName, data);
	},

	/*
	 params = {
	 	data: [],
	 	template: ''
	 }
	 * */
	render: function(params) {
		return $.templates[params.template].render(params.data);
	},

	scroll: function(scrollToTop) {
		$("html, body").animate({ scrollTop: scrollToTop ? 0 : $(document).height() }, "slow");
	},

	stringify: function(obj) {
	  	return typeof obj == 'object' ? JSON.stringify(obj) : obj;
	},

	parseHTML: function(text, useHash, useTag) {
		var lineRegex    = /\r?\n/g;
		var phoneRegex   = /(\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-.]([0-9]{4}))/gi;
		// http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
	    var urlRegex 	 = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi;

	    var html = text
	        .replace(lineRegex,    '<br/>')
	        .replace(urlRegex,     '<a href="#" data-url="$1">$1</a>')
			.replace(phoneRegex,   '<a href="#" data-url="tel:$1">$1</a>');

	    if (useHash) {
	    	var hashTagRegex = /(^|\B)#(([a-zA-Z_]+\w*)|(\d+([,.]\d+)?))/gi;
	    	html = html.replace(hashTagRegex, '$1<a href="#hash" data-hash="$2">#$2</a>');
	    }

	    if (useTag) {
	    	var mentionRegex = /(^|\s)@(\w+)/gi;
	    	html = html.replace(mentionRegex, '$1<a href="#profile" data-user-name="$2">@$2</a>');
	    }

	    return html;
	},

	validateURL: function(url) {
		var urlRegex    = new RegExp('^(http|https)://', 'i');
		var phoneRegex  = /(\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-.]([0-9]{4}))/gi;
		if ( !phoneRegex.test( url ) ) {
			if ( !urlRegex.test( url ) ) {
				url = 'http://' + url;
			}
		}
		return url;
	},

	truncate: function(text, limit) {
	  	if (text.length <= limit) {
			return text;
		} else {
			var str = text.substr(0, limit);
			str = str.substr(0, str.lastIndexOf(' '));// remove the last word to ensure #aaa or @aaa not being cut
			return str;
		}
	},

	showAI: function() {
		$('#ai').show();
	},

	hideAI: function() {
		$('#ai').hide();
	},

	updateViewport: function(width, height) {
		if (width == null) { width = window.innerWidth; }
		if (height == null) { height = window.innerHeight; }

		var m = document.createElement("meta");
		m.name = 'viewport';
		m.content = 'user-scalable=no, width=' + width + ', height=' + height + ', initial-scale=1, maximum-scale=1';
		document.getElementsByTagName("head")[0].appendChild(m);

		$('html, body').css({
			width: width + 'px',
			height: height + 'px',
			overflow: 'hidden'
		});
	}
};

UTILS.onClick = function(e) {
	var element = e.target;

	while (element && element.className.indexOf('touchDisabled') != -1) {
		element = element.parentNode;
	}

	if (element.nodeName == 'A') {
		var data = $(element).data();
  		data.clickAction = element.hash;
		data.link = UTILS.validateURL(data.link);
  		UTILS.fireEvent(e, 'click', data);
  		return false;
	} else {
		while (element) {
  			var data = $(element).data();
  			if (data.clickAction == null) {
  				element = element.parentNode;
  			} else {
  				UTILS.fireEvent(e, 'click', data);
  				break;
  			}
  		}
	}
};
