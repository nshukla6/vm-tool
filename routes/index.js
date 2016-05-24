var mysql=require('mysql');
var HashMap = require('hashmap');
var map = new HashMap();




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
	
var queryBase='select distinct base from related where '+
'child in '+
'( '+
'SELECT bug_id FROM bugs b '+
'JOIN profiles p ON p.userid=b.assigned_to '+
'JOIN products pr ON pr.id=b.found_in_product_id '+
'JOIN versions v ON v.id=b.found_in_version_id '+
'WHERE pr.name='+mysql.escape(product)+' and p.login_name='+mysql.escape(user)+' and v.name='+mysql.escape(version)+
' and b.resolution ="fixed" and b.bug_status in ("closed","resolved")'+
')'


var queryAll='SELECT bug_id FROM bugs b '+
'JOIN profiles p ON p.userid=b.assigned_to '+
'JOIN products pr ON pr.id=b.found_in_product_id '+
'JOIN versions v ON v.id=b.found_in_version_id '+
'WHERE pr.name='+mysql.escape(product)+' and p.login_name='+mysql.escape(user)+' and v.name='+mysql.escape(version)+
' and b.resolution ="fixed" and b.bug_status in ("closed","resolved")';








	
var results;
var bugs=[];
con.query(queryAll,function(err,rows){
  if(err){
  console.log("error="+err);
  res.render('error');
  }
 else if(rows){
  results=rows;
  console.log('Data received from Db:\n');
  console.log(results);
  for(var i=0;i<rows.length;i++){
	  bugs[i]=results[i].bug_id;
      console.log( bugs[i]);
  

  }
  console.log(JSON.stringify(rows));
  var map=my();
  res.render('result',{product:product,
					 email:email,
					 version:version,
					 result:results,
					 map:map
									 
					 });

  
  
  }
  
});

childBug=[];
normalBug=[];
var index=0;

function my(){

for(var i=0;i<bugs.length;i++){
	console.log("inside for loop "+bugs[i]);
	var bug=bugs[i];
var queryChild='select child from related where base='+mysql.escape(bugs[i]);

con.query(queryChild,function(err,rows){
	if(err){
		console.log("queryChild error="+err);
		res.render('error');
		
	}
	console.log("for bug "+bug+"childs are="+JSON.stringify(rows)+"query="+queryChild);
	if(rows.length>0){
		
	for(var j=0;j<rows.length;j++){
	  childBug[j]=rows[j].child;

  }
  console.log("base bug="+bug);
  map.set(bug,childBug);
  console.log("setting key="+bug+" and value="+childBug);
  
		
		
	}
	
	map.forEach(function(value, key) {
    console.log(key + " : " + value);
});


	
	
});

}
con.end();
return map;
}

};
