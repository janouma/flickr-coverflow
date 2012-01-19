(function( $ ) {
  $.fn.clone = function() {
  	var nodes = [];
    this.each(function() {
        nodes.push(this.cloneNode(true));
    });
    return $(nodes);
  };
})( $ );