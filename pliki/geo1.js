var gdansk = {
    "type" : "Point",
    "coordinates" : [ 18.68976, 54.361118 ]
	};
var geofind = db.miasta.find({loc: {$near: {$geometry: gdansk} } }).skip(1).limit(5).toArray();

printjson(geofind);
