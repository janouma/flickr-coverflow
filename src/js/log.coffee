window.LogLevel =
	TRACE:
		id: 0
		label: "TRACE"
		
	DEBUG:
		id: 1
		label: "DEBUG"
		
	INFO:
		id: 2
		label: "INFO"
		
	WARNING:
		id: 3
		label: "WARNING"
		
	ERROR:
		id: 4
		label: "ERROR"
		
	FATAL:
		id: 5
		label: "FATAL"


class window.Logger
	
	constructor: (@configuration = level:LogLevel.ERROR) ->
		dynamicMethods = ""
		for levelName, levelObject of LogLevel
			dynamicMethods += """
			
			this.levelIs#{levelName.capitalize()} = function () {
			  return this.configuration.level.id <= LogLevel.#{levelName}.id;
			}
			
			this.#{levelName.toLowerCase()} = function (message) {
			  return this.log(LogLevel.#{levelName}, message);
			}
			"""

		eval dynamicMethods
		
	log: (level, message) ->
		now = new Date()
		if @configuration.level.id <= level.id
			console?.log "#{level.label}	- #{now.toLocaleDateString()} #{now.toLocaleTimeString()}	- #{message}"
