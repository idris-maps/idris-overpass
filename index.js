var Promise = require('pinkie-promise')
var fetch = require('fetch-ponyfill')({Promise: Promise}).fetch
var osmtogeojson = require('osmtogeojson')

module.exports = function(input, callback) {
	var data = checkInput(input)
	var url = createUrl(data.bbox, data.kv, data.timeout)
	reqUrl(url, function(err, json) { 
		if (err) return callback(err)
		var geojson = osmtogeojson(json, { flatProperties: true })
		callback(null, geojson)
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
	fetch(url, {
		mode: 'cors',
		redirect: 'follow'
	})
	.then(function (res) {
		if (!res.ok) {
			var err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
	.then(function (body) {
		callback(null, body)
	})
	.catch(callback)
}
