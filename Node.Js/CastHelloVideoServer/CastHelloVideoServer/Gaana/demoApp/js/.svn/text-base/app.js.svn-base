var requestSource = [	
	{'type':'song', 'subtype':['most_popular','hot_songs']}, 
	{'type':'album', 'subtype':['most_popular', 'new_release', 'all_albums', 'featured_album']}, 
	{'type':'artist', 'subtype':['most_popular', 'artist_list']}, 
	{'type':'playlist', 'subtype':['most_popular_playlist', 'playlist_home_featured', 'user_playlist']}
];

var gaanaMaster;
$(function () {
	var tabs = $( "#maincontent" ).tabs();

	for (var i = 0; i < requestSource.length; i++) {
		var type = requestSource[i]['type'];
		// if (type != 'song') continue;
		var sType = requestSource[i]['subtype'];
		for (var j = 0; j < sType.length; j++) {
			loadInfo(type, sType[j]);
			// console.log(sType[j]);
		};
	};
	// loadInfo('most_popular');
	// loadInfo('hot_songs');
	
});

function toTitleCase(str) {
    return str.replace(/_/g, ' ').replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}


function addAccordion (id, sid) {
	$('#'+id+' h3').parent().next('div#'+sid).hide();
	$('#'+id+' h3').click(function() {
		if($(this).parent().next('div#'+sid).is(':visible')) {
    		$(this).parent().next('div#'+sid).slideUp();    
		}
		else{
    		$('#'+id+' h3').parent().next('div#'+sid).slideUp();
    		$(this).parent().next('div#'+sid).slideToggle();
		}    
	});

	if (id == 'song' && sid=='most_popular') {
		$('#'+id+' h3').click();
	};
}

function loadInfo (type, sType) {
	var title = toTitleCase(sType);
	$('#'+type).append('<div class="section group"><h3>'+title+'</h3></div><div id="'+sType+'" class="section group"><div class="col span_1_of_4">Loading...</div></div>');
	// $( "#"+type+" h3" ).accordion();
	addAccordion(type, sType);
	$.ajax({
		url: BASE_URL+"get.php?type="+type+"&subtype="+sType,
		type: 'get',
		success: function(data) {
			// console.log(JSON.parse(data));
			var dataObj = JSON.parse(data);
			showInfo(dataObj, type, sType);
		},
		error: function (er) {
			console.log(er);
		}
	});
}

function getTracks (dataObj) {
	return dataObj.tracks;
}

function getAlbums (dataObj) {
	return dataObj.album;
}

function getArtists (dataObj) {
	return dataObj.artist;
}

function getPlaylists (dataObj) {
	return dataObj.playlist;
}

function getCount (dataObj) {
	return dataObj.count;
}

function getArtist (track) {
	var artistName = '';
	for (k in track.artist) {
		if(track.artist[k].name == null)
			continue;

		if (artistName != '') {
			artistName += ', ';
		}
	 	artistName += track.artist[k].name.trim();
	}
	return artistName;
}

function playThis(type, key){
	switch(type){
		case 'song':
			sType = 'song_detail';
			break;

		case 'album':
			sType = 'album_detail';
			break;

		default:
			return;
	}

	$.ajax({
		url: BASE_URL+"get.php?type="+type+"&subtype="+sType+"&dataKey="+key,
		// url: 'http://s.staging.api.gaana.com/index.php?type=song&subtype=song_detail&track_id=290911',
		type: 'get',
		crossDomain: true,
		success: function(data) {
			console.log(JSON.parse(data));
			 if(data != '' && $.trim(data)!="null"){
               	if(!gaanaMaster) {
                   	gaanaMaster = new GaanaMaster({
                    	autoPlay:true, 
                    	data:null
                	});
                }
                gaanaMaster.createSound({
                       data: data,
                       index: 0,
                       shuffle: false
                   }, true, true, "jsPlayer", 0, 0);                        
           	}
                          

		},
		error: function (er) {
			console.log(er);
		}
	});

}

function showInfo (dataObj, type, sType) {
	var html = '';
	switch(type){
		case 'song':
			var len = getCount(dataObj);
			var tracks = getTracks(dataObj);
			var headerAdded = false;
			for (var i = 0; i < len; i++) {
				if (!headerAdded) {
					html +=		'<div class="section group"><div class="col span_1_of_6">Album Image</div><div class="col span_1_of_6">Track Title</div><div class="col span_1_of_6">Album Title</div><div class="col span_2_of_6">Artists</div><div class="col span_1_of_6">Actions</div></div>';
					headerAdded = true;
				};

				html +=		'<div id="song_'+tracks[i].track_id+'" class="section group song">';
				html +=			'<div class="col span_1_of_6">';
				html +=				'<img src="'+tracks[i].artwork+'" height="80">';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_6">';
				html +=				'<a href="javascript:void(0);" onclick="playThis(\'song\', '+tracks[i].track_id+');">'+tracks[i].track_title+'<a/>';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_6">';
				html +=				tracks[i].album_title;
				html +=			'</div>';
				html +=			'<div class="col span_2_of_6">';
				html +=				getArtist(tracks[i]);
				html +=			'</div>';
				html +=			'<div class="col span_1_of_6">';
				html +=				'<button class="play_pause" onclick="playThis(\'song\', '+tracks[i].track_id+');">Play</button>';
				html +=			'</div>';
				html +=		'</div>';
			};
			break;
	
		case 'album':
			var albums = getAlbums(dataObj);
			// var len = getCount(dataObj);
			var len = 0;
			if (albums !== null) {
				len = albums.length;
			};
			if (len == 0) {
				html = 'No item found.';
			};
			// console.log(type+' '+sType);
			var headerAdded = false;
			for (var i = 0; i < len; i++) {
				if (!headerAdded) {
					html +=		'<div class="section group"><div class="col span_1_of_4">Album Image</div><div class="col span_1_of_4">Album Name(No. of Tracks)</div><div class="col span_1_of_4">Label</div><div class="col span_1_of_4">Artists</div></div>';
					headerAdded = true;
				};
				html +=		'<div id="album_'+albums[i].album_id+'" class="section group">';
				html +=			'<div class="col span_1_of_4">';
				html +=				'<img src="'+albums[i].artwork+'" height="80">';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				albums[i].title +'('+albums[i].trackcount+')';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				albums[i].recordlevel;
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				getArtist(albums[i]);
				// html +=				'<button>Play</button>';
				html +=			'</div>';
				html +=		'</div>';
			};

			break;
	
		case 'artist':
			var artists = getArtists(dataObj);
			// var len = getCount(dataObj);
			var len = 0;
			if (artists !== null) {
				len = artists.length;
			};
			if (len == 0) {
				html = 'No item found.';
			};
			// console.log(type+' '+sType);
			var headerAdded = false;
			for (var i = 0; i < len; i++) {
				if (!headerAdded) {
					html +=		'<div class="section group"><div class="col span_1_of_4">Artist Image</div><div class="col span_1_of_4">Artist Name</div><div class="col span_1_of_4">Songs and Albums</div><div class="col span_1_of_4">Ratings</div></div>';
					headerAdded = true;
				};
				html +=		'<div id="album_'+artists[i].artist_id+'" class="section group">';
				html +=			'<div class="col span_1_of_4">';
				html +=				'<img src="'+artists[i].artwork+'" height="80">';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				artists[i].name ;
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				artists[i].songs + ' Songs, ';
				html +=				artists[i].albums + ' Albums';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				artists[i].rating + ' Ratings';
				html +=			'</div>';
				html +=		'</div>';
			};
			break;
	
		case 'playlist':
			var playlists = getPlaylists(dataObj);
			// var len = getCount(dataObj);
			var len = 0;
			if (playlists !== null) {
				len = playlists.length;
			};
			if (len == 0) {
				html = 'No item found.';
			};
			// console.log(type+' '+sType);
			var headerAdded = false;
			for (var i = 0; i < len; i++) {
				if (!headerAdded) {
					html +=		'<div class="section group"><div class="col span_1_of_4">Playlist Image</div><div class="col span_1_of_4">Playlist Name</div><div class="col span_1_of_4"></div><div class="col span_1_of_4">Ratings</div></div>';
					headerAdded = true;
				};
				html +=		'<div id="album_'+playlists[i].playlist_id+'" class="section group">';
				html +=			'<div class="col span_1_of_4">';
				html +=				'<img src="'+playlists[i].artwork+'" height="80">';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				playlists[i].title ;
				// html +=				playlists[i].songs + ' Songs';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				// html +=				playlists[i].albums + ' Albums';
				html +=			'</div>';
				html +=			'<div class="col span_1_of_4">';
				html +=				(playlists[i].rating != null ? playlists[i].rating : '0') + ' Ratings';
				html +=			'</div>';
				html +=		'</div>';
			};
			break;

		default: 
			console.log('Wrong datatype found: '+type);
	
	}
	$("#"+type+" #"+sType).html(html);
}