var spider = require('spider');
var urlParse = require('url').parse;
var mysql = require('mysql');

var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'allergy_test'
});
conn.connect();

var crawler = spider({maxSockets: 30});
crawler
.route('householdproducts.nlm.nih.gov', '/cgi-bin/household/list?*&alpha=A', function(window, $) {
    $('.h3 a').spider();
})
.route('householdproducts.nlm.nih.gov', '/cgi-bin/household/list?*&alpha=*', function(window, $) {
    $('li a').spider();
})
.route('householdproducts.nlm.nih.gov', '/cgi-bin/household/brands?*=brands*', function(window, $) {
    var productName = $('.headertext').first().next('td').text();

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
        insertProductIngredient(productName, chemicalName);
    }
})
.log('debug')
.get('http://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=A');


// Utility functions.

function insertProductIngredient(productName, chemicalName) {
    var data = {product: productName, ingredient: chemicalName};
    conn.query('INSERT IGNORE INTO product_ingredients SET ?', data, function(err, result) {
        if (err) throw err;
    });
}
