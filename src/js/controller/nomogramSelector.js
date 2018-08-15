"use strict"

var App = App || {};

let NomogramSelector = function(){

  let self = {
    attributes: App.nomogramAxes
  }
  init();
  function init()
  {
    let nomogramSelected = d3.select("#nomogramType")
                             .on("change",selectAttributeSet);
  }
  function selectAttributeSet()
  {
    if($(this).val()==="Default")
    {
      let temp = [];
      App.models.applicationState.setExcludedAttributes(temp);
      self.attributes = App.nomogramAxes;
      App.controllers.nomogram.init();
      App.views.nomogram.updateAxes();

    }
    else if($(this).val()==="Aspiration")
    {
      let temp = [];
      App.models.applicationState.setExcludedAttributes(temp);
      self.attributes = App.aspirationAxes;
      App.controllers.nomogram.init();
      App.views.nomogram.updateAxes();
    }
    else
    {
      let temp = [];
      App.models.applicationState.setExcludedAttributes(temp);
      self.attributes = App.dysphasiaAxes;
      App.controllers.nomogram.init();
      App.views.nomogram.updateAxes();

    }

  }
  function getSelectedAttributes()
  {
    return self.attributes;
  }
  return{
    selectAttributeSet,
    getSelectedAttributes,
    init
  }
}
