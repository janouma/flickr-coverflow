/* Flickr Coverflow 0.1.0 */
class FlickrCoverflow {

	constructor(){
		Logger.log("[FlickrCoverflow] - constructor");
	}

}

Object.defineProperty(
	FlickrCoverflow,
	"logLevel",
	{
		get(){ return Logger.level; },
		set(level){
			Logger.level = level;
			Logger.info('%cFlickr Coverflow 0.1.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;');
		}
	}
);