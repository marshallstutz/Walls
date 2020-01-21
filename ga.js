// Start the game over
function resetGame() {
  counter = 0;
  numberOfRuns++;
  // Resetting best bird score to 0
  if (bestBall) {
    bestBall.score = 0;
  }
  bats = [];
}

// Create the next generation
function nextGeneration() {
  if(bestBall.score > 30000){
    
  }
  resetGame();
  // Normalize the fitness values 0-1
  normalizeFitness(allBalls);
  // Generate a new set of birds
  activeBalls = generate(allBalls);
  // Copy those birds to another array
  allBalls = activeBalls.slice();
}

// Generate a new population of birds
function generate(oldBalls) {
  let newBalls = [];
  for (let i = 0; i < oldBalls.length; i++) {
    // Select a bird based on fitness
    let ball = poolSelection(oldBalls);
    newBalls[i] = ball;
  }
  return newBalls;
}

// Normalize the fitness of all birds
function normalizeFitness(balls) {
  // Make score exponentially better?
  for (let i = 0; i < balls.length; i++) {
    balls[i].score = pow(balls[i].score, 2);
  }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < balls.length; i++) {
    sum += balls[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < balls.length; i++) {
    balls[i].fitness = balls[i].score / sum;
  }
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(balls) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= balls[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return balls[index].copy();
}
