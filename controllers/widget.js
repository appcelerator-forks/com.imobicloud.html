var eventName = 'app:' + new Date().getTime(),
	cache = [{
		callback: 'UTILS.init',
		params: eventName
	}],
	wvReady = false;

init(arguments[0]);

/*
 params = {
 	csss: 'templates/stories,templates/comment',
 	scripts: 'libs/Event.min,templates/stories,templates/comment,riot/tag templates/todo.tag',
 	
 	url: '/webview/html/index.html'
 }
 * */
function init(params) {
	var url = params.url || '/webview/html/index.html';
	var html = Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, url).read().toString(),
  		csss = params.csss ? params.csss.split(',') : [],
  		scripts = params.scripts ? params.scripts.split(',') : [],
  		css = [],
  		script = [];
	
	var path = url.match(/^.*[\\\/]/, '')[0];
		path = path.substr(1); // remove / character
	
	csss.unshift( 'index.css' );
	scripts.unshift( 'libs/jquery.jsss', 'libs/fastclick.jsss', 'index.jsss' );
	
	for(var i=0,ii=csss.length; i<ii; i++){
		css.push(' <link rel="stylesheet" href="' + path + 'css/' + csss[i] + '"> ');
	}
	
	for(var i=0,ii=scripts.length; i<ii; i++){
		var js = scripts[i];
		if (js.indexOf(' ') == -1) {
			script.push(' <script src="' + path + 'js/' + js + '"></script> ');
		} else {
			// ex: type url inline
			// riot/tag templates/todo.tag
			// riot/tag templates/todo.tag true
			var parts = js.split(' ');
			if (!parts[2]) {
				script.push(' <script type="' + parts[0] + '" src="' + path + 'js/' + parts[1] + '"></script> ');
			} else {
				script.push(' <script type="' + parts[0] + '">' + Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, '' + path + 'js/' + parts[1] ).read().toString() + '</script> ');
			}
		}
	}
	
	$.container.html = html
		.replace('<!-- CSS PLACEHOLDER -->', css.join('\n\t'))
		.replace('<!-- JS PLACEHOLDER -->', script.join('\n\t'));
	
  	//
  	
  	Ti.App.addEventListener(eventName,  fireEvent);
  	
  	Ti.API.info('com.imobicloud.html:load ' + eventName);
}

exports.unload = function() {
  	Ti.App.removeEventListener(eventName,  fireEvent);
  	
  	// if (OS_ANDROID) {
  		// $.container.release();
  	// }
  	
  	Ti.API.info('com.imobicloud.html:unload ' + eventName);
};

/*
 params = {
 	callback: '', 	// name of the function you want to run
 	params: {}		// params for that function
 }
 * */
exports.run = function(params) {
	cache.push( params );
	checkCondition();
};

function checkCondition() {
  	if (wvReady) {
  		while (cache.length) {
  			var call = cache[0];
			run(call.params, call.callback);
			cache.splice(0, 1);
		}
	}
}

function run(params, key) {
	var str = '();'; // default - if params is undefined
	
	if ( params ) {
		params.html && ( params.html = escape(params.html) );
		str = '(' + JSON.stringify(params) + ');';
				
	} else if ( params == '' ) { // params is ''
		str = '("");';
	}
	
	$.container.evalJS( key + str );
}

function wvLoaded(e) {
  	wvReady = true;
  	checkCondition();
}

function fireEvent(e) {
	Ti.API.info('com.imobicloud.html:fireEvent ' + JSON.stringify( e ));
	$.trigger(e.etype, e);
}