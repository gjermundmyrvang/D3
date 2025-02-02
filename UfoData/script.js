const margin = { top: 60, right: 30, bottom: 60, left: 70 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
