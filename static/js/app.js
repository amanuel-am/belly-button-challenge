//d define url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {


    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let results = metadata.filter(item => item.id === parseInt(sample));
    let firist_result = results[0];
    // Use d3 to select the panel with id of `#sample-metadata`

    let PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(firist_result).forEach(([key, value]) => {
    PANEL.append("p").text(`${key.toUpperCase()}: ${value}`)
    })
  }
  )};


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let SampleFilter = samples.filter(item => item.id == sample)
    let sampleValue = SampleFilter[0];
    
    // Get the otu_ids, otu_labels, and sample_values
    let sample_values = sampleValue.sample_values;
    let otu_ids = sampleValue.otu_ids;
    let otu_labels = sampleValue.otu_labels;
    console.log(sample_values);
    console.log(otu_ids);
    console.log(otu_labels);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        opacity: [0.6],
        size: sample_values
      }
  };

  let bubbleData = [bubble_trace];
    // Render the Bar Chart
  let bubble_layout = {
    title: "Bacteria Cultures Per Sample",
    showlegend: false,
    height: 600,
    hovermode: "closest",
    xaxis: {title: "OTU ID"},
    };

     Plotly.newPlot("bubble", bubbleData, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart of Top 10 
    let otuidSliced = otuIDs.slice(0,10).reverse();
    let samplevaluesSliced = sampleValues.slice(0,10).reverse();
    let outlabelsSliced = otuLabels.slice(0,10).reverse();
    console.log(outlabelsSliced, samplevaluesSliced, outlabelsSliced)
 
    // Build a Bubble Chart
    let bar_trace = {
      x: samplevaluesSliced,
      y: otuidSliced.map((id) => `OTU ${id}`),
      text: outlabelsSliced,
      type: 'bar',
      orientation: 'h',
    };

    let barData = [bar_trace];
  // Render the Bubble Chart
    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
  };

  Plotly.newPlot("bar",barData, bar_layout); //'bubble' is the html tag in index.html
   
}

)};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let namesField = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    let selectedData = d3.select("selDataset");

    // Select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    
    // List of sample names to populate the select options
    Object.values(names).forEach(item => {
      dropdown.append('option').text(item)
    });
    // Get the first sample from the list
    let sample = names[0]

    buildMetadata(sample),
    buildcharts(sample),
    init
   
    })
  };


// Function for event listener
function optionChanged(value) {
  // Build charts and metadata panel each time a new sample is selected
  d3.selectAll("#selDataset").on("change",
  buildMetadata(value),
  buildcharts(value),
  init
  )

};

// Initialize the dashboard
init();
