"use strict"

var App = App || {};

let KiviatDiagramView = function(targetID) {

  let self = {
    attributeScales: {},
    colorScale: null,
    subjectElement: null,
    subjectSvg: null,
    neighborsElement: null,
    neighborsSvgs: null,
    legendElement: null,
    legendSvg: null,
    axisTip: null,
    centerTip: null
  }

  init();

  function init()
  {
    self.subjectElement = d3.select(targetID + "-subject");
    self.neighborsElement = d3.selectAll(targetID + "-neighbors");
    self.legendElement = d3.selectAll(targetID + "-legend");

    self.subjectSvg = self.subjectElement.append("svg")
          .attr("width", 300)
          .attr("height", 300)
          .attr("viewBox", "0 0 100 100")
          .attr("preserveAspectRatio", "xMidYMid")
          .each(createKiviatDiagram);

    self.neighborsSvgs = self.neighborsElement.selectAll(".patientNeighborSVG");

    self.legendSvg = self.legendElement.append("svg")
            .attr("width", 200)
            .attr("height", 500)
            .attr("viewBox", "0 0 100 200")
            .attr("preserveAspectRatio", "xMidYMid");


    for (let attribute of App.kiviatDiagramAttributes) {
            self.attributeScales[attribute] = d3.scaleOrdinal()
                .range([5, 35]);
        }

    self.colorScale = d3.scaleLinear()
        .interpolate(d3.interpolateHcl)
        .domain([0, 1])
        .range(["#d18161", "#70a4c2"]);

    console.log(self.colorScale);

    drawLegend();
  }

  function drawLegend()
  {
    console.log("in draw legend");
    let svgDefs = self.legendSvg.append('defs');

    let legendGradient = svgDefs.append('linearGradient')
        .attr('id', 'legendGradient');

    legendGradient.append('stop')
        .attr('class', 'stop-bottom')
        .attr('offset', '0')
        .attr("stop-color", "#ffa474");


    legendGradient.append('stop')
        .attr('class', 'stop-top')
        .attr('offset', '1')
        .attr("stop-color", "#00ff00");

    //Vertical gradient
    legendGradient
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

      self.legendSvg.append("rect")
              .classed("fill", "url(#linear-gradient)")
              .attr("x", 15)
              .attr("y", 10)
              .attr("width", 10)
              .attr("height", 80)
              .style("opacity", 0.75);

      let survivalRateText = ["1", "Surv. Rate", "0"];

      for (let i = 0; i < 3; i++) {
          self.legendSvg.append("text")
              .attr("x", 30)
              .attr("y", 16 + 37 * i)
              .style("font-size", "8px")
              .style("font-weight", "bold")
              .text(survivalRateText[i]);

            }

      for (let attributeInd in App.kiviatDiagramAttributes) {
            self.legendSvg.append("text")
                .attr("x", 15)
                .attr("y", 105 + attributeInd * 12)
                .style("font-size", "8px")
                .text(attributeInd + ": " + App.kiviatDiagramAttributes[attributeInd]);
        }
}

  function createKiviatDiagram(d,i)
  {   console.log(this);
      let SVG = d3.select(this);
      console.log(d,i);
      createToolTips();
      console.log(self.axisTip,self.centerTip);
      SVG.call(self.axisTip);
      SVG.call(self.centerTip);


  }

  function createToolTips() {

      console.log("Hello");

        self.axisTip = d3.tip()
            .attr("class", "d3-tip")
            .direction("e")
            .html(function(d) {
                return d.attr + ": " + d.val;
            });

        self.centerTip = d3.tip()
            .attr("class", "d3-tip")
            .direction("e")
            .html(function(d) {
                return "ID: " + d.ID + "<br>Age: " + d.AgeAtTx + "<br>5y Sur. Pb.: " + d["Probability of Survival"];
            });
    }
}
