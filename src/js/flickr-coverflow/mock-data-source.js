class MockDataSource {
  static EMPTY_RESULTS = Object.freeze([])
  _endOfStream = false

  nextPage() {
    if (this._endOfStream) {
      return Promise.resolve(MockDataSource.EMPTY_RESULTS)
    } else {
      this._endOfStream = true
      return Promise.resolve([
        {
          title: `t${performance.now()}`,
          url_t: 'images/sd/0.jpg',
          url_s: 'images/hd/0.jpg',
          url_m: 'images/hd/0.jpg'
        },
        {
          title: `t${performance.now()}`,
          url_t: 'images/sd/1.jpg',
          url_s: 'images/hd/1.jpg',
          url_m: 'images/hd/1.jpg'
        }/*,
        {
          title: `t${performance.now()}`,
          url_t: 'images/sd/3.jpg',
          url_s: 'images/hd/3.jpg',
          url_m: 'images/hd/3.jpg'
        }/*,
        {
          title: `t${performance.now()}`,
          url_t: 'images/sd/4.jpg',
          url_s: 'images/hd/4.jpg',
          url_m: 'images/hd/4.jpg'
        }*/
      ]);
    }
  }
}

export default MockDataSource