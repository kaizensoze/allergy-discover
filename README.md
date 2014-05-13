
# Setup

install rbenv
install ruby-build
install rbenv-gem-rehash

rbenv install 1.9.3-p545

rbenv global 1.9.3-p545
rbenv rehash

gem install mysql2
gem install anemone

## osx anemone issue

NOTE: for osx, anemone requires nokogiri which requires libxml which is a clusterfuck
see here: http://nokogiri.org/tutorials/installing_nokogiri.html

brew install libxml2 libxslt libiconv
gem install libxml-ruby
gem install nokogiri -- --use-system-libraries
gem install anemone

mysql -uroot -e 'create database allergy_test'
mysql -uroot -e "grant all privileges on allergy_test.* to 'allergy'@'localhost' with grant option"

# Info

http://anemone.rubyforge.org/doc/classes/Anemone/Core.html