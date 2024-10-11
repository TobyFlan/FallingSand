import { Container, Graphics } from "pixi.js";

const generateGrid = (gridSize) => {

    let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    // add some sand particles
    grid[10][6] = 1;
    grid[5][5] = 1;
    grid[44][32] = 1;

    return grid;

};

// Main function
export default function run(app) {
    const container = new Container();
    app.stage.addChild(container);

    const gridSize = 50;
    const squareSize = 10;

    // initialise grid of 0s of gridSize x gridSize
    let grid = generateGrid(gridSize);

    // render the initial grid
    const squares = [];
    for(let i = 0; i < gridSize; i++) {
        squares[i] = [];
        for(let j = 0; j < gridSize; j++) {
            const square = new Graphics();
            square.beginFill(grid[i][j] === 0 ? 0x000000 : 0xFFD700);
            square.drawRect(0, 0, squareSize, squareSize);
            square.endFill();
            square.x = j * squareSize;
            square.y = i * squareSize;
            container.addChild(square);
            squares[i][j] = square;
        }
    }

    // simple falling sand logic
    const updateSand = () => {
        // start from bottom and go upwards
        for (let y = gridSize - 2; y >= 0; y--) { // Avoid bottom row
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] === 1 && grid[y + 1][x] === 0) { // If there's sand and empty space below
                    // Move sand down
                    grid[y][x] = 0;
                    grid[y + 1][x] = 1;
                    
                    // Update the visuals
                    squares[y][x].clear();
                    squares[y][x].beginFill(0x000000); // Empty space
                    squares[y][x].drawRect(0, 0, squareSize, squareSize);
                    squares[y][x].endFill();

                    squares[y + 1][x].clear();
                    squares[y + 1][x].beginFill(0xFFD700); // Sand particle
                    squares[y + 1][x].drawRect(0, 0, squareSize, squareSize);
                    squares[y + 1][x].endFill();
                }
            }
        }
    }

    // render loop
    app.ticker.add(() => {
        updateSand();
    });


}