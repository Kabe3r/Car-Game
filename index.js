const score = document.querySelector('.score');
const levelScreen = document.querySelector('.levelScreen');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

let keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Tab: false
}

let player = {
      speed: 5,
      score: 0,
      level: 1,
};

startScreen.addEventListener('click', start);
document.addEventListener('keydown', keyPress);
document.addEventListener('keyup', keyLeave);

// moving the marks on the road
function moveMarks() {
      let marks = document.querySelectorAll('.roadMarkers');
      marks.forEach(function (mark) {
            if (mark.y >= 1500) {
                  mark.y -= 1500;
            }
            mark.y += player.speed;
            mark.style.top = mark.y + "px";
      });
}

// moving the cars on the road
function moveRandomCars(car) {
      let cars = document.querySelectorAll('.randomCars');
      cars.forEach(function (item) {
            if (collision(car, item)) {
                  gameOver();
            }
            if (item.y >= 1500) {
                  item.y = -1000;
                  item.style.left = Math.floor(Math.random() * 350) + "px";
                  item.style.backgroundColor = randomColor();
            }
            item.y += player.speed;
            item.style.top = item.y + "px";
      })
}

// Checking the collision of car
function collision(a, b) {
      let myCar = a.getBoundingClientRect();
      let randomCars = b.getBoundingClientRect();
      
      // inspecting vertical and horizontal positions of  the cars.
      const collided = !((myCar.bottom < randomCars.top) || (myCar.top > randomCars.bottom) || (myCar.right < randomCars.left) || (myCar.left > randomCars.right));
      
      return collided;
}
// starting the game by creating an infinite animation on the road
function playGame() {
      let car = document.querySelector(".car");
      moveMarks();
      moveRandomCars(car);
      // Setting the bounding limit for car
      let road = gameArea.getBoundingClientRect();
      if (player.start) {
            // setting vertical coordinates within boundingbox
            if (keys.ArrowUp && player.y > -671) {
                  player.y -= player.speed;
            }
            if (keys.ArrowDown && player.y < (road.bottom - 50)) {
                  player.y += player.speed;
            }
            // setting horizontal coordinates within boundingbox
            if (keys.ArrowLeft && player.x > 0) {
                  player.x -= player.speed;
            }
            if (keys.ArrowRight && player.x < (road.width - 50)) {
                  player.x += player.speed;
            }
            // setting the car element with the coordinates above
            car.style.left = player.x + "px";
            car.style.top = player.y + "px";
            window.requestAnimationFrame(playGame);
            player.score++;
            score.innerHTML = "Score: " + player.score + "<br>Level: " + player.level;
            const scores = (player.score === 700 || player.score === 1700 || player.score === 3000 || player.score === 4000 || player.score === 5000 || player.score === 6000)
            if (scores) {
                  upGradeLevel();
            }
      }
}

function keyPress(event) {
      event.preventDefault();
      keys[event.key] = true;
      if (!player.start) {
            if (keys.Tab) {
                  levelUp();
            }
      }
}

function keyLeave(event) {
      event.preventDefault();
      keys[event.key] = false;
}

function gameOver(event) {
            player.start = false;
            score.innerHTML = "Game Over<br>Score was " + player.score+ "<br>Level  " + player.level;
            startScreen.classList.remove("hide");
            gameArea.innerHTML = "";
            keys[event.key] = false;
}


function levelUp() {
            levelScreen.classList.add("hide");
            player.start = true;
           window.requestAnimationFrame(playGame);
}

function upGradeLevel() {
      player.start = false;
      player.level++;
      player.speed += 5;
      score.innerHTML = "Score was " + player.score + "<br>Congratulations You're on Level " + player.level;
      levelScreen.classList.remove("hide");
}

// Run when the game starts
function start() {
      startScreen.classList.add("hide");
      gameArea.innerHTML = "";
      player.start = true;
      player.score = 0;
      player.level = 1;
      player.speed = 5;
      // creating road lines
      for (let i = 0; i < 10; i++) {
            let div = document.createElement('div');
            div.classList.add('roadMarkers');
            div.y = i * 150;
            div.style.top = (i * 150) + 'px';
            gameArea.appendChild(div);
      }
      window.requestAnimationFrame(playGame);
      let car = document.createElement("div");
      car.setAttribute("class", "car");
      gameArea.appendChild(car);
      // Setting the values for x and y coordinates
      player.x = car.offsetLeft;
      player.y = car.offsetTop;
      //creating and generating random cars
      for (let i = 0; i < 4; i++) {
            let div = document.createElement('div');
            div.classList.add('randomCars');
            div.innerHTML = "<br>" + (i + 1);
            div.y = ((i + 1) * 600) * -1;
            div.style.top = div.y + 'px';
            div.style.left = Math.floor(Math.random() * 350) + "px";
            div.style.backgroundColor = randomColor();
            gameArea.appendChild(div);
      }
}

// Generating random hex values
function randomColor() {
      function hex() {
            let value = Math.floor(Math.random() * 256).toString(16);
            return ('0' + String(value)).substr(-2);
      }
      return '#' + hex() + hex() + hex();
}