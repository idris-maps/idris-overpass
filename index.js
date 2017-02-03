var request = require('request')
var osmtogeojson = require('osmtogeojson')

module.exports = function(input, callback) {
	var data = checkInput(input)
	var url = createUrl(data.bbox, data.kv, data.timeout)
	reqUrl(url, function(json) { 
		var geojson = osmtogeojson(json, { flatProperties: true })
		callback(geojson)
	})
}

function checkInput(input) {
	var ok = true
	var data = {}
	if(!input.kv) { ok = false; console.log('Specify key/value pairs') }
	else { data.kv = input.kv }
	if(!input.bbox) { ok = false; console.log('Specify bounding box') }
	else { data.bbox = input.bbox }
	if(input.timeout) { data.timeout = input.timeout }
	else { data.timeout = 100 }
	if(ok) { return data }
}

function createUrl(bb, keyVals, timeout) {
	var bbox = '%28' + bb[1] + '%2C' + bb[0] + '%2C' + bb[3] + '%2C' + bb[2] + '%29'
	var url = 'http://www.overpass-api.de/api/interpreter?data=[out:json]'
	var time = 25
	if(timeout) { time = timeout }
	url = url + '[timeout:' + time + '];('
	
	keyVals.forEach(function(kv) {
		var k = kv.key
		var v = kv.value
		kv.types = ["node","way", "relation"]
		kv.types.forEach(function(kvt) {
			if(v === '*') { url = url + kvt + '["' + k + '"]' + bbox + ';' }
			else { url = url + kvt + '["' + k + '"="' + v + '"]' + bbox + ';' }
		})
	})

	url = url + ');out body;>;out skel qt;'
	return decodeURIComponent(url)
}

function reqUrl(url, callback) {
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(JSON.parse(body))
		} else {
			console.log('request ERROR', error)
			console.log('request STATUSCODE', response.statusCode)
		}
	})
}
