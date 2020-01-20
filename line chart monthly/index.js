  const marginLeft = 60;
  const marginRight = 100;
  const marginTop = 10;
  const marginBottom = 75;
  const width = 3500 - marginLeft - marginRight;
  const height = 270 - marginTop - marginBottom;

  const svg = d3.select("#svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .attr("class", "bar-chart");

  var parseDate = d3.timeParse("%d.%m.%y");
  var formatMonths = d3.timeFormat("%b '%y");

  var toolTip = d3.select("body")
    .append("div")
    .attr("class", "toolTip");


  d3.csv("https://raw.githubusercontent.com/idaflik/data/master/total_ships_by_month.csv",function(data){

    data.forEach(function(d){
      d.month = parseDate(d.month);
      d.active = +d.active
      d.blocked = +d.blocked;
      d.max = +d.max;
      });

      console.log(data);

      const xScale = d3.scaleTime()
          .range([0, width])
          .domain([new Date(2014, 0), new Date(2019, 11)])
          ;

      const yScale = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(data, function(d) { return d.active; })])
          ;

      const chart = svg.append('g')
          .attr('transform', `translate(${marginLeft}, ${marginTop})`)
          ;

      chart.append('g')
          .attr("class", "white")
          .call(d3.axisLeft(yScale))
          .append("text")

          // .attr("transform", "rotate(-90)")
          // .attr("y", 6)
          // .attr("dy", 20)
          // .append("text")
          // .attr("text-anchor", "end")
          // .attr("stroke", "black")
          // .text("Annual average death rate")
          ;

      chart.append('g')
          .attr("class", "white")
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickFormat(formatMonths).ticks(60))

      // chart.append('g')
      //     .attr("class", "grid")
      //     .call(d3.axisLeft(yScale)
      //     .ticks(9)
      //     .tickSize(-width, 0, 0)
      //     .tickFormat(""))
      //     .attr("fill", "none")
      //     .attr("stroke", "#f2f2f2")
      //     .attr("stroke-width", 1)
      //     ;

      var barWidth = width / data.length * 0.9;

      chart.append("path")
      .attr("class", "linechart")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f94802")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return xScale(d.month) })
        .y(function(d) { return yScale(d.blocked) })
      )


      chart.append("path")
      .attr("class", "linechart")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2a25bc")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return xScale(d.month) })
        .y(function(d) { return yScale(d.active) })
      )


      // var tooltipLine = chart.append("line")
      //   .attr("class", "tooltipLine")
      //   .attr("stroke", "black")
      //   .attr("stroke-width", 2)
      //   ;

      chart.selectAll(".bar")
             .data(data)
             .enter().append("rect")
             .attr("class", "invisible")
             .attr("x", function(d) { return xScale(d.month) - (barWidth / 2) } )
             .attr("y", function(d) { return yScale(d.max); })
             .attr("width", width / data.length * 0.9)
             .attr("height", function(d) { return height - yScale(d.max); })
             .on("mousemove", function(d){
                       toolTip
                         .style("left", d3.event.pageX + "px")
                         .style("top", d3.event.pageY + "px")
                         .style("display", "inline-block")
                         .html(formatMonths(d.month) + ":<br>" + "Active: " + (d.active)+ "<br>" + "Blocked/seized: " + (d.blocked));
                        // tooltipLine
                        // .attr("x1", d3.event.pageX)
                        // .attr("y1", 0)
                        // .attr("x2", d3.event.pageX)
                        // .attr("y2", -height);
                   })
             .on("mouseout", function(d){ toolTip.style("display", "none")})
             ;

       });
