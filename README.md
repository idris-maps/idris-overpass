# idris-overpass

Query the [overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API). Returns a GeoJSON collection.

**WORKS ONLY IN NODE as it uses [request](https://www.npmjs.com/package/request) to fetch the data.**

## Usage

**io(config, callback)**

```
var io = require('idris-overpass')

var config = {
	bbox: [7.590,47.560,7.595,47.563],
	kv: [{key: 'highway', value: '*'}]
}

io(config, function(geojson) {
	console.log(geojson)
})
```

**config**

* bbox (required) [minX, minY, maxX, maxY]
* kv (required) an array of objects ```{key: ... , value: ... }```
* timeout (optional)
