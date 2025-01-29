// Declaring some properties for the canvas
const margin = { top: 60, right: 30, bottom: 60, left: 70 },
  width = 1738 - margin.left - margin.right,
  height = 850 - margin.top - margin.bottom;

// Add <svg> inside body
const svg = d3
  .select("body")
  .append("svg")
  // When using the width and height properties later this ensures some padding
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
