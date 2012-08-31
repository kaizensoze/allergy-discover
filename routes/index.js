
/*
 * GET home page.
 */

var mysql = require('mysql');
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  database: 'allergy_test'
});

exports.index = function(req, res){
  conn.connect();
  conn.query('SELECT * FROM product_ingredients', function(err, results) {
    if (err) throw err;
    
    res.render('index', {
      title: 'Allergy Test',
      results: results
    });
  });

  conn.end();
};