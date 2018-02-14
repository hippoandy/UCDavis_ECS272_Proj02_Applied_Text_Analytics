const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine
app.set( 'view engine', 'ejs' )
// allow to load external resources
app.use(express.static('public'));

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
	console.log( condition )
	if( condition == undefined )
		condition = {}
	mdbo.collection( collection ).find( condition ).toArray( function( err, result )
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

app.listen( 8802, function ()
{
	console.log('App now listening on port 8802!')
})
