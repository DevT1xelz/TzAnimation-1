const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width/2;
const centerY = canvas.height/2;

const type = localStorage.getItem('animationType') || 'heart';

const particles = [];
const lines = [];
const colors = {heart:'#d81b60', star:'#fbc02d', flower:'#c62828'};
const SPEED_FACTOR = 0.00002; 

function generateShapePoints(type){
  const points = [];
  switch(type){
    case 'heart':
      const scale = 15;
      for(let t=0;t<Math.PI*2;t+=0.03){
        const x = 16*Math.pow(Math.sin(t),3);
        const y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
        points.push({x:x*scale, y:-y*scale});
      }
      break;
    case 'star':
      const spikes = 5, outerR = 100, innerR = 50;
      let rot = Math.PI/2*3, step = Math.PI/spikes;
      for(let i=0;i<spikes;i++){
        let x = outerR * Math.cos(rot), y = outerR * Math.sin(rot);
        points.push({x,y});
        rot += step;
        x = innerR * Math.cos(rot); y = innerR * Math.sin(rot);
        points.push({x,y});
        rot += step;
      }
      break;
    case 'rose':
      const a = 100;
      const k = 4;
      for(let t=0; t<Math.PI*2; t+=0.01){
        let r = a * Math.sin(k*t);
        let x = r * Math.cos(t);
        let y = r * Math.sin(t);
        points.push({x,y});
      }
      break;
  }
  return points;
}

class Particle{
  constructor(targetX,targetY,color){
    this.x = centerX;
    this.y = centerY;
    this.targetX = centerX + targetX;
    this.targetY = centerY + targetY;
    this.color = color;
    this.size = 2;
    this.vx = (this.targetX-centerX)*SPEED_FACTOR*(Math.random()+0.5);
    this.vy = (this.targetY-centerY)*SPEED_FACTOR*(Math.random()+0.5);
    this.alpha = 0;
  }

  update(){
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx += dx * 0.0003;
    this.vy += dy * 0.0003;
    this.x += this.vx;
    this.y += this.vy;

    this.alpha += 0.002; 
    if(this.alpha > 1) this.alpha = 1;

    lines.push({x1:centerX,y1:centerY,x2:this.x,y2:this.y,color:this.color, alpha:this.alpha*0.2});
  }

  draw(){
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function init(){
  const shapePoints = generateShapePoints(type==='rose'?'rose':type);
  const color = colors[type==='rose'?'flower':type];
  shapePoints.forEach(pt=>{
    particles.push(new Particle(pt.x, pt.y, color));
  });
}

function animate(){
  ctx.fillStyle='rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  lines.splice(0,lines.length);

  particles.forEach(p=>{
    p.update();
    p.draw();
  });

  lines.forEach(l=>{
    ctx.strokeStyle = l.color;
    ctx.globalAlpha = l.alpha;
    ctx.beginPath();
    ctx.moveTo(l.x1,l.y1);
    ctx.lineTo(l.x2,l.y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(animate);
}

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
init();
animate();
