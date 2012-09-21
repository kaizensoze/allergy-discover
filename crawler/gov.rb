
require 'anemone'
require 'mysql2'

excludes = ['(Complete MSDS for this product)', 'Non-hazardous ingredient(s)']

client = Mysql2::Client.new(:host => "localhost", :username => "root", :password => "root", :database => "allergy_test")

Anemone.crawl("http://householdproducts.nlm.nih.gov/cgi-bin/household/list?tbl=TblBrands&alpha=A", :threads => 20, :depth_limit => 2) do |anemone|
  anemone.on_pages_like(/\/cgi-bin\/household\/brands\?tbl=brands&id=\d+$/) do |page|  # /\/cgi-bin\/household\/brands\?tbl=brands&id=19033001/
    page_doc = page.doc
    product = page_doc.css('.bodytext')[0].text

    # Leave this out for now.
    # product.gsub!(/-\d+\/\d+\/\d+$/, '')
    # product.gsub!(/-Old Product$/, '')
    # product.gsub!(/-discontinued$/, '')

    # puts "#{page.url}   -    #{product}"

    ingredient_tds = page_doc.css('table')[-2].css('tr')[1..-1].css('td')

    ingredients = 0.step(ingredient_tds.length-1, 3).map { |i| ingredient_tds[i].text } - excludes

    ingredients.each do |ingredient|
      # puts "#{product}  -  #{ingredient}"
      escaped_product = client.escape(product)
      escaped_ingredient = client.escape(ingredient)
      client.query "INSERT IGNORE INTO product_ingredients (product, ingredient) VALUES ('#{escaped_product}', '#{escaped_ingredient}')"
    end
  end
end

client.close
