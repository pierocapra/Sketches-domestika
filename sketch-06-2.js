const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random')
const Color = require('canvas-sketch-util/color')
const risoColors = require('riso-colors')

const seed = random.getRandomSeed()

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: false
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);

  let x, y, w, h, fill, stroke, blend;

  // Number of rectangles
  const num = 80;

  // Angle of rectangles
  const degrees = -30;

  // Array of rectangles
  const rects = [];

  // Colors
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors)
  ]

  // Background color
  const bgColor = random.pick(risoColors).hex;

  // Create polygon mask
  const mask = {
    radius: width * 0.4,
    sides: 6,
    x: width * 0.5,    
    y: height * 0.5 
  }

  // Fill rectangles array with different values
  for (let i = 0; i < num; i++) {
    x = random.range(0, width)
    y = random.range(0, height)
    w = random.range(300, 400)
    h = random.range(40, 200)

    // fill = `rgba(${random.range(0, 255)},${random.range(0, 255)}, ${random.range(0, 255)},1)`
    fill = random.pick(rectColors).hex
    stroke = random.pick(rectColors).hex

    blend = (random.value() > 0.5) ? 'overlay' : 'source-over'

    rects.push({x, y, w, h, fill, stroke, blend})
  }

  // Draw Rectangles and Polygon
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y)

    drawPolygon({context, radius: mask.radius, sides: mask.sides});

    context.lineWidth = 10;
    context.strokeStyle = "black";
    context.stroke();

    // clips the content inside the polygon
    context.clip()
  
    rects.forEach(rect =>{
      const{x, y, w, h , fill, stroke, blend} = rect
      let shadowColor;
      context.save()
      context.translate(-mask.x, -mask.y)
      context.translate(x,y);
      
      context.fillStyle = fill;
      context.lineWidth = 10;
      context.strokeStyle = stroke;

      // context.globalCompositeOperation = blend;

      drawSkewedRect({context, w, h, degrees});

      // Apply a shadow to rectangle
      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.8;

      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      
      context.fill()
      context.shadowColor = null;
      context.stroke()

      // context.globalCompositeOperation = 'source-over'

      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke()

      context.restore()
    })

    context.restore()

    // Poligon outline
    context.save()
    context.translate(mask.x, mask.y)
    
    drawPolygon({context, radius: mask.radius, sides: mask.sides});

    context.lineWidth = 10;
    context.strokeStyle = 'black';
    context.stroke();

    context.restore()
  };
};

// Draw single skewed rectangle
const drawSkewedRect = ({context, w = 600, h = 400, degrees = 45})=>{
    angle = math.degToRad(degrees);    
    let rx = Math.cos(angle) * w;
    let ry = Math.sin(angle) * w;
    
    context.save()
    context.translate(rx * -0.5 ,(ry + h) * -0.5);

    context.beginPath();
    context.moveTo(0, 0)
    context.lineTo(rx,ry)
    context.lineTo(rx,ry + h)
    context.lineTo(0, h)
    context.closePath()
    context.stroke()

    context.restore()
}

// Draw Polygon
const drawPolygon = ({context, radius = 100, sides = 3}) => {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius)
  }

  context.closePath();
}

canvasSketch(sketch, settings);
