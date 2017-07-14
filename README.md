# idris-overpass

Query the [overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API). Returns a GeoJSON collection, takes an [error-first callback](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/).

## Usage

**queryOverpass(config, callback)**

```
var queryOverpass = require('idris-overpass')

var config = {
	bbox: [7.590,47.560,7.595,47.563],
	kv: [{key: 'highway', value: '*'}]
}

queryOverpass(config, function(err, geojson) {
	if (err) console.error(err)
	else console.log(geojson)
})
```

**config**

* **bbox** (required) [minX, minY, maxX, maxY]
* **kv** (required) an array of objects ```{key: ... , value: ... }```
* **timeout** (optional)
