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
.route('whatsinproducts.com', '/brands/index', function(window, $) {
    $('.ltr_srch_hldr a').spider();
})
.route('whatsinproducts.com', '/brands/brand_search/1/[ACEGHIJLMNOQRUWXYZ]', function(window, $) {
    $('.brnd_srch_brnd_name2 a').spider();
})
// .route('whatsinproducts.com', '/brands/brand_search/1/[BDFKPSTV]', function(window, $) {
//     $('.brnd_srch_brnd_name2 a').each(function() {
//         $(this).attr('href', encodeURI($(this).attr('href')));
//     });
//     $('.brnd_srch_brnd_name2 a').spider();
// })
// .route('whatsinproducts.com', '/brands/brand_search/1/0-9', function(window, $) {
//     $('.brnd_srch_brnd_name2 a').spider();
// })
.route('whatsinproducts.com', '/types/type_detail/*', function(window, $) {
    var productName = $('.srch_hd span').text();

    $('.brnd_srch_chem_name a').each(function() {
        var chemicalName = $(this).text();
        insertProductIngredient(productName, chemicalName);
    });
})
.log('debug')
.get('http://whatsinproducts.com/brands/index');


// Utility functions.

function insertProductIngredient(productName, chemicalName) {
    var data = {product: productName, ingredient: chemicalName};
    conn.query('INSERT IGNORE INTO product_ingredients SET ?', data, function(err, result) {
        if (err) throw err;
    });
}
