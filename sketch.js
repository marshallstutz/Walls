// How big is the population
var totalPopulation = 500;
// All active balls (not yet collided with batl)
var activeBalls = [];
// All balls for any given population
var allBalls = [];
// Pipes
var bats = [];
// A frame counter to determine when to add a batl
var counter = 0;

var runsAtPop = 0;
// Interface elements
var speedSlider;
var speedSpan;
var highScoreSpan;
var allTimeHighScoreSpan;
var numberOfRunsSpan;
var currentPopulationSpan;

var data = [];

var numberOfRuns = 0;
// All time high score
var highScore = 0;

// Training or just showing the current best
var runBest = false;
var runBestButton;

function setup() {
  var canvas = createCanvas(720, 900);
  canvas.parent('canvascontainer');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
	numberOfRunsSpan = select('#nr');
	currentPopulationSpan = select('#cp');
  runBestButton.mousePressed(toggleState);

  // Create a population
  for (var i = 0; i < totalPopulation; i++) {
    var ball = new Ball();
    activeBalls[i] = ball;
    allBalls[i] = ball;
  }
}

// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best ball
  if (runBest) {
    resetGame();
    runBestButton.html('continue training');
    // Go train some more
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}



function draw() {
  background(0);

  // Should we speed up cycles per frame
  var cycles = speedSlider.value();
  speedSpan.html(cycles);


  // How many times to advance the game
  for (var n = 0; n < cycles; n++) {
    // Show all the batls
    for (var i = bats.length - 1; i >= 0; i--) {
      bats[i].update();
      if (bats[i].offscreen()) {
        bats.splice(i, 1);
      }
    }
    // Are we just running the best ball
    if (runBest) {
      bestBall.think(bats);
      bestBall.update();
      for (var j = 0; j < bats.length; j++) {
        // Start over, ball hit batl
        if (bats[j].hits(bestBall)) {
          resetGame();
          break;
        }
      }

      if (bestBall.bottomTop()) {
        resetGame();
      }
      // Or are we running all the active balls
    } else {
      for (var i = activeBalls.length - 1; i >= 0; i--) {
        var ball = activeBalls[i];
        // Ball uses its brain!
        ball.think(bats);
        ball.update();

        // Check all the batls
        for (var j = 0; j < bats.length; j++) {
          // It's hit a batl
          if (bats[j].hits(activeBalls[i])) {
            // Remove this ball
            activeBalls.splice(i, 1);
            break;
          }
        }

        if (ball.bottomTop()) {
          activeBalls.splice(i, 1);
        }

      }
    }

    // Add a new batl every so often
    if (counter % 45 == 0) {
      bats.push(new Bat());
    }
    counter++;
  }

  // What is highest score of the current population
  var tempHighScore = 0;
  // If we're training
  if (!runBest) {
    // Which is the best ball?
    var tempBestBall = null;
    for (var i = 0; i < activeBalls.length; i++) {
      var s = activeBalls[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBall = activeBalls[i];
      }
    }

    // Is it the all time high scorer?
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBall = tempBestBall;
    }
  } else {
    // Just one ball, the best one so far
    tempHighScore = bestBall.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);
	numberOfRunsSpan.html(numberOfRuns);
	currentPopulationSpan.html(totalPopulation);

  // Draw everything!
  for (var i = 0; i < bats.length; i++) {
    bats[i].show();
  }

  if (runBest) {
    bestBall.show();
  } else {
    for (var i = 0; i < activeBalls.length; i++) {
      activeBalls[i].show();
    }
    // If we're out of balls go to the next generation
    if (activeBalls.length == 0) {
			/*if(bestBall.score > 30000){
				data[data.length] = "Population " + totalPopulation + " number of runs" + numberOfRuns;
				runsAtPop++;
				numberOfRuns = 0;
				if(runsAtPop > 5){
					runsAtPop = 0;
					totalPopulation++;
				}
					highScore = 0;
					activeBalls = [];
					allBalls = [];
					for (var i = 0; i < totalPopulation; i++) {
						var ball = new Ball();
						activeBalls[i] = ball;
						allBalls[i] = ball;
				  }
			}*/
      nextGeneration();
    }
  }
}
