class MockDataSource {
  static EMPTY_RESULTS = Object.freeze([])
  _endOfStream = false
  
  get pageSize () {
    return 7
  }

  nextPage () {
    if (this._endOfStream) {
      return Promise.resolve(MockDataSource.EMPTY_RESULTS)
    } else {
      this._endOfStream = true
      return Promise.resolve([
        {
          title: 'pulsar',
          url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fnizwalls.files.wordpress.com%2F2009%2F04%2Fspace-and-planets_00022.jpg&f=1',
          url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fnizwalls.files.wordpress.com%2F2009%2F04%2Fspace-and-planets_00022.jpg&f=1',
          url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fnizwalls.files.wordpress.com%2F2009%2F04%2Fspace-and-planets_00022.jpg&f=1'
        },
        {
          title: 'milky way',
          url_t: 'https://images.photowall.com/products/71364/milky-way-galaxy.jpg?h=699&q=85',
          url_s: 'https://images.photowall.com/products/71364/milky-way-galaxy.jpg?h=699&q=85',
          url_m: 'https://images.photowall.com/products/71364/milky-way-galaxy.jpg?h=699&q=85'
        },
        {
          title: 'planet rain',
          url_t: 'https://img.freepik.com/premium-photo/rain-water-drop-falling-city-street-floor-heavy-rain-day_1962-2005.jpg?w=2000',
          url_s: 'https://img.freepik.com/premium-photo/rain-water-drop-falling-city-street-floor-heavy-rain-day_1962-2005.jpg?w=2000',
          url_m: 'https://img.freepik.com/premium-photo/rain-water-drop-falling-city-street-floor-heavy-rain-day_1962-2005.jpg?w=2000'
        },
        {
          title: 'stars ocean',
          url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-TDFRxAhzDIM%2FUNTp-W-zbsI%2FAAAAAAAAKyw%2FptSswHxO5XY%2Fs1600%2Flrg_christmas_tree_cluster_fox_fur_nebula_cone_nebula_ngc2264.jpg&f=1',
          url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-TDFRxAhzDIM%2FUNTp-W-zbsI%2FAAAAAAAAKyw%2FptSswHxO5XY%2Fs1600%2Flrg_christmas_tree_cluster_fox_fur_nebula_cone_nebula_ngc2264.jpg&f=1',
          url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-TDFRxAhzDIM%2FUNTp-W-zbsI%2FAAAAAAAAKyw%2FptSswHxO5XY%2Fs1600%2Flrg_christmas_tree_cluster_fox_fur_nebula_cone_nebula_ngc2264.jpg&f=1'
        },
        {
          title: 'jupiter rise',
          url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F_DJZSrQkWQCo%2FS8fFRvrhUeI%2FAAAAAAAAAM0%2Fy3YHWYY4EBs%2Fs1600%2FSunrise_in_Space_by_gucken.jpg&f=1',
          url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F_DJZSrQkWQCo%2FS8fFRvrhUeI%2FAAAAAAAAAM0%2Fy3YHWYY4EBs%2Fs1600%2FSunrise_in_Space_by_gucken.jpg&f=1',
          url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F_DJZSrQkWQCo%2FS8fFRvrhUeI%2FAAAAAAAAAM0%2Fy3YHWYY4EBs%2Fs1600%2FSunrise_in_Space_by_gucken.jpg&f=1'
        }/**/
      ])
    }
  }
}

export default MockDataSource
