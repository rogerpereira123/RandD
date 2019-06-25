<?php 

include_once './php/constants.php';
include_once './php/utilities.php';

include_once './php/GetClass.php';


/**
* Tracks Class
*/
class GetTracks extends GetClass {
	protected $rTracks;
	protected $rData;
	protected $rCount;
	protected $rUserTokenStatus;
	protected $rTrackIds = array();
	protected $rRetData = array();
	protected $rType = 'song';
	protected $rKeyParam = 'track_id';

	function __construct($pSubType, $pKey) {
		parent::__construct($pSubType, $pKey);
		$data = json_decode($this->rData);
		$this->rTracks = $data->tracks;
		$this->rCount = $data->count;
		// $this->rUserTokenStatus = $data->user-token-status;

		//List to make search faster on itration
		foreach ($this->rTracks as $k => $track) {
			$this->rTrackIds[$track->track_id] = $k;
		}
	}

	public function getData() {
		if ($this->rKey > 0) {
			foreach ($this->rTracks as $k => $track) {
				// echo "adding details";
				$subData['title'] = $this->getTrackTitle($track->track_id);
				$subData['id'] = $track->track_id;
				$subData['track_ids'] = $track->track_id;
				$subData['path'] = $this->getTrackPath($track->track_id);
				$subData['duration'] = $this->getTrackDuration($track->track_id);
				$subData['source_id'] = $this->getTrackAlbumId($track->track_id);
				$subData['sType'] = $track->stream_type;
				$subData['albumartwork'] = $track->artwork;
				$subData['albumtitle'] = $this->getTrackAlbum($track->track_id);
				$subData['albumseokey'] = $track->albumseokey;
				$subData['seokey'] = $track->seokey;
				$subData['content_source'] = (isset($track->content_source) ? $track->content_source : '1');
				// $subData['artist'] = $track->getTrackArtist($track->track_id);
				
				$this->rRetData[] = $subData;	
			}
			print_r(json_encode($this->rRetData, true));
		}
		else{
			parent::getData();
		}
	}

	public function getTracks() {
		return $this->rTracks;
	}

	public function getTrackCounts() {
		return $this->rCount;
	}

	public function getTrackInfoById($pTrackId) {
		return $this->rTracks[$this->rTrackIds[$pTrackId]];
	}

	public function getTrackInfoByIndex($pTrackIndex) {
		return $this->rTracks[$pTrackIndex];
	}

	public function getTrackTitle($pTrackId) {
		return trim($this->rTracks[$this->rTrackIds[$pTrackId]]->track_title);
	}

	public function getTrackAlbum($pTrackId) {
		return trim($this->rTracks[$this->rTrackIds[$pTrackId]]->album_title);
	}

	public function getTrackAlbumId($pTrackId) {
		return trim($this->rTracks[$this->rTrackIds[$pTrackId]]->album_id);
	}

	public function getTrackArtwork($pTrackId) {
		return trim($this->rTracks[$this->rTrackIds[$pTrackId]]->artwork);
	}

	public function getTrackArtworkLarge($pTrackId) {
		return trim($this->rTracks[$this->rTrackIds[$pTrackId]]->artwork_large);
	}

	public function getTrackArtist($pTrackId) {
		$artistName = '';
		foreach ($this->rTracks[$this->rTrackIds[$pTrackId]]->artist as $artist) {
			if ($artistName != '') {
				$artistName .= ', ';
			}
			// $artistName .= trim($artist->name."###".$artist->artist_id."###".str_replace(" ", "-", strtolower($artist->name)));
			$artistName .= trim($artist->name);
		}
		return $artistName;
	}

	public function getTrackGenre($pTrackId) {
		$genre = '';
		foreach ($this->rTracks[$this->rTrackIds[$pTrackId]]->gener as $gener) {
			if ($genre != '') {
				$genre .= ', ';
			}
			$genre .= trim($gener->name);
		}
		return $genre;
	}

	public function getTrackDuration($pTrackId) {
		return trim($this->rTracks[$this->rTrackIds[$pTrackId]]->duration);
	}

	public function getTrackPath($pTrackId) {
		$track = $this->rTracks[$this->rTrackIds[$pTrackId]];
		$albumid = $this->getTrackAlbumId($pTrackId);
		$mod = ($albumid % 100);
		$content_source = (isset($track->content_source) ? $track->content_source : '1');
		switch ($content_source) {
			case '1':
				$str = "mp3/64/" . $mod . "/" . $albumid . "/" . $pTrackId;
				break;
			
			case '2':
				$str = '';
				break;
			
			case '3':
				$str = $pTrackId;
				break;
			
			case '4':
				$str = '';

			default:
				$str = "mp3/64/" . $mod . "/" . $albumid . "/" . $pTrackId;
				break;
		}
		return $str;
	}

}



?>