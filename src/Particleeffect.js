// ParticleEffect.js
import React, { useLayoutEffect, useRef } from 'react';

const ParticleEffect = () => {
  const canvasRef = useRef();

  // Define your constants and variables
  const PARTICLE_NUM = 500;
  const PARTICLE_BASE_RADIUS = 0.5;
  const FL = 500;
  const DEFAULT_SPEED = 2;
  const BOOST_SPEED = 300;

  let canvas;
  let canvasWidth, canvasHeight;
  let context;
  let centerX, centerY;
  let mouseX, mouseY;
  let speed = DEFAULT_SPEED;
  let targetSpeed = DEFAULT_SPEED;
  let particles = [];

  const randomizeParticle = (p) => {
    p.x = Math.random() * canvasWidth;
    p.y = Math.random() * canvasHeight;
    p.z = Math.random() * 1500 + 500;
    return p;
  };

  useLayoutEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext('2d');

    const resize = () => {
      canvasWidth = canvas.width = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
      centerX = canvasWidth * 0.5;
      centerY = canvasHeight * 0.5;
      context.fillStyle = 'rgb(255, 255, 255)';
    };

    document.addEventListener('resize', resize);
    resize();

    mouseX = centerX;
    mouseY = centerY;

    for (let i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = randomizeParticle(new Particle());
      particles[i].z -= 500 * Math.random();
    }

    const loop = () => {
      context.save();
      context.fillStyle = 'rgb(0, 0, 0)';
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.restore();

      speed += (targetSpeed - speed) * 0.01;

      // Rest of the loop function...

      requestAnimationFrame(loop);
    };

    const mouseMoveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const mouseDownHandler = () => {
      targetSpeed = BOOST_SPEED;
    };

    const mouseUpHandler = () => {
      targetSpeed = DEFAULT_SPEED;
    };

    document.addEventListener('mousemove', mouseMoveHandler, false);
    document.addEventListener('mousedown', mouseDownHandler, false);
    document.addEventListener('mouseup', mouseUpHandler, false);

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []); // Empty dependency array to run this effect only once on mount

  return <canvas ref={canvasRef} id="c"></canvas>;
};

export default ParticleEffect;

class Particle {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.pastZ = 0;
  }
}
