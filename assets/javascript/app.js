// Global variables
var stars = ['Jennifer Lawrence', 'Shailene Woodley', 'Tom Cruise', 'Matt Damon','Chris Evans', 'Kate Winslet'];
var gifs = [];

// Listeners
function addListener(sel, event, fn) {
	$(sel).on(event, fn);
}
function clickSubmit(event) {
	event.preventDefault();
	var name = $('#actor-input').val();
	stars.push(name);
	$('#actorButtons').empty();
	createButtons();
}
function clickActorButtons() {
	var name = $(this).data('name');
	getGifs(name, 10, 'g');	
}
function clickImg() {
	// It can set data-state earlier and test 
	// if data-state == 'still' then do swapping.
	// But I think toggleClass is a little bit simpler
	var idx = $(this).attr('index');

	$(this).toggleClass('still');
	if ($(this).hasClass('still')) {
		// load still gif
		$(this).attr('src', gifs[idx].still_url);
	} else {
		// load animated gif
		$(this).attr('src', gifs[idx].animated_url);
	}
}
// DOM Manipulation
function createButton(name) {
	var obj = $('<button>').addClass('buttons actor-buttons').data('name', name).text(name);
	return (obj);
}
function createButtons() {
	stars.forEach(function(name) {
		var button = createButton(name);
		$('#actorButtons').append(button);
	});
	addListener('.actor-buttons', 'click', clickActorButtons);
}
function createImgBoxes(name, arr) {
	var box,img, p;
	$('#actors').empty();
	
	arr.forEach(function(obj, idx) {
		
		box = $('<div>').addClass('img-box');
		// When the box is created, it has still gif.
		// Also save index in 'index'
		img = $('<img>').addClass('img still').attr('src', obj.still_url).attr('alt', name).attr('index', idx);
		p = $('<p>').html('Rating: ' + obj.rating);
		box.append(img);
		box.append(p);
		$('#actors').append(box);
	});

	addListener('.img', 'click', clickImg);	
}
// Ajar

function getGifs(name, limit, rating) {
	var publicKey = 'dc6zaTOxFJmzC';
	var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + name;
	queryURL += "&api_key=" + publicKey + "&limit=" + limit + "&rating=" + rating;

    $.ajax({
    	url: queryURL,
    	method: "GET"
    }).done (function(response){
    	gifs = [];
    	// filter out info from resposne.data[i]
    	// and save it in gifs array
    	gifs = response.data.map(function(obj) {
    		return {
    			animated_url: obj.images.fixed_height.url,
    			still_url: obj.images.fixed_height_still.url,
    			rating: obj.rating
    			};
    	});

    	createImgBoxes(name, gifs);
    }); 
}

// Execution
$(document).ready(readyFn);

function readyFn() {
	createButtons();
	// I have practiced event bubbling in HW3 hangman game, so just use
	// plain adding Listeners when it's necessary
	addListener('#addActor', 'click', clickSubmit);	
}
