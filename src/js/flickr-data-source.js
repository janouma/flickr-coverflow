class FlickrDataSource {

	constructor({
		apiKey,
		user,
		size
	}){
		this._apiKey = apiKey;
		this._user = user;
		this._size = size;
		this._source = `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&format=json&nojsoncallback=1&extras=url_t,url_s,url_m&api_key=${apiKey}&user_id=${user}&per_page=14`;
        this._currentPage = 1;
        this._endOfStream = false;
	}


    nextPage(){
        if(this._endOfStream){
            return Promise.resolve([]);
        }

        return new Request(`${this._source}&page=${this._currentPage++}`)
            .send()
            .then((response) => {
                let data = JSON.parse(response.text);
                this._endOfStream = !data.photos.photo.length;

                Logger.debug(`[FlickrCoverflow.FlickrDataSource] - nextPage -`, {
                    loaded: data.photo.length,
                    total: data.photos.total
                });

                if(!this._endOfStream){
                    return data.photos.photo;
                }else{
                    return [];
                }
            });
    }

}