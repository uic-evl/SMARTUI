"use strict"

var App = App || {};

let KaplanMeierPatientModel = function(){

  let self = {
    patients: {},
    selectedAttribute: null,
    patientGroups: {},
    kaplanMeierPatientGroups: {},
    maxOS: 0
  }

  function initPatients(patients, attribute)
  {
    self.patients = patients;
    self.selectedAttribute =attribute;
    updateData();
  }

  function updatePatients(patients)
  {
    self.patients = patients;
    updateData();
  }

  function updateSelectedAttribute(attribute)
  {
    self.selectedAttribute = attribute;
    updateData();
  }

  function updateData()
  {
    let attributeDomains = App.models.patient.calculatePatientAttributeDomains();
    let groups = attributeDomains[self.selectedAttribute];
    console.log(attributeDomains,groups);
    self.patientGroups = {};
    self.kaplanMeierPatientGroups = {};
    self.maxOS = 0;

    for(let i=0;i<groups.length;i++)
    {
      let filter = {};
      filter[self.selectedAttribute] = groups[i];

      let thisGroupPatient = _.filter(self.patients, filter);

      self.patientGroups[groups[i]] = _.sortBy(thisGroupPatient, ["OS"]);

      calculateKaplanMeierData(self.patientGroups[groups[i]], groups[i]);
    }

    self.maxOS = Math.ceil(self.maxOS);

  }

  function calculateKaplanMeierData(currentPatientGroup, selectedAttributeValue)
  {
    console.log("In calculateKaplanMeierData");
    let CensorsAtOS = {};

    for(let patientInd in currentPatientGroup)
    {

        CensorsAtOS[currentPatientGroup[patientInd].OS] = [];

    }
    console.log(CensorsAtOS);
    for (let patientInd in currentPatientGroup) {
            CensorsAtOS[currentPatientGroup[patientInd].OS].push(currentPatientGroup[patientInd].Censor);

        }

    let sortedOSKeys = Object.keys(CensorsAtOS).sort((a, b) => parseFloat(a) - parseFloat(b));


      let temp=[];
      temp[0]="NaN";
      sortedOSKeys=_.difference(sortedOSKeys,temp);

      sortedOSKeys.sort(function(a,b){
        return Number(a)-Number(b);
      });

    let probAtOS = []; // [{OS, prob, variance}, {OS, ...}, ...]
    let previousProb = 1;
    let sumForVar = 0;
    let pateintAtRisk = currentPatientGroup.length;

    for(let keyID in sortedOSKeys)
    {

      probAtOS[keyID] = {};

      probAtOS[keyID].OS = sortedOSKeys[keyID];


      let patientDied = CensorsAtOS[sortedOSKeys[keyID]].length;
            for (let i = 0; i < CensorsAtOS[sortedOSKeys[keyID]].length; i++) {
                patientDied -= CensorsAtOS[sortedOSKeys[keyID]][i];
            }


      probAtOS[keyID].prob = previousProb * (pateintAtRisk - patientDied) / pateintAtRisk;

      sumForVar += patientDied / (pateintAtRisk * (pateintAtRisk - patientDied));
      probAtOS[keyID].var = probAtOS[keyID].prob * probAtOS[keyID].prob * sumForVar;

      previousProb = probAtOS[keyID].prob;
      pateintAtRisk -= CensorsAtOS[sortedOSKeys[keyID]].length;

    }
    for(let i=0;i<probAtOS.length;i++)
    {
      probAtOS[i].OS = Number(probAtOS[i].OS);
    }

    probAtOS.sort(function(a,b){
      return a.OS-b.OS;
    });
    console.log(probAtOS);
    if (sortedOSKeys.length > 0) {
      self.maxOS = Math.max(self.maxOS, +(sortedOSKeys[sortedOSKeys.length-1]));

    }

    self.kaplanMeierPatientGroups[selectedAttributeValue] = probAtOS;
    console.log(self.kaplanMeierPatientGroups);
  }

  function getKaplanMeierPatients() {
        return self.kaplanMeierPatientGroups;
    }

    /* get the maximum value of OS */
  function getMaxOS() {
        return self.maxOS;
    }


  return{
    calculateKaplanMeierData,
    updateData,
    initPatients,
    updateSelectedAttribute,
    getKaplanMeierPatients,
    getMaxOS
  }

}
