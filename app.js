
// Module dependencies.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var app = express();


// Configuration.
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});


// Mysql config.
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  database: 'allergy_test'
});


// Initial setup for setting app-wide variables.
app.set('title', 'Allergy Test');

function storeAllergyDataInMemory() {
  conn.connect();
  conn.query('SELECT product, ingredient FROM product_ingredients ORDER BY product, ingredient', function(err, results) {
    if (err) throw err;
    
    var products = [];
    var ingredients = [];
    var productIngredients = {};
    var ingredientProducts = {};

    for (var i=0; i < results.length; i++) {
      var row = results[i];
      var product = row['product'];
      var ingredient = row['ingredient'];

      // Add product.
      if (products.indexOf(product) === -1) {
        products.push(product);
      }

      // Add ingredient.
      if (ingredients.indexOf(ingredient) === -1) {
        ingredients.push(ingredient);
      }
      
      if (!productIngredients[product]) {
        productIngredients[product] = [];
      }
      productIngredients[product].push(ingredient);

      if (!ingredientProducts[ingredient]) {
        ingredientProducts[ingredient] = [];
      }
      if (ingredientProducts[ingredient].indexOf(product) === -1) {
        ingredientProducts[ingredient].push(product);
      }
    }

    products.sort();
    ingredients.sort();

    app.set('products', JSON.stringify(products));
    app.set('ingredients', JSON.stringify(ingredients));
    app.set('productIngredients', JSON.stringify(productIngredients));
    app.set('ingredientProducts', JSON.stringify(ingredientProducts));
  });

  conn.end();
}
storeAllergyDataInMemory();


// Route handlers.
app.get('/', routes.index);


// Start listening.
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
