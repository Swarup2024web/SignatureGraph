const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

let pathPoints = [];
let drawIndex = 0;
let hue = 0;
let animationFrame = null;

// Map of font names to their CDN URLs (.ttf)
const fontURLs = {
  "GreatVibes-Regular.ttf":
    "https://cdn.jsdelivr.net/gh/google/fonts/ofl/greatvibes/GreatVibes-Regular.ttf",
  "DancingScript-Regular.ttf":
    "https://cdn.jsdelivr.net/gh/google/fonts/ofl/dancingscript/DancingScript-Regular.ttf",
  "Pacifico-Regular.ttf":
    "https://cdn.jsdelivr.net/gh/google/fonts/ofl/pacifico/Pacifico-Regular.ttf",
  "Satisfy-Regular.ttf":
    "https://cdn.jsdelivr.net/gh/google/fonts/ofl/satisfy/Satisfy-Regular.ttf",
  "Allura-Regular.ttf":
    "https://cdn.jsdelivr.net/gh/google/fonts/ofl/allura/Allura-Regular.ttf",
};

function drawRuledLines() {
  const spacing = canvas.height / 5;
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 4; i++) {
    const y = spacing * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function generateSignature() {
  const name = document.getElementById("nameInput").value.trim();
  const fontFile = document.getElementById("fontSelect").value;

  if (!name) {
    alert("Please enter a name!");
    return;
  }

  const fontURL = fontURLs[fontFile];

  if (!fontURL) {
    alert("Font URL not found!");
    return;
  }

  // Clear previous animation and canvas
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRuledLines(); // re-draw lines
  pathPoints = [];
  drawIndex = 0;
  hue = 0;

  opentype.load(fontURL, function (err, font) {
    if (err) {
      alert("Font load error: " + err);
      return;
    }

    const fontSize = 180;
    const xStart = 50;
    const yBase = 220;

    const path = font.getPath(name, xStart, yBase, fontSize);
    const pathData = path.commands;

    // Extract vector points
    for (let cmd of pathData) {
      if (cmd.x !== undefined && cmd.y !== undefined) {
        pathPoints.push({ x: cmd.x, y: cmd.y });
      }
    }

    animateDrawing();
  });
}

function animateDrawing() {
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  function draw() {
    if (drawIndex >= pathPoints.length - 1) return;

    const p1 = pathPoints[drawIndex];
    const p2 = pathPoints[drawIndex + 1];

    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    hue = (hue + 2) % 360;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    drawIndex++;
    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}
