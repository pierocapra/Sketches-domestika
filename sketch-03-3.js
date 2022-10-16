const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  // Randomize position of dots and insert in array
  for (let i=0; i< 40; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x,y))
  }
  
  return ({ context, width, height }) => {

    // White background
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height); 
    
    // Draw lines according to a minimum distance
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      for (let j = i+1; j < agents.length; j++) {
        const other = agents[j];
        
        const dist = agent.pos.getDistance(other.pos);

        // Only draw a line if the distance between agents is lower than 250
        if (dist > 350) continue; //skip the rest of the code

        // Randomize thickness of lines
        context.lineWidth = math.mapRange(dist, 0, 200, 10, 1)
        // context.lineWidth = 2;

        // Draw the line
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

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

  // Get Distance between dots
  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    // Pitagorian theorem 
    // dist = square root of dx square + dy square 
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x,y){
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1)); //velocity
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
    if(this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1
  }

  // Draw just outline of the dot
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