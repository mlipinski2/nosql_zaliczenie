# nosql_zaliczenie
Projekt zespolowy stworzony na zaliczenie zajec czesci laboratoryjnej nosql

osoby:
* Michał Lipiński
* Mariusz Piątek

## zalozenie 
Zalozeniem w tym cwiczeniu przeze mnie i Mariusza bylo sprawdzenie jak mongodb bedzie dzialalo w systemie ktory zostal poddany wirtualizacji.
Do testow uzylismy sporej bazy z [reddit](https://www.reddit.com/r/datasets/comments/3bxlg7/i_have_every_publicly_available_reddit_comment), wielkosc ~5,5GB
po rozpakowaniu plik json ~32GB, ilosc rekordow 53 851 542 obiekty.

## import do mongodb

* odpalamy baze mongo db z parametrami cpu i directoryperdb w celu sprawdzania uzycia samego silnika w przypadku pierwszego przelacznika, drugi uzyteczny przy importowaniu innych baz w celu zachowania porzadku

```sh
mongod --cpu --directoryperdb --dbpath /home/luis/mongo
```

* importujemy baze do mongodb, uzycie binarki time pokazuje czas wykonywania polecenia

```sh
time bunzip2 -c RC_2015-01.bz2 | mongoimport --drop -d mongo -c reddit
```

![mongoimport_mongo_reddit_time.jpg](pliki/mongoimport_mongo_reddit_time.jpg)

![db.stats.jpg](pliki/db.stats.jpg)

jak widac czas jest blisko 120 minut, a zuzycie procesora dla hosta i VMki podczas importu wyglada jak ponizej:

 * HOST mozemy zauwazyc wzmozona prace 4 corow procesora fizycznego oraz dysku fizycznego dla watku VMki (write okolo 10MB/s)
	
![host_CPU_aggreg.jpg](pliki/host_CPU_aggreg.jpg)

![host_resource_monitor.jpg](pliki/host_resource_monitor.jpg)

 * VMka
	
![VM_CPU_after_600sec.jpg](pliki/VM_CPU_after_600sec.jpg)

* widac, ze utylizacja hosta jest tylko na 4 core`ach *czyli polowie) i 4 wirtualnych CPU dla VMki czyli 100% przydzielonych zasobow wirtualnych

skrypty ktore zostaly uzyte do powyzszych dzialan:

find1.js
```js
var dbfind1 = db.reddit.find({"author":"YoungModern", "score":{$gt: 10}}).count();

printjson(dbfind1);
```

find2.js
```js
var dbfind2 = db.reddit.find().pretty().limit(10);

printjson(dbfind2);
```

aggreg.js
```js
var dbaggreg = db.reddit.aggregate( [ { $match: { author : "YoungModern" } } , { $group: { _id : "$subreddit_id" , total : { $sum: "$score" } } } ] ).pretty();

printjson(dbaggreg);
```

## dzialania na postgres (import) (count)


* importowanie jsona bylo podzielone na dwie czesci, pierwsza to rozpakowanie archiwum z jsonem a druga to import przy pomocy binarki pgfutter, jak widac nie zajelo specjalnie duzo czasu:

![vm_time_import_psql.jpg](pliki/vm_time_import_psql.jpg)

* jednakze zliczanie wszystkich rekordow w bazie postgres juz trwa znaczaco **baaaaardzo dlugo:)**
 * 5050563 ms = 84.17605 min **:)**

![VM_psql_count_all.jpg](pliki/VM_psql_count_all.jpg)

* ponizej mozna zauwazyc ze maszyna fizyczna jak i wirtualna glownie zajete byly "dyskowo"

![host_CPU_utilization_psql_count_all.jpg](pliki/host_CPU_utilization_psql_count_all.jpg)

![VM_CPU_utilization_psql_count_all.jpg](pliki/VM_CPU_utilization_psql_count_all.jpg)

## GEOJSONy - (point) (polygon) (LineString)

* do zabawy z geojsonami uzylismy zbioru wszystkich miast i miasteczek w Polsce (4100 obiekotw) [miasta.polski.json](pliki/miasta.polski.json) gdzie zamiportowanie nie trwalo dlugo:

![VM_import_geojesony_time.jpg](pliki/VM_import_geojesony_time.jpg)

 * wykonanie pierwszego skryptu [geo1.js](pliki/geo1.js) ktorego postac wyglada:
 ```js
 var gdansk = {
    "type" : "Point",
    "coordinates" : [ 18.68976, 54.361118 ]
	};
var geofind = db.miasta.find({loc: {$near: {$geometry: gdansk} } }).skip(1).limit(5).toArray();

printjson(geofind);
```
dostarcza nam mapke z obszarem (polygon) najblizszych miast w/w obszarze:
[geo1.geojson](pliki/geo1.geojson)

* wykonanie drugiego skryptu [geo2.js](pliki/geo2.js) ktorego postac wyglada:
```js
var gdansk = db.miasta.find({"name":"GdaĹ„sk"}).limit(2).toArray()[0]
var gdansk2 = db.miasta.find({"name":"Gdansk"}).limit(1).toArray()[0]
var gdynia = db.miasta.find({"name":"Gdynia"}).limit(1).toArray()[0]
var sopot = db.miasta.find({"name":"Sopot"}).limit(1).toArray()[0]
var rumia = db.miasta.find({"name":"Rumia"}).limit(1).toArray()[0]
var reda = db.miasta.find({"name":"Reda"}).limit(1).toArray()[0]
var puck = db.miasta.find({"name":"Puck"}).limit(1).toArray()[0]
var wladek = db.miasta.find({"name":"Wladyslawowo"}).limit(1).toArray()[0]
var jastarnia = db.miasta.find({"name":"Jastarnia"}).limit(2).toArray()[0]
db.miasta.find({loc: {$geoIntersects: {$geometry : {type: "LineString", "coordinates" : [gdansk.loc.coordinates,gdansk2.loc.coordinates,gdynia.loc.coordinates,sopot.loc.coordinates,rumia.loc.coordinates,reda.loc.coordinates,puck.loc.coordinates,wladek.loc.coordinates,jastarnia.loc.coordinates]}}}})
```

dostarcza nam mapke z droga (LineString), ktora pokonuje na hel jadac na kajta:)
[geo2.geojson](pliki/geo2.geojson)

a tutaj mapka polski (polygon)
[polska.geojson](pliki/polska.geojson)

## __Na koniec taka nasza zyciowa prawda, ktora jak sie okazalo nawet podczas powyzszych zmagan dala sie we znaki:)__

![mistrz.png](pliki/mistrz.png)
