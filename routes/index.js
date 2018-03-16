var express = require('express');
var router = express.Router();
var http=require('http');
//var encoding =require('encoding');
/* GET home page. */

router.get('/', function(req, res, next) {
	if(req.session.un==null){
		req.session.nickname="未登录";
		req.session.isLog=0;
	}
	var data = new Promise(function(resolve, reject){
        //做一些异步操作
		 var json = '';
		 http.get('http://localhost:3000/getinfo', function (res) {
		res.on('data', function (data) {
		json += data;
		}).on('end',function (){
			json = JSON.parse(json);
			resolve(json);
			 })
		}).on('error', function (e) {
    console.error(e);
	});
       
    }); 
	data.then(function(data){
		var title=new Array;
		var pid=new Array;
		for(i=0;i<data.length;i++){
			title[i]=data[i].pname;
			pid[i]=data[i].pid;
			
		}
		
		res.render('index',{
		title:title,
		nickname:req.session.nickname,
		isLog:req.session.isLog,
		pid:pid
		});

});
})

module.exports = router;
