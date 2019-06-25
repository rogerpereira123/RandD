<?php 

/**
* Main Parent 
*/
class GetClass {
	// protected $rData;
	protected $rSubType;
	protected $rKey;

	public function __construct($pSubType, $pKey) {
		$this->rSubType = $pSubType;
		$this->rKey = $pKey;

		$param = '';
		if ($pKey > 0) {
			$param = "&".$this->rKeyParam."=".$pKey;
		}

		$opts = array('http'=>array('method'=>"GET"));
		$context = stream_context_create($opts);

		// Open the file using the HTTP headers set above
		$url = SERVICEBASEURL."/index.php?type={$this->rType}&subtype={$this->rSubType}".$param;
		$this->rData = file_get_contents($url, false, $context);
	}

	public function getData() {
		print_r($this->rData);
	}
}

?>