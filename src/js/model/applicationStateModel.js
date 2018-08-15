"use strict"

var App = {} || App;

let ApplicationStateModel = function() {
  let self = {
    numberOfNeighbors: 5,
    selectedPatientID: 200,
    excludedAttributes: [],
    attributeFilters: {},
    selectedAttribute: null
  };

  function setNumberOfNeighbors(number) {
    self.numberOfNeighbors = numbers;
  }

  function getNumberOfNeighbors() {
    return self.numberOfNeighbors;
  }

  function setSelectedPatientID(subjectID) {
    
    self.selectedPatientID = subjectID;
  }

  function getSelectedPatientID() {
    return self.selectedPatientID;
  }

  function getExcludedAttributes(){
    return self.excludedAttributes;
  }
  function setExcludedAttributes(attributes){
    self.excludedAttributes = attributes;
  }

  return {
    setNumberOfNeighbors,
    getNumberOfNeighbors,
    setSelectedPatientID,
    getSelectedPatientID,
    getExcludedAttributes,
    setExcludedAttributes
  }
}
