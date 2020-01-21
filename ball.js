function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Ball {
  constructor(brain){
    this.y = 50;
    this.x = width/2;
    this.velocity = 0;
    this.accel = 0;
    this.accelCap = 1.00;
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(6, 8, 1);
    }
      this.score = 0;
      this.fitness = 0;
  }
  show() {
    fill(255);
    ellipse(this.x,this.y,50,50);
  }
  copy(){
   return new Ball(this.brain);
  }
  update(){
    this.x += this.velocity;
    this.velocity += this.accel;
    this.score++;
  }
    think(bats) {
    // First find the closest pipe
    let closest = null;
    let second = null;
    for (let i = 0; i < bats.length; i++) {
      let diff = bats[i].y - this.y;
      if (diff > 0) {
        closest = bats[i];
        if(bats[i+1] != null){
          second = bats[i+1];
        }
        i = bats.length;
      }
    }

    if (closest != null && second != null) {
      // Now create the inputs to the neural network
      let inputs = [];
      // y position of closest bat
      inputs[0] = map(closest.y, this.y, height, 0, 1);
      // left of closest pipe opening
      inputs[1] = map(closest.left, 0, width, 0, 1);
      // left of second pipe opening
      inputs[2] = map(second.left, 0, width, 0, 1);
      // bird's x position
      inputs[3] = map(this.x, 0, height, 0, 1);
      // bird's x velocity
      inputs[4] = map(this.velocity, -10, 10, 0, 1);
      // y position of second bat
      inputs[5] = map(second.y, this.y, height, 0, 1);

      // Get the outputs from the network
      let action = this.brain.predict(inputs);
      // Decide to jump or not!
      this.accel = action[0];
    }
  }
    bottomTop() {
    // Bird dies when hits bottom?
    return (this.x > width || this.x < 0);
  }

  setAccel(accel){
    this.accel =  accel;
    if(this.accel > this.accelCap){
      this.accel = this.accelCap;
    }
    if(this.accel < -this.accelCap){
      this.accel = -this.accelCap;
    }
  }
}
