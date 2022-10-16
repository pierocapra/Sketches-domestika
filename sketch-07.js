const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [ 1080, 1080 ],
	animate: true,
};

let elCanvas;
let points;

const sketch = ({ canvas }) => {
	points = [
		new Point({ x: 200, y: 540 }),
		new Point({ x: 400, y: 700 }),
		new Point({ x: 880, y: 540 }),
		new Point({ x: 600, y: 700 }),
		new Point({ x: 640, y: 900 })
	];

	// Activate Event on Mouse Down
	canvas.addEventListener('mousedown', onMouseDown);

	elCanvas = canvas;

	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		// Draw light guide lines
		context.strokeStyle = '#999';
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);

		for (let i = 1; i < points.length; i++) {
			context.lineTo(points[i].x, points[i].y);
		}

		context.stroke();

		/*
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i += 2) {
			context.quadraticCurveTo(points[i + 0].x, points[i + 0].y, points[i + 1].x, points[i + 1].y);
		}
		context.stroke();
		*/

		// Draw actual curves connected
		context.beginPath();

		for (let i = 0; i < points.length - 1; i++) {
			const curr = points[i + 0];
			const next = points[i + 1];

			const mx = curr.x + (next.x - curr.x) * 0.5;
			const my = curr.y + (next.y - curr.y) * 0.5;

			// draw midpoints
			// context.beginPath();
			// context.arc(mx, my, 5, 0, Math.PI * 2);
			// context.fillStyle = 'blue';
			// context.fill();

			if (i == 0) context.moveTo(curr.x, curr.y);
			else if (i == points.length - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
			else context.quadraticCurveTo(curr.x, curr.y, mx, my);
		}

		context.lineWidth = 4;
		context.strokeStyle = 'blue';
		context.stroke();

		points.forEach(point => {
			point.draw(context);
		});
	};
};

const onMouseDown = (e) => {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);

	const x = (e.offsetX / elCanvas.offsetWidth)  * elCanvas.width;
	const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

	// Enable possibility of dragging point
	let hit = false;
	points.forEach(point => {
		point.isDragging = point.hitTest(x, y);
		if (!hit && point.isDragging) hit = true;
	});

	if (!hit) points.push(new Point({ x, y }));

  console.log('mouse down');
};

const onMouseMove = (e) => {
	// Scaling canvas according to proportions
	const x = (e.offsetX / elCanvas.offsetWidth)  * elCanvas.width;
	const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

    // Move the point across the canvas 
	// Animate needs to be true
	points.forEach(point => {
		if (point.isDragging) {
			point.x = x;
			point.y = y;
		}
	});
//   console.log(x,y);
};

// Release Listeners when not pressing mouse
const onMouseUp = () => {
	window.removeEventListener('mousemove', onMouseMove);
	window.removeEventListener('mouseup', onMouseUp);
};

canvasSketch(sketch, settings);

// Point Class
class Point {
	constructor({ x, y, control = false }) {
		this.x = x;
		this.y = y;
		this.control = control;
	}

	// Draw point
	draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = this.control ? 'red' : 'black';

		context.beginPath();
		context.arc(0, 0, 10, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}

	// Check if mouse hover on the point
	hitTest(x, y) {
		// coordinates
		const dx = this.x - x;
		const dy = this.y - y;

		// distance
		const dd = Math.sqrt(dx * dx + dy * dy);

		return dd < 20;
	}
}