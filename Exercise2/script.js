// Reads csv file with my observations
const readFile = async (file) => {
  const data = await d3.csv(file);
  const formatted = data.map((d) => ({
    ...d,
    db: +d.db,
    time: +d.time,
  }));
  formatted.sort((a, b) => a.time - b.time);
  return { log: formatted };
};

// Declaring boundries
const width = 800,
  height = 800,
  margin = 120;

// Common pie settings
const radius = Math.min(width, height) / 2 - margin;
const pie = d3.pie().value(10);
const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
const colorDomain = [...Array(101).map((_, i) => i)];
const color = d3.scaleOrdinal().domain(colorDomain).range(d3.schemeDark2);

// Adding the svg (canvas)
const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height + 50)
  .attr("preserveAspectRatio", "xMidYMid meet") // Ensures responsivenessish
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Function to render one single piechart
const renderOnePieChart = () => {
  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
  readFile("observations.csv").then((data) => {
    const data_ready = pie(data["log"]);

    svg
      .selectAll("sectors")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .transition()
      .duration(1000)
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", (d) => color(d.data.db))
      .attr("stroke", "black")
      .style("stroke-width", "2px");

    generateLabelArcStyle(data_ready);
  });
};

let place = "floor 4";
const container = document.querySelector(".places");

// Function to change place according based on button clicked
const changePlace = (key) => {
  place = key;
  update(2);
};

// Function to render grouped piecharts
const renderMultiplePieCharts = () => {
  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
  readFile("observations.csv").then((data) => {
    // Idea is to group by place and show a piechart displaying observations done in the chosen place
    const groupedData = data.log.reduce((acc, d) => {
      if (!acc[d.place]) {
        acc[d.place] = [];
      }
      acc[d.place].push(d);
      return acc;
    }, {});

    // if div is empty
    if (!container.innerHTML.trim()) {
      Object.keys(groupedData).forEach((key) => {
        const btn = document.createElement("button");
        btn.textContent = key;
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          changePlace(key);
        });
        container.appendChild(btn);
      });
    }

    console.log(groupedData[place]);
    const data_ready = pie(groupedData[place]);

    svg
      .selectAll("sectors")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .transition()
      .duration(1000)
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", (d) => color(d.data.db))
      .attr("stroke", "black")
      .style("stroke-width", "2px");

    // Apply different text styling if sectors < 2
    if (groupedData[place].length == 1) {
      svg
        .selectAll("sectors")
        .data(data_ready)
        .join("text")
        .text((d) => `Time: ${d.data.time} - Desibel: ${d.data.db}`)
        .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-weight", "800")
        .style("font-size", "22px");
    } else {
      generateLabelArcStyle(data_ready);
    }
  });
};

const update = (data) => {
  if (data === 1) {
    container.innerHTML = "";
    renderOnePieChart();
  } else {
    renderMultiplePieCharts();
  }
};

// This function prevents me from writing duplicate code
const generateLabelArcStyle = (data_ready) => {
  const labelArc = d3
    .arc()
    .innerRadius(radius + 40)
    .outerRadius(radius + 40);

  const labelArc2 = d3
    .arc()
    .innerRadius(radius + 20)
    .outerRadius(radius + 20);

  const labelArc3 = d3
    .arc()
    .innerRadius(radius + 60)
    .outerRadius(radius + 60);

  svg
    .selectAll("sectors")
    .data(data_ready)
    .join("text")
    .text((d) => d.data.db + " DB")
    .attr("transform", (d) => {
      const pos = labelArc3.centroid(d);
      const angle = ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI);
      return `translate(${pos}) rotate(${angle})`;
    })
    .style("text-anchor", "middle")
    .style("font-weight", "800")
    .style("font-size", "16px");

  svg
    .selectAll("sectors")
    .data(data_ready)
    .join("text")
    .text((d) => formatTime(d.data.time))
    .attr("transform", (d) => {
      const pos = labelArc.centroid(d);
      const angle = ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI);
      return `translate(${pos}) rotate(${angle})`;
    })
    .style("text-anchor", "middle")
    .style("font-weight", "800")
    .style("font-size", "14px");

  svg
    .selectAll("sectors")
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
};

// I need this because I chose to store 'time' as an int for sorting reasons
const formatTime = (time) => {
  const hours = Math.floor(time / 100); // removes the minutes
  const minutes = time % 100;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

// Just starting with the combined pie chart
update(1);
