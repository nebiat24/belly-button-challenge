// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
function findSample(x){
  return x.id == sample;
};
let indiv_metadata = metadata.filter(findSample);

    // Use d3 to select the panel with
let panel = d3.select(`#sample-metadata`);


    // Use `.html("") to clear any existing metadata

panel.html('')
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
for (var key in indiv_metadata[0]){
      panel.append('p').text(`${key.toUpperCase()}: ${indiv_metadata[0][key]}`)
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    samples_field = data.samples

    // Filter the samples for the object with the desired sample number
    function findSample(x){
      return x.id == sample; // console logging sample showed that it's the number we're looking for.
    };
    
    let indiv_data = samples_field.filter(findSample)[0]
    console.log(indiv_data)

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = indiv_data.otu_ids
    let otu_labels = indiv_data.otu_labels
    let sample_values = indiv_data.sample_values

    // Build a Bubble Chart
    traceBubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        hovertext: otu_labels
      }
    }

    // Render the Bubble Chart
    let bubbleplot_data = [traceBubble];
    let bubbleplot_layout = {title: 'Bacteria Cultures per Sample'};
    Plotly.newPlot('bubble',bubbleplot_data,bubbleplot_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otu_strings = [];
    for (var id in otu_ids){otu_strings.push('OTU ' + String(otu_ids[id]))};
    console.log(otu_ids)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    traceBar = {
      x: sample_values.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h',
      hovertext: otu_labels.slice(0,10).reverse(),
      y: otu_strings.slice(0,10).reverse(),
    };

    bardata = [traceBar];
    barlayout = {
      title: 'Top 10 Bacteria Cultures Found',
    }


    // Render the Bar Chart
    Plotly.newPlot('bar',bardata,barlayout)
  });
}



// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    dropdown = document.getElementById('selDataset') 

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (i=0;i<names.length;i++){
      // create an option object
      let newoption = document.createElement('option');
      newoption.value = names[i];
      newoption.text = names[i];
      // append the option object to the 'select' object
      dropdown.appendChild(newoption);
    };

    // Get the first sample from the list
    first = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first);
    buildCharts(first);
  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
