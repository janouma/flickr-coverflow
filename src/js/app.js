import Coverflow from 'flickr-coverflow/coverflow'

export default () => {
  Coverflow.logLevel = 'debug'

  new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow'),
    '3d': true
  })

  new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow-bis'),
    '3d': false
  })

  new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow-third'),
    '3d': true
  })
}

