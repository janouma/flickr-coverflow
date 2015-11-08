/* Flickr Coverflow 0.1.0 */
class _FlickrCoverflow {

	constructor(
		{
			apiKey,
			user,
			containerId,
			size = "small",
			"3d": d3 = false
		} = {
			apiKey: undefined,
			user: undefined,
			containerId: undefined,
			size: undefined,
			"3d": undefined
		}
	){
		let container = document.getElementById(containerId);

		Logger.log("[FlickrCoverflow] - constructor");
		Logger.debug("[FlickrCoverflow] - constructor - ", {size, d3});

		this._validateStringArg("apiKey", apiKey);
		this._validateStringArg("user", user);
		this._validateStringArg("size", size, ["small", "medium", "large"]);

		if( ! container ){
			throw `parameter container is required and must be an HTMLElement. Actual: ${container}`;
		}

		CoverflowStyle.config = {
			containerId,
			size,
			"3d": d3
		};

		CoverflowStyle.insertSheet();
	}


	_validateStringArg(name, value, possibleValues){
		if( ! possibleValues ){
			if( typeof value !== "string" || ! value.trim() ){
				throw `parameter ${name} is required and must be a non-empty string. Actual: ${value}`;
			}
		}else{
			if( possibleValues.indexOf(value) < 0 ){
				throw `parameter ${name} must be one of ${possibleValues}. Actual: ${value}`;
			}
		}
	}

}

Object.defineProperty(
	_FlickrCoverflow,
	"logLevel",
	{
		get(){ return Logger.level; },
		set(level){
			Logger.level = level;
			Logger.info('%cFlickr Coverflow 0.1.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;');
		}
	}
);

if(typeof define === "function" && define.amd){
	define("FlickrCoverflow", ()=> _FlickrCoverflow);
}else{
	window.FlickrCoverflow = _FlickrCoverflow;
}