// Function to initialize the dashboard
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use d3.json to load and retrieve the samples.json file
    d3.json("samples.json").then((data) => {
      // Log the loaded data for debugging
      console.log(data);
      
      // Get the list of sample names
      var sampleNames = data.names;
  
      // Populate the select options with sample names
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  // Function to handle changes in the selected sample
  function optionChanged(newSample) {
    console.log(newSample);
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  // Function to build the demographics panel metadata
  function buildMetadata(sample) {
    // Load the samples.json file
    d3.json("samples.json").then((data) => {
      // Get the metadata array
      var metadata = data.metadata;
      
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      
      // Select the panel with the id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Clear any existing metadata
      PANEL.html("");
  
      // Add each key-value pair from the metadata to the panel
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // Function to build the charts
  function buildCharts(sample) {
    // Load the samples.json file
    d3.json("samples.json").then((data) => {
      // Get the samples array
      var samples = data.samples;
  
      // Filter for the object with the desired sample number
      var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
  
      // Get metadata array
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  
      // Get metadata and samples
      var result = filteredSamples[0]; 
      var array = resultArray[0];
  
      // Extract data for the charts
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;
      var wfreq = array.wfreq;
  
      // Create yticks for the bar chart
      var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
  
      // Create trace for the bar chart
      var barData = {
        y: yticks,
        x: values.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
  
      // Create layout for the bar chart
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        paper_bgcolor: "LightCoral"
      };
  
      // Plot the bar chart
      Plotly.newPlot("bar", [barData], barLayout);
  
      // Create trace for the bubble chart
      var bubbleData = [{
        x: ids,
        y: values,
        mode: "markers",
        text: labels,
        marker: {
          color: ids,
          size: values,
          colorscale: "LightGreen"
        },
      }];
  
      // Create layout for the bubble chart
      var bubbleLayout = {
        title: 'Bacteria Cultures per Sample',
        xaxis: {
          title: 'OTU ID'
        },
        height: 480,
        width: 1100,
        hovermode: 'closest',
        paper_bgcolor: "CornflowerBlue"
      };
  
      // Plot the bubble chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Create trace for the gauge chart
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: 'Belly Button Washing Frequency per Week' },
          titlefont: { family: '"Arial, Helvetica, sans-serif' },
          type: "indicator",
          gauge: {
            axis: { visible: true, range: [0, 10] },
            bar: { color: "black" },
          },
          mode: "gauge+number"
        }
      ];
  
      // Create layout for the gauge chart
      var gaugeLayout = {
        width: 420,
        height: 400,
        margin: { t: 100, r: 100, l: 100, b: 100 },
        line: {
          color: '600000'
        },
        font: { color: "black", family: "Arial" },
        paper_bgcolor: "lavender"
      };
  
      // Plot the gauge chart
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }
  