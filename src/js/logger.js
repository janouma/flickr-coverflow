let Logger = {
	_level: "info",

	_levels: [
		"debug",
		"log",
		"info",
		"warn",
		"error"
	],


	get level(){
		return this._level;
	},


	set level(newLevel){
		let levelIndex;
		let _levels = this._levels;

		newLevel = ((newLevel && newLevel.trim()) || "").toLowerCase();

		if( ! newLevel ){
			throw `[FlickrCoverflow.Logger] - set level - level argument must be provided. actual: "${newLevel}"`;
		}

		levelIndex = _levels.indexOf(newLevel);

		if(levelIndex < 0){
			throw `[FlickrCoverflow.Logger] - set level - "${newLevel}" log level is not supported`;
		}

		this._level = newLevel;

		if(levelIndex > 0){
			for(let level of _levels.slice(0, levelIndex)){
				this[level] = this._noaction;
			}
		}

		for(let level of _levels.slice(levelIndex)){
			this[level] = this._trace.bind(this, level);
		}

		this.info(`[FlickrCoverflow.Logger] - set level - Level has been set to "${newLevel}"`);
	},

	_trace(level, ...params){
		if( !(level in console) ){
			level = "log";
		}
		console[level](...params);
	},


	_noaction(){},

};

for(let level of Logger._levels){
	Logger[level] = Logger._noaction;
}