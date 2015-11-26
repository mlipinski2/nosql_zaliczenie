var dbfind1 = db.reddit.find({"author":"YoungModern", "score":{$gt: 10}}).count()

printjson(dbfind1)
