const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [ 1080,1080 ]
};
let manager;

// Letter settings
let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif'

const sketch = ({ context, width, height }) => {
  //
  // Create a sample letter to be mapped
  //
  const typeCanvas = document.createElement('canvas');
  const typeContext = typeCanvas.getContext('2d');
  
  // Size and frequency of glyph cell
  const cell = 20;
  
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return () => {
    // Black background of sample letter
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typeContext.fillStyle = "white";
    typeContext.font = fontSize + 'px ' + fontFamily;
    typeContext.textBaseline = 'top';

    //
    // Map the letter by each pixel
    //
    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(tx, ty )

    // Draw border
    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore()

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    // console.log(typeData);

    //
    // Draw the letter with glyphs
    //

    // Black background
    context.fillStyle = "black";
    context.fillRect(0,0,width,height)

    // Center the image
    context.textBaseline = 'middle'
    context.textAlign = 'center'
    
    // draws the small letter at top left
    context.drawImage(typeCanvas, 0 ,0);

    // draws each cell
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols)

      const x = col * cell;
      const y = row * cell;

      // glyph colors 
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      // Get the randomise glyph
      const glyph = getGlyph(r)

      context.font = `${cell * 2}px ${fontFamily}`
      if (Math.random() < 0.1) {
        context.font = `${cell * 6}px ${fontFamily}`
      }

      // Color of glyph
      // context.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`
      context.fillStyle = 'white'

      context.save();
      context.translate(x, y)
      context.translate(cell * 0.5, cell * 0.5)

      // context.fillRect(0,0,cell,cell)

      // context.beginPath();
      // context.arc(0, 0, cell * 0.5, 0, Math.PI *2)
      // context.fill();

      context.fillText(glyph, 0, 0)

      context.restore()
    }
  };
};

// Randomize glyphs
const getGlyph = (v) => {
  if(v<50) return '';
  if(v<100) return '.';
  if(v<150) return '-';
  if(v<200) return '+';

  const glyphs = '_= /'.split('');
  return random.pick(glyphs);
}

// Change letter on key press
const onKeyUp = (e) => {
  console.log(e.key);
  text = e.key.toUpperCase();
  manager.render()
}
document.addEventListener('keyup', onKeyUp);

// Run canvas sketch asyncronously
const start = async() => {
  manager = await canvasSketch(sketch, settings);
}
start();

