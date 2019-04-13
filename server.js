var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine
app.set( 'view engine', 'ejs' )
// allow to load external resources
//app.use(express.static('public'));
//var wroot = "/ucd-ecs272-p2/";
//app.locals.docroot = wroot + "public";
//app.locals.njslibr = wroot + "node_modules";
app.use(express.static(__dirname + '/public/'));

// set node_module route
app.use('/lib', express.static(__dirname + '/node_modules/'));

var config = require( './config' );

// MongoDB Client
var mongo = require( 'mongodb' );
var mdb_client = mongo.MongoClient;
var mdbo;
mdb_client.connect( config.MongoDB_URL, function( err, db )
{
	if (err) throw err;
	mdbo = db.db( config.MongoDB_DB );
	console.log( "Connected to MongoDB." );
});

// MySQL Client
var mysql = require( 'mysql' );
var sql_client = mysql.createConnection({
	host: config.MySQL_ADDR,
	user: config.MySQL_USER,
	password: config.MySQL_PASS,
	database: config.MySQL_DB
});
sql_client.connect( function(err)
{
    if (err) throw err;
    console.log( "Connected to MySQL." );
});

// handling data request
app.post( '/mongo/query', function( req, res )
{
	var collection = req.body.collection;
	var condition = req.body.conidtion;
	var index = req.body.index;
	console.log( condition );
	console.log( index );
	if( condition == undefined )
		condition = {};
	if( index == undefined )
		index = {};
	mdbo.collection( collection ).find( condition, index ).toArray( function( err, result )
	{
		if (err) throw err;
		res.send( result );
	});
});
app.post( '/mongo/quone', function( req, res )
{
    var collection = req.body.collection;
    var condition = req.body.conidtion;
	console.log( collection );
    console.log( condition );
    if( condition == undefined )
        condition = {};
	mdbo.collection( collection ).findOne( condition, function( err, result )
    {
        if (err) throw err;
        res.send( result );
    });
});
app.post( '/mysql/query', function( req, res )
{
	var command = req.body.command;
	sql_client.query( command, function (err, result)
	{
		if (err) throw err;
		res.send( result );
	});
});


app.get('/', function (req, res)
{
	//res.send('Hello World!')
	res.render( 'index' );
})

//app.listen( 8802, function ()
//{
//	console.log('App now listening on port 8802!')
//})

var httpsServer = https.createServer(credentials, app);
httpsServer.listen( 8802 );
