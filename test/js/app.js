import { Coverflow, FlickrDataSource } from './flickr-coverflow-dev.js'
import MockDataSource from './mock-data-source.js'

Coverflow.logLevel = 'debug'

{
  const dataSource = new FlickrDataSource({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    pageSize: Coverflow.PAGE_SIZE
  })

  const coverFlow = new Coverflow({
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
}

{
  const dataSource = new FlickrDataSource({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    pageSize: Coverflow.PAGE_SIZE
  })

  const coverFlow = new Coverflow({
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
}

{
  const dataSource = new FlickrDataSource({
    apiKey: 'd894b19ad1a475b0d9aff1a5eb612419',
    user: '80141149@N00',
    pageSize: Coverflow.PAGE_SIZE
  })

  const joLartist = new Coverflow({
    dataSource,
    container: document.getElementById('flickr-coverflow-third'),
    '3d': true,
    size: 'large',
    prefix: 'fcf'
  })

  let interval = setInterval(() => {
    if (!joLartist.next()) {
      clearInterval(interval)
    }
  }, 3000)

  joLartist.onInit(() => console.debug('third Coverflow initialized'))
  joLartist.onZoom((event) => console.debug('third Coverflow zoom:', event))
  joLartist.onPrevious((event) => console.debug('third Coverflow previous:', event))
  joLartist.onNext((event) => console.debug('third Coverflow next:', event))
  joLartist.init()
}

{
  const dataSource = new MockDataSource()

  const coverFlow = new Coverflow({
    dataSource,
    container: document.getElementById('flickr-coverflow-last'),
    '3d': true
  })

  coverFlow.init()
}
