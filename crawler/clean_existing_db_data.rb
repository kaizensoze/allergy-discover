
require 'mysql2'

client = Mysql2::Client.new(:host => "localhost", :username => "root", :password => "root", :database => "allergy_test")

results = client.query "SELECT product, ingredient FROM product_ingredients"
results.each do |row|
  product = row["product"]
  old_product = product.dup

  # # product.sub!(/-\d+\/\d+\/\d+$/i, '')
  # product.sub!(/-Old Product$/i, '')
  # product.sub!(/-discontinued$/i, '')

  escaped_product = client.escape(product)
  escaped_old_product = client.escape(old_product)

  # NOTE: Decided against "cleaning" the data.
  
  # puts "UPDATE product_ingredients SET product = '#{escaped_product}' WHERE product = '#{escaped_old_product}'"
  # client.query "UPDATE product_ingredients SET product = '#{escaped_product}' WHERE product = '#{escaped_old_product}'"
end

client.close
