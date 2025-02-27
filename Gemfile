# frozen_string_literal: true

source 'https://rubygems.org'

gem 'aasm'
gem 'activejob-status'
gem 'ancestry'
gem 'api-pagination'
gem 'axlsx', git: 'https://github.com/randym/axlsx'

gem 'backup'
gem 'barby'
gem 'bcrypt_pbkdf', '>= 1.0', '< 2.0'
gem 'bibtex-ruby'
gem 'bootsnap'
gem 'bootstrap-sass', '~> 3.4.1'
gem 'charlock_holmes'

# gem 'chem_scanner', git: 'git@git.scc.kit.edu:ComPlat/chem_scanner.git'
gem 'chem_scanner', git: 'https://github.com/complat/chem_scanner.git'

gem 'closure_tree'
gem 'countries'

gem 'daemons'
gem 'delayed_cron_job'
gem 'delayed_job_active_record'
gem 'devise'
gem 'dotenv-rails', require: 'dotenv/rails-now'

gem 'ed25519', '>= 1.2', '< 2.0'

gem 'faraday', '~> 0.12.1'
gem 'faraday_middleware', '~> 0.12.1'
gem 'font-awesome-rails'
gem 'fun_sftp', git: 'https://github.com/fl9/fun_sftp.git', branch: 'allow-port-option'
gem 'fx'

gem 'grape', '~>1.2.3'
gem 'grape-entity'
gem 'grape-kaminari'
gem 'grape-swagger'
gem 'grape-swagger-entity', '~> 0.3'
gem 'grape-swagger-rails'
gem 'grape-swagger-representable', '~> 0.2'

gem 'graphql'

gem 'haml-rails', '~> 1.0'
gem 'hashie-forbidden_attributes'
gem 'httparty'

gem 'inchi-gem', '1.06.1', git: 'https://github.com/ComPlat/inchi-gem.git', branch: 'main'

gem 'jbuilder', '~> 2.0'
gem 'jquery-rails'
gem 'jwt'

gem 'kaminari'
gem 'kaminari-grape'
gem 'ketcherails', git: 'https://github.com/complat/ketcher-rails.git', ref: '287c848ad4149caf6466a1b7a648ada017d30304'

gem 'net-sftp'
gem 'net-ssh'
gem 'nokogiri'

gem 'omniauth', '~> 1.9.1'
gem 'omniauth-github', '~> 1.4.0'
gem 'omniauth-oauth2', '~> 1.7', '>= 1.7.2'
gem 'omniauth-orcid', git: 'https://github.com/datacite/omniauth-orcid'
gem 'omniauth_openid_connect'
gem 'openbabel', '2.4.90.3', git: 'https://github.com/ComPlat/openbabel-gem.git', branch: 'hot-fix-svg'

gem 'pandoc-ruby'
gem 'paranoia', '~> 2.0'
gem 'pg', '~> 0.20.0'
gem 'pg_search'
gem 'prawn'
gem 'prawn-svg'
gem 'pundit'

# If we want to upgrade past rack >= 2.1 we need to upgrade to at least grape
# 1.3.0
gem 'rack', '~> 2.0.0'
gem 'rack-cors', require: 'rack/cors'
gem 'rails', '~> 5.2.0'
gem 'rdkit_chem', git: 'https://github.com/CamAnNguyen/rdkit_chem'
gem 'rinchi-gem', '1.0.1', git: 'https://git.scc.kit.edu/ComPlat/rinchi-gem.git'
gem 'rmagick'
gem 'roo', '>2.5.0'
gem 'rqrcode'
gem 'rtf'
gem 'ruby-geometry', require: 'geometry'
gem 'ruby-mailchecker'
gem 'ruby-ole'

gem 'sablon', git: 'https://github.com/ComPlat/sablon'
gem 'sassc-rails', '~> 2.1.2'
gem 'scenic'
gem 'schmooze'
gem 'semacode', git: 'https://github.com/toretore/semacode.git', branch: 'master'
gem 'sentry-rails'
gem 'sentry-ruby'
gem 'swot', git: 'https://github.com/leereilly/swot.git', branch: 'master', ref: 'bfe392b4cd52f62fbc1d83156020275719783dd1'
gem 'sys-filesystem'

gem 'thor'
gem 'thumbnailer', git: 'https://github.com/merlin-p/thumbnailer.git'
gem 'turbo-sprockets-rails4'

gem 'uglifier', '>= 4.0.0'
# gem 'webpacker', '~> 6.0.0.beta.6'
gem 'webpacker', git: 'https://github.com/rails/webpacker', branch: 'master'
gem 'whenever', require: false

gem 'yaml_db'

group :development do
  gem 'better_errors' # allows to debug exception on backend from browser

  gem 'capistrano', '3.9.1'
  gem 'capistrano-bundler'
  gem 'capistrano-npm'
  gem 'capistrano-nvm', require: false
  gem 'capistrano-rails'
  gem 'capistrano-rvm'
  gem 'capistrano-yarn'

  gem 'fast_stack'    # For Ruby MRI 2.0
  gem 'flamegraph'

  gem 'memory_profiler'

  #  gem 'rack-mini-profiler', git: 'https://github.com/MiniProfiler/rack-mini-profiler'
  gem 'slackistrano'
  gem 'stackprof' # For Ruby MRI 2.1+

  gem 'web-console', '~> 2.0'
end

group :development, :test do
  gem 'annotate'
  gem 'awesome_print'

  gem 'binding_of_caller'
  gem 'bullet'
  gem 'byebug'

  gem 'chronic'

  gem 'listen'

  # Install mailcatcher outside the bundle since it does not support rack 2.0
  # Use `gem install mailcatcher` instead
  # gem 'mailcatcher'

  gem 'meta_request'

  gem 'pry-byebug'
  gem 'pry-rails'

  gem 'puma'

  gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false

  gem 'rspec-rails'
  gem 'ruby_jard'
  gem 'rubyXL', '3.3.26'

  gem 'spring'
end

group :test do
  gem 'capybara'

  gem 'database_cleaner'

  gem 'factory_bot_rails', '~>4.11'
  gem 'faker', '~> 1.6.6'

  gem 'launchy', '~> 2.4.3'

  gem 'rspec-repeat'

  gem 'simplecov', require: false
  gem 'simplecov-lcov', require: false

  gem 'webdrivers'
  gem 'webmock'
end

# gem 'nmr_sim', git: 'https://github.com/ComPlat/nmr_sim', ref: 'e2f91776aafd8eb1fa9d88c8ec2291b02201f222', group: [:plugins,:development, :test, :production]

# Chemotion plugins: list your ELN specific plugin gems in the Gemfile.plugin
eln_plugin = File.join(File.dirname(__FILE__), 'Gemfile.plugin')
eval_gemfile eln_plugin if File.exist?(eln_plugin)
