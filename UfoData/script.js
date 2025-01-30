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
});
