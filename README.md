# upload-demo

### 项目名称：xxxx

---

## 安装NodeJs版本管理工具`nvm`

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

source ~/.bashrc

nvm -h

```

可以到这里下载安装最新稳定版本
[https://github.com/creationix/nvm](https://github.com/creationix/nvm)


## 安装NodeJs

```
$ nvm ls-remote --lts   # 查看nodeJS最新稳定版本
$ nvm install v10.20.0 (此项目v8以上即可)
$ nvm alias default v10.20.0  # 设置为默认版本
$ node -v   # 查看node版本，检测node是否安装正常
$ npm -v    # 查看npm版本，检测npm是否安装正常
```


## 切换私服(避免npm install慢问题)

```
$ nrm use customName
```

> 关于`添加镜像私服地址`请查看：  


## 安装依赖包

```
$ cd upload-demo
$ npm install    #安装node依赖包
```

## 打包发布

打包过后文件会放到dist目录下，请拷贝此目录下的所有文件


1、发布到生产环境

```bash
$ cd upload-demo
$ git checkout master && git pull
$ npm run build:prod
```

2、发布到测试环境

```bash
$ cd upload-demo
$ git checkout develop && git pull
$ npm run build:test
```

3、开发者本地打包测试

```bash
$ cd upload-demo
$ git checkout your-feature-branch && git pull
$ npm run build
```

4、开发者本地源码启动

```
$ cd upload-demo
$ git checkout your-feature-branch && git pull
$ npm run serve
```

3、Nginx配置

> a、http配置

```sh
server {
    listen       8080;
    server_name  example.com;
    client_max_body_size 20M;
    access_log  /var/logs/access_manage_8080.log;
    error_log   /var/logs/error_manage_8080.log;
    
    location / {
        root   /workspace/dist/upload-demo;
        index  index.html;
        try_files $uri $uri/ /index.html =404;
        
        #开启gzip压缩功能
        gzip on;
        #或者 gzip_buffers 16 8k; //这里表示每压缩16个包，每个包8k大小，就向客户端发送
        gzip_buffers 32 4k;
        #这里表示压缩级别，可以是0到9中的任一个，级别越高，压缩就越小，节省了带宽资源，但同时也消耗CPU资源，所以一般折中为6
        gzip_comp_level 6;
        #这里表示如果文件小于200个字节，就不用压缩，因为没有意义，本来就很小
        gzip_min_length 200;
        #这里表示哪些类型的文件要压缩，text/html类型是默认的不需要写，如果不知道文件有哪些类型，可以在nginx目录中找到文件类型，/var/#mywww/nginx/conf/mime.types 文件中记录了所有可以 压缩的文件类型
        gzip_types text/plain text/xml application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
        #可以不写，表示我在传送数据时，给客户端说明我使用了gzip压缩
        gzip_vary on;
    }
	
    location /api/ { # 不含/api开头
        proxy_pass    http://api.example.com/; #API服务
    }
    location /static/ { # 不含/static开头
        proxy_pass  http://api.example.com/; #静态资源服务
    }
}
```

> b、https配置

```
server {
    listen  443 ssl;
    server_name  example.com;
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    
    client_max_body_size 20M;
    access_log  /var/logs/access_manage_443.log;
    error_log   /var/logs/error_manage_443.log;
    
    location / {
        root   /workspace/dist/upload-demo;
        index  index.html;
        try_files $uri $uri/ /index.html =404;
        
        #开启gzip压缩功能
        gzip on;
        #或者 gzip_buffers 16 8k; //这里表示每压缩16个包，每个包8k大小，就向客户端发送
        gzip_buffers 32 4k;
        #这里表示压缩级别，可以是0到9中的任一个，级别越高，压缩就越小，节省了带宽资源，但同时也消耗CPU资源，所以一般折中为6
        gzip_comp_level 6;
        #这里表示如果文件小于200个字节，就不用压缩，因为没有意义，本来就很小
        gzip_min_length 200;
        #这里表示哪些类型的文件要压缩，text/html类型是默认的不需要写，如果不知道文件有哪些类型，可以在nginx目录中找到文件类型，/var/#mywww/nginx/conf/mime.types 文件中记录了所有可以 压缩的文件类型
        gzip_types text/plain text/xml application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
        #可以不写，表示我在传送数据时，给客户端说明我使用了gzip压缩
        gzip_vary on;
    }
	
    location /api/ { # 不含/api开头
        proxy_pass    https://api.example.com/; #API服务
    }
    location /static/ { # 不含/static开头
        proxy_pass  http://api.example.com/; #静态资源服务
    }
}
```
