d3.csv("observations.csv").then((data) => {
  data.map((d) => {
    d.db = +d.db;
  });
  data.sort((a, b) => a.db - b.db);
  const groupedData = data.reduce((acc, d) => {
    if (!acc[d.place]) {
      acc[d.place] = [];
    }
    acc[d.place].push(d);
    return acc;
  }, {});

  const width = 450,
    height = 450,
    margin = 40;

  const radius = Math.min(width, height) / 2 - margin;

  const color = d3.scaleOrdinal().range(d3.schemeSet2);

  const pie = d3.pie().value((d) => d.db);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  const keys = Object.keys(groupedData);

  keys.forEach((place) => {
    const data_ready = pie(groupedData[place]);

    const svg = d3
      .select("#canvas")
      .append("svg")
      .attr("width", width)
      .attr("height", height + 50)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -radius - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(place);

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
      .text((d) => d.data.time + ": " + d.data.db + "db")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px");
  });
});
