// Setup chart
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 80
};
// Define dimensions of chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#circles")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group that will hold chart
// and shift the latter by left and top margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv data file
d3.csv("data.csv").then(function(healthriskData) {
    console.log(healthriskData)
});

// Format the data
healthriskData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
});

// Create Scales
var xLinearScale = d3.scaleLinear()
.domain(d3.extent(healthriskData, d => d.poverty))
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(healthriskData, d => d.healthcare)])
.range([height, 0]);


// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append Axis to the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  chartGroup.append("g")  
  .call(leftAxis);