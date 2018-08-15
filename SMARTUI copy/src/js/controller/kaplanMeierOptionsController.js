"use strict"

var App = App || {};

let KaplanMeierOptions = function(targetID){

  let self= {
    targetID: null
  }
  init();
  function init()
  {
    self.targetID=targetID;
    populateDropdown();
  }
  function populateDropdown()
  {
    let attributes=App.models.patient.getAttributeNames();
    console.log(attributes);
    let excludedAttributes = ["Age at Diagnosis (Calculated)","Affected Lymph node cleaned","Smoking status (Packs/Year)"];
    attributes = _.difference(attributes,excludedAttributes);
    attributes.forEach(function(d){
        let id = d3.select(targetID)
                  .append("option")
                  .attr("value",d)
                  .text(d);
    });

  }

  function selectOption(targetID)
  {
    let selectedID;
    d3.select(targetID)
      .on("change",function(d){
        selectedID = d3.select(this)
                            .node()
                            .value;
                            console.log(selectedID);
      App.models.kaplanMeierPatient.initPatients(App.models.patient.getPatients(),selectedID);
      console.log(App.models.kaplanMeierPatient.getMaxOS());
      let maxOS = App.models.kaplanMeierPatient.getMaxOS();
      App.views.kaplanMeier.setMaxOS(maxOS);
      console.log(App.models.kaplanMeierPatient.getKaplanMeierPatients());
      let x=App.models.kaplanMeierPatient.getKaplanMeierPatients();
      let a = App.views.kaplanMeier.update(x);
      });
  }
  return{
    init,
    populateDropdown,
    selectOption
  }
}
