var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routers = require('./routes/index');
var users = require('./routes/users');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); //动态网站

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	secret: '12345',
	name: "user",
	cookie: {
		maxAge: 1000 * 60 * 50
	},
	resave: false,
	saveUninitialized: false
})); //session

app.use(express.static(path.join(__dirname, 'public'))); //静态网站

app.use('/', routers);
app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req, res, next) {
	var pw = req.body.pw;
	var status;
	req.session.regenerate(function(err) {
		if(err) {
			return res.sendStatus(500);
		}

		if(req.body.un != '') {
			var p = new Promise(function(resolve, reject) {
				http.get("http://localhost:8080/getteacher/" + req.body.un, function(res) {
					var json = "";
					res.on('data', function(data) {
						json += data;
					}).on("end", function() {
						json = JSON.parse(json);
						console.log(json[0].tpw);
						if(json[0].tpw == pw) {
							status = 200;
							req.session.nickname=json[0].tname;
						} else status = 404;
						resolve(status);
					})
				})
			})
			p.then(function(data) {
				if(status == 200) {
					req.session.un = req.body.un;
					req.session.isLog = 1;
				}
				res.sendStatus(status);
			})
		} else {
			res.sendStatus(404);
		}

	})

})
app.get('/logout',function (req,res) {
	req.session.isLog=0;
	req.session.un=null;
	req.session.nickname="未登录";
	res.send("登出成功！<br/><a href='/'>返回主页</a> ");
})
app.post('/reg', function(req, res) {
	//var querystring = require('querystring');
	//发送 http Post 请求  
	var postData = JSON.stringify(req.body);
	var options = {
		hostname: 'localhost',
		port: 8080,
		path: '/user_add',
		method: 'POST',
		headers: {
			//'Content-Type':'application/x-www-form-urlencoded',  
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Length': Buffer.byteLength(postData)
		}
	}
	var p = new Promise(function(resolve, reject) {
		var post_req = http.request(options, function(res) {
			//res.setEncoding('utf-8');
			var all = "";
			res.on('data', function(data) {
				all += data;
			}).on('end', function() {
				console.log(all);
				all = JSON.parse(all);
				var status = all.status;
				resolve(status);
			});
		});
		post_req.on('error', function(err) {
			console.error(err);
		});
		post_req.write(postData);
		post_req.end();
	})
	p.then(function(data) {

		res.sendStatus(data);
	});

})

app.get('/getinfo', function(req, res) {
	var data = new Promise(function(resolve, reject) {
		//做一些异步操作
		var json = '';
		http.get('http://localhost:8080/getinfo', function(res) {
			res.on('data', function(data) {
				json += data;
			}).on('end', function() {
				resolve(json);
			})
		}).on('error', function(e) {
			console.error(e);
		});

	});
	data.then(function(data) {
		res.send(data);
	})
});

app.get('/p/:pid', function(req, res) {
	var data = new Promise(function(resolve, reject) {
		//做一些异步操作
		var json = '';
		http.get('http://localhost:8080/p/' + req.params.pid, function(res) {
			res.on('data', function(data) {
				json += data;
			}).on('end', function() {
				json = JSON.parse(json);
				resolve(json);
			})
		}).on('error', function(e) {
			console.error(e);
		});

	});
	data.then(function(data) {
		res.render('inner', {
			title: data[0].pname,
			pin: data[0].pin,
			tname: data[0].tname,
			isLog: req.session.isLog,
			ptime: data[0].ptime,
			pid:data[0].pid
		})
	})
})

app.get('/add_addicate/:pid',function(req,res){
    var Date=moment().format('YYYY-MM-DD H:mm:ss');
    var data={"pid":req.params.pid,"sno":req.session.un,"sname":req.session.nickname,"time":Date};
    var postData = JSON.stringify(data);
    var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/add_addicate',
        method: 'POST',
        headers: {
            //'Content-Type':'application/x-www-form-urlencoded',
            'Content-Type': 'application/json;charset=UTF-8',
            'Content-Length': Buffer.byteLength(postData)
        }
    }
    var data = new Promise(function(resolve, reject) {
        var post_req = http.request(options, function(res) {
            //res.setEncoding('utf-8');
            var all = "";
            res.on('data', function(data) {
                all += data;
            }).on('end', function() {
                console.log(all);
                all = JSON.parse(all);
                var status = all.status;
                resolve(status);
            });
        });
        post_req.on('error', function(err) {
            console.error(err);
			resolve(404);
        });
        post_req.write(postData);
        post_req.end();
	});
data.then(function (status) {
    console.log(status);
    res.sendStatus(status);
})


});
app.get('/get_addicate/:pid',function(req,res){
    var data = new Promise(function(resolve, reject) {
        //做一些异步操作
        var json = '';
        http.get('http://localhost:8080/get_addicate/'+req.params.pid, function(res) {
            res.on('data', function(data) {
                json += data;
            }).on('end', function() {
                resolve(json);
            })
        }).on('error', function(e) {
            console.error(e);
        });

    });
    data.then(function(data) {
        res.send(data);
    })
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;