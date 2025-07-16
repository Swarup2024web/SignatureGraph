const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

let pathPoints = [];
let drawIndex = 0;
let hue = 0;
let animationFrame = null;

function generateSignature() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) {
    alert("Please enter a name!");
    return;
  }

  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(animationFrame);
  pathPoints = [];
  drawIndex = 0;
  hue = 0;

  opentype.load(
    "https://fonts.gstatic.com/s/greatvibes/v15/RWmMoKWR9v4ksMfaWd_JN9XFiaQ4.woff",
    function (err, font) {
      if (err) {
        alert("Font load error: " + err);
        return;
      }

      const fontSize = 180;
      const path = font.getPath(name, 50, 200, fontSize);
      const pathData = path.commands;

      // Extract points
      for (let cmd of pathData) {
        if (cmd.x !== undefined && cmd.y !== undefined) {
          pathPoints.push({ x: cmd.x, y: cmd.y });
        }
      }

      animateDrawing();
    }
  );
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
