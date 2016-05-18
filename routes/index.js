var mysql=require('mysql');




exports.index = function(req, res){

  res.render('home');
};



exports.search = function(req, res){
	var bug=req.query.bug_id;
	console.log("********"+bug);
var con = mysql.createConnection({
  host: "bz3-m-db3.eng.vmware.com",
  user: "mts",
  password: "mts",
  database: "bugzilla"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

var query='select thetext from longdescs where bug_id= '+mysql.escape(bug);

var data;

con.query(query,function(err,rows){
	if(err){
		console.log("error="+err);
	}
	else if(rows){
		data=rows;
		console.log("data recieved")
		console.log(rows);
  
  
	}

res.render('search',{data:data});
	
});

con.end();
};






exports.query = function(req, res){
var con = mysql.createConnection({
  host: "bz3-m-db3.eng.vmware.com",
  user: "mts",
  password: "mts",
  database: "bugzilla"
});


con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});
	var product=req.body.product;
	var email=req.body.email;
	var version=req.body.version;
	
	var user=email.split("@")[0];
	console.log("user===="+user)
	
	
	
var query='SELECT bug_id from bugs where product_id '+
'IN(SELECT id from products where name='+mysql.escape(product)+')and bug_id '+
'IN(SELECT child FROM related where base IN(SELECT b.bug_id FROM bugs b '+
'JOIN profiles p ON p.userid=b.assigned_to '+
'JOIN products pr ON pr.id=b.found_in_product_id '+
'JOIN versions v ON v.id=b.found_in_version_id '+
'WHERE pr.name='+mysql.escape(product)+' and p.login_name= '+mysql.escape(user)+' and v.name= '+mysql.escape(version)+'))';


var results;	
con.query(query,function(err,rows){
  if(err){
  console.log("error="+err);
  }
 else if(rows){
  results=rows;
  console.log('Data received from Db:\n');
  console.log(results);
  for(var i=0;i<rows.length;i++){
  console.log(results[i].bug_id);
  }
  console.log(JSON.stringify(rows));
  

  
  res.render('result',{product:product,
					 email:email,
					 version:version,
					 result:results
									 
					 });
  }
});

con.end();
	


  
};
