var express=require('express');
var app=express();


module.exports = function(app){
	app.get('/login',function(req,res){
		res.render('login');
	});
	
	app.post('/login',function(req,res){
	var data=req.body;
	console.log(data);
	res.sendStatus(200);
	
});
};
/*
app.post('/login',function(req,res,next){
	var username=req.data.un;
	var pw=req.data.pw;
	var json;
	http.get('',function(res){
		res.on('data'function(data){
			json+=data;
		}).on('end',function(){
			json = JSON.parse(json);
			if(json.pw==pw&&json.name==username){
				console.log("sucess");
			}
		}).on('error',function(err){
			console.log(err);
		})
	})
});
*/