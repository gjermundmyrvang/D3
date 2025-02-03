const data = {
  nodes: [
    {
      id: 1,
      name: "Scatter Plots",
      group: 1,
      href: "ScatterPlot/",
    },
    {
      id: 2,
      name: "Circle Exercise",
      group: 2,
      href: "Exercise1/",
    },
    {
      id: 3,
      name: "Ufo Data",
      group: 3,
      href: "UfoData/",
    },
    {
      id: 3,
      name: "Exercise 2",
      group: 4,
      href: "Exercise2/",
    },
  ],
  links: [
    {
      source: 1,
      target: 2,
    },
    {
      source: 2,
      target: 3,
    },
    {
      source: 3,
      target: 4,
    },
  ],
};

const color = d3.scaleOrdinal(d3.schemeCategory10);

const links = data.links.map((d) => ({ ...d }));
const nodes = data.nodes.map((d) => ({ ...d }));

const height = 800;
const width = window.innerWidth;

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink(links)
      .id((d) => d.id)
      .distance(300)
  )
  .force("charge", d3.forceManyBody().strength(-300)) // Repels nodes
  .force("x", d3.forceX(width / 2).strength(0.2)) // Centers nodes horizontally
  .force("y", d3.forceY(height / 2).strength(0.2));

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g");

const link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", (d) => Math.sqrt(d.value));

const node = svg
  .append("g")
  .attr("stroke", "#f1f1f1")
  .attr("stroke-width", 3)
  .selectAll("g")
  .data(nodes)
  .join("g")
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

node
  .append("circle")
  .attr("r", 50)
  .attr("fill", (d) => color(d.group));

node
  .append("foreignObject")
  .attr("width", 80)
  .attr("height", 60)
  .attr("x", -40)
  .attr("y", -20)
  .append("xhtml:div")
  .style("width", "40px")
  .style("height", "20px")
  .style("text-align", "center")
  .style("font-size", "16px")
  .style("overflow", "visible")
  .append("a")
  .attr("href", (d) => d.href)
  .attr("target", "_blank")
  .style("pointer-events", "auto")
  .style("color", "black")
  .text((d) => d.name);

node.call(
  d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
);

simulation.on("tick", () => {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("transform", (d) => `translate(${d.x},${d.y})`);
});

function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}
