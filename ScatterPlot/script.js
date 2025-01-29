const margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 960 - margin.left - margin.right,
  height = 640 - margin.top - margin.bottom;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
