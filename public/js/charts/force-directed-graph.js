
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
                var review = d.text;
                if( review == undefined ) return;
                // clear old value
                var selector = document.getElementById( "ud-r-selector-container" );
                selector.innerHTML = "";
                document.getElementById( "ud-uid" ).innerHTML = "";
                var uidstyle;
                switch( d.group )
                {
                    case 1:
                        uidstyle = "User ID: <italic><positive>" + d.id + "</italic></positive>";
                        break;
                    case 2:
                        uidstyle = "User ID: <italic><negative>" + d.id + "</italic></negative>";
                        break;
                    default:
                        uidstyle = "User ID: <italic><neutral>" + d.id + "</italic></neutral>";
                        break;
                }
                document.getElementById( "ud-uid" ).innerHTML = uidstyle;
                // set the selector value
                var arr = review.split( '. ' ).join('|').split('! ').join('|').split( '|' );
                for( var i = 0 ; i < arr.length ; i++ )
                {
                    selector.innerHTML += "<label class='ud-r-selector'><div>" + arr[ i ] +
                        "</div><input type='radio' name='radio' onclick='clear_radio(); set_radio_true( this )'> \
                        <span class='checkmark'></span> \
                    </label>";
                }
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

function parse_btn()
{
    // clear the error message
    document.getElementById( "selector-e-msg" ).innerHTML = "";
    var is_checked = false;
    var ele;
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
            document.getElementById( "selector-e-msg" ).innerHTML = "[<italic>Error</italic>]Please select a sentence!";
        else
        {
            var toparse = String($(ele).prev().html());
            var c_r = compendium.analyse( toparse );
            console.log( c_r );
        }
    });
}