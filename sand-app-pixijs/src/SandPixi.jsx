import { Container, Graphics } from "pixi.js";
import setupMouseInteractions from "./utils/mouseInteractions";


// todo
// can make more efficient by not drawing black squares

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
    const squareSize = 2;
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
            if (grid[i][j] === 1) {  // Only create a square if there's a sand particle
                const square = new Graphics();
                square.beginFill(0xFFD700); // Sand color
                square.drawRect(0, 0, squareSize, squareSize);
                square.endFill();
                square.x = j * squareSize;
                square.y = i * squareSize;
                container.addChild(square);
                squares[i][j] = square;
            } else {
                squares[i][j] = null; // No square for empty cells
            }
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

                    // Remove the square from the old position
                    if (squares[y][x]) {
                        container.removeChild(squares[y][x]);
                        squares[y][x] = null;
                    }

                    // Create a new square for the new position
                    const newSquare = new Graphics();
                    newSquare.beginFill(0xFFD700); // Sand particle color
                    newSquare.drawRect(0, 0, squareSize, squareSize);
                    newSquare.endFill();
                    newSquare.x = x * squareSize;
                    newSquare.y = (y + 1) * squareSize;
                    container.addChild(newSquare);
                    squares[y + 1][x] = newSquare;

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
    
                            if(squares[y][x]) {
                                container.removeChild(squares[y][x]);
                                squares[y][x] = null;
                            }

                            const newSquare = new Graphics();
                            newSquare.beginFill(0xFFD700); // Sand particle color
                            newSquare.drawRect(0, 0, squareSize, squareSize);
                            newSquare.endFill();
                            newSquare.x = (x + 1) * squareSize;
                            newSquare.y = (y + 1) * squareSize;
                            container.addChild(newSquare);
                            squares[y + 1][x + 1] = newSquare;

                        } else {
                            grid[y][x] = 0;
                            grid[y + 1][x - 1] = 1;
    
                            if(squares[y][x]) {
                                container.removeChild(squares[y][x]);
                                squares[y][x] = null;
                            }
                            const newSquare = new Graphics();
                            newSquare.beginFill(0xFFD700); // Sand particle color
                            newSquare.drawRect(0, 0, squareSize, squareSize);
                            newSquare.endFill();
                            newSquare.x = (x - 1) * squareSize;
                            newSquare.y = (y + 1) * squareSize;
                            container.addChild(newSquare);
                            squares[y + 1][x - 1] = newSquare;

                        }
                    } else if (canMoveRight) {
                        grid[y][x] = 0;
                        grid[y + 1][x + 1] = 1;

                        if(squares[y][x]) {
                            container.removeChild(squares[y][x]);
                            squares[y][x] = null;
                        }

                        const newSquare = new Graphics();
                        newSquare.beginFill(0xFFD700); // Sand particle color
                        newSquare.drawRect(0, 0, squareSize, squareSize);
                        newSquare.endFill();
                        newSquare.x = (x + 1) * squareSize;
                        newSquare.y = (y + 1) * squareSize;
                        container.addChild(newSquare);
                        squares[y + 1][x + 1] = newSquare;
                    } else if (canMoveLeft) {
                        grid[y][x] = 0;
                        grid[y + 1][x - 1] = 1;

                        if(squares[y][x]) {
                            container.removeChild(squares[y][x]);
                            squares[y][x] = null;
                        }
                        const newSquare = new Graphics();
                        newSquare.beginFill(0xFFD700); // Sand particle color
                        newSquare.drawRect(0, 0, squareSize, squareSize);
                        newSquare.endFill();
                        newSquare.x = (x - 1) * squareSize;
                        newSquare.y = (y + 1) * squareSize;
                        container.addChild(newSquare);
                        squares[y + 1][x - 1] = newSquare;
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