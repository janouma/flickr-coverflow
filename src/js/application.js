(function() {

  $(function() {
    var coverflow, jo, juice,
      _this = this;
    console.log("Application ready !!!");
    juice = {
      apiKey: "526aaaa5cbca4f64991e80ea2c67c1e1",
      user: "12143321@N03"
    };
    jo = {
      apiKey: "d894b19ad1a475b0d9aff1a5eb612419",
      user: "80141149@N00"
    };
    coverflow = $("#flickr-coverflow").flickrCoverflow(jo.apiKey, jo.user, {
      size: "small",
      renderIn3D: true
    });
    $(document).on("touchmove", function(event) {
      return event.preventDefault();
    });
    return $("#flickr-coverflow").on("zoom", function(event) {
      return console.log("Zoom Event has been triggered on " + ($(this).attr('id')) + ", url: " + event.zoomUrl);
    });
  });

}).call(this);
