class MockDataSource {
  static EMPTY_RESULTS = Object.freeze([])
  _endOfStream = false

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
          url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmomentumbooks.com.au%2Fwp-content%2Fuploads%2F2013%2F06%2Fspace.jpg&f=1',
          url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmomentumbooks.com.au%2Fwp-content%2Fuploads%2F2013%2F06%2Fspace.jpg&f=1',
          url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmomentumbooks.com.au%2Fwp-content%2Fuploads%2F2013%2F06%2Fspace.jpg&f=1'
        },
        {
          title: 'planet rain',
          url_t: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fspace-wallpapers-3.jpg&f=1',
          url_s: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fspace-wallpapers-3.jpg&f=1',
          url_m: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F04%2Fspace-wallpapers-3.jpg&f=1'
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
