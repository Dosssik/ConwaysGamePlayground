class Cell {
    static width = 10;
    static height = 10;

    constructor(context, gridX, gridY) {
        this.context = context;

        this.gridX = gridX;
        this.gridY = gridY;
        this.top = gridY * Cell.height;
        this.left = gridX * Cell.width;

        this.alive = false;
    }

    draw() {
        // Draw a simple square
        this.context.fillStyle = this.alive ? '#43a047' : '#303030';
        this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height);
    }
}

class GameWorld {

    static numColumns = 200;
    static numRows = 200;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvasLeft = canvas.offsetLeft + canvas.clientLeft;
        this.canvasTop = canvas.offsetTop + canvas.clientTop;
        this.context = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.createGrid();

        this.canvas.addEventListener('click', function(event) {
            console.log("clicked!")

            var x = event.pageX - game.canvasLeft,
                y = event.pageY - game.canvasTop;

            console.log("x = ", x)
            console.log("y = ", y)

            console.log("event.pageX = ", event.pageX)
            console.log("event.pageY = ", event.pageY)
            console.log("cells amount = ", game.gameObjects.length)


            game.makeCellAliveIfCoordinatesMatches(y, x);

            game.drawAllCells()
        }, false);

        this.checkSurrounding();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAllCells()
    }

    makeCellAliveIfCoordinatesMatches(y, x) {
        for (let i = 0; i < game.gameObjects.length; i++) {
            let cell = game.gameObjects[i];

            if (y > cell.top && y < cell.top + Cell.height &&
                x > cell.left && x < cell.left + Cell.width) {

                cell.alive = !cell.alive;
                console.log('clicked an element');
            }
        }
    }

    createGrid() {
        for (let y = 0; y < GameWorld.numRows; y++) {
            for (let x = 0; x < GameWorld.numColumns; x++) {
                this.gameObjects.push(new Cell(this.context, x, y));
            }
        }
    }

    isAlive(x, y) {
        if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows) {
            return false;
        }

        return this.gameObjects[this.gridToIndex(x, y)].alive ? 1 : 0;
    }

    gridToIndex(x, y) {
        return x + (y * GameWorld.numColumns);
    }

    checkSurrounding() {
        // Loop over all cells
        for (let x = 0; x < GameWorld.numColumns; x++) {
            for (let y = 0; y < GameWorld.numRows; y++) {

                // Count the nearby population
                let numAlive = this.isAlive(x - 1, y - 1) +
                    this.isAlive(x, y - 1) +
                    this.isAlive(x + 1, y - 1) +
                    this.isAlive(x - 1, y) +
                    this.isAlive(x + 1, y) +
                    this.isAlive(x - 1, y + 1) +
                    this.isAlive(x, y + 1) +
                    this.isAlive(x + 1, y + 1);

                let centerIndex = this.gridToIndex(x, y);

                if (numAlive == 2) {
                    // Do nothing
                    this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                } else if (numAlive == 3) {
                    // Make alive
                    this.gameObjects[centerIndex].nextAlive = true;
                } else {
                    // Make dead
                    this.gameObjects[centerIndex].nextAlive = false;
                }
            }
        }

        // Apply the new state to the cells
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
        }
    }

    gameLoop() {
        this.checkSurrounding();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAllCells()

        setTimeout(() => {
            window.requestAnimationFrame(() => this.gameLoop());
        }, 30)
    }

    drawAllCells() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }
    }
}

function onStartClicked() {
    window.requestAnimationFrame(() => game.gameLoop());
}

let game;
window.onload = () => {
    game = new GameWorld('canvas');
}