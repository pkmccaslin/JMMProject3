// Import d3 library
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// set the dimensions and margins of the graph
const container = document.getElementById("working-on-dying");
const width = container.clientHeight;
const height = container.clientHeight;
const radius = (height / 2) - 1;

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#working-on-dying")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

const g = svg.append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

//data 
const data = {
  "F1LTHY": 51900,
  "Loosie Man": 45800,
  "Oogie Mane": 23600,
  "Others": 15900
};

let totalStreams = 0;
for (const key in data) {
  if (data.hasOwnProperty(key)) {
    totalStreams += data[key];
  }
}


//pie and arc generators
const pie = d3.pie()
  .value(d => d.value)
  .sort(null);

const data_ready = pie(Object.entries(data).map(([key, value]) => ({ key, value })));

const arc = d3.arc()
  .innerRadius(radius * 0.3)
  .outerRadius(radius);

const image = g.append("image")
  .attr("x", -radius * 0.5)
  .attr("y", -radius * 0.5)
  .attr("width", radius)
  .attr("height", radius)
  .attr("xlink:href", "Working on Dying 2.png")


const artistTopInfo = document.createElement("div");

artistTopInfo.className = "artist-text-overlay-top";
artistTopInfo.innerHTML = "Producer";
document.getElementById("record-analysis-working-on-dying").appendChild(artistTopInfo);

const artistBottomInfo = document.createElement("div");

artistBottomInfo.className = "artist-text-overlay-bottom";
document.getElementById("record-analysis-working-on-dying").appendChild(artistBottomInfo);


const paths = g.selectAll("path")
  .data(data_ready)
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", "black")
  .attr("stroke", "grey")
  .style("stroke-width", "2px")
  .style("transition", "fill 0.25s")

const audioFiles = {
  "F1LTHY": new Audio("Freestyle2.mp3"),
  "Loosie Man": new Audio("ILoveUIHateU.mp3"),
  "Oogie Mane": new Audio("NewNeon.mp3"),
  "Others": new Audio("VampAnthem.mp3")
};

let currentlyPlaying = null; // Define this globally


// window.addEventListener("scroll", () => {

  // function isFullyVisible(el) {
  //   const rect = el.getBoundingClientRect();
  //   return rect.top >= 0 && rect.bottom <= window.innerHeight;
  // }

  function handleScroll(event) {



    const total = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const ratio = scrolled / total;


    const angle = ratio * 360;

    g.attr("transform", `translate(${width / 2}, ${height / 2}) rotate(${-angle})`);

    let activeIndex = 0;
    let cumulative = 0;
    for (let i = 0; i < data_ready.length; i++) {
      const value = data_ready[i].data.value;
      const start = cumulative / totalStreams;
      cumulative += value;
      const end = cumulative / totalStreams;

      if (ratio >= start && ratio < end) {
        activeIndex = i;
        break;
      }
    }

    const currentKey = data_ready[activeIndex].data.key;
    const currentValue = data_ready[activeIndex].data.value;
    const percentage = Math.round(100 * currentValue / totalStreams);
    artistTopInfo.innerHTML = `${currentKey}`;
    artistBottomInfo.innerHTML = `made up ${percentage}% of streams`;

    const currentAudio = audioFiles[currentKey];

    if (currentAudio && currentlyPlaying !== currentAudio) {
      if (currentlyPlaying) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
      }
      currentAudio.play();
      console.log("is it playing?")
      currentlyPlaying = currentAudio;
    }

    paths.attr("fill", (d, i) => i === activeIndex ? "red" : "black");


  }

  window.addEventListener("scroll", handleScroll);

  // var scrollPosition = window.scrollY || document.documentElement.scrollTop;
  // console.log(scrollPosition);
  // const rotationAngle = scrollPosition / 3;

  // g.attr("transform", `translate(${width / 2}, ${height / 2}) rotate(${rotationAngle})`);




