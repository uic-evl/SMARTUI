"use strict"

var App = App || {};



(function() {
  App.models = {};
  App.controllers = {};
  App.views ={};

  App.demographicAttributes = ["Age at Diagnosis (Calculated)",
                                "Gender",
                                "Aspiration rate Pre-therapy",
                                "Smoking status at Diagnosis (Never/Former/Current)",
                                "Race",
                                "HPV/P16 status",
                                "ecog",
                                "Smoking status (Packs/Year)"
                                ];
  App.kiviatDiagramAttributes = ["Gender", "Ethnicity", "Tcategory", "Site",
                                  "Nodal_Disease", "ecog", "Chemotherapy", "Local_Therapy"];

  App.cancerAttributes = ["Site",
                          "AJCC 7th edition",
                          "AJCC 8th edition",
                          "T-category",
                          "N-category",
                          "Pathological Grade",
                          "Tumor subsite (BOT/Tonsil/Soft Palate/Pharyngeal wall/GPS/NOS)",
                          "Affected Lymph node cleaned"
                          ];

  App.treatmentAttributes = ["Therapeutic combination",
                              "Local_Therapy",
                              "Treatment duration (Days)",
                              "Total dose",
                              "Total fractions",
                              "Dose/fraction (Gy)",
                              "Neck Dissection after IMRT (Y / levels)",
                              "Neck boost (Y/N)",
                              "OS (Calculated)"];

  App.nomogramAxes =[         {
                                name:"Age at Diagnosis (Calculated)",
                                rangeShrink: [0,1],
                                domain: [25,90],
                                label: "AgeAtTx"
                              },
                              {
                                name:"Gender",
                                rangeShrink: [0.2,0],
                                label: "Gender"
                              },
                              {
                                name:"Race",
                                rangeShrink: [0.6,0],
                                label: "Race"
                              },
                              {
                                name:"HPV/P16 status",
                                rangeShrink: [0.4,0],
                                //domain: ["IV","III","II","I"],
                                label: "HPV/P16"
                              },
                              {
                                name:"ecog",
                                rangeShrink: [0.4,0],
                                domain: ["0","1","2","3"],
                                label: "ecog"
                              },
                              {
                                name:"Smoking status at Diagnosis (Never/Former/Current)",
                                rangeShrink: [0.4,0],
                              //  domain: ["Tis","T1","T2","T3","T4","Tx"],
                                label: "Smoking Status"
                              },
                              {
                                name:"Smoking status (Packs/Year)",
                                rangeShrink: [0.5,0],
                              //  domain: [0,180],
                                label: "Packs/Year"
                              },
                              {
                                name:"Site",
                                rangeShrink: [0.3,0],
                                label: "Tumor Site"
                              },
                              {
                                name:"Tumor subsite (BOT/Tonsil/Soft Palate/Pharyngeal wall/GPS/NOS)",
                                rangeShrink: [0.6,0],
                                label: "Tumor Subsite"
                              },
                              {
                                name:"T-category",
                                rangeShrink: [0.4,0],
                                domain: ["Tis","T1","T2","T3","T4","Tx"],
                                label: "T-category"
                              },
                              {
                                name:"N-category",
                                rangeShrink: [0.5,0],
                                domain: ["N0","N1","N2","N3"],
                                label: "N-category"
                              },
                              {
                                name: "OS (Calculated)",
                                label: "OS",
                                rangeShrink: [0,1],
                                domain: [0,200]
                              }
                            ];


  App.aspirationAxes = [      {
                                name:"Age at Diagnosis (Calculated)",
                                rangeShrink: [0,1],
                                domain: [25,90],
                                label: "AgeAtTx"
                              },
                              {
                                name:"Aspiration rate Pre-therapy",
                                rangeShrink: [0,0.2],
                                label: "Pre-Aspiration"
                              },
                              {
                                name:"Aspiration rate Post-therapy",
                                rangeShrink: [0,0.2],
                                label: "Post-Aspiration"
                              },
                              {
                                name:"Aspiration type",
                                rangeShrink: [0,1],
                                label: "Aspiration Type"
                              },
                              {
                                name:"Aspiration rate(Y/N)",
                                rangeShrink: [0,0.2],
                                label: "Aspiration rate"
                              },
                              {
                                name: "OS (Calculated)",
                                label: "OS",
                                rangeShrink: [0,1],
                                domain: [0,200]
                              }];
  App.dysphasiaAxes = [       {
                                name:"Age at Diagnosis (Calculated)",
                                rangeShrink: [0,1],
                                domain: [25,90],
                                label: "AgeAtTx"
                              },
                              {
                                name:"Feeding tube 6m",
                                rangeShrink: [0,0.2],
                                label: "Feeding Tube"
                              },
                              {
                                name: "OS (Calculated)",
                                label: "OS",
                                rangeShrink: [0,1],
                                domain: [0,200]
                              }];
App.category10colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
"#393b79", "#637939", "#7f7f7f", "#bcbd22", "#843c39"];

App.attributeColors = d3.scaleOrdinal(App.category10colors);
App.cohortVariables = ["Dummy ID","Tm Laterality (R/L)","Affected Lymph nodes","Treatment duration (Days)","Dose/fraction (Gy)","ROI"];


  App.init=function() {

    App.models.patient=new PatientModel();
    App.models.applicationState = new ApplicationStateModel();
    App.models.kaplanMeierPatient = new KaplanMeierPatientModel();

    App.controllers.patientSelector = new InputFillController();
    App.controllers.nomogramSelector = new NomogramSelector();

    App.models.patient.loadPatients().then(function(){

      App.controllers.patientSelector.populatePatientDropdown();
      App.controllers.patientSelector.selectPatient(".idSelect");
      if(!(window.location.pathname==='/'))
      {
        App.models.applicationState.setSelectedPatientID(localStorage.getItem("Select"));
        console.log(App.models.applicationState.getSelectedPatientID());
      }
      App.views.nomogram = new NomogramView("#demoNomogram");

      App.controllers.nomogram = new NomogramOptions("#nomogramOptions");
      App.controllers.axisControl = new AxisSlider();
      App.controllers.nomogramSelector.init();
      App.controllers.kaplanOptions = new KaplanMeierOptions("#kaplanOptions");
      App.controllers.kaplanOptions.selectOption("#kaplanOptions");


      App.views.kaplanMeier = new KaplanMeierView("#kaplanMeier");

      App.models.kaplanMeierPatient.initPatients(App.models.patient.getPatients(),App.demographicAttributes[1]);
      let maxOS = App.models.kaplanMeierPatient.getMaxOS();
      App.views.kaplanMeier.setMaxOS(maxOS);
      let x=App.models.kaplanMeierPatient.getKaplanMeierPatients();
      let a = App.views.kaplanMeier.update(x);

      App.views.cohort = new CohortView();

      //

      App.views.kiviat = new KiviatDiagramView("#kiviatDiagramSection");
    })
    .catch(function(err) {
              console.log("Promise Error", err);
          });

  };

})();
function changeNomogram(d)
{
  console.log($(this).val());
}
window.addEventListener("load",App.init,false);
