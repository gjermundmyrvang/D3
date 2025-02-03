const margin = { top: 50, right: 30, bottom: 40, left: 70 },
  width = 1200 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
