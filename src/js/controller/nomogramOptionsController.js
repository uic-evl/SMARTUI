var App = App || {};

let NomogramOptions = function(targetID) {

  let self = {
    targetID: null,
    options: null,
    currentSelectedRadio: null
  }
  init();

  function init()
  {
    let selectedRadio;
    let attributes = App.controllers.nomogramSelector.getSelectedAttributes();
    d3.select("#nomogramOptions").selectAll("*").remove();
    attributes.forEach(function(d){
      let radioButton = d3.select("#nomogramOptions").append("div")
      radioButton.append("input")
                  .attr("class","demoRadio")
                  .attr("type","radio")
                  .attr("name","toggleDemo")
                  .attr("value",d.label)
                  .attr("style","margin-left:0px;")
                  .on("change",function(d){
                    adjustAxes(this.value);
                  });
      radioButton.append("label").text(" - ");
      radioButton.append("input")
                  .attr("class","demoCheckbox")
                  .attr("type","checkbox")
                  .attr("name","filterDemo"+d.label)
                  .attr("value",d.label)
                  .attr("style","margin-left: 15px;")
                  .property("checked","true")
                  .on("change",function(d){
                    attributeFilter(this);
                  });
      radioButton.append("label").text(" "+d.label);

    });
  }

  function adjustAxes(axesSelected)
  {
    let attributes = App.controllers.nomogramSelector.getSelectedAttributes();

    attributes.forEach(function(d){
      if(axesSelected===d.label)
      {
        self.currentSelectedRadio = axesSelected;
        console.log(self.currentSelectedRadio);
      }
    });
  }
  function attributeFilter(checkbox)
  {
    let excluded = App.models.applicationState.getExcludedAttributes();
    console.log(checkbox);
    let attributes = App.controllers.nomogramSelector.getSelectedAttributes();
    if($(checkbox).prop("checked")===false)
    {
      let s = (checkbox.name).replace("filterDemo",'');
      console.log(s);
      attributes.forEach(function(d){
        if(s===d.label)
        {
          excluded.push(d.name);
          excluded = _.uniq(excluded);
          console.log(excluded);
        }
      });
    }

    else
    {
      console.log(checkbox.name);

      attributes.forEach(function(d){
        if(checkbox.name==="filterDemo"+d.label)
        {
          let temp = [];
          temp[0] = d.name;
          console.log(d.name);
          let array = _.difference(excluded,temp);
          excluded = array;
          excluded = _.uniq(excluded);
          console.log(excluded);
        }
      });
    }
    App.models.applicationState.setExcludedAttributes(excluded);
    App.views.nomogram.updateAxes();
  }
  function getSelectedRadio()
  {
    return self.currentSelectedRadio;
  }
  return{
    adjustAxes,
    attributeFilter,
    init,
    getSelectedRadio
  }
}
