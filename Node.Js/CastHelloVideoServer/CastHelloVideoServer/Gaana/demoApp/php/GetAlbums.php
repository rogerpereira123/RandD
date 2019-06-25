<?php 

include_once './php/constants.php';
include_once './php/utilities.php';

include_once './php/GetClass.php';


/**
* GetAlbums Class
*/
class GetAlbums extends GetClass {
	protected $rAlbums;
	protected $rData;
	protected $rCount;
	protected $rUserTokenStatus;
	protected $rTrackIds = array();
	protected $rType = 'album';
	
	function __construct($pSubType, $pKey) {
		parent::__construct($pSubType, $pKey);
	}

}



?>