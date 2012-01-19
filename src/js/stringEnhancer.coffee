console?.log """*** WARNING *** Enhancing String object with "capitalize()" method"""

String.prototype.capitalize =->
	if this.length > 1
		"#{this[0].toUpperCase()}#{this[1..this.length].toLowerCase()}"
	else if this.length = 1
		this.toUpperCase()
	else this