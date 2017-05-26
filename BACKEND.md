### Why?
我们的其他后端程序员没有写项目文档!!! 没有文档!!!!
因为只有把前端运行起来是不够的, 我们还需要后端数据, 如下

```bash
# clone 新主站代码
git clone https://github.com/GeekPark/geekpark.git --depth=1
cd geekpark
# install
bundle
# db
bundle exec rake db:create db:migrate
# cp config/app.yaml
cp config/app.yml.example config/app.yml
# mock data
bundle exec rails c
FactoryGirl.create_list(:column, 50)
FactoryGirl.create_list(:tag, 50)
FactoryGirl.create_list(:topic, 50)
FactoryGirl.create_list(:post, 50)
FactoryGirl.create_list(:comment, 50)
FactoryGirl.create_list(:ad, 50)
# start
bundle exec rails s -p 5000
```

在 `config/application.rb` 文件中加入
```ruby
config.middleware.insert_before 0, 'Rack::Cors' do
  allow do
    origins %r{\Ahttps?:\/\/(.*\.)?geekpark\.net\z}
    resource '/api/*', headers: :any, methods: [:get, :post, :options]
    origins '*'
    resource '/api/*',
            headers: :any,
            methods: [:get, :post, :options],
            credentials: true
    resource '/admin/*',
            headers: :any,
            methods: [:get, :post, :patch, :options, :put],
            credentials: true
    resource %r{/my/(access_key)},
            headers: :any,
            methods: [:get, :post, :patch, :options],
            credentials: true
```

OK, 以上除了用户站之外, 其他数据都有了, 用户站涉及到数据安全, 暂时不开放, 嗯, 就这样😀
