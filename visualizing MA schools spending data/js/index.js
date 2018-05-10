$(document).ready(function(){
  $('#slider').slider({
    range:true,
    min:-1,
    max:12,
    values:[-1,12],
    slide: function(event,ui){ myFunction(ui.values[0], ui.values[1]) }
  }).each(function() {
   var opt = $(this).data().uiSlider.options;
    var vals = opt.max - opt.min;
    for (var i = 0; i <= vals; i++) {
        var value = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
        $("#slider").append(value);
    }

});
});

var width = 700;
var height = 500;
var svg = d3.select( "#part1" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

function myFunction(min=-1 , max=12)
{
 d3.json("https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-500.geojson", function(error,data){
  if(min==-1)
    min="PK";
  else if(min==0)
    min="K";
   if(max==-1)
    max="PK";
  else if(max==0)
    max="K";
    var x = document.getElementById("drop-down").value;
   var g = svg.append( "g" );
var projection = d3.geoConicConformal()
                   .scale( 10090 )
                   .rotate( [71.057,0] )
                   .center( [0, 42.313] )
                   .translate( [width/2,height/2] );

   var geoPath = d3.geoPath()
    .projection( projection );
   
    g.selectAll( "path" )
    .data( data.features )
    .enter()
    .append( "path" )
    .attr( "fill",function(d){if(x=="All")
                                  {
                                    if(d.properties.STARTGRADE==min && d.properties.ENDGRADE==max)
                                      {return "#FF0000";}
                                    else
                                      {return "#FFFFFF";}
                                  }
                              else{
                                  if(d.properties.MADISTTYPE==x && d.properties.STARTGRADE==min && d.properties.ENDGRADE==max)
                                    {return "#FF0000";} 
                                  else
                                    {return "#FFFFFF";}
                                 }
                             })                     
    
    .attr( "stroke", "#333")
   .attr( "stroke-width",function(d){if(x=="All")
                                  {
                                    if(d.properties.STARTGRADE==min && d.properties.ENDGRADE==max)
                                      {return 2;}
                                    else
                                      {return 1;}
                                  }
                              else{
                                  if(d.properties.MADISTTYPE==x && d.properties.STARTGRADE==min && d.properties.ENDGRADE==max)
                                    {return 2;} 
                                  else
                                    {return 1;}
                                 }
                             })    
    .attr('opacity',0.25)
    .attr( "d", geoPath );
 });}
function createHist(errors, data)
{
  
  var data1 = data.filter(function(d) { return d.TTPP != 0; });
  var min = d3.min(data1, function(d) { return d.TTPP; });
  var max = d3.max(data1, function(d) { return d.TTPP; });
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;
  var x = d3.scaleLinear()
          .domain([min,max])
          .range([0, width])
          .nice(25);
var y = d3.scaleLinear()
          .range([height, 0]);
var histogram = d3.histogram()
    .value(function(d) { return d.TTPP; })
    .domain(x.domain())
    .thresholds(25);
var svg1 = d3.select("#part2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
  var bins = histogram(data);
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);
  svg1.selectAll("rect")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)     
      .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })     
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); });
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
}

function createHist1(errors, data)
{
  
  var data1 = data.filter(function(d) { return d.TTPP != 0; });
  var min = d3.min(data1, function(d) { return d.TTPP; });
  var max = d3.max(data1, function(d) { return d.TTPP; });
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;
  var x = d3.scaleLinear()
          .domain([min,max])
          .range([0, width])
          .nice(25);
var y = d3.scaleLinear()
          .range([height, 0]);
var histogram = d3.histogram()
    .value(function(d) { return d.TTPP; })
    .domain(x.domain())
    .thresholds(25);
var svg2 = d3.select("#hist").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
  var bins = histogram(data);
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);
     
  svg2.selectAll("rect")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("id","bar")
      .attr("x", 1)     
      .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })     
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); })
  
   
     .on("mouseover", function(d,i){d3.select(this).attr("fill", "#FF0000");
                                   highlight(d);
                                   
                                   })
      .on("mouseout", function(d,i){d3.select(this).attr("fill", "#000000");
                                   unhighlight();});
  
      

  svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
   
  
}

d3.csv("https://gist.githubusercontent.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-funding.csv", createHist);
d3.csv("https://gist.githubusercontent.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-funding.csv", createHist1);
var svg3 = d3.select( "#map" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

function highlight(funding){
d3.json("https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-500.geojson", function(error,data){
var g = svg3.append( "g" );
var projection = d3.geoConicConformal()
                   .scale( 10090 )
                   .rotate( [71.057,0] )
                   .center( [0, 42.313] )
                   .translate( [width/2,height/2] );
var geoPath = d3.geoPath()
    .projection( projection );
  

  var district= funding.map(function(d,i){return d.District;});
 
   
    g.selectAll( "path" )
    .data( data.features )
    .enter()
    .append( "path" )
    .attr("id","geo")
    .attr("fill",
          function(d)
          {
            var count=0;
      district.forEach
            (function(g){if(d.properties.DISTRICT==g){count++;}}
              
            ) 
            if(count == 0)
              {return "#FFFFFF";}
            else {return "#FF0000";}
    }
         )
                                                                    
    .attr( "stroke", "#333")
    .attr('opacity',0.25)
    .attr( "d", geoPath );

});}
function unhighlight(){
d3.json("https://cdn.rawgit.com/dakoop/e3d0b2100c6b6774554dddb0947f2b67/raw/b88ded9fbc37a4e13e7f94d58a79efe2074c8c8a/ma-school-districts-500.geojson", function(error,data){
  var g = svg3.append( "g" );
var projection = d3.geoConicConformal()
                   .scale( 10090 )
                   .rotate( [71.057,0] )
                   .center( [0, 42.313] )
                   .translate( [width/2,height/2] );
var geoPath = d3.geoPath()
    .projection( projection );
    g.selectAll( "path" )
    .data( data.features )
    .enter()
    .append( "path" )
    .attr("id","geo")
    .attr("fill","#FFFFFF")
    .attr( "stroke", "#333")
    .attr("stroke-width","1")
    //.attr('opacity',0.5)
    .attr( "d", geoPath );

});}