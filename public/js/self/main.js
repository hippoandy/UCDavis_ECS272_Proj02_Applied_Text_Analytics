$( document ).ready(function()
{
    // show the first tab
    // document.getElementById( "view1" ).style.display = "block";
    // hide the sidebar
    close_sider();
    // hide the user review dashboard
    close_u_dash();
});

// MongoDB Query Request --------------------------------------------------------
function mdb_query( collection, condition, index )
{
    return new Promise( function( resolve, reject )
    {
        $.ajax({
            type: 'POST',
            data: JSON.stringify( { "collection": collection, "conidtion": condition, "index": index } ),
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

// Google Maps ------------------------------------------------------------------
var markers = [];
function init()
{
    var poistion = { lat: map_center.lat, lng: map_center.lon };
    var map = new google.maps.Map(document.getElementById( 'map' ), {
        zoom: 10,
        center: poistion
    });
    google.maps.event.addListener( map, 'idle', function()
    {
        del_markers();
        var bounds =  map.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var table = "business";
        var command = "SELECT * FROM " + table + " WHERE latitude > " +
            sw.lat() + " and latitude < " +
            ne.lat() + " and longitude > " +
            sw.lng() + " and longitude < " +
            ne.lng();
        sql_query( command ).then( function( data )
        {   // Run this when your request was successful
            for( var i = 0 ; i < data.length ; i++ )
            {
                var d = data[ i ];

                var latlon = new google.maps.LatLng( parseFloat(d.latitude), parseFloat(d.longitude) );
                var marker = new google.maps.Marker({
                    position: latlon,
                    map: map,
                    id: d.id,
                    data: d
                });
                markers.push( marker );
                marker.addListener('click', function()
                {
                    // show the loading icon
                    document.getElementById( "loading" ).style.visibility = "visible";
                    // clear old chart
                    document.getElementById( "sider-wc-container" ).innerHTML = "";
                    document.getElementById( "fillgauge1" ).innerHTML = "";
                    document.getElementById( "fillgauge2" ).innerHTML = "";
                    document.getElementById( "fillgauge3" ).innerHTML = "";
                    document.getElementById( "fillgauge4" ).innerHTML = "";
                    document.getElementById( "fd-graph" ).innerHTML = "";
                    // clear old data
                    document.getElementById( "sider-cate-container" ).innerHTML = "";
                    document.getElementById( "sider-photos" ).style.background = "";

                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify( { "collection": "business", "conidtion": { "business_id": this.id } } ),
                        contentType: 'application/json',
                        url: '/mongo/query',
                        async: true,
                        success: function( data )
                        {
                            var arr = data[ 0 ].categories;
                            for( var i = 0 ; i < arr.length ; i++ )
                                document.getElementById( "sider-cate-container" ).innerHTML += 
                                "<div class='category'>" + arr[ i ] + "</div>";
                        },
                        error: function( err ) { console.log( err ); }
                    });

                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify( { "collection": "photos", "conidtion": { "business_id": this.id } } ),
                        contentType: 'application/json',
                        url: '/mongo/query',
                        async: true,
                        success: function( data )
                        {
                            if( data.photo_id != undefined )
                                document.getElementById( "sider-photos" ).style.background = "url('/img/photos/" + data.photo_id + ".jpg') no-repeat center";
                            else
                                document.getElementById( "sider-photos" ).style.background = "url('/img/photo-default.jpg') no-repeat center";
                        },
                        error: function( err ) { console.log( err ); }
                    });

                    // setting the content
                    $("#sider-name").html( "<bold style='font-size: 25px;'>" + this.data.name + "</bold>" );
                    // $("#sider-addr").html( "<small>" + this.data.address + "<br>" + this.data.city + ", " + this.data.postal_code + "</small>" );

                    // set the star rating
                    const starPercentage = (parseFloat(this.data.stars) / 5) * 100;
                    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
                    document.getElementById( "stars-show" ).style.width = starPercentageRounded;

                    var store_name = this.data.name;
                    // apply NLP analysis
                    // var all_adjs = new Set();
                    var all_adjs = {};
                    $.ajax({
                        type: 'POST',
                        // data: JSON.stringify( { "collection": "review", "conidtion": { "business_id": this.id }, "index": { "business_id": 1 } } ),
                        data: JSON.stringify( { "collection": "business_reviews", "conidtion": { "business_id": this.id }, "index": { "business_id": 1 } } ),
                        contentType: 'application/json',
                        url: '/mongo/query',
                        async: true,
                        success: function( data )
                        {
                            var arr = data[ 0 ].reviews;
                            // for the graph
                            var user_cluster = {
                                "nodes": [
                                    {"id": store_name, "group": 0},
                                    {"id": "Positive", "group": 1},
                                    {"id": "Negative", "group": 2},
                                    {"id": "Neutral", "group": 3},
                                ],
                                "links": [
                                    {"source": "Positive", "target": store_name, "value": 1},
                                    {"source": "Negative", "target": store_name, "value": 1},
                                    {"source": "Neutral", "target": store_name, "value": 1},
                            ]};
                            var nega = 0, neut = 0, pos = 0, mixed = 0, total = 0 , sentiment = 0;
                            for( var i = 0 ; i < arr.length ; i++ )
                            {
                                var toparse = String(arr[ i ].text).replace( '\n', '' );
                                var uid = String(arr[ i ].user_id);
                                try
                                {
                                    // sentiment analysis by compedium lib.
                                    var c_r = compendium.analyse( toparse );
                                    for( var j = 0 ; j < c_r.length ; j++ )
                                    {
                                        var l = c_r[ j ].profile.label;
                                        switch( l )
                                        {
                                            case "positive":
                                                pos += 1;
                                                break;
                                            case "negative":
                                                nega += 1;
                                                break;
                                            case "neutral":
                                                neut += 1;
                                                break;
                                            case "mixed":
                                                mixed += 1;
                                                break;
                                        }
                                        sentiment = sentiment + parseInt(c_r[ j ].profile.sentiment);
                                    }
                                }
                                catch( err ){}
                                // part-of-speech tagging by compromise lib.
                                var r = nlp( toparse );
                                //grab the adjectives
                                var adjs = r.match( '#Adjective' ).not( nlp_config.adj_blacklist ).out('array');
                                for( var j = 0 ; j < adjs.length ; j++ )
                                {
                                    if( all_adjs[ adjs[ j ] ] == undefined ) all_adjs[ adjs[ j ] ] = 1;
                                    else all_adjs[ adjs[ j ] ] = all_adjs[ adjs[ j ] ] + 1
                                }
                                var new_gnode = {"id": uid, "group": 0, "text": toparse};
                                // clustering the user
                                if( pos > nega )        // Positive
                                {   new_gnode.group = 1;
                                    // add link
                                    user_cluster.links.push(
                                        {"source": "Positive", "target": uid, "value": (sentiment / c_r.length) * 100 }
                                    );
                                }
                                else if( nega > pos )   // Negative
                                {   new_gnode.group = 2;
                                    // add link
                                    user_cluster.links.push(
                                        {"source": "Negative", "target": uid, "value": (sentiment / c_r.length) * 100 }
                                    );
                                }
                                else                    // Neutral
                                {   new_gnode.group = 3;
                                    // add link
                                    user_cluster.links.push(
                                        {"source": "Neutral", "target": uid, "value": (sentiment / c_r.length) * 100 }
                                    );
                                }
                                // add node
                                user_cluster.nodes.push( new_gnode );
                            }
                            fd_graph.draw( user_cluster );
                            var ws = new Array();
                            for( var k in all_adjs )
                                if( all_adjs.hasOwnProperty( k ) )
                                    ws.push( { "word": String( k ), "amount": parseInt( all_adjs[ k ]) } );
                            word_cloud.draw( ws );

                            total = pos + nega + neut + mixed;
                            var p_pos, p_nega, p_neut, p_mixed;
                            try { p_pos = ((pos / total) * 100).toFixed( 1 ); }
                            catch( err ){ p_pos = 0; }
                            try { p_nega = ((nega / total) * 100).toFixed( 1 ); }
                            catch( err ){ p_nega = 0; }
                            try { p_neut = ((neut / total) * 100).toFixed( 1 ); }
                            catch( err ){ p_neut = 0; }
                            try { p_mixed = ((mixed / total) * 100).toFixed( 1 ); }
                            catch( err ){ p_mixed = 0; }
                            // thermo_draw( gg_config );
                            d3.select("#fillgauge1").call( d3.liquidfillgauge, p_pos, {
                                backgroundColor: "white",
                                waveAnimateTime: 2000,
                                waveHeight: 0.3,
                                waveCount: 1,
                                valueCountUpAtStart: false,
                                waveRiseAtStart: false
                            }).async;
                            d3.select("#fillgauge2").call( d3.liquidfillgauge, p_nega, {
                                circleColor: "#FF7777",
                                textColor: "#FF4444",
                                waveTextColor: "#FFAAAA",
                                waveColor: "#FF7777",
                                backgroundColor: "white",
                                waveAnimateTime: 2000,
                                waveHeight: 0.3,
                                waveCount: 1,
                                valueCountUpAtStart: false,
                                waveRiseAtStart: false
                            }).async;
                            d3.select("#fillgauge3").call( d3.liquidfillgauge, p_neut, {
                                circleColor: "#3CA55C",
                                textColor: "#3C7229",
                                waveTextColor: "#3CD88F",
                                waveColor: "#3CA55C",
                                backgroundColor: "white",
                                waveAnimateTime: 2000,
                                waveHeight: 0.3,
                                waveCount: 1,
                                valueCountUpAtStart: false,
                                waveRiseAtStart: false
                            }).async;
                            d3.select("#fillgauge4").call( d3.liquidfillgauge, p_mixed, {
                                circleThickness: 0.4,
                                circleColor: "#6DA398",
                                textColor: "#0E5144",
                                waveTextColor: "#6DA398",
                                waveColor: "#246D5F",
                                textVertPosition: 0.52,
                                waveAnimateTime: 5000,
                                waveHeight: 0,
                                waveAnimate: false,
                                waveCount: 2,
                                waveOffset: 0.25,
                                textSize: 1.2,
                                // minValue: 30,
                                // maxValue: 150,
                                // displayPercent: false
                            }).async;
                            // check if needed to open the sidebar
                            var sider_w = document.getElementById( "mySidenav" ).style.width;
                            if( sider_w == "0px" || sider_w == "" ) setTimeout( open_sider, 1000 );
                            document.getElementById( "loading" ).style.visibility = "hidden";
                        },
                        error: function( err ) { console.log( err ); }
                    });
                });
            }
        }).catch( function( err )
        {   // Run this when promise was rejected via reject()
            console.log( err )
        });
    });
}
// Sets the map on all markers in the array.
function set_map_on_all(map)
{
    for( var i = 0; i < markers.length; i++ ) markers[ i ].setMap(map);
}

// Removes the markers from the map, but keeps them in the array.
function clear_markers()
{
    set_map_on_all(null);
}

// Shows any markers currently in the array.
function show_markers()
{
    set_map_on_all(map);
}

// Deletes all markers in the array by removing references to them.
function del_markers()
{
    clear_markers();
    markers = [];
}
// ------------------------------------------------------------------ Google Maps


// User Review Dashboard Functions ----------------------------------------------
async function open_u_dash()
{
    var e = document.getElementById( "dashboard-u-reviews" );
    // e.style.top = "10px";
    // e.style.left = String(($(window).width() / 2) - ($('#dashboard-u-reviews').width() / 2)) + "px";
    e.style.top = "0px";
    e.style.visibility = "visible";
}
function close_u_dash()
{
    var e = document.getElementById( "dashboard-u-reviews" );
    e.style.top = "-" + String($('#dashboard-u-reviews').height() + ud_offset) + "px";
    e.style.visibility = "hidden";
    document.getElementById( "ud-ana-result" ).style.visibility = "hidden";
}
// ---------------------------------------------- User Review Dashboard Functions

// Sidebar Functions ------------------------------------------------------------
async function open_sider()
{
    var e = document.getElementById( "mySidenav" );
    e.style.right = "0px";
    e.style.visibility = "visible";
}
function close_sider()
{
    var e = document.getElementById( "mySidenav" );
    e.style.right = sidebar_loc;
    e.style.visibility = "hidden";
}
// ------------------------------------------------------------ Sidebar Functions

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
    $('#dashboard-u-reviews').animate(
    {
        scrollTop: $(id).offset().top
    },
    500);
}
// ---------------------------------------------------------------------- General Usage