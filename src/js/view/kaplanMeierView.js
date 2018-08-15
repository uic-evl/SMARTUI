"use strict"

var App = App || {};

let KaplanMeierView = function(targetID){

    let self = {
          targetElement: null,
          targetSvg: null,
          maxOS: null
      };

    init();

  function init() {
      self.targetElement = d3.select(targetID);

      self.targetSvg = self.targetElement.append("svg")
          .attr("width", self.targetElement.node().clientWidth)
          .attr("height", self.targetElement.node().clientHeight*2)
          .attr("viewBox", "0 0 100 100")
          .attr("preserveAspectRatio", "xMidYMin");

      drawXAxis();
      drawYAxis();
      drawXAxisLabels();
  }
  function drawXAxis() {
      self.targetSvg.append("line")
          .attr("x1", 10)
          .attr("y1", 90)
          .attr("x2", 110)
          .attr("y2", 90)
          .style("stroke", "black")
          .style("stroke-width", "0.6px");
  }
  function drawYAxis() {
      self.targetSvg.append("line")
          .attr("x1", 10)
          .attr("y1", 10)
          .attr("x2", 10)
          .attr("y2", 90)
          .style("stroke", "black")
          .style("stroke-width", "0.6px");
  }

  function drawXAxisLabels() {
      for (let i = 0; i <= 10; i++) {
          self.targetSvg.append("text")
              .attr("x", 2)
              .attr("y", 91 - 8 * i)
              .style("font-size", "4px")
              .text((0.1 * i).toFixed(1));
      }
  }

  function drawLegend(attrVal, attrValNum, color) {
        self.targetSvg.append("rect")
            .attr("class", "legend")
            .attr("x", 80)
            .attr("y", attrValNum * 5)
            .attr("width", 4)
            .attr("height", 4)
            .style("fill", color)
            .style("opacity", 0.5);

        self.targetSvg.append("text")
            .attr("class", "legend")
            .attr("x", 85)
            .attr("y", 4 + attrValNum * 5)
            .style("font-size", "4px")
            .text(attrVal);
    }

    function update(KMData)
    {
      d3.selectAll(".kmVar").remove();
      d3.selectAll(".kmPlots").remove();
      d3.selectAll(".legend").remove();
      d3.selectAll(".yAxisLabels").remove();

      let x = d3.scaleLinear()
                .domain([0, self.maxOS])
                .range([10, 110]);
      let y = d3.scaleLinear()
                .domain([0, 1])
                .range([90, 10]);
      let attrValNum = 0;
      for (let attrKey of Object.keys(KMData)) {

          if (KMData[attrKey].length > 0) {
              console.log(attrKey);
              console.log(KMData[attrKey]);// have patients in the group
              drawKMPlot(KMData[attrKey], x, y, App.attributeColors(attrKey));
              drawLegend(attrKey, attrValNum, App.attributeColors(attrKey));
              attrValNum++;
          }
      }

      let interval = Math.round(self.maxOS / 100) * 10;
      console.log(interval);
      for (let i = 0; i < self.maxOS; i += interval) {
          self.targetSvg.append("text")
              .attr("class", "yAxisLabels")
              .attr("x", x(i))
              .attr("y", 95)
              .style("font-size", "4px")
              .style("text-anchor", "middle")
              .text(i);
      }

    }

  function drawKMPlot(data, xScale, yScale, color)
  {
    let areaPercent95 = 1.96;
      console.log(color);
    for(let j=0; j<data.length-1;j++)
    {
      let x1= xScale(data[j].OS);
      let x2 = xScale(data[j+1].OS);
      let y1 = yScale(Math.max(0, data[j].prob - areaPercent95 * Math.sqrt(data[j].var)));
      let y2 = yScale(Math.min(1, data[j].prob + areaPercent95 * Math.sqrt(data[j].var)));

      self.targetSvg.append("rect")
          .attr("class", "kmVar")
          .attr("x", x1)
          .attr("y", y2)
          .attr("width", x2 - x1)
          .attr("height", y1 - y2)
          .style("stroke", "none")
          .style("fill", color)
          .style("opacity", 0.5);
    }

    let lineData = [{
            x: xScale(data[0].OS),
            y: yScale(1)
        }, {
            x: xScale(data[0].OS),
            y: yScale(data[0].prob)
        }];
    for (let i = 1; i < data.length; i++) {
            lineData.push({
                x: xScale(data[i].OS),
                y: yScale(data[i - 1].prob)
            });
            lineData.push({
                x: xScale(data[i].OS),
                y: yScale(data[i].prob)
            });

        }
    console.log(lineData);
    let lineFunc = d3.line()
            .x(function(d) {
                return d.x;
            })
            .y(function(d) {
                return d.y;
            });

    self.targetSvg.append("path")
        .attr("class", "kmPlots")
        .attr("d", lineFunc(lineData))
        .style("stroke", color)
        .style("stroke-width", "0.8px")
        .style("fill", "none");
  }
  function setMaxOS(os)
  {
    self.maxOS = os;
  }
  return{
    setMaxOS,
    drawKMPlot,
    update
  }
}
