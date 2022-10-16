const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  // Randomize position of dots and insert in array
  for (let i=0; i< 60; i++){
    // Randomize without library
    // const x = Math.floor(Math.random() * settings.dimensions[0]);
    // const y = Math.floor(Math.random() * settings.dimensions[1]); 
    
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x,y))
  }
  
  return ({ context, width, height }) => {

    // White background
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height); 
    
    // Draw agents from array
    agents.forEach((item)=>{
      item.draw(context)
    })
  };
};

canvasSketch(sketch, settings);

// CLASSES

// Declare position
class Point {
  constructor(x,y){
    this.x = x;
    this.y = y; 
  } 
}


class Agent {
  constructor(x,y){
    this.pos = new Point(x, y);
    this.radius = random.range(4,12);
  } 

  draw(context){
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'black';
    // Randomize color
    // context.fillStyle = `rgb(${random.range(0,255)}, ${random.range(0,255)}, ${random.range(0,255)})`;
    context.fill();
  }
}