var mysql=require('mysql');

var product;
var email;
var version;
var bugs=[];
var results;





exports.index = function(req, res){

  res.render('home');
};



exports.getChilds = function(req, res){
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

var query='select child from related where base='+mysql.escape(bug);

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

res.render('result',
				{child:data,
				base:bug,
				product:product,
				email:email,
				version:version,
				result:results
				}
				
				);
	
});

con.end();
};






exports.getBugs = function(req, res){
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
	 product=req.body.product;
	 email=req.body.email;
	 version=req.body.version;
	
	var user=email.split("@")[0];
	console.log("user===="+user)
	

var queryAll='SELECT bug_id FROM bugs b '+
'JOIN profiles p ON p.userid=b.assigned_to '+
'JOIN products pr ON pr.id=b.found_in_product_id '+
'JOIN versions v ON v.id=b.found_in_version_id '+
'WHERE pr.name='+mysql.escape(product)+' and p.login_name='+mysql.escape(user)+' and v.name='+mysql.escape(version)+
' and b.resolution ="fixed" and b.bug_status in ("closed","resolved")';



	


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
  res.render('result',{product:product,
					 email:email,
					 version:version,
					 result:results,
					 child:'',
					 base:''
					
									 
					 });

  
  
  }
  
});
con.end();



};
