
// Word Cloud
// Ref.
//    1. https://bl.ocks.org/abrahamdu/e1481e86dd4e9d553cc2d7d359b91e68
//    2. https://github.com/jasondavies/d3-cloud

var word_cloud = {
    draw: function( data )
    {
        // // var categories = d3.keys(d3.nest().key(function(d) { return d.category; }).map(data));
        // // var color = d3.scale.ordinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]);
        var color = d3.scaleBand().rangeRound( ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"] )
        var fontSize = d3.scalePow().exponent(5).domain([0,1]).range([10,80]);

        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 460 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        var svg = d3.select( '#sider-wc-container' ).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var color = d3.scaleOrdinal(d3.schemeCategory20);
        // var categories = d3.keys(d3.nest().key(function(d) { return d.State; }).map(data));
        // var fontSize = d3.scalePow().exponent(5).domain([0,1]).range([40,80]);
        
        var layout = d3.layout.cloud()
            .size([width, height])
            .timeInterval(20)
            .words(data)
            .rotate(function(d) { return 0; })
            .fontSize(function(d,i) { return fontSize(Math.random()); })
            //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
            .fontWeight(["bold"])
            .text(function(d) { return d.Team_CN; })
            .spiral("rectangular") // "archimedean" or "rectangular"
            .on("end", draw_wc)
            .start();

        var wordcloud = svg.append("g")
            .attr('class','wordcloud')
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

        var div = d3.select( "#tooltip" );
        function draw_wc( words )
        {
            wordcloud.selectAll( "text" )
                .data( words )
                .enter().append( "text" )
                .attr( 'class', 'word')
                .style( "font-size", function(d) { return d.size + "px"; } )
                .style( "font-family", function(d) { return d.font; } )
                // .style( "fill", function( d ) { return color( d ); } )
                .style( "fill", function( d ) { return color( d.word ); } )
                //.style("fill", function(d) { 
                    //var paringObject = data.filter(function(obj) { return obj.Team_CN === d.text});
                // return color(paringObject[0].category); 
                //})
                .attr( "text-anchor", "middle" )
                .attr( "transform", function( d ) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; } )
                .text( function(d) { return d.word; } )
                .on( "mouseover", function( d )
                {
                    div.transition()
                        .duration( 100 )
                        .style( "visibility", "visible" )
                        .style( "opacity", 0.9 )
                        .style( "transition", "0.5s" );
                    div.html(
                            "<div class=\"text-bold center\"style='font-size: 1.5em;'>" + d.word + "</div>" +
                            "Amount: <bold><italic>" + d.amount + "</bold></italic>"
                        )
                        .style( "left", (d3.event.pageX - 90) + "px" )
                        .style( "top", (d3.event.pageY - 28) + "px" );
                })
                .on( "mouseout", function() {
                    return div.style( "visibility", "hidden" );
                });
        }
    }
};
