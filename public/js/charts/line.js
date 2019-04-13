// Line Chart
// Ref.
//    1. https://bl.ocks.org/pstuffa/26363646c478b2028d36e7274cedefa6
//    2. https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3
//    3. https://bl.ocks.org/micahstubbs/e4f5c830c264d26621b80b754219ae1b

var y_range =
{
    "min": -2,
    "max": 2
}

var line_chart = {
    draw: function( id, data )
    {
        // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
        // var data = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })

        // 1. Use the margin convention practice 
        var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = $(id).width() - margin.left - margin.right, // Use the window's width 
            height = 400 - margin.top - margin.bottom; // Use the window's height

        // The number of datapoints
        var n = data.length;

        // 5. X scale will use the index of our data
        var x_scale = d3.scaleLinear()
            .domain( [ data[0].x, data[data.length - 1].x ] )
            .range( [ 0, width ] );

        // 6. Y scale will use the randomly generate number 
        var y_scale = d3.scaleLinear()
            .domain( [ y_range.min, y_range.max ] )
            .range( [ height, 0 ] );

        // 7. d3's line generator
        var line = d3.line()
            .x(function(d, i) { return x_scale(i); }) // set the x values for the line generator
            .y(function(d) { return y_scale(d.y); }) // set the y values for the line generator 
            .curve( d3.curveMonotoneX ); // apply smoothing to the line

        // 2. Add the SVG to the page and employ #2
        var svg = d3.select( id ).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // 3. Call the x axis in a group tag
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3.axisBottom( x_scale )
                    .ticks( data.length )
                    // .tickFormat( d3.format("d") )
            ); // Create an axis component with d3.axisBottom

        // 4. Call the y axis in a group tag
        svg.append( "g" )
            .attr( "class", "y axis" )
            .call( d3.axisLeft( y_scale ) ); // Create an axis component with d3.axisLeft

        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            .datum( data ) // 10. Binds data to the line 
            .attr("class", "lc-line") // Assign a class for styling 
            .attr("d", line) // 11. Calls the line generator
            .attr( 'stroke', "#fff" );

        // 12. Appends a circle for each datapoint 
        svg.selectAll(".dot")
            .data( data )
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "lc-dot") // Assign a class for styling
            .attr("cx", function(d, i) { return x_scale(i) })
            .attr("cy", function(d) { return y_scale(d.y) })
            .attr("r", 5);

        // text label for the x axis
        svg.append("text")             
            .attr( "transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")" )
            .style("text-anchor", "middle")
            .attr( "class", "lc-label" )
            .text( "Sentences" );
        
        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr( "class", "lc-label" )
            .text("Sentiment Score"); 

        var g = svg.append( "g" );

        var focus = g.append("g")
            .attr( "class", "focus" )
            .style( "display", "none" );

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", 0);

        focus.append("text")
            .attr( "x", 15 )
            .attr( "dy", ".31em" )
            .attr( "class", "text-bold" )
            .style( "fill", "white" );

        svg.append("rect")
            // .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" )
            .attr( "class", "lc-overlay" )
            .attr( "width", width )
            .attr( "height", height )
            .on( "mouseover", function() { focus.style( "display", null ); } )
            .on( "mouseout", function() { focus.style( "display", "none" ); } )
            .on( "mousemove", mousemove);

        var bisect_data = d3.bisector( function( d ) { return d.x; } ).left;
        function mousemove()
        {
            var x0 = x_scale.invert( d3.mouse( this )[ 0 ] ),
                i = bisect_data( data, x0, 1 ),
                d0 = data[ (i - 1) ],
                d1 = data[ i ],
                d = x0 - d0.x > d1.x - x0 ? d1 : d0;
                ind = x0 - d0.x > d1.x - x0 ? i : (i - 1);

            focus.attr("transform", "translate(" + x_scale( ind ) + "," + y_scale( d.y ) + ")");
            focus.select( "text" ).text(function() { return d.y; });
            focus.select( ".x-hover-line" ).attr( "y2", height - y_scale( d.y ) );
            focus.select( ".y-hover-line" )
                .attr( 'x1', 0 )
                .attr( 'x2', -x_scale( d.x ) )
                .attr( 'y1', 0 )
                .attr( 'y2', 0 );
        }
    }
};
