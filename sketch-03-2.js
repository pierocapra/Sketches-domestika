const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  // Randomize position of dots and insert in array
  for (let i=0; i< 60; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x,y))
  }
  
  return ({ context, width, height }) => {

    // White background
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height); 
    
    // Draw agents from array
    agents.forEach((agent)=>{
      agent.update();
      agent.bounce(width, height)
      agent.draw(context)
    })
  };
};

canvasSketch(sketch, settings);

// Position of Dot
class Vector {
  constructor(x,y){
    this.x = x;
    this.y = y; 
  } 
}

class Agent {
  constructor(x,y){
    this.pos = new Vector(x, y);

    //randomise speed/velocity of movement
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1)); //velocity

    //randomise size of Dot
    this.radius = random.range(4,12);
  } 

  // Update the position of Dot at each frame  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  // Agent to bounce off the edges of the canvas
  bounce(width, height){
    if(this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if(this.pos.y <= 0 || this.pos.y >= width) this.vel.y *= -1
  }

  // draw just outline of the dot
  draw(context){
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke()

    context.restore()
  }
}

// animate without sketch
// const animate = () => {
//   console.log('domestika');
//   window.requestAnimationFrame(animate);
// }
// animate();