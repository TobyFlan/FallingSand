import { Container, Graphics } from "pixi.js";
import setupMouseInteractions from "./utils/mouseInteractions";


// todo
// can make more efficient by not drawing black squares

const generateGrid = (gridSizeX, gridSizeY) => {

    return Array.from({ length: gridSizeY }, () => Array(gridSizeX).fill(0));

};


// function to move sand
const moveSand = (container, squares, grid, x, y, newX, newY, squareSize) => {

    let hue = squares[y][x].hue;

    if(squares[y][x]) {
        container.removeChild(squares[y][x]);
        squares[y][x] = null;
    }

    const newSquare = new Graphics();
    newSquare.hue = hue;
    newSquare.beginFill(hue);
    newSquare.drawRect(0, 0, squareSize, squareSize);
    newSquare.endFill();
    newSquare.x = newX * squareSize;
    newSquare.y = newY * squareSize;
    container.addChild(newSquare);
    squares[newY][newX] = newSquare;

}


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
    const squareSize = 5;
    const { gridSizeX, gridSizeY } = getGridSize(app, squareSize);
    container.interactive = true;
    container.hitArea = app.screen;
    

    // initialise grid of 0s of gridSize x gridSize
    let grid = generateGrid(gridSizeX, gridSizeY);

    // render the initial grid
    const squares = [];
    for(let i = 0; i < gridSizeY; i++) {
        squares[i] = [];
        for(let j = 0; j < gridSizeX; j++) {
            squares[i][j] = null; // No square for empty cells

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
                    moveSand(container, squares, grid, x, y, x, y + 1, squareSize);

                }
                else if (grid[y][x] === 1) { 
                    // Check if diagonal left or right is available
                    const canMoveLeft = grid[y + 1][x - 1] === 0 && x - 1 >= 0;
                    const canMoveRight = grid[y + 1][x + 1] === 0 && x + 1 < gridSizeX;
    
                    if (canMoveLeft && canMoveRight) {
                        // Randomly choose to move left or right
                        const moveRight = Math.random() > 0.5; // 50% chance to move right
    
                        if (moveRight) {
                            grid[y][x] = 0;
                            grid[y + 1][x + 1] = 1;
                            
                            moveSand(container, squares, grid, x, y, x + 1, y + 1, squareSize);
                            
                        } else {
                            grid[y][x] = 0;
                            grid[y + 1][x - 1] = 1;
    
                            moveSand(container, squares, grid, x, y, x - 1, y + 1, squareSize);

                        }
                    } else if (canMoveRight) {
                        grid[y][x] = 0;
                        grid[y + 1][x + 1] = 1;

                        moveSand(container, squares, grid, x, y, x + 1, y + 1, squareSize);
                        
                    } else if (canMoveLeft) {
                        grid[y][x] = 0;
                        grid[y + 1][x - 1] = 1;

                        moveSand(container, squares, grid, x, y, x - 1, y + 1, squareSize);
                    }
                }
            }
        }
    };
    

    // render loop
    app.ticker.add(() => {
        updateSand();
    });


}