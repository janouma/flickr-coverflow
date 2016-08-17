import Coverflow from 'flickr-coverflow/coverflow'
import FlickrDataSource from 'flickr-coverflow/flickr-data-source'
import MockDataSource from 'flickr-coverflow/mock-data-source'

export default () => {
  Coverflow.logLevel = 'debug'

  let dataSource = new FlickrDataSource({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    pageSize: Coverflow.PAGE_SIZE
  })

  let coverFlow = new Coverflow({
    dataSource,
    container: document.getElementById('flickr-coverflow'),
    '3d': true
  })

  coverFlow.onInit(() => console.debug('first Coverflow initialized'))
  coverFlow.onInit(() => console.debug('first Coverflow initialized bis'))
  coverFlow.onLoad(() => console.debug('first Coverflow loaded page'))
  coverFlow.onZoom((event) => console.debug('first Coverflow zoom:', event))
  coverFlow.onPrevious((event) => console.debug('first Coverflow previous:', event))
  coverFlow.onNext((event) => console.debug('first Coverflow next:', event))
  coverFlow.init()

  dataSource = new FlickrDataSource({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    pageSize: Coverflow.PAGE_SIZE
  })

  coverFlow = new Coverflow({
    dataSource,
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

  dataSource = new FlickrDataSource({
    apiKey: 'd894b19ad1a475b0d9aff1a5eb612419',
    user: '80141149@N00',
    pageSize: Coverflow.PAGE_SIZE
  })

  coverFlow = new Coverflow({
    dataSource,
    container: document.getElementById('flickr-coverflow-third'),
    '3d': true
  })

  let joLartist = coverFlow
  let interval = setInterval(() => {
    if (!joLartist.next()) {
      clearInterval(interval)
    }
  }, 3000)

  coverFlow.onInit(() => console.debug('third Coverflow initialized'))
  coverFlow.onZoom((event) => console.debug('third Coverflow zoom:', event))
  coverFlow.onPrevious((event) => console.debug('third Coverflow previous:', event))
  coverFlow.onNext((event) => console.debug('third Coverflow next:', event))
  coverFlow.init()

  dataSource = new MockDataSource()

  coverFlow = new Coverflow({
    dataSource,
    container: document.getElementById('flickr-coverflow-last'),
    '3d': true
  })

  coverFlow.init()
}

