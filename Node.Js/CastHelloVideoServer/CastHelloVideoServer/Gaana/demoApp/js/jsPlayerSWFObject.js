if(typeof deconcept=="undefined")var deconcept=new Object();if(typeof deconcept.util=="undefined")deconcept.util=new Object();if(typeof deconcept.SWFObjectUtil=="undefined")deconcept.SWFObjectUtil=new Object();deconcept.SWFObject=function(swf,id,w,h,ver,c){if(!document.createElement||!document.getElementById){return;}
this.params=new Object();this.variables=new Object();this.attributes=new Array();if(swf){this.setAttribute('swf',swf);}
if(id){this.setAttribute('id',id);}
if(w){this.setAttribute('width',w);}
if(h){this.setAttribute('height',h);}
if(ver){this.setAttribute('version',new deconcept.PlayerVersion(ver.toString().split(".")));}
if(c){this.addParam('bgcolor',c);}}
deconcept.SWFObject.prototype={setAttribute:function(name,value){this.attributes[name]=value;},getAttribute:function(name){return this.attributes[name];},addParam:function(name,value){this.params[name]=value;},getParams:function(){return this.params;},addVariable:function(name,value){this.variables[name]=value;},getVariable:function(name){return this.variables[name];},getVariables:function(){return this.variables;},getVariablePairs:function(){var variablePairs=new Array();var key;var variables=this.getVariables();for(key in variables){variablePairs.push(key+"="+variables[key]);}
return variablePairs;},getSWFHTML:function(){var swfNode="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){swfNode='<embed type="application/x-shockwave-flash" src="'+this.getAttribute('swf')+'" width="'+this.getAttribute('width')+'" height="'+this.getAttribute('height')+'"';swfNode+=' id="'+this.getAttribute('id')+'" name="'+this.getAttribute('id')+'" ';var params=this.getParams();for(var key in params){swfNode+=[key]+'="'+params[key]+'" ';}
var pairs=this.getVariablePairs().join("&");if(pairs.length>0){swfNode+='flashvars="'+pairs+'"';}
swfNode+='/>';}else{if(this.getAttribute("doExpressInstall"))this.addVariable("MMplayerType","ActiveX");swfNode='<object id="'+this.getAttribute('id')+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="'+this.getAttribute('width')+'" height="'+this.getAttribute('height')+'">';swfNode+='<param name="movie" value="'+this.getAttribute('swf')+'" />';var params=this.getParams();for(var key in params){swfNode+='<param name="'+key+'" value="'+params[key]+'" />';}
var pairs=this.getVariablePairs().join("&");if(pairs.length>0){swfNode+='<param name="flashvars" value="'+pairs+'" />';}
swfNode+="</object>";}
return swfNode;},write:function(elementId,cb){var n=(typeof elementId=='string')?document.getElementById(elementId):elementId;n.innerHTML=this.getSWFHTML();if(cb){setTimeout(function(){eval(cb)()},500)}
return true;}}
deconcept.SWFObjectUtil.getPlayerVersion=function(reqVer,xiInstall){var PlayerVersion=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){PlayerVersion=new deconcept.PlayerVersion(x.description.replace(/([a-z]|[A-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");for(var i=3;axo!=null;i++){axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);PlayerVersion=new deconcept.PlayerVersion([i,0,0]);}}catch(e){}
if(reqVer&&PlayerVersion.major>reqVer.major)return PlayerVersion;if(!reqVer||((reqVer.minor!=0||reqVer.rev!=0)&&PlayerVersion.major==reqVer.major)||PlayerVersion.major>=8||xiInstall){try{PlayerVersion=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}catch(e){}}}
return PlayerVersion;}
deconcept.PlayerVersion=function(arrVersion){this.major=parseInt(arrVersion[0])!=null?parseInt(arrVersion[0]):0;this.minor=parseInt(arrVersion[1])||0;this.rev=parseInt(arrVersion[2])||0;}
deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major)return false;if(this.major>fv.major)return true;if(this.minor<fv.minor)return false;if(this.minor>fv.minor)return true;if(this.rev<fv.rev)return false;return true;}
deconcept.util={getRequestParameter:function(param){var q=document.location.search||document.location.hash;if(q){var startIndex=q.indexOf(param+"=");var endIndex=(q.indexOf("&",startIndex)>-1)?q.indexOf("&",startIndex):q.length;if(q.length>1&&startIndex>-1){return q.substring(q.indexOf("=",startIndex)+1,endIndex);}}
return"";}}
deconcept.SWFObjectUtil.cleanupSWFs=function(){var objects=document.getElementsByTagName("OBJECT");for(var i=0;i<objects.length;i++){for(var x in objects[i]){if(typeof objects[i][x]=='function'){objects[i][x]=null;}}}}
if(typeof window.onunload=='function'){var oldunload=window.onunload;window.onunload=function(){deconcept.SWFObjectUtil.cleanupSWFs();oldunload();}}else{window.onunload=deconcept.SWFObjectUtil.cleanupSWFs;}
if(Array.prototype.push==null){Array.prototype.push=function(item){this[this.length]=item;return this.length;}}
var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;var featureFlashList=new Array();function featureFlashPlayerAction(type)
{var subUrl;if(type!='featuredAlbumList')
{strPlayer=type.split(',');type=strPlayer[0];subUrl=strPlayer[1];}
switch(type)
{case'callUrl':$.history.load(subUrl);break;default:sendToFlashGallery(featureFlashList['featuredAlbumList']);}}
function callLog(track_id,type){type=(typeof(type)!='undefined')?type:"song";callAjax("ajax/log.php",{"track_id":track_id,"type":type},"post",false);}
function playStarted(currentSongID,currentTrack){_activeSongID=currentSongID;_activeSongInfo=currentTrack;activateCurrentPlaying();}