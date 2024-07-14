let salesData = {};
let selectedYear = "2023"; // Default year
let combinedData = {};
let csvFiles = {
  "2022": "sales_2022.csv",
  "2023": "sales_2023.csv",
  "2024": "sales_2024.csv"
};

function preload() {
  // Load CSV files
  for (let year in csvFiles) {
    salesData[year] = loadTable(csvFiles[year], "csv", "header");
  }
}

function setup() {
  createCanvas(1300, 800);
  let yearSelector = createSelect();
  yearSelector.position(width - 100, 70);
  yearSelector.option("2022");
  yearSelector.option("2023");
  yearSelector.option("2024");
  yearSelector.selected(selectedYear);
  yearSelector.changed(() => {
    selectedYear = yearSelector.value();
    redraw();
  });

  // Apply CSS styles to the dropdown
  yearSelector.style('border', '2px solid white');
  yearSelector.style('background-color', 'black');
  yearSelector.style('color', 'white');
  yearSelector.style('padding', '5px');

  noLoop();
}

function draw() {
  background(0); // Change background to black
  drawTitle();
  drawBars();
  drawLegend();
}

function drawTitle() {
  textSize(24);
  textAlign(CENTER, CENTER);
  fill(255); // White color for text
  text(`Monthly EV Sales Comparison for ${selectedYear}`, width / 2, 40);
}

function drawBars() {
  let data = salesData[selectedYear].getRows();
  let months = Array.from(new Set(data.map(d => d.get("month")))); // Unique months
  let barWidth = (width - 200) / (months.length * 3); // Adjust the bar width to ensure equal spacing on both sides
  let maxSales = max(data.map(d => int(d.get("sales"))));
  textSize(12);
  textAlign(CENTER, CENTER);
  
  for (let i = 0; i < months.length; i++) {
    let month = months[i];
    let monthData = data.filter(d => d.get("month") === month);
    let x = (i * 3) * barWidth + 100; // Adjust the x position

    monthData.forEach((d, index) => {
      let sales = int(d.get("sales"));
      let barHeight = map(sales, 0, maxSales, 0, height - 250); // Adjust height to leave space for month labels
      let color;

      switch (d.get("manufacturer")) {
        case "Tesla":
          color = [0, 0, 255]; // Pure blue
          break;
        case "Ford":
          color = [255, 165, 0]; // Pure orange
          break;
        case "Toyota":
          color = [0, 255, 0]; // Pure green
          break;
      }

      fill(color);
      rect(x + index * barWidth, height - barHeight - 130, barWidth - 5, barHeight);
      fill(255); // White color for text
      text(sales / 1000 + "k", x + index * barWidth + barWidth / 2 - 2.5, height - barHeight - 140);
    });

    fill(255); // White color for text
    push();
    translate(x + 1.5 * barWidth, height - 70); // Adjust y position of month labels
    rotate(PI / 4);
    text(month, 0, 0);
    pop();
  }
}

function drawLegend() {
  textSize(14);
  textAlign(LEFT);
  fill(0, 0, 255); // Pure blue
  rect(20, 50, 20, 20);
  fill(255); // White color for text
  text("Tesla", 50, 60);

  fill(255, 165, 0); // Pure orange
  rect(20, 80, 20, 20);
  fill(255); // White color for text
  text("Ford", 50, 90);

  fill(0, 255, 0); // Pure green
  rect(20, 110, 20, 20);
  fill(255); // White color for text
  text("Toyota", 50, 120);
}
