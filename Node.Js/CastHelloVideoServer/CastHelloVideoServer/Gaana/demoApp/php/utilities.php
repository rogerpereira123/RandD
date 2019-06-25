<?php 


class chkParms {

	private $rParmCnt;
	private $rFid;
	private $rLog;

	// constructor
	function __construct() {
		$this->rParmCnt = 0;
		$this->rFid = "";
		$this->rLog = "";
	}

	function evalFid($pFid, $noParmCnt = false) {
		$this->rFid = "";

		// Did we get a valid value?
		if ($this->getVar($pFid)) {
			$this->rParmCnt += 1;
			$this->rLog .= '*' . $pFid . ' is: ' . $this->rFid . ' ';
		} else {
			// Missing key parameter, can't continue
			$this->rLog .= ' ^^ ' . $pFid . ' was not specified, parmCnt was ' . $this->rParmCnt;
			if ($noParmCnt) {
				// Don't negate the parmcount
			} else {
				$this->rParmCnt = -1;
			}
		} // if (strlen($_GET["dataType"]) > 0 )

		return $this->rFid;
	}

// function evalFid( $pFid)

	function getVar($pVar) {
		// This was originally planned to be overridden
		// in a subclass, but it is so basic that
		// there is no reason to do so.
		$retVal = true;

		if (isset($_GET[$pVar]) > 0) {
			// This is a get, save the value
			$this->rFid = $_GET[$pVar];
		} elseif (isset($_POST['userKey']) > 0) {
			// This is a post, save the value
			$this->rFid = $_POST[$pVar];
		} else {
			// Not found, return false
			$retVal = false;
		} // if (isset( $_GET[  $pVar ] ) > 0)

		return ($retVal);
	}

// function getVar( $pVar)

	public function getOptionalFid($pVar) {
		// This is similar to evalFid except that it checks for
		// optional fids and doesn't set flags if they don't
		// exist.
		$retVal = null;
		if ($this->getVar($pVar)) {
			$retVal = $this->rFid;
		}
		return $retVal;
	}

	function getParmCnt() {
		return ($this->rParmCnt);
	}

	function parmsLog() {
		return ($this->rLog);
	}

}

function reportError($value='', $errCode) {
	# code...
}

?>