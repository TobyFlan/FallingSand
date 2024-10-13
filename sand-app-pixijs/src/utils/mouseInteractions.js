
// mouseInteractions.js
import { Graphics } from "pixi.js";

export default function setupMouseInteractions(container, grid, squares, squareSize, gridSizeX, gridSizeY) {
    let isMouseDown = false;
    let intervalId = null;

    // Function to add sand particle at and around the mouse position in a 3x3 grid
    const addSandAtMousePosition = (event) => {
        const mousePosition = event.data.getLocalPosition(container);
        const gridX = Math.floor(mousePosition.x / squareSize);
        const gridY = Math.floor(mousePosition.y / squareSize);

        // Add sand particle at the mouse position if it's empty
        if (gridY >= 0 && gridY < gridSizeY && gridX >= 0 && gridX < gridSizeX && grid[gridY][gridX] === 0) {
            grid[gridY][gridX] = 1;

            // Reuse existing square if available, or create a new one
            if (!squares[gridY][gridX]) {
                // Create a new square for sand
                const newSquare = new Graphics();
                newSquare.beginFill(0xFFD700); // Sand particle color
                newSquare.drawRect(0, 0, squareSize, squareSize);
                newSquare.endFill();
                newSquare.x = gridX * squareSize;
                newSquare.y = gridY * squareSize;
                container.addChild(newSquare);
                squares[gridY][gridX] = newSquare;
            } else {
                // If square already exists, just update its color to sand
                squares[gridY][gridX].clear();
                squares[gridY][gridX].beginFill(0xFFD700); // Sand particle color
                squares[gridY][gridX].drawRect(0, 0, squareSize, squareSize);
                squares[gridY][gridX].endFill();
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
