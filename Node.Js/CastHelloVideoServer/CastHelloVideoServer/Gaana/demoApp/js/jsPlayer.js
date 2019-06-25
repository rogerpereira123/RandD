/*************** data parser and utils etc *******************/
var _currentSogId,isPlayingStatus=false, prerollPlayed = {}, playingPreRoll = false,_source,_source_id,_last_track_id,_playedtime ="00:00",_prerolllog = false;
var prerollFlagAlbumId = false;
var prerollOnAlbumBasis = [];
var prerollOnAlbumBasis = ['147885']; //Kochadaiiyaan Album Staging
var ArrayUtils = {};
ArrayUtils.copyArray = function(array_arr) {
	return array_arr.slice();
};
ArrayUtils.shuffleArray = function(array_arr) {
	for(var i = 0; i < array_arr.length; i++) {
		var randomNum_num = Math.floor(Math.random() * array_arr.length);
		var arrayIndex = array_arr[i];
		array_arr[i] = array_arr[randomNum_num];
		array_arr[randomNum_num] = arrayIndex;
	};
	return array_arr;
};
var DataParser ={};
DataParser = {
	separator: {itemSeparator:"||", dataSeparator:"##"},
	isInit:false,
	parseData: function(data) {			
			//alert(data)
			var srtg = data.replace(/\r|\n/gmi,'');
			this.currentData = srtg;
			var isJson = /^\[\{.*\}\]$/gmi;	
			var _songs_array = new Array();
			//trace("isJson.test(srtg) "+ (isJson.test(srtg)))
			if(isJson.test(srtg)===true) {
				try {
					_songs_array = eval(srtg);//JSON && JSON.parse(srtg) || $.parseJSON(srtg); //parse with core json if available otherwise with jquery					
				} catch(e) {
					//trace("Invalid JSON "+e);
					// utility.errorLog(e.message,'DataParser.parseData');
				}
				//trace(_songs_array)
			} else {
				var pickRegExp = /[^A-Za-z0-9#@|&;,()'\"\ \:.\/_-~|\-]/gmi;
				srtg = srtg.replace(pickRegExp, ""); //jsData;				
				_songs_array = srtg.split(this.separator.itemSeparator);
			};
			var arr = new Array();
			for(var i=0;i<_songs_array.length;i++) {
				var obj = {data:_songs_array[i], index:i};
				arr.push(obj);
			};
			//trace("arr.length "+arr.length)
			return arr;
	}
};

window.DataParser = DataParser;

//(function(window){
//some debug method -  will move to somewhere else
/**************************/
function trace() {
	try {	
		console.debug.apply(console, arguments);
	} catch(e) {
		try {
			opera.postError.log(opera, arguments);
		} catch(e) {
			alert(Array.prototype.join.call( arguments, " "));
		};
	};
};
window.trace = trace;
var jsPlayer = null; //this will be used as static - inside from flash too :D
function GaanaPlayer(sId, data, movieId) {	
	/*
	trace("================================");
	trace(sId, data, movieId);
	trace("================================");
	*/
	 var MSSound,
  	_gp = this, _ua = navigator.userAgent, _win = window, _wl = _win.location.href.toString(), _doc = document,  
  	_is_iDevice = _ua.match(/(ipad|iphone|ipod)/i), _isIE = _ua.match(/msie/i), _isWebkit = _ua.match(/webkit/i), _isSafari = (_ua.match(/safari/i) && !_ua.match(/chrome/i)), _isOpera = (_ua.match(/opera/i)), 
  	_mobileHTML5 = (_ua.match(/(mobile|pre\/|xoom)/i) || _is_iDevice),
  	_isOldSafari = (!_wl.match(/usehtml5audio/i) && _isSafari && !_ua.match(/silk/i) && _ua.match(/OS X 10_6_([3-7])/i)), // Safari 4 and 5 (excluding Kindle Fire, "Silk") occasionally fail to load/play HTML5 audio on Snow Leopard 10.6.3 through 10.6.7 due to bug(s) in QuickTime X and/or other underlying frameworks. :/ Confirmed bug. https://bugs.webkit.org/show_bug.cgi?id=32159
	_hasConsole = (typeof console !== 'undefined' && typeof console.log !== 'undefined'); 	   	
	
	this.movieDivID = (movieId || "tunePlayer"); //div holder
	this.soundId = (sId || "msPlayer"); //player id - will be used for sound object
	this.movieURL = null; // swf url
	this.swfLoaded = false; //is swf loaded
	this.prop = new Object(); //this will have lots of info
	this.isReady = false;
	this.version = "3.0";
	this.author = "Gaana Team";
	this.canPlay = true; 
	this.swfVars = {
		'data':(data || ""),//if null mean test or u can use test
		'baseUrl': "http://uat.gaana.com/", //this is for testing - we need to set serverpath here
		'enableRating':0,
		'enableComment':0,
		'useFlashUI':1, //this will enable UI control in flash - ie full screen view - will work later on this
		'playerId': _gp.soundId,
		'withLayout':1,
		'autoPlay':1, //enable playing of file as soon as possible (much faster if "stream" is true)
		'shuffle':0, //shuffle if sending data as playlist the playlist
		'from':0, // position to start playback within a sound (msec), default = beginning
		'to':null //// position to end playback within a sound (msec), default = last
	};	
	this.swfParams = {
		'salign':'center',
		'wmode':'transparent',
		'allowScriptAccess': 'always',	
		'allowFullScreen':'true'		 
	};
		
	this.defaultCallbacks = {    
	onId3: [],            		// callback function for "ID3 data is added/available"
	onReady:[],           		// callback function for "swf is ready to interact"
	onStreamLoad:[],     	// callback function for "download progress update" (X of Y bytes received)
	onStreamNotFound:[],
	onIO_Error:[],
	onSpectrumReady:[],
	onSpectrumError:[],
	onPlay:[],           		// callback for "play" start
	onPause:[],          		// callback for "pause"
	onResume:[],         		// callback for "resume" (pause toggle)
	onMeta: [],     			// callback during play (position update)
	onStop: [],           		// callback for "user stop"
	onError: [],        		// callback function for when playing fails
	onSoundComplete:[],         	// callback function for "sound finished playing"
	onPosition: null,         	// object containing times and function callbacks for positions of interest (secnods)
	onInit:[],
	onSeek:[]
  };	
	this.showSWF_Error = function() {
		this.canPlay = false;
		$( "#missingFlash").dialog({modal:true, minWidth:500, title:"Oops!"});
	}
	/***************** callback ****************/	
	this.playerId = sId; //player id - string
	this.data = data; //data - string
	this.sounds = {}; //static for all
	
	this.getMovieId = function(id) {
		return _gp.sounds[id].id || null;
	};	
	//create layout - create movie - i am using swfcreator for now. will change later
	var makeSWF = function(id, oOpt, cb) {		
		var versionRequire = 10.3; //playerVersion - is required
		var objPlayerVer = deconcept.SWFObjectUtil.getPlayerVersion(versionRequire, true);
		var playerVersion = eval(objPlayerVer.major+"."+objPlayerVer.minor);
		var so;
		var swfParams = oOpt.swfParams;
		var swfVars = oOpt.swfVars;
		
		var movieId = (id || _gp.movieDivID);
		var flashId = movieId+"_flash";
		if(playerVersion < versionRequire){						
			so = new SWFObject(TMStaticUrl+"/swf/playerProductInstall.swf",flashId, "100%", "100%", versionRequire, "#000000");
			_gp.showSWF_Error();
		} else {				
			_gp.canPlay = true;			
			var movieURL;
			if(this.movieURL) {
				movieURL = $.trim(this.movieURL);
			} else if($.trim(playerSwf).length>0) {
				movieURL = $.trim(playerSwf);
			} else {
				movieURL = TMUrl+"/swf/GaanaPlayerV2_v43.swf";
			}
			so = new SWFObject(movieURL, flashId, "100%", "100%", versionRequire, "#ffffff");
			//add params
			for(var i in swfParams) {
				so.addParam(i,swfParams[i]);
			};			
			//add vars
			for(var i in swfVars) {
				so.addVariable(i,swfVars[i]);
			};
		};
		so.write(movieId, cb);
		//debug
		var dbgid = movieId+"_dbug";		
		$("#"+movieId).after("<div id='"+dbgid+"'></div>");
	};	
	/**************** MSSound ******************/
	MSSound = function(sId, data, movieId, opt) {
		var id = sId;
		var _soundClass = this;
		var _isShuffleOn = false;
		var _autoPlay = true;
		var swfOptions = {};
		swfOptions.swfParams = _gp.swfParams;
		swfOptions.swfVars = _gp.swfVars;
		this.defaultCallbacks = new Object();
		this.resetOnComplete = false;
		var stack = [], isLoading = false;
		this.defaultCallbacks = {
				onId3: [],            		// callback function for "ID3 data is added/available"
				onReady:[],           		// callback function for "swf is ready to interact"
				onStreamLoad:[],     	// callback function for "download progress update" (X of Y bytes received)
				onStreamNotFound:[],
				onSpectrumReady:[],
				onSpectrumError:[],
				onIO_Error:[],
				onPlay:[],           		// callback for "play" start
				onPause:[],          		// callback for "pause"
				onResume:[],         		// callback for "resume" (pause toggle)
				onMeta: [],     			// callback during play (position update)
				onStop: [],           		// callback for "user stop"
				onError: [],        		// callback function for when playing fails
				onSoundComplete:[],         	// callback function for "sound finished playing"
				onPosition: null,         	// object containing times and function callbacks for positions of interest (secnods)
				onInit:[],
				onSeek:[]
				
		 };	
		var resetDefaultEvents = function() {
			_soundClass.defaultCallbacks = {
					onId3: [],            		// callback function for "ID3 data is added/available"
					onReady:[],           		// callback function for "swf is ready to interact"
					onStreamLoad:[],     	// callback function for "download progress update" (X of Y bytes received)
					onStreamNotFound:[],
					onSpectrumReady:[],
					onSpectrumError:[],
					onIO_Error:[],
					onPlay:[],           		// callback for "play" start
					onPause:[],          		// callback for "pause"
					onResume:[],         		// callback for "resume" (pause toggle)
					onMeta: [],     			// callback during play (position update)
					onStop: [],           		// callback for "user stop"
					onError: [],        		// callback function for when playing fails
					onSoundComplete:[],         	// callback function for "sound finished playing"
					onPosition: null,         	// object containing times and function callbacks for positions of interest (secnods)
					onInit:[],
					onSeek:[]					
			 };
		};
		if(typeof data == "object") {			
			//need everything as an object
			//will do something later		
		} else {
			if(typeof opt !== "undefined") {
				if(typeof opt.swfParams !== "undefined") {
					swfOptions.swfParams = $.extend(opt.swfParams, _gp.swfParams);
				};
				if(typeof opt.swfVars !== "undefined") {
					swfOptions.swfVars = $.extend(opt.swfVars, _gp.swfVars);
				};		
				if(typeof opt.swfVars !== "undefined") {
					this.defaultCallbacks = $.extend(opt.defaultCallbacks, _gp.swfVars);
				};
				_autoPlay = (typeof opt.autoPlay !== "undefined") ? opt.autoPlay : _autoPlay;
				_isShuffleOn = (typeof opt.shufflePlay !== "undefined") ? opt.shufflePlay : _isShuffleOn;
			};
		};
		
		/************ utitls ************/				
		 var makeData = function(s) {			
			var str = s;			
			_songs_array = new Array(), _songs_shuffle_array = new Array(), _current_songs_array = new Array();
			if(str && str.length>0) {
				_songs_array = DataParser.parseData(str.toString());
			}
			_songs_shuffle_array = ArrayUtils.shuffleArray(ArrayUtils.copyArray(_songs_array)); //copy in shuffle array
			_current_songs_array = (_isShuffleOn===true) ? ArrayUtils.copyArray(_songs_shuffle_array) : ArrayUtils.copyArray(_songs_array); //this will be will be used
		};
		/***********************************/
		
		/*********** parse data *************/
		var _songs_array = new Array();
		var _songs_shuffle_array = Array();
		var _current_songs_array = new Array();
		var _currentIndex = 0;		
		if(data=='test') {
			swfOptions.swfVars.data = 'test'; //if this is test
		} else {
			makeData(data);
			var firstData;
			if(_current_songs_array.length>0) {
				firstData = (typeof (_current_songs_array[_currentIndex].data)=="string") ? (_current_songs_array[_currentIndex].data) : $.toJSON((_current_songs_array[_currentIndex].data));
			}
			//trace("firstData " + firstData);
			swfOptions.swfVars.data = (firstData || "");
		};		
		/*********** end parse *************/
		
		//add player id and more
		swfOptions.swfVars.playerId = id;
		//trace("swfOptions")
		//trace(swfOptions)
		//build invisible ui
		makeSWF(movieId, swfOptions, function() {
			//trace("movieId "+movieId)
			var flashId = movieId+"_flash";
			_gp.sounds[id]._flash = (_isIE) ? _win[flashId] : _doc[flashId]; 
			//trace(id+ " _gp.sounds[id].isReady "+_gp.sounds[id].isReady)
			if(_gp.sounds[id].isReady==false) {
				_gp.sounds[id]._onready();
			} 
		});
		
		/********** properties for sound ****************/
		this.prop = new Object();//this will loads of data
		this.id = id; // this id and playerid is same. to have legacy between flash and js
		this.data = data;
		this.movieId = movieId; // movie id is div id
		this.playerId = id; // sound id
		this.flashId = movieId+"_flash"; // sound id		
		this.swfOptions = swfOptions; //this holds vars and params
		this.playigStatus = _autoPlay;
		this.volume = 1;
		this.isReady = false;		
		// Player properties
		this.isBuffering = false;
		this.time = 0;
		this.songDurationSec = 0;		
		this.length = 0;
		this.bytesLoaded = 0;
		this.bytesTotal = 0;
		this.streamStarted = false;
		//these are callbacks from flash
		var fireEvents = function(arr, arguments) {			
			if(typeof arr=="function") {
				arr(arguments);
			} else if(arr instanceof Array) {
				for(var i=0;i<arr.length;i++) {
					//trace("i: " +i)
					try {
						eval(arr[i])(arguments);
					} catch(e) {
						//trace(e);
					}
				};
			};
		};	
		this._onSpecialError = function(type, msg) { //this is some special error coming from flash - this will be logged
			//if(type=="metadata")
			// utility.errorLog(msg, this.id+'.onSpecialError');
			//dontt email
			return false;
			$.ajax({
				url:TMUrl+"ajax/email.php",
				type:"post",
				data:{message:msg},
				success: function(res) {
					//silent
				}
			})
		}
		this._onready  = function(arg) {
			//alert(this.defaultCallbacks.onReady)
			//alert("onready")			
			_gp.sounds[this.id].isReady = true;
			_gp.sounds[this.id].swfLoaded = true;	
			_gp.isReady = true;
			_gp.swfLoaded = true; //first swf is ready
			if(this.defaultCallbacks.onReady.length!=0)  {				
				fireEvents(this.defaultCallbacks.onReady, arg);
			};
			//trace(_gp.defaultCallbacks.onReady);
		};
		this._onFlashLoad = function(arg){
			flashLoaded = true;
		};
		this._loding =function(arg){
			isLoading = false;
			if(this.defaultCallbacks.onIO_Error.length!=0)  {			
				fireEvents(this.defaultCallbacks.onIO_Error, arg);
			};		
			 // messagebox.open({msg:"Please check your network connection.",autoclose:true});
		}
		this._oninit = function(arg) {
			this.streamStarted = true;
			isLoading = false;
			_gp.stopAllSound(this.id);//excep this sound
			//check if something is in stack load the last one
		
			if(stack.length==0) {
				if(this.defaultCallbacks.onInit.length!=0)  {
					fireEvents(this.defaultCallbacks.onInit, arg);					
				};				
				//reset onposition on next song
				if(this.defaultCallbacks.onPosition!=null) {
					for(var i in this.defaultCallbacks.onPosition) {
						this.defaultCallbacks.onPosition[i].isCalled = false;
					};
				};
			} else {
				_gp.stopAllSound(); //stop all sound there is loaded
				//load the last one
				this.createSound(stack[stack.length-1]);
				stack = [];//remove que
			}			
		};
		this._onplay = function(arg) {
			if(this.defaultCallbacks.onPlay.length!=0)  {
				//this.defaultCallbacks.onPlay.apply(this, arguments);
				fireEvents(this.defaultCallbacks.onPlay, arg);
			};
		};
		this._onpause = function(arg) {
			if(this.defaultCallbacks.onPause.length!=0)  {				
				fireEvents(this.defaultCallbacks.onPause, arg);
			};
		};
		this._onstop = function(arg) {
			if(this.defaultCallbacks.onStop.length!=0)  {				
				fireEvents(this.defaultCallbacks.onStop, arg);
			};
		};
		this._onseek = function(arg) {
			if(this.defaultCallbacks.onSeek.length!=0)  {
				//this.defaultCallbacks.onSeek.apply(this, arguments);
				fireEvents(this.defaultCallbacks.onSeek, arg);
			};
		};
		this._onstreamload = function(arg) {
			//update properties
			_gp.sounds[this.id].prop.buffer = arg;
			this.bytesLoaded = arg.bytesLoaded;
			this.bytesTotal = arg.bytesTotal;
			this.isBuffering = true;
			if(arg.percent>=100) {
				this.isBuffering = false;
			};						
			if(this.defaultCallbacks.onStreamLoad.length!=0)  {
				//this.defaultCallbacks.onStreamLoad.apply(this, arguments);
				fireEvents(this.defaultCallbacks.onStreamLoad, arg);
			};
		};		
		this._onmeta = function(arg) {				
			this.prop.meta = arg; //hold the current data
			_gp.sounds[this.id].prop.meta = arg;
			//update properties
			this.time = arg.time;
			this.length = arg.length;
			this.songDurationSec = arg.length;			
			
			if(this.defaultCallbacks.onMeta.length!=0)  {
				fireEvents(this.defaultCallbacks.onMeta, arg);
			};		
			
			//on position callback
			if(this.defaultCallbacks.onPosition!=null) {			
				//console.log(arg.time.toString())
				var roundTime = Math.round(arg.time).toString();
				if(this.defaultCallbacks.onPosition[roundTime] && this.defaultCallbacks.onPosition[roundTime].isCalled==false) {
					var fn = this.defaultCallbacks.onPosition[roundTime].fn;
					this.defaultCallbacks.onPosition[roundTime].isCalled = true;
					fn.apply(this, arguments);
				};
			};			
			//trace(arg);
			//var dbgid = this.id+"_dbug";
			//var s = "Time: "+arg.time + " TotalTime: "+arg.length;
			//$("#"+dbgid).html(s).css({border:'1px solid #c3c3c3', padding:'10px'});
		};
		this._onsoundcomplete = function(arg) {
			//trace("onSoundComplete");
			if(this.defaultCallbacks.onSoundComplete.length!=0)  {
				//this.defaultCallbacks.onSoundComplete.apply(this, arguments);
				fireEvents(this.defaultCallbacks.onSoundComplete, arg);
			};
			//trace("this.resetOnComplete "+this.resetOnComplete)
			if(this.resetOnComplete===true) {
				resetDefaultEvents();
			}
		};
		this._onstreamnotfound = function(arg) {
			if(this.defaultCallbacks.onStreamNotFound.length!=0)  {				
				fireEvents(this.defaultCallbacks.onStreamNotFound, arg);
			};
		};
		this._onio_error = function(arg) {
                    //alert("inside io error1"+arg);
			this.streamStarted = false;
			isLoading = false;
			stack = [];//remove que
			
			if(this.defaultCallbacks.onIO_Error.length!=0)  {			
				fireEvents(this.defaultCallbacks.onIO_Error, arg);
			};		
		};
		this._onspectrumready = function(arg) {
			if(this.defaultCallbacks.onSpectrumReady.length!=0)  {				
				fireEvents(this.defaultCallbacks.onSpectrumReady, arg);
			};
		};
		this._onspectrumerror = function(arg) {
			if(this.defaultCallbacks.onSpectrumError.length!=0)  {				
				fireEvents(this.defaultCallbacks.onSpectrumError);
			};
		};
		this._onerror = function(msg) {
			this.streamStarted = false;
			isLoading = false;
			stack = [];//remove que
			//trace("msg "+(msg.message || msg))
			var message  = (typeof msg=="object") ? msg.message : msg;
                       // alert("1"+message);                    

                        if(this.defaultCallbacks.onError.length!=0)  {
                                //this.defaultCallbacks.onError.apply(this, arguments);
                                fireEvents(this.defaultCallbacks.onError, message);
                        };			
                        // utility.errorLog(message, this.id+'._onerror');
                        //trace("error:"+ (msg.message || msg));
                                
		};
		this._updateLastTrackId = function(msg) {
			_last_track_id = msg
			//alert(msg)
		};
		var getSongsArray = function () {
			return _current_songs_array;
		};
		//this will be used when we want to play list from this class - or single :D
		var moveToSongIndex = function(index) {
			if(index < getSongsArray().length) {
				var obj = getSongsArray()[index];
				//trace("moveToSongIndex");				
				var filePath = (typeof (obj.data)=="string") ? (obj.data) : $.toJSON((obj.data));								
				try {
					_soundClass.stopMe();
					var streamData = eval("["+obj.data+"]");
					streamData = streamData[0];					
					if(streamData.sType.toLowerCase()=="radio") {
						_soundClass.playRadio(streamData);
					} else {
						//alert(filePath)
						_soundClass._flash.createSound(_soundClass.playerId, filePath, 0); //passing only value
					}										
				} catch(e) {
					//trace("moveToSongIndex "+e);
					// utility.errorLog(e.message,"FmoveToSongIndex inside MSSound" );
				};
			};
		};
		/************** setter getter *****************/				
		this.testCallback = function() {
			try {
				this._flash.testCallback();
			} catch(e) {			
				// utility.errorLog(e.message, this.id+'.testCallback');
			};
		}
		this.init = function(data, autoPlay) {	
			makeData(data);
			moveToSongIndex(autoPlay);
		};	
		this.playMe = function() {
			try {
				this._flash.playMe();
			} catch(e) {
				//trace("playMe "+e);
				// utility.errorLog(e.message, this.id+'.playMe');
			};
		};
		this.playToggle = function() {
			try {
				this._flash.playToggle();
			} catch(e) {
				//trace("playToggle: "+e);
				// utility.errorLog(e.message, this.id+'.playToggle');
			};	
		};		
		this.pauseMe = function() {			
			try {
				this._flash.pauseMe();
				this.playigStatus = false;
			} catch(e) {
				//trace("pauseMe: " +e);
				// utility.errorLog(e.message, this.id+'.pauseMe');
			};
		};
		this.seekTo = function(pos) {
			try {
				this._flash.seekTo(pos);
			} catch(e) {
				//trace("seekTo: "+e);
				// utility.errorLog(e.message, this.id+'.seekTo');
			};		
		};
		this.setVolume = function(vol) {
			try {
				this.volume = vol;
				this._flash.setVolume(vol);
			} catch(e) {
				//trace("setVolume: "+e);
				// utility.errorLog(e.message, this.id+'.setVolume');
			};
		};
		this.mute = function() {
			try {
				this._flash.mute();
				this.volume = 0;
			} catch(e) {
				//trace("mute "+e);
				// utility.errorLog(e.message, this.id+'.mute');
			};
		};
		this.fadeMute = function() {
			try {
				this._flash.fadeMute();
				this.volume = 0;
			} catch(e) {
				//trace("fadeMute "+e);
				// utility.errorLog(e.message, this.id+'.fadeMute');
			};
		};
		this.fadeStop = function() {
			try {
				this._flash.fadeStop();
			} catch(e) {
				//trace("fadeStop "+e);
				// utility.errorLog(e.message, this.id+'.fadeStop');
			};
		};
		this.stopMe = function() {
			try {
				this._flash.stopMe();
			} catch(e) {
				//trace("stopMe "+e);
				// utility.errorLog(e.message, this.id+'.stopMe');
			};
		};
		this.getMemoryUsage = function() {
			try {
				return this._flash.getMemoryUsage();
			} catch(e) {
				//trace("getMemoryUsage "+e);
				// utility.errorLog(e.message, this.id+'.getMemoryUsage');
			};
		};
		this.isPlaying = function() {	
			//trace("this._flash "+this._flash)
			try {
				return this._flash.isPlaying();
			} catch(e) {
				//trace("isPlaying "+e);
				//errorLog(e.message, this.id+'.isPlaying');
			};
		};
		this.connectLocal = function(conn, method) {			
			try {
				return this._flash.connectLocal(conn, method);
			} catch(e) {
				//trace("connectLocal "+e);
				// utility.errorLog(e.message, this.id+'.connectLocal');
			};
		};
		
		//just to keep uniform - same as init
		this.createSound = function(data, auto) {
			//_currentIndex = (index||0); //its used for autoplay now			
			if(typeof auto == "boolean") {
				this.setAutoPlay(auto);
			};
			_currentIndex = 0;
			//isLoading = false;
			if(isLoading==false) {
				isLoading = true;
				this.streamStarted = false;
				return this.init(data, _currentIndex);
			} else {
				stack.push(data);
			};	
			
	
		};
		this.setAutoPlay = function(auto) {
			try {
				return this._flash.setAutoPlay(auto);
				} catch(e) {
					//trace("setAutoPlay "+e);
					// utility.errorLog(e.message, this.id+'.setAutoPlay');
			};
		};
		this.setResetOnComplete = function(res) {
			this.resetOnComplete = res;
		}
		this.getCookies = function() {
			try {
				return this._flash.getCookies();
				} catch(e) {
					//trace("getCookies "+e);
					// utility.errorLog(e.message, this.id+'.getCookies');
			};
		};
		this.onReady = function(fn) {
			this.defaultCallbacks.onReady.push(fn);
		};
		this.onInit = function(fn) {
			this.defaultCallbacks.onInit.push(fn);
		};
		this.onPlay = function(fn) {
			this.defaultCallbacks.onPlay.push(fn);
		};
		this.onPause = function(fn) {
			this.defaultCallbacks.onPause.push(fn);
		};
		this.onStop = function(fn) {
			this.defaultCallbacks.onStop.push(fn);
		};
		this.onSeek = function(fn) {
			this.defaultCallbacks.onSeek.push(fn);
		};
		this.onStreamLoad = function(fn) {
			this.defaultCallbacks.onStreamLoad.push(fn);
		};
		
		this.onMeta = function(fn) {
			this.defaultCallbacks.onMeta.push(fn);
		};
		this.onSoundComplete = function(fn) {
			this.defaultCallbacks.onSoundComplete.push(fn);
		};
		this.onStreamNotFound = function(fn) {
			this.defaultCallbacks.onStreamNotFound.push(fn);
		};
		this.onIO_Error = function(fn) {
			this.defaultCallbacks.onIO_Error.push(fn);
		};
		this.onSpectrumReady = function(fn) {
			this.defaultCallbacks.onSpectrumReady.push(fn);
		};
		this.onSpectrumError = function(fn) {
			this.defaultCallbacks.onSpectrumError.push(fn);			
		};
		this.onError = function(fn) {
                   // alert(fn);
			this.defaultCallbacks.onError.push(fn);
		};
		this.onPosition = function(pos, fn, clear) {
			if(this.defaultCallbacks.onPosition==null || clear===true) {
				this.defaultCallbacks.onPosition = {};
			};	
			this.defaultCallbacks.onPosition[pos] = {time:pos, fn:fn, isCalled:false};
		};
		this.clearOnPosition = function(pos) {
			if(this.defaultCallbacks.onPosition!=null) {
				if(pos) {
					delete this.defaultCallbacks.onPosition[pos];
				} else {
					this.defaultCallbacks.onPosition = null;
				};
			};			
		};
		this.clearOn = function(method, fn) {
			var arr = this.defaultCallbacks["on"+method];
			if(arr) {
				if(arr.length>0) {
					for(var i=0;i<arr.length;i++) {
						if(arr[i]==fn) {
							arr.splice(i,1);
						}
					}
				}
			}
		};
		this.getVersion = function() {
			try {
				return this._flash.getVersion();
				} catch(e) {
					//trace("getVersion "+e);
					// utility.errorLog(e.message, this.id+'.getVersion');
			};
		};	
		
		
		/******************* Radio Mirchi ********************/
		this.playRadio = function(data) {
			try {
				//trace("this.playRadio");
				var stationId = data.stationId;//"137781"
				var feedId = data.feedId; //"MeethiMirchi@16318"
				_soundClass.stopMe();
				_soundClass._flash.playRadio(_soundClass.playerId, stationId, feedId);
			} catch(e) {
				//trace("playRadio "+e);
				// utility.errorLog(e.message, this.id+'.playRadio');
			}
		},
		
		this.trackLog = function(params){
			if(typeof params !='undefined'){
				a = this._flash.trackLog($.toJSON(params));
				
			}
		}
		
		/********************** event handler ****************/				
	};						
	/***************** end ms sound *********************/
	/************ for static *********************/
	
	this.playMe = function(sId) {
		var oSound = this.getSound(sId);
		oSound.playMe();
	};
	this.playToggle = function(sId) {
		var oSound = this.getSound(sId);
		oSound.playToggle();
	};
	
	this.pauseMe = function(sId) {			
		var oSound = this.getSound(sId);
		oSound.pauseMe();
	};
	this.seekTo = function(sId, pos) {
		var oSound = this.getSound(sId);
		oSound.seekTo(pos);
	};
	this.setVolume = function(sId, vol) {
		var oSound = this.getSound(sId);
		oSound.setVolume(vol);
	};
	this.mute = function(sId) {
		var oSound = this.getSound(sId);
		oSound.mute();
	};
	this.fadeMute = function(sId) {
		var oSound = this.getSound(sId);
		oSound.fadeMute();
	};
	this.fadeStop = function(sId) {
		var oSound = this.getSound(sId);
		oSound.fadeStop();
	};
	this.stopMe = function(sId) {
		var oSound = this.getSound(sId);
		oSound.stopMe();
	};
	this.isPlaying = function(sId) {			
		var oSound = this.getSound(sId);
		return oSound.isPlaying();
	};	
	//this is static and for sound too
	this.onReady = function(sId, fn) {
		//trace(sId, fn)
		if(typeof sId=="function") {			
			_gp.defaultCallbacks.onReady.push(sId); //add in the default
		} else if(sId && fn) {
			var oSound = this.getSound(sId);
			oSound.onReady(fn);
		}		
	};	
	this.onInit = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onInit(fn);
	};
	this.onPlay = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onPlay(fn);
	};
	this.onPause = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onPause(fn);
	};
	this.onStop = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onStop(fn);
	};
	this.onSeek = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onSeek(fn);
	};
	this.onStreamLoad = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onStreamLoad(fn);
	};
	
	this.onMeta = function(sId, fn) {		
		var oSound = this.getSound(sId);
		oSound.onMeta(fn);
	};
	this.onSoundComplete = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onSoundComplete(fn);
	};
	this.onStreamNotFound = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onStreamNotFound(fn);
	};
	this.onIO_Error = function(fn) {
           // alert("IOerror "+fn)
		var oSound = this.getSound(sId, sId);
		oSound.onIO_Error(fn);
	};
	this.onSpectrumReady = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onSpectrumReady(fn);
	};
	this.onSpectrumError = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onSpectrumError(fn);
	};
	this.onError = function(sId, fn) {
		var oSound = this.getSound(sId);
		oSound.onError(fn);
	};
	this.onPosition = function(sId, pos, fn, clear) {
		var oSound = this.getSound(sId);
		oSound.onPosition(pos, fn, clear);		
	};
	this.clearOnPosition = function(sId, pos) {
		var oSound = this.getSound(sId);
		oSound.clearOnPosition(pos);
	};
	
	this.createSound = function(sId, data, movieId, opt) {		
		var oSound = this.getSound(sId);		
		if(oSound == null) {			
			oSound = new MSSound(sId, data, movieId, opt);
			oSound._flash = (_isIE) ? _win[oSound.flashId] : _doc[oSound.flashId];
			_gp.sounds[sId] = oSound;
			if(_gp.defaultCallbacks.onReady.length!=0) {				 
				if(typeof arr=="function") {
					arr(oSound);
				} else if(arr instanceof Array) {
					for(var i=0;i<arr.length;i++) {
						arr[i](oSound);
					};
				};
			};
		} else {			
			oSound.createSound(data); //should have index option - will work on this
		};		
		return oSound;
	};
	this.getCookies = function(sId) {
		var oSound = this.getSound(sId);
		return oSound.getCookies();
	};
	this.getSound = function(id) {
		return _gp.sounds[id] || null;
	};
	this.getMemoryUsage = function(id) {
		var oSound = this.getSound(id);
		if(oSound!=null) {
			return oSound.getMemoryUsage();
		};
	};	
	//pause all sound
	this.stopAllSound = function(except) {
		var sounds = _gp.sounds;
		//trace(sounds)
		var exception = except || ""
		for(var i in sounds) {
			if(exception!=i) {
				try {
					//trace(sounds[i])
					sounds[i].stopMe();
				} catch(e) {
					//
				}
			}
		}
	};
	this.testCallback = function(sId) {
		var oSound = this.getSound(sId || "msPlayer");
		oSound.testCallback();
	}
	this.trackLog = function(sId) {
		var oSound = this.getSound(sId || "msPlayer");
		oSound.trackLog('dd');
	}
	this.showFlashPanel = function(sId) {		
		var oSound = this.getSound(sId || "msPlayer");
		$("#"+oSound.movieId).css({top:"-90px", zIndex:10});
	}
	this.hideFlashPanel = function(sId) {
		var oSound = this.getSound(sId || "msPlayer");
		$("#"+oSound.movieId).css({top:0, zIndex:0});
	}
	this.createSound("msPlayer", "", this.movieDivID);
};

//jsPlayer = new GaanaPlayer();
//window.GaanaPlayer = GaanaPlayer; //Main js player
//window.jsPlayer =  jsPlayer; //This will be used by flash and static
//window.jsPlayer2 = jsPlayer.createSound("jsplayer2","test", "player2");
//}(window));
/* ************* seekbar ****************** */
//This component is based on slider - all slider method is extended to seekbar. Added some new methods too. 
$.widget("ui.seekbar", $.extend({buffer:true}, $.ui.slider.prototype, {
  _init: function(){
	var o = this.options;
	if(o.buffer!==false) {
		this.element.prepend("<div class='buffer'></div>");
		this.element.find(".buffer")
				.addClass( "ui-slider" +
					" ui-slider-" + this.orientation +
					" ui-widget" +
					" ui-corner-all" +
					( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );	
		this.updateBuffer(0);
	}
	this.element.addClass("seekbar");	
    this.element.data('slider', this.element.data('seekbar'));
    return $.ui.slider.prototype._init.apply(this, arguments);
  },
  destory: function() { //has some bug in this
	//console.log("seekbar _destory");	
	$(this.element).html("");
	//$(this.element).slider("destory");	
  },
  update: function(val) { //this will work same as value
	//trace("val "+val)
	this.value(val);
	//console.log($(".ui-slider-handle").position().left +" : "+$(".ui-slider-range").width());	
	//console.log(val);
  },
  updateBuffer: function(val, animate) {
	  if(this.options.buffer!==false) {
		  if(animate) {
			  if(this.options.orientation == "vertical") {
				   this.element.find(".buffer").animate({height:val+"%"}, 1000);				   
			  } else {
				  this.element.find(".buffer").animate({width:val+"%"}, 1000);
			  };
		  } else {
			  if(this.options.orientation == "vertical") {
				   this.element.find(".buffer").css({height:val+"%"});
			  } else {
				  this.element.find(".buffer").css({width:val+"%"});
			  };
		  }
	  };
  },
  
  reset: function() {
	this.value(0);
	this.max = 0;
	this.updateBuffer(0);
  }
}));
$.ui.seekbar.defaults = $.extend({}, $.ui.slider.defaults); //to make sure it has all the properties

//initialize components
$(document).ready(function(e) {
	if($("#tunePlayer_SWF").length==0) {
		//craete a new one
		$("body").prepend("<div id='tunePlayer_SWF'></div>");
	};
    var jsPlayer = new GaanaPlayer("msPlayer", null, "tunePlayer_SWF");
	window.jsPlayer =  jsPlayer; //This will be used by flash and static
	
	//ui controller 
	uiController = new UIController();
});

/********************** ui controller **********************/
// ver: 1.3.1
function UIController(opt) {	
	var getDefaultSettings = function() {
		var settings = {
				containers:{
					player:'.mainPlayer',
					play:'.playPause',
					next:'.next',
					previous:'.previous',
					songSeekbar:'.songseek',
					volumeSeekbar:'.volumeseek',
					time:'.time',
					total:'.total',
					mute:'.mute',
					shuffle:'.shuffle',
					repeat:'.repeat',
					loader:'.loader'
				},
			  	events:{
				  play:null,
				  next:null,
				  previous:null,
				  songSeekbar:{start:null,slide:null,stop:null,enabled:true},
				  volumeSeekbar:{start:null,slide:null,stop:null,enabled:true},
				  mute:null,
				  shuffle:null,
				  repeat:null
				},
				volumeSeekValue:0.9,
				songSeekValue:0
				};
		return  settings;
	};
	var components = getDefaultSettings();
	this._components = $.extend(true, components, opt);	
	//if(!owner) throw "owner name is required";
	this.owner = {};
	this.containers = components.containers;
	this.events = components.events;
	var last = {};
	var _this = this, currentOwner;
	var getComponent = function(id) {
		return _this._components.containers.player +" " +_this._components.containers[id];
	};
	var elementCache = {};
	var getElement = function(ele) {
		if(elementCache[ele]) {
			return elementCache[ele];
		};
		elementCache[ele] = $(ele);
		return elementCache[ele];
	};
	var _disabled = function(cp, is, fade) {
		if(getComponent(cp)) {
			var holder = getComponent(cp);
			if(is==true) {
				switch(holder) {
					case "songSeekbar":
					case "volumeSeekbar":					
					break;
					default:
						var opacity = (!fade) ? 0.5 : 1;
						$(holder).removeClass("enabled").addClass("disabled").css({opacity:opacity, cursor:'default'});					
					break;
				}
				//remove listener
				_this.unbindEvent(cp);
				
			} else {
				switch(holder) {
					case "songSeekbar":
					case "volumeSeekbar":					
				break;
				default:
					$(holder).removeClass("disabled").addClass("enabled").css({opacity:1, cursor:'pointer'});					
				break;
				}				
				//remove listerner
				_this.unbindEvent(cp);
				//add listener
				if(_this.events[cp]) {
					//trace("_this.events["+cp+"]")
					//trace(_this.events[cp])
					_this.bindEvent(cp, _this.events[cp], true); //means dont assign in settings vars
				};
			};
		};
	};	
	/************ internal events **********************/	
	var resetOld  = function() {		
		getElement(getComponent("play")).unbind("click");
		getElement(getComponent("next")).unbind("click");
		getElement(getComponent("previous")).unbind("click");
		getElement(getComponent("mute")).unbind("click");
		getElement(getComponent("shuffle")).unbind("click");
		getElement(getComponent("repeat")).unbind("click");
	}
	var initButtonEvents = function() {
		resetOld();
		if(_this._components.events.play!=null) {
			getElement(getComponent("play")).bind("click", _this._components.events.play);
		};
		if(_this._components.events.next!=null) {
			getElement(getComponent("next")).bind("click", _this._components.events.next);
		};
		if(_this._components.events.previous!=null) {
			getElement(getComponent("previous")).bind("click", _this._components.events.previous);
		};
		if(_this._components.events.mute!=null) {
			getElement(getComponent("mute")).bind("click", _this._components.events.mute);
		};
		if(_this._components.events.shuffle!=null) {
			getElement(getComponent("shuffle")).bind("click", _this._components.events.shuffle);
		};
		if(_this._components.events.repeat!=null) {
			getElement(getComponent("repeat")).bind("click", _this._components.events.repeat);
		};
	}
	var initLayout = function () {
		//build ui - seekbar				
		if(isinit===false) {			
			getElement(getComponent("songSeekbar")).seekbar({max:0,
								   value:_this._components.songSeekValue,
								   range: "min",
								   step:0.01,
								   start: function(evt, ui) {								   
									   //assert(true, "song seek bar - start")								  
									   if(_this._components.events.songSeekbar.start!=null && _this._components.events.songSeekbar.enabled==true) {
										 _this._components.events.songSeekbar.start(evt, ui);
									   };
									},
								   slide:function(evt, ui) {
									   getElement(getComponent("songSeekbar")).seekbar("update", ui.value);
									   if(_this._components.events.songSeekbar.slide!=null && _this._components.events.songSeekbar.enabled==true) {
										   _this._components.events.songSeekbar.slide(evt, ui);
									   };
									},
								   stop:function(evt, ui){
									   //assert(true, "song seek bar - stop")
									    if(_this._components.events.songSeekbar.stop!=null && _this._components.events.songSeekbar.enabled==true) {
										  _this._components.events.songSeekbar.stop(evt, ui);
									   };
								   }
								   });			
			getElement(getComponent("volumeSeekbar")).seekbar({value:_this._components.volumeSeekValue, buffer:false,max:1, range: "min", step:0.01, animate: true, 
									start: function(evt, ui) {
									   //assert(true, "volumeSeekbar seek bar - start")
									   if(_this._components.events.volumeSeekbar.start!=null) {
										 _this._components.events.volumeSeekbar.start(evt, ui);
									   };
									},
									slide:function(evt, ui) {
									    if(_this._components.events.volumeSeekbar.slide!=null) {
										  _this._components.events.volumeSeekbar.slide(evt, ui);
									   };
									},	
									stop:function(evt, ui){
									   //assert(true, "volumeSeekbar seek bar - stop")
									    if(_this._components.events.volumeSeekbar.stop!=null) {
										  _this._components.events.volumeSeekbar.stop(evt, ui);
									   };
								   	}
									});
		}
		isinit = true;
	};
	var isinit = false;
	var initLayoutAndEvents = function() {		
		//reset old		
		initButtonEvents();
		initLayout();		
	};	
	var init = function() {
		initLayoutAndEvents();
	};
	init();	
	/*************** public **********************/	
	this.setOwner = function(name, opt) {
		var ownerObj;
		if(!this.owner[name]) { //if exist									
			//if not - need opt			
			this._components = ownerObj = $.extend(true, getDefaultSettings(), opt);
			this.owner[name] = {};
			this.owner[name]["name"] = name;
			this.owner[name]["components"] = this._components;
			ownerObj = this.owner[name];			
		} else {
			ownerObj = this.owner[name];
		}	
		currentOwner = name;
		//trace(ownerObj)
		//assing to current
		this._components = ownerObj.components;
		this.owner[name]["name"] = ownerObj.name;
		this.owner[name]["components"] = ownerObj.components;		
		this.events = ownerObj.components.events;
		this.containers = ownerObj.components.containers;
		_this._components = ownerObj.components;
		//restore old events - init
		initButtonEvents();
		return this;
	};
	this.getCurrentOwner = function() {
		return currentOwner;
	};
	this.restoreLastOwner = function() {
		if(lastOwner) {
			this.setOwner(lastOwner);
		}
	};
	this.disabled = function(h, is, fade) {		
		if(h.indexOf(",")>0) {
			var holders = h.split(",");
			//mutiple
			for(var i=0;i<holders.length;i++) {
				var crnt = $.trim(holders[i]);
				//trace("crnt "+crnt)
				_disabled(crnt, is, fade);
			};
		} else {
			_disabled(h, is, fade);
		};		
	};
	this.isDisabled = function(h) {
		return getElement(getComponent(h)).hasClass("disabled");
	};
	this.bindEvent = function(h, fn, isNew) {
		if(getComponent(h)) {
			this.unbindEvent(h);
			_this._components.events[h] = fn;
			switch(h) {
				case "songSeekbar":
				case "volumeSeekbar":
				if(isNew!=false) {
					this.events[h] = fn;
				};
				//getElement(getComponent(h)).seekbar("enable");
				if(fn.start) {
					_this._components.events[h].start = fn.start;
				}
				if(fn.slide) {
					_this._components.events[h].slide = fn.slide;
				}
				if(fn.stop) {
					_this._components.events[h].stop = fn.stop;
				}	
				_this._components.events[h].enabled = true;
				break;
				default:
				getElement(getComponent(h)).bind("click", _this._components.events[h]);
			};		
		};
	};
	this.unbindEvent = function(h) {
		if(_this._components.events[h]) {
			switch(h) {
				case "songSeekbar":
				case "volumeSeekbar":				
				//getElement(getComponent(h)).seekbar("disable");
				//_this._components.events[h].start = null;
				//_this._components.events[h].slide  = null;
				//_this._components.events[h].stop = null;
				_this._components.events[h].enabled = false;
				break;
				default:
				getElement(getComponent(h)).unbind("click", _this._components.events[h]);
			};			
		};
	};
	this.updateMeta = function(time, total, reset) {
	if(time) {
			if(getComponent("time")) {
				getElement(getComponent("time")).html(time);
			};
			if(!reset) {
				last.time = time;
			}
		};
		if(total) {
			if(getComponent("total")) {
				getElement(getComponent("total")).html(total);
			};
			if(!reset) {
				last.length = total;
			}
		};
	};
	
	this.updateBuffer = function(value, anim) {
		getElement(getComponent("songSeekbar")).seekbar("updateBuffer", value, anim);
	};	
	this.getTime = function() {
		//trace(getElement(getComponent("time")).html())
		return last;
	}
	this.resetTime = function() {
		last = {time:"00:00", length:"00:00"};
	}
	this.setCSS = function(h, css) {
		if(getComponent(h)) {
			getElement(getComponent(h)).addClass(css);
		};
	};
	this.removeCSS = function(h, css) {
		if(getComponent(h)) {
			getElement(getComponent(h)).removeClass(css);
		};
	};
	this.title = function(h, sText) {
		if(getComponent(h) && sText) {
			getElement(getComponent(h)).attr("title", sText);
		} else {
			return getElement(getComponent(h)).attr("title");
		};
	};
	//this method can remove/set event/property to a seekbar
	this.setSeekbarOption = function(h, key, value) {
		if(getComponent(h)) {
			//trace("h: " +h);
			getElement(getComponent(h)).seekbar("option", key, value);
		};
	};	
	this.getSeekbarOption = function(h, key) {
		if(getComponent(h)) {
			return getElement(getComponent(h)).seekbar("option", key);
		};
	};	
	this.updateSongSeek = function(value) {
		//trace("value "+parseFloat(value).toFixed(3))
		if(getComponent("songSeekbar")) {
			getElement(getComponent("songSeekbar")).seekbar("update", parseFloat(value));
		};
	};
	this.updateVolumeSeek = function(value) {
		if(getComponent("volumeSeekbar")) {
			getElement(getComponent("volumeSeekbar")).seekbar("update", value);
		};
	};
	this.reset  = function(h) {
		var comp = h || "songSeekbar";
		getElement(getComponent(comp)).seekbar("reset");
	};
	this.show = function(h, text, isBuffer) {
		if(h.indexOf(",")>0) {
			var holders = h.split(",");
			for(var i=0;i<holders.length;i++) {
				getElement(getComponent($.trim(holders[i]))).show();
			}
		} else {
			getElement(getComponent(h)).show();
			if(h=='loader') {
				getElement(getComponent(h)).html(text || "loading...");
				if(!isBuffer) {
					if(!getElement(getComponent("play")).hasClass("loadingPlay")) { //do it one time
						getElement(getComponent("play")).addClass("loadingPlay");
						this.disabled("play", true, 1); //last param is opacity
					}
				} else {
					if(getElement(getComponent("play")).hasClass("loadingPlay")) { //do it one time - enabled if being buffered
						getElement(getComponent("play")).removeClass("loadingPlay");
						this.disabled("play", false, 1); //last param is opacity
					}
				}
			}
		}
	};
	this.hide = function(h) {
		if(h.indexOf(",")>0) {
			var holders = h.split(",");
			for(var i=0;i<holders.length;i++) {
				getElement(getComponent($.trim(holders[i]))).hide();
			}
		} else {
			getElement(getComponent(h)).hide();
			if(h=='loader') {
				getElement(getComponent("play")).removeClass("loadingPlay");
				this.disabled("play", false);
			}
		}
		
	};
	
	this.ClearTime = function (){
		getElement(getComponent("total")).html('');
		getElement(getComponent("time")).html('');
	}
};

/************************* gaana master **********************/
function GaanaMaster(settings, isRadio) {
	try{
	var _this = this;
	this.version = "1.5.2";
	var _sound = jsPlayer.getSound("msPlayer"); 
	var _settings = $.extend(true,{
							data:null,
							index:0,
							repeat:0, //"playlist"
							shuffle:false,
							autoPlay:true,
							loadAtStartUp:true,
							events:{}
							},settings);
	var _data = _settings.data;	
	var _uiCtrlr;
	var _songs_array, _songs_shuffle_array, _current_songs_array;
	var playerModeLabel = {player:"jsPlayer", radioGaana:"radioGaana", radio:"radio", karaoke:"karaoke", radiotheme:"radiotheme",
			preroll:"preroll",genreRadio:'genreRadio',echonestplayer:'echonestplayer',Minisitetopsongs:'Minisitetopsongs'};
	var uiRules = {
				jsPlayer:{
					play:{enable:true, visible:true},
					next:{enable:true, visible:true},
					previous:{enable:true, visible:true},
					songSeekbar:{enable:true, visible:true},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:true, visible:true},
					repeat:{enable:true, visible:true},
					total:{visible:true},
					fn:function() {
						//_setRepeat(undefined, "playlist");
						$('.volumesettings').unbind('mouseenter mouseleave')
						   $('.volumesettings').hover(function(){
						            $('#volum').show();
      							    $(this).next('.control_blk').hide();
						    },function(){

						        $('#volum').hide();
      						    $(this).next('.control_blk').show();	
						    })
						
						$('.volumesettings').removeClass('col16per');
						$('#radio').removeClass('pjax genreRadio');
                                                $('#radio').removeAttr('href');
						Layout.enableGaanaIcon(true);
						 $('#volum').hide();
						$('.playPause').removeClass('radiopause')
						$('.playPause').removeClass('radioplay')
						$(".radioIcon").removeClass("active");
						 $('#radio').removeClass('actradio');   
						 $('.echonest1').css({display : 'none'});
						$('.radio_tool').css({display : 'inline-block'})
					  //if(_getSongsArray().length<=1) {			
							//_uiCtrlr.disabled("next,previous,shuffle,repeat", true);
                                                        manageButtonsForSongCount('next');
						//}
					}
				},
				radioGaana:{
							play:{enable:true, visible:true},
							next:{enable:true, visible:true},
							previous:{enable:false, visible:true},
							songSeekbar:{enable:true, visible:true},
							volumeSeekbar:{enable:true, visible:true},
							shuffle:{enable:false, visible:true},
							repeat:{enable:false, visible:true},
							total:{visible:true},
							fn:function() {
								$('.playPause').addClass('radiopause')
								$(".radioIcon").addClass("active");		
								 $('#radio').addClass('actradio');  
								 
								 $('.echonest1').css({display : 'none'});
								$('.radio_tool').css({display : 'inline-block'})
								 
								_setRepeat(undefined, 0);
								if(_getSongsArray().length>1) {			
									_uiCtrlr.disabled("next", false);	
								} else {
									_uiCtrlr.disabled("next", true);
								}
							}
				},
				radio:{
					play:{enable:true, visible:true},
					next:{enable:true, visible:false},
					previous:{enable:true, visible:false},
					songSeekbar:{enable:true, visible:false},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:true, visible:false},
					repeat:{enable:true, visible:false},
					total:{visible:false},
					fn:function() {
						 $('.volumesettings').unbind('mouseenter mouseleave')
						$('#volum').show();
        				$(this).next('.control_blk').hide();
						Layout.showHideNextSongInfo(false);
						Layout.showHideSocial(false);
						Layout.showHideRcommendation(false);
						Layout.showHideGaanaRadio(false);
						$(".radioIcon").removeClass("active");
                                                superCookie.setItem('genre_radio_url', null);
						$('#radio').removeClass('pjax genreRadio');
                                                $('#radio').removeAttr('href');
						_uiCtrlr.removeCSS("play", "play");//component, cssClass
						_uiCtrlr.setCSS("play", "pause");//component, cssClass
						_uiCtrlr.title("play", "Pause");
						
						 $('.echonest1').css({display : 'none'});
						$('.radio_tool').css({display : 'inline-block'})
					}
				},
				karaoke:{
					play:{enable:true, visible:true},
					next:{enable:false, visible:true},
					previous:{enable:false, visible:true},
					songSeekbar:{enable:false, visible:true},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:false, visible:true},
					repeat:{enable:false, visible:true},
					total:{visible:true},
					fn:function() {
						//_uiCtrlr.disabled("previous,next,shuffle,repeat,songSeekbar", true);
						$('.playPause').removeClass('radiopause')
						$('.playPause').removeClass('radioplay')
						Layout.showHideSocial(false);
						Layout.showHideRcommendation(false);
						Layout.showHideGaanaIcon(false);
						_uiCtrlr.removeCSS("play", "pause");//component, cssClass
						_uiCtrlr.removeCSS("play", "play");//component, cssClass
						_uiCtrlr.setCSS("play", "stop");//component, cssClass			
						_uiCtrlr.title("play", "Stop");
						$('#radio').removeClass('pjax genreRadio');
                                                $('#radio').removeAttr('href');
						_setRepeat(undefined, 0);
						 $('.echonest1').css({display : 'none'});
							$('.radio_tool').css({display : 'inline-block'})
					}
				},
				genreRadio:{
					play:{enable:true, visible:true},
					next:{enable:true, visible:true},
					previous:{enable:true, visible:false},
					songSeekbar:{enable:true, visible:false},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:true, visible:false},
					repeat:{enable:true, visible:false},
					total:{visible:false},
					fn:function() {
					 $('.volumesettings').unbind('mouseenter mouseleave')
						$('#volum').show();
                                                $(this).next('.control_blk').hide();
						Layout.showHideNextSongInfo(false);
						Layout.showHideSongQueue(false);
						Layout.enableGaanaIcon(false);
						Layout.showHideRcommendation(false);
						$(".radioIcon").removeClass("active");
						$('#radio').addClass('pjax genreRadio');
						//alert(_genre_radio_url)
                                                $('#radio').attr('href',_genre_radio_url)
						$('#radio').attr('title','Gaana Radio');
						$('.playPause').removeClass('radiopause')
						$('.playPause').removeClass('radioplay')
						$(".radioIcon").removeClass("active");
						_uiCtrlr.removeCSS("play", "play");//component, cssClass
						_uiCtrlr.setCSS("play", "pause");//component, cssClass
						_uiCtrlr.title("play", "Pause");
						 $('.echonest1').css({display : 'none'});
						$('.radio_tool').css({display : 'inline-block'})
					}
				},
				radiotheme:{
					play:{enable:true, visible:true},
					next:{enable:true, visible:true},
					previous:{enable:false, visible:true},
					songSeekbar:{enable:false, visible:true},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:false, visible:true},
					repeat:{enable:false, visible:true},
					total:{visible:true},
					fn:function() {				
						$(".radioIcon").removeClass("active");
						Layout.showHideGaanaIcon(false);
						_setRepeat(undefined, 0);						
					}
				},
				
				preroll:{
					play:{enable:false, visible:true},
					next:{enable:false, visible:true},
					previous:{enable:false, visible:true},
					songSeekbar:{enable:false, visible:true},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:false, visible:true},
					repeat:{enable:false, visible:true},
					total:{visible:true},
					fn:function() {				
						$(".radioIcon").removeClass("active");
						Layout.showHideGaanaIcon(false);
						Layout.showHideSocial(false);
						_setRepeat(undefined, 0);						
					}
				},
				
				echonestplayer : {
					play:{enable:true, visible:true},
					next:{enable:true, visible:true},
					previous:{enable:true, visible:false},
					songSeekbar:{enable:true, visible:false},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:true, visible:false},
					repeat:{enable:true, visible:false},
					total:{visible:false},
					fn:function() {
					 $('.volumesettings').unbind('mouseenter mouseleave')
						$('#volum').show();
        				$(this).next('.control_blk').hide();
						Layout.showHideNextSongInfo(false);
						Layout.showHideSongQueue(false);
						Layout.enableGaanaIcon(false);
						$('#radio').removeClass('genreRadio');
						Layout.enableGaanaIcon(true);
						_uiCtrlr.removeCSS("play", "play");//component, cssClass
						_uiCtrlr.setCSS("play", "pause");//component, cssClass
						_uiCtrlr.title("play", "Pause");
						$('.echonest1').css({display : 'block'});
						$('.radio_tool').css({display : 'none'})
						 manageButtonsForSongCount('next');
					}
				},
				
				Minisitetopsongs:{
					play:{enable:true, visible:true},
					next:{enable:true, visible:true},
					previous:{enable:true, visible:true},
					songSeekbar:{enable:true, visible:true},
					volumeSeekbar:{enable:true, visible:true},
					shuffle:{enable:true, visible:false},
					repeat:{enable:true, visible:false},
					total:{visible:false},
					fn:function() {
						$('.volumesettings').unbind('mouseenter mouseleave')
						$('#volum').show();
        				$(this).next('.control_blk').hide();
						Layout.showHideNextSongInfo(false);
						Layout.showHideSongQueue(false);
						Layout.enableGaanaIcon(false);
						$('#radio').removeClass('genreRadio');
						Layout.enableGaanaIcon(true);
						_uiCtrlr.removeCSS("play", "play");//component, cssClass
						_uiCtrlr.setCSS("play", "pause");//component, cssClass
						_uiCtrlr.title("play", "Pause");
						Layout.showHideRcommendation(false);
						Layout.showHideGaanaIcon(false);
						
						$('.echonest1').css({display : 'block'});
						$('.radio_tool').css({display : 'none'})
					}
				}
				
				
			};
	
	
	var _isShuffleOn = false,currentPlayerMode = playerModeLabel.player, playerMode = playerModeLabel.player; //jsPlayer, radioGaana, radio
	var _currentIndex = _settings.index;
	var _nextIndex = '';
	var _radioId = (isRadio || false);
	var _isUI_Init = false, logsUpdated=false, firstPlay=true,reconnect = false,playmode=false;
	var prerollPlayed = {}, playingPreRoll = false;
	var playerLogTimer, logTime = 10; //after 10 secnods
	var currentVal,oldVal,currentVolume,oldVolume, isRadio = false, ignoreRepeat = false, ignoreShuffle=false, playingFromCache=false, hasCacheData=false;
	this._events = $.extend({}, _settings.events);			
	var _radioThemeLevel=''; // Radio Mood, Radio Channel etc
	var _cursonginfo = '';   // Current Song info; to be used in Now playing on Radio Gaana
	var _radioThemeId = 0;   // Radio Channel or Mood Id 
	//This will be used for if a song is taking too much to load.
	//we can do some action
	var TimeChecker = {
			intervalid:0,
			counter:1,
			maxCheck:60,//seconds
			start: function() {
				TimeChecker.intervalid = setInterval(function() {
					TimeChecker.counter++;
					if(TimeChecker.counter>=TimeChecker.maxCheck) {
						//trace("Refresh the page... Taking too much time?")
						TimeChecker.reset();
					}
				}, 1000)
			},
			reset: function() {
				this.counter = 1;
				clearInterval(TimeChecker.intervalid);
			}
	};	
	var addGA_Events = function(act, lbl) {
		// var action = act
		// var label = lbl;
		// _gaq.push(['_trackEvent',"Player UI Interactions", "g3-"+action, label]);
		//_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
	}
	var _saveList = function() {	
		if(_data) {	
			if($.trim(playerMode)=='genreRadio') {
                                superCookie.setItem(_variables.CookiesLabel.que, _data);
                                Layout.setgenreRadioSongCards();
                                //console.log("_variables.CookiesLabel.que-"+_variables.CookiesLabel.que+"_data-"+_data);
			}else{
				superCookie.setItem(_variables.CookiesLabel.que, _data);	
			}
		};
	};
	var _makeData = function(s) {
		var str = s;			
		_songs_array = new Array(), _songs_shuffle_array = new Array(), _current_songs_array = new Array();
		if(!str) return;
		_songs_array = DataParser.parseData(str.toString());
		_songs_shuffle_array = ArrayUtils.shuffleArray(ArrayUtils.copyArray(_songs_array)); //copy in shuffle array
		_current_songs_array = (_isShuffleOn===true) ? ArrayUtils.copyArray(_songs_shuffle_array) : ArrayUtils.copyArray(_songs_array); //this will be will be used		
		//trace("_isShuffleOn "+_isShuffleOn)		
	};		
	var _initUI = function() {
		//assert(true, "_initUI");
		_uiCtrlr = uiController.setOwner("gaanaMaster", {
			events:{
				play:_play,
				next:_next,
				previous:_previous,
				songSeekbar:{start:_setSongDragging,stop:_dragSongSeek},
				volumeSeekbar:{slide:_adjustVolume, stop:afterMute},
				mute:_mute,
				shuffle:_shufflePlay,
				repeat:_setRepeat
			}
			}); //events and owener
		_isUI_Init = true;
		_setRepeat(undefined, "playlist"); //set deafult repeat as playlist
	};	
	var _updateMeta = function(arg) {	
		//trace(arg)
		staticPlayer.updateMeta(arg);
	};
	var _updateBuffer = function(arg) {
		staticPlayer.updateBuffer(arg);		
	};
	var soundOnInit = function(arg) {
		//trace(arg)
	/*	var end = new Date().getTime();
		var time = end - window.start;
		trace('Execution time: ' + time);*/
	if(typeof _playedtime !='undefined' && _playedtime != "00:00") {
			try{
			//trace(params)
				
			Logs.addTrackLog(); //on last song there is no update - will see later
			}catch(e){
				//alert(e.message)
			}
		} else {
			Logs.addTrackLog();
			//alert(2)
		}
		try{
			TimeChecker.reset();
			resetStartupSettings();
			_uiCtrlr = uiController.setOwner("gaanaMaster"); //dont need to pass same event again
			staticPlayer.setSound_n_UI(_sound, _uiCtrlr); //make owner for sound and ui
			staticPlayer.updatePlayButton(true);
			_uiCtrlr.hide("loader");
			oldVolume = arg.volume;
			_uiCtrlr.updateVolumeSeek(arg.volume);
			//alert($.trim(playerMode))
			if($.trim(playerMode) =="radio"){
				//utility.postOnFacebook({action : 'music.listens',obj:'radio_station',url:TMUrl + "player/"+arg.radioInfo.stationId+"|||radiostation"})
			}else{
				var songInfo = $.parseJSON(arg.songInfo);
				/****** call netspider ******************/
				adsVariable.album = songInfo.albumname;
				adsVariable.artist = songInfo.artist;
				adsVariable.songtitle = songInfo.title;
				if($.trim(playerMode) !="karaoke" && playingPreRoll==false){
                   	adsPlayEvent();
				}
			}
			
			/************** end ***********************/
			//playerInitilizeHistory(songInfo.id,false)
			var cacheData = superCookie.getItem(_variables.CookiesLabel.que);
			//playerInitilizeList(cacheData,null);			
			// Code added by Nabajyoti for Now Playing in Radio Theme
			playerMode = $.trim(playerMode);					
			var formatedText = "";
			if(typeof playerMode!='undefined' && ((playerMode=='radioGaana') || (playerMode=='radiotheme')) ){				
				 if(playerMode=='radiotheme')
					 formatedText = '<div class="songName">You are enjoying the '+_radioThemeLevel+' channel.</div>';
				 else if(playerMode=='radioGaana' && (_cursonginfo!='') && (typeof _cursonginfo!='undefined')) {					 
					 var formatedText = "<div class=\"songName\">You are listening to Radio Gaana based on the song <a onclick=\"callHistory('/albums/"+_cursonginfo.albumseokey+"');\" href=\"javascript:void(0);\">"+_cursonginfo.title+ "</a></div>";		
					 //+' '+songInfo.title '+Layout.buildArtistHtml(songInfo)+'<span>-'+Layout.buildAlbumHtml(songInfo)+
					//console.log(songInfo);
				}
				$('#nowPlayingRadioTheme').html(formatedText);
				$('#nowPlayingRadioTheme').find('.albumName').removeClass('albumName');				
				//Storing the data in cookie
				//createCookie("gaana_radiotheme",escape(formatedText), 1);				
				_radioThemeLevel = (_radioThemeLevel!='')?_radioThemeLevel:'';
				createCookie("gaana_radiotheme","{'playerMode':'"+playerMode+"','id':'"+_radioThemeId+"','name':'"+_radioThemeLevel+"','data':\""+escape(formatedText)+"\"}", 1);				
			}
			else {
				//Storing the data in cookie
				$('#nowPlayingRadioTheme').html("");
				createCookie("gaana_radiotheme","", 1);
			}
			// Code End here..
			
			// Removing the layer while song is started ....
			if(flagAdsOverThePlayer || flagAirtelAdsOverThePlayer){
				clearPromotionalLayerAbovePlayer();
			}	
						
			_sound.onPosition(150, function() {				
				// GAANA-6581 For any pre rolls to count the number of songs, please use the criteria that song must have been heard for over 2.5 minutes. then only count it as 1 song play.				
				//if(playingPreRoll == false && $.trim(playerMode) !="radio" && $.trim(playerMode) !="karaoke"){
				if(isGaanaPaidUserCheck()) {
					return;
				}
                if($.trim(playerMode) !="radio" && $.trim(playerMode) !="karaoke" && $.trim(playerMode) !="genreRadio"){	
					updateCommonPreRoll();			
                }	
				// End Here			
			});	
			
						
			// Counter increment for GenreRadio so that video preroll can be played on each 3 minutes 
			_sound.onPosition(120, function() {	
				//console.log("After the playing of 10 sec ... "+playingPreRoll+" "+playerMode);
				if(playingPreRoll == false && $.trim(playerMode) =="genreRadio"){	
					var cookieName = "globalGenreRadio";
					if(typeof readCookie(cookieName) =='undefined' || readCookie(cookieName)==null ){
						createCookie(cookieName , 1)
					}else{
						value = readCookie(cookieName);
						createCookie(cookieName , parseInt(value)+1);
					}					
				}
			});
			
			_sound.onPosition(30, function() {
				
				if(playingPreRoll == false && $.trim(playerMode) !="radio" && $.trim(playerMode) !="karaoke" ){	
					songInfo =  gaanaMaster.getCurrentInfo();
					Layout.updateCataLog(songInfo.id,'play');
					
				}
				
				if($.trim(playerMode) =="radio"){
					// utility.postOnFacebook({action : 'music.listens',obj:'radio_station',url:TMUrl + "player/"+arg.radioInfo.stationId+"|||radiostation"})
				}
				if($.trim(playerMode) !="karaoke" && playingPreRoll==false){
					var uriToPost=getUrl(songInfo.title,songInfo.id,songInfo.seokey);
					if(typeof uriToPost !='undefined')
					{
					// utility.postOnFacebook({action : 'music.listens',obj:'song',url:TMUrl + "song/"+uriToPost})
					                    
					                    }
					}
				
				
			}
			
					
				
			)		
			
			_sound.onPosition(4, function() {
				if(isGaanaPaidUserCheck()) {
					return;
				}
				if(playingPreRoll == false && $.trim(playerMode) !="radio" && $.trim(playerMode) !="karaoke" ){	
					songInfo =  gaanaMaster.getCurrentInfo();
					currentSongId = songInfo.id;
					isAdsChanelSong = false;
					if(typeof(playlistTrackIdsArray) !='undefined' && playlistTrackIdsArray != null){
						isAdsChanelSong = (playlistTrackIdsArray.indexOf(currentSongId) != -1);
					}
										
					//alert(isAdsChanelSong);
					if(gridPlaySong && songInfo.channelId==35){
						gridPlaySong = false
						//	Ads.showAd("fantaModal", 0, arg);					
					}else if(flagAirtelAdsOverThePlayer && isAdsChanelSong) {								
						// Cross checking of Track Id whether it exist in the global array of Promotional Array defined in JS						
						//console.log(songInfo);
						 gAnalyticChannelClick('Aitel song of the day','Play','Banner over Player');
						Ads.showAd('airtelAds', 5000, arg);
					}
					else if(flagAdsOverThePlayer) {
                                            
						Ads.showAd('formulaOne', 5000, arg);
					}	
				}			
			});
	
			logsUpdated = false;	
		}catch(e){
		
		}	
			//trace("isRadio "+ (isRadio===true))
			if(isRadio===true) {	
				//trace("RadioMetaData.init")
				RadioMetaData.init(superCookie.getItem("stationid"));
				//Logs.startRadioLog();
			} else {					
				//Layout.renderCurrentSongInfo(_getSongsArray()[_currentIndex].data, 0);				
				//add to fb event if login
				staticPlayer.FB_Events.pause();
				
				Logs.stopRadioLog();
				RadioMetaData.stopUpdating();
			}
			//this will enable/disabled next prev etc
			 if($.trim(playerMode) =="echonestplayer" ){	
				 manageButtonsForSongCount('next');
			 }else{
				 manageButtonsForSongCount('next');
			 }
			
			
	}
	var _initSoundCallback = function() {
		_sound.onMeta(_updateMeta);
		_sound.onStreamLoad(_updateBuffer);
		//_sound.onPosition(10, Ads.showAd); //if one time
		_sound.onPause(function(arg){
			Layout.pauseSong(arg)
			//assert(true, "onPause event is called");
		});
		_sound.onInit(soundOnInit);		
		_sound.onSoundComplete(function(arg) {
			logsUpdated = true;
			afterSoundCompleted(arg);
			staticPlayer.FB_Events.stop();
		});
		_sound.onIO_Error(function(arg) {
			
			_uiCtrlr.hide("loader");
			_uiCtrlr.removeCSS('play','pause');
			_uiCtrlr.removeCSS('play','play')
          //  ShowMessage("Please check your network connection.")
            messagebox.open({msg:"Please check your network connection.",autoclose:true});
		})
		_sound.onError(function(arg) {	
			//trace('_sound.onError')
			//trace(playerMode);
			//trace(arg)
			gAnalyticChannelClick('Player Error',arg);
                 if(arg=="Network IO error." || arg=='Network has been changed. Please retry.')
                            {
                    			//_uiCtrlr.hide("loader");
                    			_uiCtrlr.hide("loader");
                    			_uiCtrlr.removeCSS('play','pause');
                    			_uiCtrlr.removeCSS('play','play')
                              //  ShowMessage("Please check your network connection.")
                                messagebox.open({msg:"Please check your network connection.",autoclose:true});
                                
                            }else if(arg=='NetConnection.Connect.IdleTimeOut'){
                            	
                            }else if(arg=='Connection is closed. Please retry.'){
                            	_uiCtrlr.hide("loader");
                    			_uiCtrlr.removeCSS('play','pause');
                    			_uiCtrlr.removeCSS('play','play')
                            	reconnect = true;
                            	// ShowMessage("Connection is closed. Please retry.")
                            	 messagebox.open({msg:"Connection is closed. Please retry.",autoclose:true});
                            }else{
                            	if(typeof playerMode!='undefined' && playerMode !='radio') {
                                 messagebox.open({msg:"Oops... There is some error. Moving to next...",autoclose:true});
                                  _next();
                            	}
                            }
			
		});		
		//set player controller
		staticPlayer.setSound_n_UI(_sound, _uiCtrlr); //make owner for sound and ui
	};
	var _init = function() {	
		//alert(33)
		try {
			if(!_isUI_Init) {
				_initUI();	
				_initSoundCallback();
			};					
		//make data;
		if(_data!=null) {			
			_makeData(_data);
			//trace("_settings.loadAtStartUp "+_settings.loadAtStartUp)
			//trace(_data);
			if(_settings.loadAtStartUp==true) {
				//_uiCtrlr.show("loader");
				//_uiCtrlr.reset("songSeekbar");		
				//staticPlayer.updateMeta({time:0, length:0}, true);	
				_moveToSongIndex(_currentIndex);
			} else {
				hasCacheData = true;
				//show info
				var obj = _songs_array;
				//trace(obj)
				if(gaanaMaster.getSongsCount() > 0){
					if(gaanaMaster.getSongsCount()>1){
						$('.songcnt').html(gaanaMaster.getSongsCount() +" Songs")
					}else{
						$('.songcnt').html(gaanaMaster.getSongsCount() +" Song")
					}
					
				}
				Layout.renderCurrentSongInfo(obj[0].data, 0);
				if(obj.length>1) {
					Layout.renderNextSongInfo(obj[1].data);
				}
			}
		} else {
			_makeData();//this will create array
		};
		//this will enable/disabled next prev etc
		manageButtonsForSongCount();
		
		//save in cookie
		if(superCookie) {
			if(superCookie.isReady) {
				_saveList();
			} else {
				superCookie.onReady = function() {
					_saveList();
				}
			}
		}		
		//trace("after _settings.loadAtStartUp "+_settings.loadAtStartUp)
		} catch(e) {
			//trace("init Error: "+e.message)
			// utility.errorLog(e.message, "init Error");
		}
	};
	var _inializeGaanaMaster = function() {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		if(_sound.isReady) {
			_init();
			
		} else {
			_sound.onReady(function() {			
				//assert(true, " Well... Sound player is ready...");
				//alert("after _sound.isReady "+_sound.isReady)
				_init();
				
			});
		};	
	};
	var applyUIRules = function() {
		var rules = uiRules[playerMode];
		//trace(rules)
		for(var i in rules) {
			if(i!=='fn') { //not equal to function					
				if(rules[i].enable===undefined) {
					_uiCtrlr.disabled(i, false);
				} else {
					_uiCtrlr.disabled(i, !rules[i].enable);
				}				
				if(rules[i].visible) {
					_uiCtrlr.show(i);
				} else {
					_uiCtrlr.hide(i);
				}
			}
		}
		//check if there is a method
		if(rules.fn!==undefined) {
			rules.fn.apply(this, arguments);
		}
	}
	var setUIForPlayer = function() {
		//trace("Calling setUIForPlayer");
		//trace(_uiCtrlr)
		//trace(_uiCtrlr)
		//default settings
		_uiCtrlr.show("next,previous,total,shuffle,repeat,songSeekbar");
		Layout.showHideGaanaIcon(true);
		//console.log("_settings.autoPlay "+_settings.autoPlay)		
		_uiCtrlr.removeCSS("play", "stop");//component, cssClass		
		if(_settings.autoPlay==true) {
			$(".playPause").removeClass("play");
			$(".playPause").addClass("pause");			
			_uiCtrlr.title("play", "Pause");
		} else {				
			_uiCtrlr.removeCSS("play", "pause");//component, cssClass
			_uiCtrlr.setCSS("play", "play");//component, cssClass
			_uiCtrlr.title("play", "Play");
			_settings.autoPlay = true; //after one -  set it auto play
		}		
		Layout.showHideNextSongInfo(true);
		Layout.showHideSocial(true);
		Layout.showHideGaanaRadio(true);
		//apply ui rules
		applyUIRules();					
	}
	var setUIForRadio = function() {
		//apply ui rules
		applyUIRules();		
	}
	/************** player controll ****************/	
	var _setSongDragging = function(evt, ui) {
		staticPlayer.isDragging = true;
	};
	var _dragSongSeek  = function(evt, ui) {
		 currentVal = ui.value;		
		 _sound.seekTo(currentVal);
                 
                 if(currentVal < oldVal){
                     addGA_Events("Seek Bar Back", "drag");
                     
                 }else{
                     addGA_Events("Seek Bar Forward", "drag");
                 }
                 oldVal = currentVal;
		 staticPlayer.isDragging = false;
		 //addGA_Events("Seek Bar", "drag");
	};
	var _adjustVolume = function(evt, ui) {
		 staticPlayer.setVolume(evt, ui);
                 //console.log(evt);
                 currentVolume = ui.value;
		 
		 //addGA_Events("Volume Bar", "drag");
	};
	var afterMute = function() {
                if(currentVolume > oldVolume){
                     addGA_Events("Volume Bar Forward", "drag");
                 }else{
                     addGA_Events("Volume Bar Back", "drag");
                 }
                 oldVolume = currentVolume;
		 staticPlayer.afterMute();		 
	}
	var _mute  = function(evt) {
		 staticPlayer.mute();	
	};	 
	var resetStartupSettings = function() {
		//reset
		_settings.loadAtStartUp = true;
		hasCacheData = false;
		firstPlay = false;
		reconnect = false;
		playmode = false;
		//prerollPlayed = {}
		//playingPreRoll = false;
		_this.resetComp();
	}
	var _play = function(evt) {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		//trace("_settings.loadAtStartUp "+_settings.loadAtStartUp + " hasCacheData "+hasCacheData)
		if(_settings.loadAtStartUp==false && hasCacheData==true && firstPlay==true) {
			_moveToSongIndex(0);
				//reset
			resetStartupSettings();
		} else if(firstPlay==true) {
			//play auto matic
			_this.playAutomatic();
			resetStartupSettings();
		}else if(playmode==true){
			_currentIndex = 0;
			_moveToSongIndex(0);
			resetStartupSettings();
			
		}else if(reconnect==true){
			if(playerMode=='radio'){
				gaanaMaster.playRadio(RadioMetaData.streamdata)
			}else{
				_moveToSongIndex(_currentIndex);
				resetStartupSettings();
			}
			
		}
		var playigStatus = _sound.isPlaying();
		if(playigStatus) {
			//add to fb event if login
			staticPlayer.FB_Events.pause();
			addGA_Events("Pause", playerMode);			
		} else {
			//add to fb event if login
			staticPlayer.FB_Events.play();			
			addGA_Events("Play", playerMode);
		}
		staticPlayer.playToggle();
		
	};
	
	function afterSoundCompleted(arg) {				
		//trace("playingPreRoll "+playingPreRoll)
		//trace(playerMode +" 1 == "+ playerModeLabel.radioGaana)
		//add logs 		
		staticPlayer.updateMeta({time:_sound.length, length:_sound.length});
		_this.resetComp();		
		if(playingPreRoll==true) {
			playingPreRoll = false;
			_prerolllog = true
			//_playedtime = "00:00"
			var arr = _getSongsArray();
			var songInfo = arr[_currentIndex];
			prerollPlayed["pre_"+songInfo.data.id] = true;
			_moveToSongIndex(_currentIndex); //it wont incraese the number
		} else {
			if(typeof _uiCtrlr.getTime().time !='undefined' && _uiCtrlr.getTime().time != "00:00") {
				
					_playedtime = 	_uiCtrlr.getTime().time;
				}	
			_next();
		}		
		//trace(playerMode +" 2 == "+ playerModeLabel.radioGaana)
	}
	var _next = function(evt) {
		//trace(playerMode +" 2.3 == "+ playerModeLabel.radioGaana)
		
var arr = _getSongsArray();
		
		var songInfo = arr[_currentIndex];	
		//console.log("soninfo detail..........");
		//console.log(songInfo.data);
		if(typeof songInfo !='undefined' && (songInfo.data.source==15 || songInfo.data.source==17)) {
		//	var lastsongInfo = arr[_currentIndex-1];
			if(typeof _uiCtrlr.getTime().time !='undefined' && _uiCtrlr.getTime().time != "00:00") {
				var played_duration = _uiCtrlr.getTime().time.split(":");
				var tsecond = (parseInt(played_duration[0])*60)+parseInt(played_duration[1]);
				if(tsecond<=30){
					sendfeedbacktoechonest(songInfo.data.id,'skip_song');
				}else{
				/*	if(typeof songInfo.data.echonesttype !='undefined' && songInfo.data.echonesttype=="lookahead"){
						sendfeedbacktoechonest(songInfo.data.id,'played_song');
					} */
					
					echonestRadioPlay(songInfo.data.source,songInfo.data.source_id,songInfo.data.id);
					return;
				}
				
				echonestRadioPlay(songInfo.data.source,songInfo.data.source_id,songInfo.data.id);
				return;
				
			}
			/*if(typeof songInfo.data.lastlookahed !='undefined' && songInfo.data.lastlookahed =='last') {
				echonestRadioPlay(songInfo.data.source,songInfo.data.source_id,songInfo.data.id);
				return;
			}*/
		}	
		
		var incrCurrentIndex = false;
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		
		//trace(playerMode +" 2.5 == "+ playerModeLabel.radioGaana)
		resetStartupSettings();
		var repeatType = _settings.repeat;
		//trace(playerMode +" 3 == "+ playerModeLabel.radioGaana)
		if(evt) { //clicking on button
			if($(evt.target).hasClass("disabled")) {				
				return false;
			}
			ignoreRepeat = true;
			if(_currentIndex == _getSongsArray().length-1) {
				repeatType = "playlist"; //so will move to zero
			}			
			addGA_Events("Next", playerMode);
		} else {			
			if(playerMode == playerModeLabel.radioGaana) {
				repeatType = "playlist"; //it will load fresh one
			}
			addGA_Events("Next", "automatic");
			$('.addedsonglist').hide();
			$('.songadded').removeClass('whitebg');
			$('.songcnt').addClass('white') 
			
		}		
		clearTimeout(playerLogTimer);
		//var obj = _getSongsArray();
		
		//trace("_currentIndex "+_currentIndex)
		if(repeatType == "current" && ignoreRepeat==false) {
			//_sound.seekTo(0); //we can use _moveToSongIndex method too. - will see
			//staticPlayer.updateMeta({time:0, length:0}, true);
			//trace(_activeSongID)
			_current_songs_array =  ArrayUtils.copyArray(_songs_array);
			gaanaMaster.playById(_activeSongID)
			//_moveToSongIndex(_currentIndex);
			Logs.addTrackLog()
		} else {	
			//trace(playerMode +" 4 == "+ playerModeLabel.radioGaana + " repeatType "+repeatType)
			if(repeatType == "playlist" && _currentIndex>=_getSongsArray().length-1) { 
				if(playerMode == playerModeLabel.radioGaana) {
					gaanaMaster.radioGaana(true); //radio gaana is never ending song playlist :D
				} else {
					//_uiCtrlr.removeCSS('play','pause');
        		//	_uiCtrlr.removeCSS('play','play')
					_currentIndex = -1; //move to zero
        			//alert(1)
				}
			};								
			if(_currentIndex < _getSongsArray().length-1) {				
				_currentIndex++;
				incrCurrentIndex = true;
				if(_this._events["onNext"]) {
					_this._events["onNext"](_currentIndex);
				};
				if(_nextIndex!='' && parseInt(_nextIndex)>=0){
					_currentIndex = _nextIndex;
					_nextIndex = '';
				}
				_moveToSongIndex(_currentIndex);
			};			
		};
		//trace("_currentIndex "+_currentIndex + "to=="+_getSongsArray().length)
		if(_currentIndex == _getSongsArray().length-1 && repeatType == 0) {
			_sound.stopMe();
			_this.resetComp();
			if(!evt){
				if(!incrCurrentIndex){
					playmode = true
					_uiCtrlr.removeCSS('play','pause');
					_uiCtrlr.removeCSS('play','play')
					_currentIndex = -1;
					Layout.renderCurrentSongInfo(_getSongsArray()[0].data,0);
				}
			}
		}
		
		if(_getSongsArray().length ==0){
			resetStartupSettings();
			$('#trackInfo').html('')
			$('.total').html('');
			$('.startime').html('')
			
			_uiCtrlr.removeCSS('play','pause');
			_uiCtrlr.removeCSS('play','play')
			_uiCtrlr.disabled('play', true);
			_uiCtrlr.disabled('songSeekbar', true);
			_uiCtrlr.disabled('next', true);
			_uiCtrlr.disabled('previous', true);
			_uiCtrlr.disabled('repeat', true);
			
		}
		//reset it
		ignoreRepeat = false;
	};
	var _previous = function(evt) {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		resetStartupSettings();
		//assert(true, " _previous ");
		if(evt) { //clicking on button
			if($(evt.target).hasClass("disabled")) {				
				return false;
			}
			ignoreRepeat = true;			
			addGA_Events("Previous", playerMode);
		}
		if(_currentIndex > 0) {
			_currentIndex--;
			if(_this._events["onPrevious"]) {
				_this._events["onPrevious"](_currentIndex);
			};
			_moveToSongIndex(_currentIndex);
		};
		//reset it
		ignoreRepeat = false;
	};
	var repeatButtonUI = function() {
		if(_settings.repeat=="playlist") {
			_uiCtrlr.removeCSS("repeat", "repeatOne");
			_uiCtrlr.setCSS("repeat", "repeatAll");//component, cssClass
			_uiCtrlr.title("repeat", "Repeat All");					
		} else if(_settings.repeat=="current") {
			_uiCtrlr.removeCSS("repeat", "repeatAll");
			_uiCtrlr.setCSS("repeat", "repeatOne");//component, cssClass
			_uiCtrlr.title("repeat", "Repeat this song");	
			//_uiCtrlr.disabled("shuffle");
			/*if(_settings.repeat=='current'){
				_isShuffleOn = false;
				ignoreShuffle =true;
				_uiCtrlr.removeCSS("shuffle", "on");
				_uiCtrlr.setCSS("shuffle", "off");//component, cssClass
				_uiCtrlr.title("shuffle", "Shuffle is off")
				
			}*/
		} else {
			_uiCtrlr.removeCSS("repeat", "repeatAll");
			_uiCtrlr.removeCSS("repeat", "repeatOne");//component, cssClass
			_uiCtrlr.title("repeat", "Repeat is off");				
		}
	}
	var _setRepeat = function(evt, byvalue) {		
		if(byvalue===undefined) {
			if($(evt.target).hasClass("disabled")) {				
				return false;
			}
			if(_settings.repeat == 0) {
				_settings.repeat = "current"; //repeat current song
				addGA_Events("Repeat this song", "manual");
			} else if(_settings.repeat == "current") {
				if(_getSongsArray().length<=1){ //if the song count is one then repeat current song
					_settings.repeat = 0; //off repeat song
					addGA_Events("Repeat this song", "manual");
				}else{
					_settings.repeat = "playlist"; //repeat playlist song
					addGA_Events("Repeat all", "manual");
				}
			} else if(_settings.repeat == "playlist") {
				_settings.repeat = 0;//off repeat
				addGA_Events("Repeat unset", "manual");
			};			
		} else {
			_settings.repeat = byvalue;//off repeat
		}		
		//trace("_settings.repeat "+_settings.repeat)
		repeatButtonUI();
	};
	var _shuffleUI = function() {
		if(_isShuffleOn===true) {
			_uiCtrlr.removeCSS("shuffle", "off");
			_uiCtrlr.setCSS("shuffle", "on");//component, cssClass
			_uiCtrlr.title("shuffle", "Shuffle is on");						
		} else {			
			_uiCtrlr.removeCSS("shuffle", "on");
			_uiCtrlr.setCSS("shuffle", "off");//component, cssClass
			_uiCtrlr.title("shuffle", "Shuffle is off");			
		};
		
	}
	var _shufflePlay = function(evt, byvalue) {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		if(evt) {			
			if($(evt.target).hasClass("disabled")) {				
				return false;
			}
			if(_isShuffleOn) {
				addGA_Events("Shuffle on", "manual");
			} else {
				addGA_Events("Shuffle off", "manual");
			}
		}
		//assert(true, " _shufflePlay ");	
		_isShuffleOn = !_isShuffleOn;
		if(byvalue!==undefined) {
			_isShuffleOn = byvalue;
		}
		/*if(_settings.repeat=='current'){
			_isShuffleOn = false;
			ignoreShuffle =true;
			_uiCtrlr.disabled("shuffle");
			//return //alert(2)
			
		}*/
		if(_isShuffleOn===true) {
			_currentIndex = 0;			
			ArrayUtils.shuffleArray(_songs_shuffle_array); //shuffle it again - its fun :P						
		} else {			
			_currentIndex = _current_songs_array[_currentIndex].index;
		};		
		_shuffleUI();		
		_current_songs_array = (_isShuffleOn==true) ? ArrayUtils.copyArray(_songs_shuffle_array) : ArrayUtils.copyArray(_songs_array);
		//trace("_isShuffleOn "+_isShuffleOn);		
		if(_isShuffleOn===true && !_sound.isPlaying()) {
			_moveToSongIndex(_currentIndex);
		};		
		
	};
	var _getSongsArray = function () {		
		return _current_songs_array;
	};
	var _moveToSongIndex = function(index) {
		// trace(0)
	var arr = _getSongsArray();
		if(ignoreShuffle == true) {
			ignoreShuffle = false;
			arr = _songs_array;
		}
		//trace(_songs_array)
		if(index < arr.length) {			
			var obj = arr[index];
			playNow(obj,'show'); //play now finally
			_currentSogId = obj.data.id;
			_source_id = (typeof obj.data.source_id != 'undefined') ? obj.data.source_id :1;
			_source = (typeof obj.data.source !='undefined') ? obj.data.source :1;
			if(currentPlayerMode =="karaoke"){
				_source = 7;
				_source_id =1;
			}
			var source = (typeof obj.data.channelId !='undfined') ? obj.data.channelId : 0
			//		alert(_uiCtrlr.getTime().time)
			if(typeof _uiCtrlr.getTime().time !='undefined' && _uiCtrlr.getTime().time != "00:00") {
				try{
				//trace(params)
				//Logs.addTrackLog(); //on last song there is no update - will see later
					_playedtime = 	_uiCtrlr.getTime().time;	
				_uiCtrlr.resetTime();
				staticPlayer.updateMeta({time:0, length:0});
				}catch(e){
					alert(e.message)
				}
			} else {
				_playedtime = "00:00"
				//Logs.addTrackLog();
				/*clearTimeout(playerLogTimer);
				playerLogTimer = setTimeout(function() {							
					_sound.trackLog({"type": 'song',"track_id":_currentSogId,"source":source});
					//trace({"type": 'song',"track_id":_currentSogId,"source":source})
				}, logTime*1000);*/
			}			
		};
	};
	var playTimer;	 
	var playNow = function(obj, shownextinfo) {		
		//console.log("playNow.. cookie "+readCookie("globalGenreRadio")+" playerMode "+playerMode );
		// Initializing Global play counter with Preroll
		// trace(1)
		//_globalPlayCounterWithPreroll++;
		// trace(2)
		//TimeChecker.start();	
		// trace(Fobj)	
		//check if has album pre roll, song pre roll then play now
		try{
		isRadio = false;
		var filePath = (typeof (obj.data)=="string") ? (obj.data) : $.toJSON((obj.data));
		var songInfo = 	$.parseJSON(filePath);
		// trace(songInfo)
                songInfo.albumid = (typeof songInfo.albumid != 'undefined' && songInfo.albumid>0)?songInfo.albumid:songInfo.source_id;		
		
			// Initializing Global play counter
			// trace(" play songs")
	
			playingPreRoll = false;
			playSong();	
		}catch(e){
			alert(e.message)
		}
			//var channel = (typeof songInfo.channelName !='undefined' && songInfo.channelName!='') ? songInfo.channelName :((typeof songInfo.channelId !='undefined') ? songInfo.channelId : 0);
			//gAnalyticChannelClick('Channel-'+channel,'Play',songInfo.title);
		
		
		
		function playSong() {
			playerMode = currentPlayerMode;
			_uiCtrlr = uiController.setOwner("gaanaMaster"); //dont need to pass same event again
			staticPlayer.setSound_n_UI(_sound, _uiCtrlr);  //make owner for sound and ui			
			_uiCtrlr.show("loader");			
			_this.resetComp();				
			_sound.stopMe();
			if(playTimer) {
				clearTimeout(playTimer);
			}
			//this will improve perfomance for usability
		//	_sound.createSound(filePath, _settings.autoPlay);
			//_sound.createSound(filePath, _settings.autoPlay);
			//alert(3)
			if(typeof filePath =='undefined' || filePath==null || filePath==''){
				 messagebox.open({msg:"mp3 path is missing",autoclose:true});
				return false
			}
			playTimer = setTimeout(function() {
				// trace(filePath)
				_sound.createSound(filePath, _settings.autoPlay);
				//_sound._loding();
			},1);
			
			setUIForPlayer();
			/******************/
			var obdata = obj.data
			//trace(obdata +"=========="+_currentIndex+"playerMode"+playerMode)
			Layout.renderCurrentSongInfo(obj.data,_currentIndex,playerMode);
			if(typeof(shownextinfo) !='undefined' && typeof shownextinfo!=null && _getSongsArray().length>1){
				if((_currentIndex +1) < _getSongsArray().length) {
					Layout.renderNextSongInfo(_getSongsArray()[_currentIndex+1].data)
				}else{
					Layout.renderNextSongInfo(_getSongsArray()[0].data);
				}
			} else {
				Layout.resetNextSongInfo();
			}
		}	
		
		//channel pre roll is the main playlist or album preroll
		function playChannelPreRoll() { 
			Layout.renderArtistPreInfo({title : "Tune In"});
			playTimer = setTimeout(function() {
				playingPreRoll = true;
				resetchannelsPreRoll();
				//trace("loading "+filePath);
				_sound.createSound('{"path":"'+songInfo.artistPreRoll+'","sType":"rtmp"}', _settings.autoPlay);				
			}, 500);
		}
		function playIdeaPreRoll(){
			Layout.renderArtistPreInfo({title : "Honey Bunny"});
			try{
				playTimer = setTimeout(function() {
					playingPreRoll = true;
					_playCounter = _playCounter +1;
					var artistPreRoll = "mp3/sales/honey_bunny_2";
					_sound.createSound('{"path":"'+artistPreRoll+'","sType":"rtmp"}', _settings.autoPlay);				
				}, 9);
			}catch(e){
				alert(e.message)
			}
		}
		//song preroll
		function playSongPreRoll() {
			Layout.renderSogPreInfo(songInfo);
			playTimer = setTimeout(function() {
				//trace("loading "+filePath);
				playingPreRoll = true;
				_sound.createSound('{"path":"'+songInfo.songPreRoll+'","sType":"rtmp"}', _settings.autoPlay);
			}, 500);
		}		
		try {
			Layout.highlightRow(songInfo);
			/******************/				
		} catch(e) {

		};
	}
	this.playById = function(id) {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		if(_isShuffleOn==false){
			ignoreShuffle =true;
			_uiCtrlr.removeCSS("shuffle", "on");
			_uiCtrlr.setCSS("shuffle", "off");//component, cssClass
			_uiCtrlr.title("shuffle", "Shuffle is off");
		}	
		var found = false;
		var arr = _getSongsArray();
		for(var i=0;i<arr.length;i++) {
			var current = arr[i];
			//trace(current)
			if(current.data.id == id) {
				_currentIndex = current.index;
				_moveToSongIndex(_currentIndex);
				found = true;
				break;
			}
		}
		//if not found get song info
		if(!found) {
			//load song info
		}
	}
	this.playAutomatic = function() {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		if($(".songGrid").length>0) {
			resetStartupSettings();
			//play first row
			var img = $("#row0 td:first").find("img.Plybtn");
			if(img.length>0) {				
				$(img).trigger("click");
			}
			addGA_Events("Play", "playAutomatic");			
		} else {
			messagebox.open({msg:"Please select a song",autoclose:true});
		}
	} 
	this.playNext = function() {
		_next();
	}
	this.playPrevious = function() {
		_previous();
	}
	this.playNextInQue =function(pos){
	if((_currentIndex < _getSongsArray().length-1) && pos!=_currentIndex && (pos <_getSongsArray().length) ) {				
			_nextIndex = pos
			
		};	
	}
	var manageButtonsForSongCount = function(type) {
		if(_getSongsArray().length<=1) {
		//	alert(type)
			if(typeof type !='undefined' && type=='next'){
				_setRepeat(undefined, 0);
				_uiCtrlr.disabled("previous,shuffle", true);
				_uiCtrlr.disabled("next", false);
			}else{
				_setRepeat(undefined, 0);
				_uiCtrlr.disabled("next,previous,shuffle", true);
			}
		} 		
	}
	//this will be used for highlighing some row	
	this.getCurrentIndex = function() {
		return _currentIndex;
	};	
	this.getSongsCount= function(){
		var arr = _getSongsArray();
		return arr.length;
	}
	this.getCurrentShuffle = function(){
		return _isShuffleOn;
	}
	this.setCurrentShuffle = function(flag){
		 _isShuffleOn = flag;
		// alert(_isShuffleOn)
	}
	
	this.PlaySongsAfterVideo = function(){
		try{
			//console.log("PlaySongsAfterVideo..");
			$('.hotbox').animate({bottom:'0px'},{duration:500});
			var arr = _getSongsArray();
			$('.radio_song_carousel').show();
			$('#adPlayer').hide();
			var songInfo = arr[_currentIndex];
			_moveToSongIndex(_currentIndex);
		}catch(e){
			//alert(e.message)
		}
		
	}
	this.createSound = function(obj, autoPlay, loadAtStartUp, mode, source, ids) {	// obj:{data:res,index:0},true		
		// createCookie('playerloaded',1)
		if(typeof mode !='undefined' && mode !='genreRadio') {
			// activateGuideLine();
		}
		try {	
		if(playingPreRoll==true){
			//return false;
		}
		if(typeof intid !='undefined'){
			clearInterval(intid); // Clear GA interval of GA if user switches to songs
		}
		
		
		//RadioMetaData.clearRadioHistory();
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		
			
			ignoreShuffle = true;		
			_settings.autoPlay = (autoPlay || _settings.autoPlay);
			_settings.loadAtStartUp = loadAtStartUp || true; //set it true		
			_settings.shuffle = (obj.shuffle!==undefined) ? obj.shuffle : _settings.shuffle;
			//trace("_settings.shuffle "+_settings.shuffle)
			isRadio = false;	
			//trace("mode  "+mode)
			playerMode = (mode || playerModeLabel.player);

			_radioThemeLevel = source; // To be used for Radio Channels
			_radioThemeId = (typeof ids != 'undefined')?ids:0; // To be used for Radio Channels
			if(playerModeLabel[playerMode]===undefined) {
				playerMode = playerModeLabel.player;
			}
			
			currentPlayerMode = playerMode;
			//trace("2 playerMode "+playerMode)
			_data = obj.data;
			_currentIndex = obj.index;
			_isShuffleOn = _settings.shuffle;
			if(_isShuffleOn===true){
				ignoreShuffle =false;
				
			}
			_shuffleUI();
			//trace(obj)
			Logs.stopRadioLog();
			//RadioMetaData.stopUpdating();
			_inializeGaanaMaster();
			setUIForPlayer();//ui
			staticPlayer.updateMeta({time:0, length:0});
			//check radio gaana data
			if(gaanaMaster.getSongsCount() > 0){
				if(gaanaMaster.getSongsCount()>1){
					$('.songcnt').html(gaanaMaster.getSongsCount() +" Songs");
                                        $('.songcnt').show();
				}else{
					$('.songcnt').html(gaanaMaster.getSongsCount() +" Song");
                                        $('.songcnt').show();
				}
				
			}
			
			
		} catch(e) {
			//trace("this.createSound: "+e.message);
			//alert(e.message)
			// utility.errorLog(e.message, "gaanaMaster.createSound");
		}
	};	
	var checkRadioGaanaData = function(obj) {
	//	trace(obj.index);
		//trace(obj)
		if(obj && obj.data) {
			//trace("eval(obj.data)[0].id "+eval(obj.data)[0].id)
			Layout.getRecommedationData(eval(obj.data)[0].id, function(res) {
				if($.trim(res) == "null") {
					$(".radio").css({opacity:0.5});
					$(".radio").attr("title", "Radio Gaana is not available for this song");
					$(".radio").addClass("disabled")
				} else {
					//$(".radio").css({opacity:1});
					$(".radio").attr("title", "Start your own radio with this song");
					$(".radio").removeClass("disabled");
				}
			}, "string");
		}
	}
	
	this.resetComp = function() {		
		_uiCtrlr.reset("songSeekbar");
		staticPlayer.updateMeta({time:0, length:0}, true);
		//_uiCtrlr.disabled("next", true);
		//_uiCtrlr.disabled("previous", true);
	}	
	this.playByData = function(obj, type) { //type can be preroll/recomendation etc		
		playNow(obj,type); //json data
	}
	this.playPreRoll = function(row){
		this.playByData(row, 'preroll');		
		addGA_Events("Preroll", "automatic");
	}
	this.playPostRoll = function(row){
		this.playByData(row,'postroll');
		addGA_Events("Postroll", "automatic");
	}
	this.reOrderData = function(data,index){
		_currentIndex = index;
		_makeData($.toJSON(data));
	}
	this.playWithoutClearData = function(row){		
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		var data = new Array();
		var arr = new Array();
		var check = false;
		if(_data !=null){
			data = $.parseJSON(_data)
			for(i in data){
				arr.push($.toJSON(data[i]))
					if(row.id == data[i].id){
						index = 0;
						index = i;
						check = true;
					}
			}
			if(!check){
				arr.push($.toJSON(row));
				index = arr.length-1
			}
		}else{
			arr.push($.toJSON(row))
			index = 0;
		}
		//trace(index)
		var json_Data = '['+arr.join(",")+']';
		//trace(json_Data)
		gaanaMaster.createSound({data:json_Data,index:index});
		data = null;
		arr = null;
		json_Data = null;
	}
	this.addToQueue = function(rows){
		if(typeof readCookie('playerloaded') =='undefined' || readCookie('playerloaded')!=1){
			messagebox.open({msg:message['playsong'],autoclose:true})
			return false;
		}
		if(gaanaMaster.getPlayerMode()=='radio'){
			return false;
		}
		var arr = new Array();
		if(_data !=null){
			var data = $.parseJSON(_data)
			for(i in data){
				if(typeof rows !='undefined' && rows !=null){
					var match =false;
					for(r in rows){
						if(data[i].id ==rows[r].id){
							match = true
						}
					}
					if(!match){
						arr.push($.toJSON(data[i]))
					}

				}

			}
			if(typeof rows !='undefined' && rows !=null){
				for(r in rows){
					arr.push($.toJSON(rows[r]))
					//trace(arr)
				}
			}
		}else{
			if(typeof rows !='undefined' && rows !=null){
				for(r in rows){
					arr.push($.toJSON(rows[r]))
				}
			}
		}
		var json_Data = '['+arr.join(",")+']';
		_data =json_Data
		_makeData(_data);
		_saveList();
		if(gaanaMaster.getSongsCount() > 0){
			if(gaanaMaster.getSongsCount()>1){
				$('.songcnt').html(gaanaMaster.getSongsCount() +" Songs")
			}else{
				$('.songcnt').html(gaanaMaster.getSongsCount() +" Song")
			}
			
		}
                var song_title = rows[0].title;
                var show_message = messagebox.message(message['songaddetoqueue'], song_title);
		messagebox.open({msg:show_message,autoclose:true})
		$('.add-event').hide();
		

	};
	
	this.clearQueue = function(){
		_data = null;
		superCookie.removeItem('queue')	
		_makeData(_data);
		 
	}
	
	this.deleteById = function(id) {
	try{
		var found = false;
		var arr = _getSongsArray();
		var temparr =new Array();
		var currsong = gaanaMaster.getCurrentInfo();
		var currid =  currsong.id;
		for(var i=0;i<arr.length;i++) {
			var current = arr[i];
			if(current.data.id != id) {
				temparr.push($.toJSON(current.data))
				found = true;
				
			}else{
				//_currentIndex = current.index;
			}
		}
		if(found) {
			var json_Data = '['+temparr.join(",")+']';
			_data =json_Data
			_makeData(_data);
			_saveList();
			if(gaanaMaster.getSongsCount() > 0){
				if(gaanaMaster.getSongsCount()>1){
					$('.songcnt').html(gaanaMaster.getSongsCount() +" Songs")
				}else{
					$('.songcnt').html(gaanaMaster.getSongsCount() +" Song")
				}

			}
		}else{
			gaanaMaster.clearQueue();
			$('.addedsonglist').hide();
		    $('.songadded').removeClass('whitebg');
			$('.songcnt').html('')
		}
		var arr = _getSongsArray();
		//trace(_currentIndex + 'arr.length' + arr.length)
		if(id==currid && (arr.length - _currentIndex-1)>0){
			_currentIndex = _currentIndex -1;
		}else{
			//_currentIndex = _currentIndex -1;
		}
	/*	for(var i=0;i<arr.length;i++) {
			var current = arr[i];
			//trace(current)
			if(current.data.id == currid) {
				_currentIndex = current.index;
				break;
			}
		}*/
		
		
		}catch(e){
			trace(e.message)
		}
		
	}
	
	this.playRadio = function(obj) {
		 createCookie('playerloaded',1)
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		RadioMetaData.streamdata = obj;
		playerMode = playerModeLabel.radio;
		Layout.resetCurrentSongInfo();
		_activeSongID = ''
		isRadio = true;
		//trace("this.playRadio");		
		var filePath = (typeof (obj.data)=="string") ? (obj.data) : $.toJSON((obj.data));		
		try {				
			_uiCtrlr.show("loader");
			_sound.stopMe(); 
			_sound.createSound(filePath, true); //radio autoplay on
			setUIForRadio();
			resetStartupSettings();
			addGA_Events("Play", playerMode);
			//trace("Playing radio")			
		} catch(e) {
			//trace("playRadio "+e)
		}
	};
	this.getPlayerMode = function() {
		return playerMode;
	};
	this.playToggle = function() {
		_play();
	};	
	this.play = function() {
		_play();
	};
	this.pause = function() {
		_play(); //its toggle
	};
	this.stopMe = function() {
		_sound.stopMe();
	};
	this.getUIController = function() {
		return _uiCtrlr;		
	};	
	this.updateMeta = function(arg){		
		_updateMeta(arg)
	};
	this.getCurrentInfo = function() {
		var arr = _getSongsArray();		
		return (arr.length>0 && arr[this.getCurrentIndex()].data) || null;
	};
	var getRandomNumber = function(maxRange) {
		return Math.floor((maxRange||0)*Math.random());
	};
	this.radioGaana = function(force) {
		if(!jsPlayer.canPlay) {
			jsPlayer.showSWF_Error();
			return false;
		}
		if( _getSongsArray().length==0) {
			messagebox.open({msg:message['gaana_radio_notavailable'],autoclose:true});
			return false;
		}
		if($(".radio").hasClass("disabled") && force===undefined) {
			messagebox.open({msg:message['gaana_radio_notavailable'],autoclose:true});
			return false;
		}
		var ids, id;
		ids = superCookie.getItem(_variables.CookiesLabel.que);
		if(ids) {			
			ids = eval(ids);
			id = ids[getRandomNumber(ids.length)].id; //get random no. from the list
			var title =  ids[getRandomNumber(ids.length)].title;
		} else {
			ids = new Array("583554","570325","582161","582528");
			id = ids[getRandomNumber(ids.length)];
		};			
		//trace("id "+id)		
		if(playerMode!=playerModeLabel.radioGaana || force) {								
			Layout.getRecommedationData(id, function(res) {	
			if($.trim(res) == "null") {
					//ShowMessage("Sorry! There is some problem... Trying again...");
					gaanaMaster.radioGaana(true);
				}else if($.trim(res) == "radio does not exists"){
					  messagebox.open({msg:"Radio does not exists for this song",autoclose:true});
				}  else {
					
					addGA_Events("Gaana Radio play", playerMode);					
					_this.createSound({data:res,index:0}, true, true, playerModeLabel.echonestplayer);
					//gaanaMaster.createSound({data:})
					$(".radio").css({opacity:1});
					$(".radio").attr("title", "Playing radio gaana");
					$(".radio").removeClass("disabled")
				}
			}, "string",title); //get result as string - it will return from the cache if exist
		};
	};	
	//alias
	this.surprisePlay = this.radioGaana;
	this.testPlay = function() {
		//{"id":"567758","title":"Hosanna","album":"Ekk_Deewana_Tha_58419","artist":"Suzzane De Mello###47989###suzzane-de-mello","popularity":"90470~583","rating":"4.70000","action":0,"genre":"Bollywood~56~bollywood","duration":"334","stream_type":"","ref_track_code":"0","mime":"0","albumartwork":"http://localhost/gaanadev/web//media/images-v1/default-album-110x110.gif","vendor":"17","language":"Hindi","display_global":"0","albumseokey":"ekk-deewana-tha","seokey":"hosanna-18","ads":0,"airtel_vcode":"","preroll":0,"midroll":0,"midroll_timer":0,"sType":"rtmp","path":"mp3/64/19/58419/567758","vcode":0,"albumid":"58419","albumname":"Ekk Deewana Tha","songPreRoll":"","artistPreRoll":"","songPostRoll":"","artistPostRoll":"","zoomArtistName":""}
		//_sound.createSound('{"path":"mp3/64/19/58419/567758","sType":"rtmp"}');
		_sound.createSound('{"path":"INH101203890","sType":"https", "duration":"329", "id":"677057"}');
		//gaanaMaster.createSound({data:'[{"path":"mp3/64/19/58419/567758","sType":"rtmp"}]'})
	};
	this.getSoundAndUI = function() {
		return {sound:_sound, ui:_uiCtrlr};
	};	
	this.getMode = function() {
		return playerMode;
	};
	
	_inializeGaanaMaster();
	}catch(e){
		alert(e.message)
	}
};

GaanaMaster.prototype.onNext = function(fn) {
	this._events["onNext"] = fn;
};
GaanaMaster.prototype.onPrevious = function(fn) {
	this._events["onPrevious"] = fn;
}
//var gaanaMaster = new GaanaMaster();
/*
GaanaMaster({
	data:'{"path":"mp3/64/63/59163/576091","sType":"rtmp"}'
	});
	*/
//gaanaMaster.createSound({data:'[{"path":"mp3/64/63/59163/576091","sType":"rtmp"}]'})
//this will maintain ui-states and sound automatically
//version: 1.3
var staticPlayer = {
	sound:null,
	uiCtrl:null,
	old:{},
	isPlaying: false,
	isDragging:false,
	updatePlayButton: function(force) {
		var isPlaying = force || this.sound.isPlaying();
                  this.isPlaying=isPlaying;
		if(force) {
			this.isPlaying = force;
		}
              
		if(this.isPlaying) {
			this.uiCtrl.removeCSS("play", "play");//component, cssClass
			this.uiCtrl.setCSS("play", "pause");//component, cssClass			
			if(gaanaMaster.getMode()=="karaoke") {
				this.uiCtrl.title("play", "Stop");
			} else {
				this.uiCtrl.title("play", "Pause");
			}
			
			if(gaanaMaster.getMode()=="radioGaana") {
				this.uiCtrl.removeCSS("play", "radioplay");//component, cssClass
				this.uiCtrl.setCSS("play", "radiopause");
			}
		} else {
			this.uiCtrl.removeCSS("play", "pause");//component, cssClass
			this.uiCtrl.setCSS("play", "play");//component, cssClass
			this.uiCtrl.title("play", "Play");
			if(gaanaMaster.getMode()=="radioGaana") {
				this.uiCtrl.removeCSS("play", "radiopause");//component, cssClass
				this.uiCtrl.setCSS("play", "radioplay");
			}
		}
	},
	setSound_n_UI: function(s, u, len) {
		this.sound = s;
		this.uiCtrl = u;
		this.updatePlayButton(len);
	},
	playToggle: function() {	
		if(this.sound && this.uiCtrl) {
			if($(this.uiCtrl.containers.play).hasClass("stop")) {
				this.stopMe();
				this.isPlaying = false;
			} else {
				this.sound.playToggle();
				this.isPlaying = !this.isPlaying;
				if(this.isPlaying){
					Layout.playSong();
				}else{
					
				}
				this.updatePlayButton();
			}
		}
	},
	stop: function() {
		if(this.sound && this.uiCtrl) {
			this.sound.stopMe();
			this.uiCtrl.removeCSS("play", "pause");//component, cssClass
			this.uiCtrl.setCSS("play", "play");//component, cssClass
			this.uiCtrl.title("play", "Play");
		}
	},
	setVolume: function(evt, ui) {
		this.sound.setVolume(ui.value);
		this.old.volume = ui.value;
		this.afterMute();
	},
	mute: function() {
		if(this.sound && this.uiCtrl) {
			//trace("this.sound.volume "+this.sound.volume)
			if(this.sound.volume!==0) {
				this.old.volume = this.sound.volume;
				this.sound.mute();
				this.uiCtrl.updateVolumeSeek(0);
                                _gaq.push(['_trackEvent',"Player UI Interactions", "Mute Icon", "manual"]);
                                //addGA_Events("Mute Icon", "manual");
			 } else { //unmute
				this.sound.setVolume(this.old.volume);
				this.uiCtrl.updateVolumeSeek(this.old.volume);
                                //addGA_Events("Unmute Icon", "manual");
                                _gaq.push(['_trackEvent',"Player UI Interactions", "Unmute Icon", "manual"]);
			 }
		}
		this.afterMute();
	},
	afterMute: function() {
		 if(this.sound.volume==0) {
			 this.uiCtrl.removeCSS("mute", "off");//component, cssClass
			 this.uiCtrl.setCSS("mute", "on");//component, cssClass
			 this.uiCtrl.title("mute", "Unmute");
		 } else {
			 this.uiCtrl.removeCSS("mute", "on");//component, cssClass
			 this.uiCtrl.setCSS("mute", "off");//component, cssClass
			 this.uiCtrl.title("mute", "Mute");
		 }
	},
	formatTime: function(time) {
		if(time<=0) { return '00:00'};
		time = Math.round(time);
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		var str = pad(minutes)+":"+pad(seconds);
		return str;
		
		//add extra zero - dont worry it will work even it is after return
		function pad(number) {
			return (number < 10 ? '0' : '') + number;
		};	
	},
	updateMeta: function(arg, isReset) {
		//trace(arg)
		try{
		var time = arg.time;
		var total = arg.length;			
		if( this.uiCtrl.getSeekbarOption("songSeekbar", "max")!=total) {
			 this.uiCtrl.setSeekbarOption("songSeekbar", "max", total);	
		};
		this.uiCtrl.updateMeta(this.formatTime(time), this.formatTime(total), isReset);
		if(!this.isDragging) {
			this.uiCtrl.updateSongSeek(time); //song seek (progress bar)
		}else{
			$('.addedsonglist').hide();
			$('.songadded').removeClass('whitebg');
			$('.songcnt').addClass('white') 
		}	
		}catch(e){
			alert(e.message)
		}	
	},
	updateBuffer: function(arg) {		
		if(this.sound.streamStarted===true) {
			this.uiCtrl.show("loader", "buffering...", true);
		} else {
			this.uiCtrl.show("loader");
		}
		//trace("arg.percent "+arg.percent)
		if(arg.percent>=100) {
			//trace("arg.percent "+arg.percent)
			this.uiCtrl.hide("loader");
			this.uiCtrl.updateBuffer(100, true);
		} else {
			if(typeof arg.percent == "number") {
				this.uiCtrl.updateBuffer(arg.percent, false);
			}
		}
	},
	FB_Events: {
		play: function() {
			//trace("calling play");			
			this.callFB_Event("play");
		},
		pause: function() {
			this.callFB_Event("pause");
		},
		resume: function() {
			this.callFB_Event("resume");			
		},
		stop: function() {
			this.callFB_Event("pause");
		},
		callFB_Event: function(evt) {
			try {
				if(gaanaMaster) {					
					var info = gaanaMaster.getCurrentInfo(); 
					//trace(info)
					if(info) {
						//calling from gaana-fb-music.js
						if(fbPlayerEvent) {
							fbPlayerEvent(evt+"||"+info.id+"||"+info.title+"||"+info.seokey);
						} else {
							//trace(fbPlayerEvent is not defined);
							// utility.errorLog("fbPlayerEvent is not defined",'callFB_Event');
						}
					}
				}
			} catch(e) {
				//
			}
		}
	},
	stopMe: function(cb) {
		if(this.sound && this.uiCtrl) {
			this.sound.stopMe();
			if(cb) {
				eval(cb)();
			}
		}
	}
	
}