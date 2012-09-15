
var spider = require('spider');
var urlParse = require('url').parse;
var mysql = require('mysql');

var conn = mysql.createConnection({
  host   : 'localhost',
  user   : 'root',
  password : 'root',
  database : 'allergy_test'
});
// conn.connect();

var crawledPageLinks = false;

var crawler = spider({maxSockets: 5});
crawler
.route('householdproducts.nlm.nih.gov', '/cgi-bin/household/list?*&alpha=*', function(window, $) {
  $('li a').spider();

  // if (!crawledPageLinks) {
  //   $('.h3:first a').spider();
  //   crawledPageLinks = true;
  // }
})
.route('householdproducts.nlm.nih.gov', '/cgi-bin/household/brands?*=brands&id=*', function(window, $) {
  var productName = $('.headertext').first().next('td').text();
  console.log(productName);

  var ingredientsIsh = $('table').eq(20).find('td.bodytext');
  var ingredients = [];
  ingredientsIsh.each(function(idx) {
    var thing = $(this).text();
    if (idx % 3 === 0 && thing !== "(Complete MSDS for this product)") {
      ingredients.push(thing);
    }
  });
  for (var i=0; i < ingredients.length; i++) {
    var chemicalName = ingredients[i];
    // insertProductIngredient(productName, chemicalName);
  }
})
// .log('info')
.get('http://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=C');


// Utility functions.

function insertProductIngredient(productName, chemicalName) {
  var data = {product: productName, ingredient: chemicalName};
  conn.query('INSERT IGNORE INTO product_ingredients SET ?', data, function(err, result) {
    if (err) throw err;
  });
}
