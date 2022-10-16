const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

// const degToRad = (degrees) => {
//   return degrees / 180 * Math.PI;  
// }

// const randomRange = (min, max) => {
//   return Math.random() * (max - min) + min;
// }

const sketch = () => {
  return ({ context, width, height }) => {
    
    // White background
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Color of clock elements
    context.fillStyle = 'red';

    // Variables

    // Main circle
    const cx = width * 0.5;
    const cy = height * 0.5;

    // Initial measures of clock element
    const w = width * 0.01;
    const h = height * 0.2;
    let x, y;

    // Number of clock elements
    const num = 40;

    // Initial raidus
    const radius = width * 0.3;

      // Draw elements
      for (let i = 0; i < num; i++) {
        const slice = math.degToRad(360 / num);
        const angle = slice * i;

        // Place clock elements in the canvas
        x = cx + radius * Math.sin(angle);
        y = cy + radius * Math.cos(angle);

        // Clock elements 
        context.save();
        context.translate(x, y);
        // context.rotate(0.3); //this is radiants
        context.rotate(-angle); //this is 45 degrees
        
        
        context.scale(random.range(0.1, 2), random.range(0.2,0.5));

        context.beginPath();
        context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
        context.fill();
        context.restore();

        // Arcs elements
        context.save();
        context.translate(cx, cy);
        context.rotate(-angle);

        context.lineWidth = random.range(5,20);

        context.beginPath();
        context.arc(0,0,radius * random.range(0.7,1.3), slice * random.range(1, -8),slice * random.range(1, 5));
        context.stroke();

        context.restore();
      }
    }
};


canvasSketch(sketch, settings);
