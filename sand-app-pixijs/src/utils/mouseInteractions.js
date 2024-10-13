
// mouseInteractions.js
import { Graphics } from "pixi.js";
import hueRandomizer from "./hueRandomizer";

export default function setupMouseInteractions(container, grid, squares, squareSize, gridSizeX, gridSizeY) {
    let isMouseDown = false;
    let intervalId = null;
    const getNextColor = hueRandomizer();

    // Function to add sand particle at and around the mouse position in a 3x3 grid
    const addSandAtMousePosition = (event) => {
        const mousePosition = event.data.getLocalPosition(container);
        const gridX = Math.floor(mousePosition.x / squareSize);
        const gridY = Math.floor(mousePosition.y / squareSize);

        // Add sand particle at the mouse position if it's empty
        // if (gridY >= 0 && gridY < gridSizeY && gridX >= 0 && gridX < gridSizeX && grid[gridY][gridX] === 0) {
        //     grid[gridY][gridX] = 1;

        //     // Reuse existing square if available, or create a new one
        //     if (!squares[gridY][gridX]) {
        //         // Create a new square for sand
        //         const hue = getNextColor();
        //         const newSquare = new Graphics();
        //         newSquare.hue = hue; // Sand particle color
        //         newSquare.beginFill(newSquare.hue); 
        //         newSquare.drawRect(0, 0, squareSize, squareSize);
        //         newSquare.endFill();
        //         newSquare.x = gridX * squareSize;
        //         newSquare.y = gridY * squareSize;
        //         container.addChild(newSquare);
        //         squares[gridY][gridX] = newSquare;
        //     } else {
        //         // If square already exists, just update its color to sand
        //         squares[gridY][gridX].clear();
        //         squares[gridY][gridX].beginFill(0xFFD700); // Sand particle color
        //         squares[gridY][gridX].drawRect(0, 0, squareSize, squareSize);
        //         squares[gridY][gridX].endFill();
        //     }
        // }

        // Add sand particles around the mouse position in a 3x3 grid
        const hue = getNextColor();
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const x = gridX + i;
                const y = gridY + j;
                if (y >= 0 && y < gridSizeY && x >= 0 && x < gridSizeX && grid[y][x] === 0) {
                    grid[y][x] = 1;

                    // Reuse existing square if available, or create a new one
                    if (!squares[y][x]) {
                        // Create a new square for sand
                        
                        const newSquare = new Graphics();
                        newSquare.hue = hue; // Sand particle color
                        newSquare.beginFill(newSquare.hue);
                        newSquare.drawRect(0, 0, squareSize, squareSize);
                        newSquare.endFill();
                        newSquare.x = x * squareSize;
                        newSquare.y = y * squareSize;
                        container.addChild(newSquare);
                        squares[y][x] = newSquare;
                    } else {
                        // If square already exists, just update its color to sand
                        squares[y][x].clear();
                        squares[y][x].beginFill(0xFFD700); // Sand particle color
                        squares[y][x].drawRect(0, 0, squareSize, squareSize);
                        squares[y][x].endFill();
                    }
                }
            }
        }
    };

    // Functions to add / stop adding sand at mouse pos continually 
    const startAddingSand = (event) => {
        addSandAtMousePosition(event);
        intervalId = setInterval(() => {
            addSandAtMousePosition(event);
        }, 50);
    };
    const stopAddingSand = () => {
        clearInterval(intervalId);
        intervalId = null;
    };


    // Add event listeners for mouse interaction


    // Mouse down event - start dragging
    container.on('pointerdown', (event) => {
        isMouseDown = true;
        startAddingSand(event);  // Add sand at the initial click position
    });

    // Mouse move event - keep adding sand while dragging
    container.on('pointermove', (event) => {
        if (isMouseDown) {
            addSandAtMousePosition(event);  // Continuously add sand as the mouse moves
        }
    });

    // Mouse up event - stop dragging
    container.on('pointerup', () => {
        isMouseDown = false;
        stopAddingSand();
    });

    // Mouse leaves the canvas - stop dragging
    container.on('pointerupoutside', () => {
        isMouseDown = false;
        stopAddingSand(); 
    });
}
