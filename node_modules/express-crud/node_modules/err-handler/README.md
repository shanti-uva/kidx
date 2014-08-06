#err-handler
Avoid this:

````javascript
app.get('/', function(req, res, next){
  Resource.get(function(err, resource){
    if(err)return next(err);
    res.json(resource);
  });
});
````

By using this:

````javascript
app.get('/', function(req, res, next){
  Resource.get(errHandler(next, function(resource){
    res.json(resource);
  });
});
````
