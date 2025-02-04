d3.csv("observations.csv").then((data) => {
  data = data.map((d) => ({
    ...d,
    db: +d.db,
    time: +d.time,
  }));

  data.sort((a, b) => a.time - b.time);

  const observations = {
    log: data,
  };

  console.log(observations["log"]);

  const width = 800,
    height = 800,
    margin = 120;

  const radius = Math.min(width, height) / 2 - margin;

  const color = d3.scaleOrdinal().range(d3.schemeSet2);

  const pie = d3.pie().value(10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
  const labelArc = d3
    .arc()
    .innerRadius(radius + 40)
    .outerRadius(radius + 40);

  const labelArc2 = d3
    .arc()
    .innerRadius(radius + 20)
    .outerRadius(radius + 20);

  const data_ready = pie(observations["log"]);

  const svg = d3
    .select("#canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 50)
    .attr("viewBox", `-${width / 2} -${height / 2}`)
    .attr("preserveAspectRatio", "xMidYMid meet") // Ensures responsivenessish
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  svg
    .selectAll("mySlices")
    .data(data_ready)
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", (d) => color(d.data.db))
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  svg
    .selectAll("mySlices")
    .data(data_ready)
    .join("text")
    .text((d) => formatTime(d.data.time) + ": " + d.data.db + "db")
    .attr("transform", (d) => {
      const pos = labelArc.centroid(d);
      const angle = ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI);
      return `translate(${pos}) rotate(${angle})`;
    })
    .style("text-anchor", "middle")
    .style("font-weight", "800")
    .style("font-size", "14px");

  svg
    .selectAll("mySlices")
    .data(data_ready)
    .join("text")
    .text((d) => d.data.place)
    .attr("transform", (d) => {
      const pos = labelArc2.centroid(d);
      const angle = ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI);
      return `translate(${pos}) rotate(${angle})`;
    })
    .style("text-anchor", "middle")
    .style("font-size", "14px");

  rotatePieChart(svg, 10000, width, height);
});

const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const rotatePieChart = (svg, duration, width, height) => {
  let angle = 0;

  function animate() {
    angle = (angle + 0.1) % 360;
    svg.attr(
      "transform",
      `translate(${width / 2}, ${height / 2}) rotate(${angle})`
    );
    requestAnimationFrame(animate);
  }

  animate();
};
