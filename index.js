let gameIsOver = false;
let score = 0;
let seconds = 0;
let bolts = [];
let clouds = [];
let music = new Audio('resources/music.m4a');

const ctx = document.getElementById("canvas").getContext("2d");
let speed = 2;

const sizeX = 80;
const sizeY = 160;

let mouseX = 0;
let mouseY = 0;

class Bolt {
	constructor(y) {
		let newX = Math.floor(Math.random() * window.innerWidth);
		newX = newX > window.innerWidth / 2 ? newX - 50 : newX + 50;
		this.x = newX;
		this.y = y;
	}

	draw() {
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x - sizeX, this.y + sizeY / 2 - 20);
		ctx.lineTo(this.x - sizeX / 2 + 10, this.y + sizeY / 2);
		ctx.lineTo(this.x - sizeX, this.y + sizeY);
		ctx.lineTo(this.x, this.y + sizeY / 2);
		ctx.lineTo(this.x - sizeX / 2 - 10, this.y + sizeY / 2 - 20);
		ctx.lineTo(this.x, this.y);
		ctx.fill();
		ctx.stroke();
	}

	update() {
		this.y += speed;
		if (this.y >= window.innerHeight) {
			gameIsOver = true;
		}
	}
}

function init() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	let animals = document.getElementsByClassName("duck");
	Array.prototype.forEach.call(animals, (animal) => animal.style.display = "none");

	music.play();
	setInterval(incrementSeconds, 1000);
	window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
	if (gameIsOver) {
		gameOver();
		return;
	}
	generateBolts();
	draw();
	update();

	window.requestAnimationFrame(gameLoop);
}

function generateBolts() {
	if (bolts.length > 5) {
		return;
	}

	while (bolts.length < 5) {
		bolts.push(new Bolt(100));
	}
}

function draw() {
	
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);


	let cloudPath = 'resources/cloud.webp';
	let cloud1 = new Image();
	cloud1.src = cloudPath;
	ctx.drawImage(cloud1, 100, 35, 450, 150);
	let cloud2 = new Image();
	cloud2.src = cloudPath;
	ctx.drawImage(cloud1, 500, 35, 450, 150);
	let cloud3 = new Image();
	cloud3.src = cloudPath;
	ctx.drawImage(cloud1, 900, 35, 450, 150);

	let text = "Score: ";
	ctx.fillStyle = "#02db9e";
	ctx.strokeStyle = "black";
	ctx.font = "2.4rem 'Space monospace";
	ctx.fillText(text + score, 40, 40);
	ctx.strokeText(text + score, 40, 40);

	let timeText = "Timer: ";
	ctx.fillText(timeText + seconds, 260, 40);
	ctx.strokeText(timeText + seconds, 260, 40);

	bolts.forEach((bolt) => {
		bolt.draw();
	});
}

function update() {
	bolts.forEach((bolt) => {
		bolt.update();
	});
}

function checkUserInput() {
	let newBolts = bolts.filter(
		(bolt) =>
			!(
				mouseX > bolt.x - sizeX &&
				mouseX < bolt.x &&
				mouseY < bolt.y + sizeY &&
				mouseY > bolt.y
			)
	);
	if (newBolts < bolts) {
		score += bolts.length - newBolts.length;
		let audio = new Audio("resources/thunder.ogg");
		audio.play();
	}
	bolts = newBolts;
}

function incrementSeconds() {
	seconds += 1;
	if (seconds % 4 === 0) {
		speed += 0.5;
	}
}

function gameOver() {
	music.pause();
	var audio = new Audio("resources/game-over.wav");
	audio.play();
	setTimeout(() => {window.location.href = "gameover.html";}, 1700);
	return;
}

document.addEventListener("click", (e) => {
	mouseX = e.x;
	mouseY = e.y;
	e.preventDefault();
	checkUserInput();
});
