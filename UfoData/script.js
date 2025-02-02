const formatTime = d3.utcFormat("%B %d, %Y");

d3.csv("testdata.csv").then((data) => {
  const parsedData = data.map((d) => {
    return {
      date_time: d.date_time ? formatTime(new Date(d.date_time)) : null,
      city: d.city || null,
      state: d.state || null,
      country: d.country || null,
      shape: d.shape || null,
      seconds: d.seconds ? +d.seconds : null,
      minutes: d.minutes || null,
      description: d.description || null,
    };
  });
  console.log(parsedData);
  const hierarchy = {
    name: "Ufo Data",
    children: buildHierarchy(parsedData),
  };
  console.log(hierarchy);

  const width = 1605;

  const root = d3.hierarchy(hierarchy);

  const dx = 10;
  const dy = width / (root.height + 1);

  const tree = d3.tree().nodeSize([dx, dy]);

  tree(root);

  let x0 = Infinity;
  let x1 = -x0;
  root.each((d) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const height = x1 - x0 + dx * 2;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-dy / 3, x0 - dx, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
    );

  const node = svg
    .append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node
    .append("circle")
    .attr("fill", (d) => (d.children ? "#555" : "#999"))
    .attr("r", 2.5);

  node
    .append("text")
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.children ? -6 : 6))
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.name)
    .attr("stroke", "white")
    .attr("paint-order", "stroke");
});

function buildHierarchy(data) {
  const root = {};

  data.forEach((item) => {
    if (!item.country) return; // Skip items without a country

    // Create country if it doesn't exist
    if (!root[item.country]) {
      root[item.country] = { name: item.country, children: {} };
    }
    const country = root[item.country];

    // Create state if it doesn't exist
    if (!country.children[item.state]) {
      country.children[item.state] = { name: item.state, children: {} };
    }
    const state = country.children[item.state];

    // Create city if it doesn't exist
    if (!state.children[item.city]) {
      state.children[item.city] = { name: item.city, children: [] };
    }
    const city = state.children[item.city];
    const formattedDescription = formatDescription(
      item.description || "No details",
      8
    );

    const sighting = {
      name: `UFO sighting on ${item.date_time}`,
      children: [
        { name: `Shape: ${item.shape || "Unknown"}` },
        { name: `Description: ${formattedDescription}` },
        {
          name: `Duration: ${item.minutes || "Unknown"} (${
            item.seconds || 0
          } sec)`,
        },
      ],
    };

    // Add the sighting to the city's children array
    city.children.push(sighting);
  });

  // Convert object structure into an array
  return Object.values(root).map((country) => ({
    ...country,
    children: Object.values(country.children).map((state) => ({
      ...state,
      children: Object.values(state.children),
    })),
  }));
}

function formatDescription(text, wordsPerLine) {
  const words = text.split(" ");
  let lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  return lines.join("\n");
}
