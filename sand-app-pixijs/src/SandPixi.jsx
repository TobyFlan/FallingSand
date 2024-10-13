import { Container, Graphics } from "pixi.js";
import setupMouseInteractions from "./utils/mouseInteractions";

const generateGrid = (gridSizeX, gridSizeY) => {

    let grid = Array.from({ length: gridSizeY }, () => Array(gridSizeX).fill(0));

    // add some sand particles in random locations
    for (let i = 0; i < gridSizeX * gridSizeY * 0.01; i++) {
        const x = Math.floor(Math.random() * gridSizeX);
        const y = Math.floor(Math.random() * gridSizeY);
        grid[y][x] = 1;
    }

    return grid;

};

// function to dynamically calculate the grid size based on the app view size
const getGridSize = (app, squareSize) => {

    // need to add these offsets to make sure the grid covers the entire app view
    const gridSizeX = Math.floor((app.view.width + 80) / squareSize);
    const gridSizeY = Math.floor((app.view.height + 60) / squareSize);

    return { gridSizeX, gridSizeY };

};

// Main function
export default function run(app) {
    const container = new Container();
    app.stage.addChild(container);
    const squareSize = 10;
    const { gridSizeX, gridSizeY } = getGridSize(app, squareSize);
    

    // initialise grid of 0s of gridSize x gridSize
    let grid = generateGrid(gridSizeX, gridSizeY);

    // render the initial grid
    const squares = [];
    for(let i = 0; i < gridSizeY; i++) {
        squares[i] = [];
        for(let j = 0; j < gridSizeX; j++) {
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

    // Add mouse interactions
    setupMouseInteractions(container, grid, squares, squareSize, gridSizeX, gridSizeY);

    // simple falling sand logic
    const updateSand = () => {
        // start from bottom and go upwards
        for (let y = gridSizeY - 2; y >= 0; y--) { // Avoid bottom row
            for (let x = 0; x < gridSizeX; x++) {
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
                else if (grid[y][x] === 1 && grid[y+1][x+1] === 0){ // if theres sand and empty space diagonally below
                    grid[y][x] = 0;
                    grid[y+1][x+1] = 1;

                    squares[y][x].clear();
                    squares[y][x].beginFill(0x000000); // Empty space
                    squares[y][x].drawRect(0, 0, squareSize, squareSize);
                    squares[y][x].endFill();

                    squares[y + 1][x + 1].clear();
                    squares[y + 1][x + 1].beginFill(0xFFD700); // Sand particle
                    squares[y + 1][x + 1].drawRect(0, 0, squareSize, squareSize);
                    squares[y + 1][x + 1].endFill();
                }
                else if (grid[y][x] === 1 && grid[y+1][x-1] === 0){ // if theres sand and empty space diagonally below
                    grid[y][x] = 0;
                    grid[y+1][x-1] = 1;

                    squares[y][x].clear();
                    squares[y][x].beginFill(0x000000); // Empty space
                    squares[y][x].drawRect(0, 0, squareSize, squareSize);
                    squares[y][x].endFill();

                    squares[y + 1][x - 1].clear();
                    squares[y + 1][x - 1].beginFill(0xFFD700); // Sand particle
                    squares[y + 1][x - 1].drawRect(0, 0, squareSize, squareSize);
                    squares[y + 1][x - 1].endFill();
                }
            }
        }
    }
    

    // render loop
    app.ticker.add(() => {
        updateSand();
    });


}