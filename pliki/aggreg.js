var dbaggreg = db.reddit.aggregate( [ { $match: { author : "YoungModern" } } , { $group: { _id : "$subreddit_id" , total : { $sum: "$score" } } } ] ).pretty();

printjson(dbaggreg);
