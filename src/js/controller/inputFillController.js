"use strict"

var App = App || {};

let InputFillController = function () {

  let self = {
    patientDropdown: null,
    currentPatient: null
  };

  function populatePatientDropdown() {
    let i=0;
    let patients = App.models.patient.getPatients();

    for(let patient in patients)
    {

      let id = d3.select(".idSelect")
                .append("option")
                .attr("value",i++)
                .text(patients[patient]["Dummy ID"]);
    }

  }

  function selectPatient(element)
  {
    self.patientDropdown = d3.select(element)
                              .on("change", function(d){
                                let selectedID = d3.select(this)
                                                    .node()
                                                    .value;
                                self.currentPatient = selectedID;
                                console.log(self.currentPatient);
                                console.log(window.location.pathname);
                                if(window.location.pathname==='/')
                                {
                                  localStorage.setItem("Select",self.currentPatient);
                                }
                              
                                updateSelectedPatient();
                                updateDataFields();
                              });

  }

  function updateSelectedPatient()
  {

    App.models.applicationState.setSelectedPatientID(self.currentPatient);
  }
  function updateDataFields()
  {
    let selectedPatient = App.models.patient.getPatients();
    selectedPatient = selectedPatient[self.currentPatient];
    let elementSelect = ["#demographics","#cancerDescriptors","#treatment > div.left","#treatment > div.right"];
    //Update demographics text

    for(let i=0;i<4;i++)
    {

      $(elementSelect[i]).children("input[type=text]").each(function()
      {
        $(this).val(selectedPatient[$(this).attr('name')]);

      });

      $(elementSelect[i]).children("input[type=radio]").each(function()
      {

        if($(this).attr('value')===selectedPatient[$(this).attr('name')])
        {
          $(this).prop('checked',true);
        }
      });
    }

  }

  return{
    populatePatientDropdown,
    selectPatient
  }

}
