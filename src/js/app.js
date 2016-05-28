import Coverflow from 'flickr-coverflow/coverflow'

export default () => {
  Coverflow.logLevel = 'debug'

  new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow'),
    '3d': true
  }).init()

  new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow-bis'),
    '3d': false
  }).init()

  new Coverflow({
    apiKey: 'd894b19ad1a475b0d9aff1a5eb612419',
    user: '80141149@N00',
    container: document.getElementById('flickr-coverflow-third'),
    '3d': true
  }).init()
}

