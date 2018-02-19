
// Force-Directed Graph
// Ref. https://bl.ocks.org/mbostock/4062045

var fd_graph = {
    draw: function( graph )
    {
        var svg = d3.select( "#fd-graph" ),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        // var color = d3.scaleOrdinal(d3.schemeCategory20);
        var colors = [ "#178BCA", "#FF4444", "#3CA55C" ];

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data( graph.nodes )
            .enter().append("circle")
            .attr("r", function( d )
            {
                switch( d.id )
                {
                    case "Positive":
                    case "Negative":
                    case "Neutral":
                        return 15;
                    default:
                        return 7.5;
                }
            })
            .attr("fill", function(d)
            {
                if( d.group - 1 < 0 ) return "white";
                // return colors[ d.group - 1 ];
                switch( d.id )
                {
                    case "Positive": return colors[ 0 ];
                    case "Negative": return colors[ 1 ];
                    case "Neutral": return colors[ 2 ];
                    default: return "#3f3e3e";
                }
            })
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            .on( "click", function( d )
            {
                // clear the old line chart
                clear_udash();

                var review = d.text;
                if( review == undefined ) return;
                // clear old value
                var selector = document.getElementById( "ud-r-selector-container" );
                selector.innerHTML = "";
                var ud_title = document.getElementById( "ud-uid" );
                // ud_title.innerHTML = "";
                ud_title.style.background = "#3CA55C";
                switch( d.group )
                {
                    case 1:
                        ud_title.style.background = "#178BCA";
                        break;
                    case 2:
                        ud_title.style.background = "#FF7777";
                        break;
                }
                ud_title.innerHTML = "User ID &mdash; <italic>" + d.id + "</italic>";
                // set the selector value
                var arr = review.split( '. ' ).join('|').split('! ').join('|').split( '|' );
                var num_of_revs = arr.length;
                var lc_data = [];
                var confidence = 0, amplitude = 0, politeness = 0, dirtiness = 0;
                for( var i = 0 ; i < num_of_revs ; i++ )
                {
                    selector.innerHTML += "<label class='ud-r-selector'><div>" + arr[ i ] +
                        "</div><input type='radio' name='radio' onclick='clear_radio(); set_radio_true( this )'> \
                        <span class='checkmark'></span> \
                    </label>";

                    var c_r = compendium.analyse( arr[ i ] );
                    lc_data.push( { "x": i, "y": c_r[ 0 ].profile.sentiment } );

                    confidence += c_r[ 0 ].stats.confidence;
                    amplitude += c_r[ 0 ].profile.amplitude;
                    politeness += c_r[ 0 ].profile.politeness;
                    dirtiness += c_r[ 0 ].profile.dirtiness;
                }
                line_chart.draw( "#ud-line-container", lc_data );
                confidence = confidence / num_of_revs;
                amplitude = amplitude / num_of_revs;
                politeness = politeness / num_of_revs;
                dirtiness = dirtiness / num_of_revs;
                // draw the thermometer
                th_config.value = [
                    { label: "Avg. PoS Confidence", val: (confidence * 100)},
                    { label: "Avg. Amplitude", val: (amplitude * 100)},
                    { label: "Avg. Politeness", val: (politeness * 100)},
                    { label: "Avg. Dirtiness", val: (dirtiness * 100)}
                ];
                thermo_draw( "upper-th-container", th_config );
                open_u_dash();
            });

        node.append("title")
            .text(function(d) { return d.id; });

        simulation.nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked()
        {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        function dragstarted(d)
        {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d)
        {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d)
        {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
};

// Single Selection Radio List Functions ----------------------------------------
function clear_radio()
{
    $('input[name="radio"]').each( function()
    {
        $(this).attr( 'checked', false );
    });
}
function set_radio_true( item )
{
    $(item).attr( 'checked', true );
}
// ---------------------------------------- Single Selection Radio List Functions

// the button placed on the user review analysis panel
function parse_btn()
{
    // clear the error message
    document.getElementById( "selector-e-msg" ).innerHTML = "";
    var is_checked = false;
    var ele = undefined;
    $('input[name="radio"]').each( function()
    {
        if( $(this).attr( 'checked' ) == "checked" )
        {
            is_checked = true;
            ele = this;
            return;
        }
    }).promise().done( function()
    {
        if( !is_checked )   // set the error message
            document.getElementById( "selector-e-msg" ).innerHTML = "<italic class='font-s-1-5em'>Please select a sentence!</italic>";
        else
        {   clear_udash_lower();
            // show the analytic result panel
            document.getElementById( "ud-ana-result" ).style.visibility = "visible";
            // scroll down to see the result (function located in 'main.js')
            auto_scroll( '#ud-ana-result' );
            var toparse = String($(ele).prev().html());
            var c_r = compendium.analyse( toparse );
            // add the sentiment score tag
            document.getElementById( "ud-tag-container" ).innerHTML += " \
                <div class='sentiment-score'>Sentiment Score: <italic><yelpred>" + parseFloat(c_r[ 0 ].profile.sentiment).toFixed( 4 ) +
            "</yelpred></italic></div>";
            // set the tag ("positive", "negative", "neutral", or "mixed")
            var label = c_r[ 0 ].profile.label;
            var tag = "<div class='category bgcolor-neu'>" + label + "</div>";
            switch( label )
            {
                case "positive":
                    tag = "<div class='category bgcolor-pos'>" + label + "</div>"; break;
                case "negative":
                    tag = "<div class='category bgcolor-neg'>" + label + "</div>"; break;
                case "mixed":
                    tag = "<div class='category bgcolor-mix'>" + label + "</div>"; break;
            }
            // add the tag
            document.getElementById( "ud-tag-container" ).innerHTML += tag;
            var tokens = c_r[ 0 ].tokens;
            for( var i = 0 ; i < tokens.length ; i++ )
                document.getElementById( "ud-token-container" ).innerHTML += "<div class='token'> \
                    <div class='token-text'>" + tokens[ i ].raw + "</div> \
                    <hr style='border-top: black 1px dotted;'/> \
                    <div class='token-tag'>" + tokens[ i ].pos + "</div> \
                </div>";
            // draw the thermometer
            th_config.value = [
                { label: "PoS Confidence", val: (c_r[ 0 ].stats.confidence * 100)},
                { label: "Amplitude", val: (c_r[ 0 ].profile.amplitude * 100)},
                { label: "Politeness", val: (c_r[ 0 ].profile.politeness * 100)},
                { label: "Dirtiness", val: (c_r[ 0 ].profile.dirtiness * 100)}
            ];
            thermo_draw( "th-container", th_config );
        }
    });
}

function clear_udash_upper()
{
    // clear the old data & charts
    document.getElementById( "ud-line-container" ).innerHTML = "";
    document.getElementById( "upper-th-container" ).innerHTML = "";
}
function clear_udash_lower()
{
    // clear the old data & charts
    document.getElementById( "ud-tag-container" ).innerHTML = "";
    document.getElementById( "ud-token-container" ).innerHTML = "";
    document.getElementById( "th-container" ).innerHTML = "";
}
function clear_udash()
{
    clear_udash_upper();
    clear_udash_lower()
}