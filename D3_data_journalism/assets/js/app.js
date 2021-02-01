var width = parseInt(d3.select("#scatter").style("width"));

// Designate graph height
var height = width - width / 10;

// Margin spacing for graph
var margin = 50;

// Space for placing words
var labelArea = 100;

// Text Padding
var tPadBot = 30;
var tPadLeft = 30;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Set the radius for each dot in graph
var circRadius;
function crGet() {
  if (width <= 100) {
    circRadius = 10;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// Group element to next bottom axis labels
svg.append("g").attr("class", "xText");
// xText allows selecting the group without excess code
var xText = d3.select(".xText");

// Give xText a transform property at the bottom of the chart. By nesting in a function can easily change the location of the label group whenever the width of the window changes.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// xText to append SVG files, with y coordinates specified to space out the values
// 
xText
  .append("text")
  .attr("y", -25)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// 
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age");
// 
xText
  .append("text")
  .attr("y", 25)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income");

// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Add second label group for the left axis
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");

// Nest the group's transform attr in a function to make changing it on window change an easy operation
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Append text
// 
yText
  .append("text")
  .attr("y", -25)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obesity (%)");

// 2014 AO
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 
yText
  .append("text")
  .attr("y", 25)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

// Import CSV data with d3
d3.csv("./assets/data/data.csv").then(function(data) {
  visualize(data);
});

// Visualize function on the data obtained with d3's .csv method
function visualize(theData) {
  // CurX and curY will determine what data gets represented in each axis.
  // Designate defaults here, which carry the same names as the headings in their matching .csv data file.
  var curX = "poverty";
  var curY = "healthcare";

  // This function allows us to set up tooltip rules 
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([50, -50])
    .html(function(d) {
      // x key
      var theX;
      // Grab state name
      var thestate = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is PCI
      if (curX === "PCI") {
        // Grab the x key and a version of the value formatted 
        theX = "<div>" + curX + ": " + d[curX] + "$</div>";
      }
      else {
      // Grab the x key and a version of the value formatted to include commas after every third digit.
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
        return thestate + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);
  
  // These functions remove some repitition from later code
   // change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]);
    });

    // .max will grab the largest datum from the selected column
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]);
    });
  }

  // change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * .1;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.1;
    });
  }
  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }
  // Will add the first placement of our data and axes to the scatter plot
  xMinMax();
  yMinMax();

  // With the min and max values now defined can create scales
   var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);

  // Pass the scales into the axis methods to create the axes.
   var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Append the axes in group elements. By calling them, include all of the numbers, borders and ticks.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Make grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // Append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
    theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
  d3.selectAll(".aText").on("click", function() {
    // Make sure to save a selection of the clicked text so can reference it without typing out the invoker each time.
    var self = d3.select(this);

    // Only want to run this on inactive labels.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis, execute this:
      if (axis === "x") {
        // Make curX the same as the data name.
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // Use a transition when we update the xAxis.
        svg.select(".xAxis").transition().duration(750).call(xAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(750);
        });

        // Need to change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(750);
        });
        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
      else {
        // When y is the saved axis, execute this:
        curY = name;
        yMinMax();
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(750).call(yAxis);

        // With the axis changed...update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // Each state circle gets a transition for it's new attribute.
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(750);
        });
        // Need to change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // Give each state text the same motion as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(750);
        });
        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });
}