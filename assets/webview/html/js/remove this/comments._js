eventjs.add(window, "swipe", onSwipe);

function loadUI() {
  	$('#app').html('<div id="comments"></div><div class="nav-container"></div>');
  	$('#app').on('click', UTILS.onClick);
}

function loadComments(params) {
	$('#comments').html( UTILS.render(params) );
	
	updateNav(params);
	
	UTILS.scroll();
}

function updateNav(params) {
	var html = [];
  	
  	html.push(' <div class="nav clearfix"> ');
  	
  	if (params.current !== 1) {
  		html.push(' <a class="nav-button nav-first" href="#view-first-page">First</a> ');
  		html.push(' <a class="nav-button nav-prev" href="#view-prev-page">Previous</a> ');
  	} else {
  		html.push(' <span class="nav-button nav-first">First</span> ');
  		html.push(' <span class="nav-button nav-prev">Previous</span> ');
  	}
  	
  	if (params.total !== 1) {
  		html.push(' <a class="nav-button nav-current" href="#view-all-page">' + params.current + '/' + params.total + '</a> ');
  	} else {
  		html.push(' <span class="nav-button nav-current">' + params.current + '/' + params.total + '</span> ');
  	}
  	
  	if (params.current !== params.total) {
  		html.push(' <a class="nav-button nav-last" href="#view-last-page">Last</a> ');
  		html.push(' <a class="nav-button nav-next" href="#view-next-page">Next</a> ');
  	} else {
  		html.push(' <span class="nav-button nav-last">Last</span> ');
  		html.push(' <span class="nav-button nav-next">Next</span> ');
  	}
  	
  	html.push(' </div> ');
  	
  	$('.nav-container').html( html.join('') );
  	$('.nav-container').show();
}

function resetComments() {
  	$('#comments').html('');
  	$('.nav-container').hide();
  	UTILS.showAI();
}

function resizeImage(e) {
  	if (e.height > 200) {
  		e.height = 200;
  	}
}

function onSwipe(e, self) {
	var direction = { 0: 'up', 90: 'right', 180: 'down', 270: 'left' };
	UTILS.fireEvent(e, 'swipe', { direction: direction[self.angle] });
}