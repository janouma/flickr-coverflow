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
			throw `level argument must be provided. actual: "${newLevel}"`;
		}

		levelIndex = _levels.indexOf(newLevel);

		if(levelIndex < 0){
			throw `"${newLevel}" log level is not supported`;
		}

		this._level = newLevel;

		for(let level of _levels.slice(0, levelIndex)){
			this[level] = this._noaction;
		}
	},

	debug(...params){
		this._trace("debug", params);
	},

	log(...params){
		this._trace("log", params);
	},

	info(...params){
		this._trace("info", params);
	},

	warn(...params){
		this._trace("warn", params);
	},

	error(...params){
		this._trace("error", params);
	},


	_trace(level, params){
		if( !(level in console) ){
			level = "log";
		}
		console[level](...params);
	},


	_noaction(){},

};