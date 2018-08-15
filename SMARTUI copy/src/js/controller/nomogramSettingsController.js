function toggleDemoOptions()
{
  let div = document.getElementById("nomogramOptions");
  let axis = document.getElementById("axisSlider");
  if(div.style.display==="none")
  {
    axis.style.display="block";
    div.style.display="block";
    return;
  }
  else {
    axis.style.display="none";
    div.style.display = "none";
    return;
}

}
