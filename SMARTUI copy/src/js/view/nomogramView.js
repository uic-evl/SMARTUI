"use strict"

var App = App || {};

let NomogramView = function(targetID) {

  let self = {
    targetID: null,
    targetElement: null,
    legendSVG: null,
    nomogram: null,
    axesLabel: {},
    axesRange: {},
    axesDomain: {},
    filteredAxes: [],
    strokewidth: {
      "knn":null,
      "filter" : null
    },
    data: {
      "knn": [],
      "filter": []
    },
    selectedPatientID: -1,
    mode: null
  };

  init();

  function init(){
    self.targetID = targetID;
    self.targetElement = d3.select(targetID);
    console.log(self.targetID + "Header");
    // self.legendSVG = d3.select(self.targetID + "Header").append("svg")
    //                     .attr("width",300)
    //                     .attr("height",50)
    //                     .text("Legend Goes Here");

    App.nomogramAxes.forEach(function(axes,i){
      self.axesLabel[i]=axes.label;
      self.axesRange[i]=axes.rangeShrink;
      self.axesDomain[i]=axes.domain;
      self.filteredAxes[i]=axes.name;
    });
    console.log(self.axesDomain,self.filteredAxes);

    createNomogram();
  }

  function createNomogram()
  {
    let patients=App.models.patient.getPatients();
    let selectedID = App.models.applicationState.getSelectedPatientID();
    let pat =[];
    let attributes=getAttributes();
    for(let i=0;i<644;i++)
    {
      pat[i]=patients[i];

    }
    pat.push(patients[selectedID]);
    d3.select(self.targetID).selectAll("svg").remove();
    self.nomogram = new Nomogram()
                        .target(self.targetID)
                        .setAxes(attributes,"reduce","shrinkAxis")
                        .data(pat)
                        .margins({
                          top: 5,
                          left: 40,
                          right:60,
                          bottom: 60
                        })
                        .titlePosition("bottom")
                        .titleRotation(-10)
                        .titleFontSize(10)
                        .tickFontSize(10)
                        .color(selectColor)
                        .opacity(0.7)
                        .filteredOpacity(0)
                        .strokeWidth(strokeWidth)
                        .brushable(true)
                        .onMouseOver("hide-other")
                        .onMouseOut("reset-paths");
                        console.log(self.nomogram);
                        drawNomogram();


  }
  function updateAxes()
  {
    console.log("Hello");
    let attributes=getAttributes();
    self.nomogram.setAxes(attributes,"reduce","shrinkAxis");
    drawNomogram();
  }
  function drawNomogram()
  {
    self.nomogram.draw();
  }
  function selectColor(d)
  {
    let selectedPatientID = App.models.applicationState.getSelectedPatientID();
    let patients = App.models.patient.getPatients();

    if(d["Dummy ID"]===patients[selectedPatientID]["Dummy ID"])
    {
        return "#000000";
    }
    else if(d["Gender"]=="Male"){
      return "#c9c95d";
    }
    else {
      return "#7f7f7f";
    }
  }

  function strokeWidth(d)
  {

    let mostSimilarPatients = App.models.patient.calculateSimilarPatients();
    let selectedID = App.models.applicationState.getSelectedPatientID();
    let patients = App.models.patient.getPatients();
    mostSimilarPatients.push(patients[selectedID]);
    for(let i=0;i<mostSimilarPatients.length; i++)
    {
      if(d["Dummy ID"]===mostSimilarPatients[i]["Dummy ID"])
      {
        if(d["Dummy ID"]===patients[selectedID]["Dummy ID"])
          return 4;
        else
          return 2;
      }
    }
    return 0;
}
function getAttributes()
{
  let selectedAttributes = App.controllers.nomogramSelector.getSelectedAttributes();
  let axes = selectedAttributes;
  let excluded=App.models.applicationState.getExcludedAttributes();

  console.log(selectedAttributes,App.nomogramAxes);
  let temp = [];
  selectedAttributes.forEach(function(d)
  {
    excluded.forEach(function(excludedVariable){

      if(excludedVariable===d.name)
      {
        temp.push(d);

        axes = _.difference(selectedAttributes,temp);
        console.log(axes);
      }
    });
  });
  return axes;
}

return{
  createNomogram,
  getAttributes,
  strokeWidth,
  selectColor,
  init,
  drawNomogram,
  updateAxes
}
}
