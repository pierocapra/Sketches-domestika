const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 620, 620 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const w = 60;
    const h = 60;
    const gap = 20;

    for (let x = 0; x < width; x += w + gap) {
      for (let y = 0; y < height; y += h + gap) {
        context.fillStyle = 'black';
        context.fillRect(x, y, w, h);
      }
    }
  };
};

canvasSketch(sketch, settings);
