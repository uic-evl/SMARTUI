"use strict"

var App = App || {};

let PatientModel = function() {

  let self = {
    patients: [],
    attributeDomains: {},
    attributeNames: []
  };
  function loadPatients() {
    let dataFile = "data/AnonymousNewData1.csv";

    return new Promise(function(resolve, reject){
            let dataLoadQueue = d3.queue();

            dataLoadQueue
                      .defer(d3.csv, dataFile)
                      .await(loadAllFiles);

                      function loadAllFiles(error, probData)
                      {
                        _.forEach(probData, function(d,i){
                          self.patients[i] = d;
                          self.patients[i]["Age at Diagnosis (Calculated)"] = Number(self.patients[i]["Age at Diagnosis (Calculated)"]);
                          self.patients[i]["OS (Calculated)"] = Number(self.patients[i]["OS (Calculated)"]);
                          self.patients[i]["Smoking status (Packs/Year)"] = Number(self.patients[i]["Smoking status (Packs/Year)"]);
                        });
                        calculatePatientAttributeDomains();
                        resolve();
                      }
            console.log("in Load Patients");
    });
  }

  function getPatients() {
    return self.patients;
  }

  function getNumberOfPatients() {
    return Object.keys(self.patients).length;
  }

  function calculatePatientAttributeDomains()
  {
    let patientObjArray = Object.values(self.patients);
    let attributeList = App.demographicAttributes;
    attributeList=attributeList.concat(App.cancerAttributes);
    console.log(attributeList);
    self.attributeNames = attributeList;
    for(let attribute of attributeList) {
      let attribute_valueArray = patientObjArray.map(function(o){
                return o[attribute];
      });

      let uniqueValues = _.uniq(attribute_valueArray);
      self.attributeDomains[attribute] = uniqueValues.sort();
    }
    self.attributeDomains["Age at Diagnosis (Calculated)"] = [25,90];
    self.attributeDomains["OS (Calculated)"] =[0,140];
    self.attributeDomains["Smoking status (Packs/Year)"] = [0,150];
    self.attributeDomains["ecog"] = ["0","1","2","3"];
    console.log(self.attributeDomains);
    return self.attributeDomains;
  }

  function calculateSimilarPatients()
  {
    let otherPatients = [];
    let numberOfNeighbors = App.models.applicationState.getNumberOfNeighbors();
    let subjectID = App.models.applicationState.getSelectedPatientID();

    //Patient Attributes to be changes to include everything
    let patientAttributes= App.demographicAttributes;
        patientAttributes = patientAttributes.concat(App.cancerAttributes);
    let excludedAttributes = App.models.applicationState.getExcludedAttributes();

    let attributesSelected = _.difference(patientAttributes,excludedAttributes);


    for(let patientID of Object.keys(self.patients)){
      if(patientID != subjectID && patientID != 'columns')
      {

        otherPatients[patientID] = {};
        otherPatients[patientID].id = patientID;
        otherPatients[patientID].score = similarityScore(patientID,subjectID,attributesSelected);

      }
    }
  //  console.log(attributesSelected);
    let sortedPatients = _.sortBy(otherPatients, ['score']);
    sortedPatients.reverse();
    let topKpatients = [];
    for(let i=1; i<=numberOfNeighbors; i++)
    {
      let neighbor = self.patients[sortedPatients[i].id];
      neighbor.score = sortedPatients[i].score;
      topKpatients.push(neighbor);

    }
    return topKpatients;
  }
  function similarityScore(patientID, subjectID, attributesSelected)
  {
      let score = 0;
      let tieBreaker = -(Math.abs(self.patients[patientID]["Age at Diagnosis (Calculated)"]-self.patients[subjectID]["Age at Diagnosis (Calculated)"]));

      score+=tieBreaker;

      for(let attribute of attributesSelected)
      {
        if(self.patients[patientID][attribute] === self.patients[subjectID][attribute])
        {
          score+=1;
        }
      }
      return score;
  }
  function getPatientAttributeDomains()
  {
    return self.attributeDomains;
  }
  function getAttributeNames()
  {
    return self.attributeNames;
  }
  return {
    loadPatients,
    getPatients,
    getPatientAttributeDomains,
    calculateSimilarPatients,
    calculatePatientAttributeDomains,
    getAttributeNames
  };
}
