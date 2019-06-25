<?php 
error_reporting(E_ALL);

include_once './php/constants.php';
include_once './php/utilities.php';

include_once './php/GetClass.php';
include_once './php/GetTracks.php';
include_once './php/GetAlbums.php';
include_once './php/GetArtists.php';
include_once './php/GetPlaylists.php';


// Use this to record what has happened for debugging purposes
$dbObj = null;
$error = false;

// What data do they want?
$sDataType = null;

// What subtype of data do they want?
$sSubType = null;

// Data Key to use to get the desired data
$sKey = -1;

// Request Filter to use to get the desired data through where clause
$sRequestFilter = null;


// Create a new instance of our parm checking routine.
$fidTest = new chkParms();

// Now test the primary parms
$sDataType = $fidTest->evalFid("type");

if ($fidTest->getParmCnt() > 0) {
	$sSubType = $fidTest->evalFid("subtype");
}
if ($fidTest->getParmCnt() > 0) {
	$sKey = $fidTest->getOptionalFid("dataKey");
}

if ($fidTest->getParmCnt() < 0) {
	reportError('Parm Log is ' . $fidTest->parmsLog(), 10000);
} else {
	switch ($sDataType) {
		case 'song': {
				$dbObj = new GetTracks($sSubType, $sKey);
				break;
			}

		case 'album': {
				$dbObj = new GetAlbums($sSubType, $sKey);
				break;
			}

		case 'artist': {
				$dbObj = new GetArtists($sSubType, $sKey);
				break;
			}

		case 'playlist': {
				$dbObj = new GetPlaylists($sSubType, $sKey);
				break;
			}

		default: {
				// Bad news
				reportError('Business object definition missing for this request.', 10001);
				$error = true;
			}
	}

	if (!$error) {
		// Ok, no error, let's continue
		if (!is_null($dbObj)) {
			// Ok, let's get the data....
			$dbObj->getData();
		} else {
			reportError('getdata was called, parmlog is: ' . $fidTest->parmsLog(), 10002);
		} // if (!is_null($dbObj))
	} // if ( !$error )



}

?>