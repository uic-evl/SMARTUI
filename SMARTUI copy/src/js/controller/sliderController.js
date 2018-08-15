"use strict"

var App = App || {};

let AxisSlider = function() {
  let self = {
    bottom: 0,
    top: 1
  }
  init();

  function init()
  {
    let margin = 40;
    let width= 100;
    let height = 300;

    let x = getScaleLinear();
    let brush = d3.brushY()
                  .extent([[0,0], [30,200]])
                  .on("brush", brushed);

    let svg = d3.select("#axisSlider").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + 0 + "," + 5 + ")")
                .call(d3.axisRight()
                .scale(x)
                .ticks(5));

    let brushg = svg.append("g")
                    .attr("class", "brush")
                    .call(brush)

    brush.move(brushg, [0.1, 0.5].map(x));

  }
  function getScaleLinear()
  {
    let x = d3.scaleLinear()
              .domain([0,1])
              .range([200,0]);
      return x;
  }
  function brushed()
  {
    let x = getScaleLinear();
    var range = d3.brushSelection(this)
                  .map(x.invert);
    console.log(range[0],range[1]);
    self.bottom = range[0];
    self.top = range[1];
    // bottomHandle=range[0];
    // topHandle=range[1];
    // updateAxes();
    updateAxes();
    d3.selectAll("span")
        .text(function(d, i) {
          return Math.round(range[i])
        });
  }
  function getSliderFeatures()
  {
    let temp = [];
    temp.push(self.bottom);
    temp.push(self.top);
    return temp;
  }

  function updateAxes()
  {
    let attributes = App.controllers.nomogramSelector.getSelectedAttributes();
    let selectedRadio = App.controllers.nomogram.getSelectedRadio();
    console.log(selectedRadio);
    attributes.forEach(function(d){
      if(selectedRadio===d.label)
      {
        d.rangeShrink[0] = self.bottom;
        d.rangeShrink[1] = self.top;
      }
    });
    App.views.nomogram.updateAxes();
  }
  return{
    brushed,
    init,
    getScaleLinear,
    getSliderFeatures
  }
  }
