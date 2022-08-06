import { Coverflow, FlickrDataSource } from './flickr-coverflow.js'
Coverflow.logLevel = 'info'

{
  const dataSource = new FlickrDataSource({
    apiKey: 'd894b19ad1a475b0d9aff1a5eb612419',
    user: '80141149@N00',
    pageSize: Coverflow.PAGE_SIZE
  })
  
  /* const dataSource = new FlickrDataSource({
    apiKey: '526aaaa5cbca4f64991e80ea2c67c1e1',
    user: '12143321@N03',
    pageSize: Coverflow.PAGE_SIZE
  }) */

  const joLartist = new Coverflow({
    dataSource,
    container: document.getElementById('coverflow'),
    '3d': true,
    size: 'large',
    prefix: 'fcf'
  })

  joLartist.onInit(() => console.debug('joLartist Coverflow initialized'))
  // joLartist.onZoom((event) => console.debug('third Coverflow zoom:', event))
  // joLartist.onPrevious((event) => console.debug('third Coverflow previous:', event))
  // joLartist.onNext((event) => console.debug('third Coverflow next:', event))
  joLartist.init()
}
