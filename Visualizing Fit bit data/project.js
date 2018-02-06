


    var barW = 900,
        barH = 400,
        barMargin = { top: 20, bottom: 120, left: 100, right: 300 },
        barX = d3.scaleLinear(),
        barY = d3.scaleBand(0.5);

    var svg = d3.select("#bubble").append("svg")
    .attr("width", barW + barMargin.left + barMargin.right)
    .attr("height", barH + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("class", "main")
    .attr("transform",
         "translate(" + barMargin.left + "," + barMargin.top + ")")

    function mystack() {
        d3.csv("data.csv", function (data) {
            barX.range([0, barW])
            .domain([0, d3.max(data, function (d) { return +d["distance(meters)"]; })]);
            barY.range([barH, 0])
            .domain(data.map(function (d) { return d["date"]; }));

            var barXAxis = d3.axisBottom(barX);

            svg.append("g")
            .attr("transform", "translate(0," + barH + ")")
            .attr("class", "x axis")
            .call(barXAxis)

            var barYAxis = d3.axisLeft(barY);

            svg.append("g")
            .attr("class", "y axis")
            .call(barYAxis)

            svg.append("text")
            .attr("x", barW / 2)
            .attr("y", barH + 100)
            .text("distance in meters")
            function xgridlines() {
                return d3.axisBottom(barX)
                    .ticks(0)
            }
            function ygridlines() {
                return d3.axisLeft(barY)
                    .ticks(10)
            }
            svg.append("g")
            .attr("transform", "translate(0," + barH + ")")
            .call(xgridlines()
                .tickSize(-barH)

            )
            svg.append("g")
             .call(ygridlines()
                 .tickSize(-barW)
                 .tickFormat("")
             )

            var circle = svg.selectAll("circle")
                            .data(data)

            circle.enter().append("circle")
                          .attr("cx", function (d) { return barX(d["distance(meters)"]); })
                          .attr("cy", function (d) { return barH - barMargin.bottom + 80 - barY(d["date"]); })
                          .transition().duration(2000).attr("r", function (d) { return d.calories * 0.03; }).delay(function (d, i) { return i * 500; })
                          .transition().duration(1000).style("fill", "#044B94").style("fill-opacity", "0.3");
        });
    }
    function mybar() {
        d3.csv("data.csv", function (data) {
            /*var svg1 = d3.select("#bubble").append("svg")
             .attr("width", barW + barMargin.left + barMargin.right)
             .attr("height", barH + barMargin.top + barMargin.bottom)
             .append("g")
             .attr("class", "main")
             .attr("transform",
                  "translate(" + barMargin.left + "," + barMargin.top + ")") */
            var x = d3.scaleLinear(),
                y = d3.scaleBand();
            x.range([0, barW])
           .domain([0, 1440]);
            y.range([barH, 0])
            .domain(data.map(function (d) { return d["date"]; }));
            var xaxis = d3.axisBottom(x);

            svg.append("g")
            .attr("transform", "translate(0," + barH + ")")
            .attr("class", "x axis")
            .call(xaxis)

            var yaxis = d3.axisLeft(y);

            svg.append("g")
            .attr("class", "y axis")
            .call(yaxis)
            var color = d3.scaleOrdinal(d3.schemeCategory20);

            var stack = d3.stack()
            .keys(["minutesSedentary", "minutesLightlyActive", "minutesFairlyActive", "minutesVeryActive"]);


            var series = stack(data);

            var layer = svg.selectAll(".layer")
                    .data(series)
                    .enter().append("g")
                    .attr("class", "layer")
                   .style("fill", function (d, i) { return color(i); });

            layer.selectAll("rect")
                .data(function (d) { return d; })
                .enter().append("rect").transition().duration(2000)
                .attr("y", function (d) { return y(d.data.date); })
                .attr("x", function (d) { return x(d[0]); })
                .attr("height", y.bandwidth() - 10)
                .attr("width", function (d) { return x(d[1]) - x(d[0]) }).delay(function (d, i) { return i * 500; });
            data.reverse();
            var circle1 = svg.selectAll("circle")
                            .data(data)

            circle1.enter().append("circle")
                          .attr("cx", function (d) { return x(1440) + 100; })
                          .attr("cy", function (d) { return barH - barMargin.bottom + 80 - y(d.date); })


            .transition().duration(2000).attr("r", function (d) { return d.calories * 0.0199; }).delay(function (d, i) { return i * 500; })
                          .transition().duration(2000).style("fill", "#044B94").style("fill-opacity", "0.3").delay(function (d, i) { return i * 500; })
            var text = svg.selectAll("text")
                                   .data(data)
                                    .enter()
                                    .append("text");


            var textLabels = text
                             .attr("x", function (d) { return x(1440) + 100; })
                             .attr("y", function (d) { return barH - barMargin.bottom + 80 - y(d.date); })
                             .text(function (d) { return d.calories; })
                             .attr("font-family", "sans-serif")
                             .attr("font-size", "20px")
                             .attr("fill", "red");

        });
    }