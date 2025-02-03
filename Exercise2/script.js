const width = window.innerWidth;
const height = 800;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .height(600)
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g");
