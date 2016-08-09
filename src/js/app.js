import Coverflow from 'flickr-coverflow/coverflow'

export default () => {
  Coverflow.logLevel = 'debug'

  let coverFlow = new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow'),
    '3d': true
  })
  coverFlow.onInit(() => console.debug('first Coverflow initialized'))
  coverFlow.onInit(() => console.debug('first Coverflow initialized bis'))
  coverFlow.onLoad(() => console.debug('first Coverflow loaded page'))
  coverFlow.onZoom((event) => console.debug('first Coverflow zoom:', event))
  coverFlow.init()

  coverFlow = new Coverflow({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    container: document.getElementById('flickr-coverflow-bis'),
    '3d': false
  })
  coverFlow.onInit(() => console.debug('second Coverflow initialized'))

  let loadSubscription = coverFlow.onLoad(() => {
    loadSubscription.off()
    console.debug('second Coverflow loaded page')
  })

  coverFlow.onLoad(() => console.debug('second Coverflow loaded page bis'))
  coverFlow.init()

  coverFlow = new Coverflow({
    apiKey: 'd894b19ad1a475b0d9aff1a5eb612419',
    user: '80141149@N00',
    container: document.getElementById('flickr-coverflow-third'),
    '3d': true
  })
  coverFlow.onInit(() => console.debug('third Coverflow initialized'))
  coverFlow.init()
}

