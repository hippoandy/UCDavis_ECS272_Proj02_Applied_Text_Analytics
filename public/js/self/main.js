var center_lat = 37.7749;
var center_lon = -122.4194;

$( document ).ready(function()
{
    // show the first tab
    document.getElementById( "view1" ).style.display = "block";

    // mdb_query( "business", { "business_id": "FYWN1wneV18bWNgQjJ2GNg" } ).then( function( data )
    // {   // Run this when your request was successful
    //     console.log( data )
    // }).catch( function( err )
    // {   // Run this when promise was rejected via reject()
    //     console.log( err )
    // });
    // mdb_query( "business", {} ).then( function( data )
    // {   // Run this when your request was successful
    //     console.log( data )
    // }).catch( function( err )
    // {   // Run this when promise was rejected via reject()
    //     console.log( err )
    // });
});

// MongoDB Query Request --------------------------------------------------------
function mdb_query( collection, condition )
{
    return new Promise( function( resolve, reject )
    {
        $.ajax({
            type: 'POST',
            data: JSON.stringify( { "collection": collection, "conidtion": condition } ),
            contentType: 'application/json',
            url: '/mongo/query',
            // async: false,
            success: function( data ) { resolve( data ); },
            error: function( err ) { reject( err ); }
        });
    });
}
// -------------------------------------------------------- MongoDB Query Request

// MySQL Query Request --------------------------------------------------------
function sql_query( command )
{
    return new Promise( function( resolve, reject )
    {
        $.ajax({
            type: 'POST',
            data: JSON.stringify( { "command": command } ),
            contentType: 'application/json',
            url: '/mysql/query',
            // async: false,
            success: function( data ) { resolve( data ); },
            error: function( err ) { reject( err ); }
        });
    });
}
// -------------------------------------------------------- MongoDB Query Request

// OpenLayers -------------------------------------------------------------------
function init()
{
    var from_proj = new OpenLayers.Projection( "EPSG:4326" );      // Transform from WGS 1984
    var to_proj   = new OpenLayers.Projection( "EPSG:900913" );    // to Spherical Mercator Projection
    var position  = new OpenLayers.LonLat( center_lon, center_lat ).transform( from_proj, to_proj );
    var zoom      = 10;
    var map = new OpenLayers.Map({
        div: "map",
        layers: [ new OpenLayers.Layer.OSM( "OSM (without buffer)" ) ],
        eventListeners: {
            // "zoomend": mapEvent,
            "moveend": mapEvent,
            "changelayer": mapLayerChanged,
            "changebaselayer": mapBaseLayerChanged
        }
    });
    // define custom map event listeners
    function mapEvent( event )
    {
        // console.log( event.type );
        var bounds = map.getExtent();
        x0y0 = new OpenLayers.LonLat( bounds.left, bounds.top ).transform( to_proj, from_proj );
        x2y2 = new OpenLayers.LonLat( bounds.right, bounds.bottom ).transform( to_proj, from_proj );

        var table = "business";
        var command = "SELECT * FROM " + table + " WHERE latitude > " +
            x2y2.lat + " and latitude < " +
            x0y0.lat + " and longitude > " +
            x0y0.lon + " and longitude < " +
            x2y2.lon;

        sql_query( command ).then( function( data )
        {   // Run this when your request was successful
            console.log( data )
            for( var i = 0 ; i < data.length ; i++ )
            {
                var d = data[ i ];
                var markers = new OpenLayers.Layer.Markers( d.name );
                map.addLayer( markers );
                markers.addMarker( new OpenLayers.Marker( new OpenLayers.LonLat( d.longitude, d.latitude ).transform( from_proj, to_proj ) ) );
            }
        }).catch( function( err )
        {   // Run this when promise was rejected via reject()
            console.log( err )
        });
    }
    function mapBaseLayerChanged( event )
    {
        console.log( event.type + " " + event.layer.name );
    }
    function mapLayerChanged( event )
    {
        console.log(event.type + " " + event.layer.name + " " + event.property);
    }
    // map.addControl( new OpenLayers.Control.LayerSwitcher() );
    map.setCenter( position, zoom );
}
// ------------------------------------------------------------------- OpenLayers

// Navbar Functions -------------------------------------------------------------------
function change_color( id )
{
    $(".nav>li").removeClass( "active" );
    $(id).addClass( "active" );
}
function open_tab(evt, tab_name)
{
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName( "tabcontent" );
    for( i = 0; i < tabcontent.length; i++ )
        tabcontent[i].style.display = "none";

    document.getElementById( tab_name ).style.display = "block";
}
// ------------------------------------------------------------------- Navbar Functions

// General Usage ----------------------------------------------------------------------
function auto_scroll( id )
{
    // auto-scroll
    $('html, body').animate(
    {
        scrollTop: $(id).offset().top
    },
    500);
}
// ---------------------------------------------------------------------- General Usage