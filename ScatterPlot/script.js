const margin = { top: 50, right: 30, bottom: 40, left: 70 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("coffee_energy.csv").then((data) => {
  data.forEach((d) => {
    d.coffeeAmount = +d.coffeeAmount;
    d.energyLevel = +d.energyLevel;
  });
  console.log(data);
});
