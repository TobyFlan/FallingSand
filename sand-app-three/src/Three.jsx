import * as THREE from 'three';
import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  const isMouseDown = useRef(false); // Track mouse button state

  

  useEffect(() => {
    // Setup the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Add antialiasing for smoother visuals

    // Set the size of the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild(renderer.domElement);

    // Create a 2D grid array
    const rect = refContainer.current.getBoundingClientRect();
    const gridSize = 100;
    const squareSize = Math.min(rect.width, rect.height) / gridSize;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    const squares = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    
    
    const materialBlack = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black material
    const materialWhite = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White material
    const PlaneGeometry = new THREE.PlaneGeometry(squareSize, squareSize);

    // Create squares based on the grid array
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const material = materialBlack;
        const square = new THREE.Mesh(PlaneGeometry, material);

        square.position.set(
          colIndex * squareSize - (grid.length * squareSize) / 2 + squareSize / 2,
          -(rowIndex * squareSize - (grid.length * squareSize) / 2 + squareSize / 2),
          0
        );

        scene.add
        squares[rowIndex][colIndex] = square;
      });
    });


    camera.position.z = 5; // Position the camera back to see the grid

    // Variables to manage the animation speed
    let lastUpdateTime = 0;
    const updateInterval = 20; // Update every 20 milliseconds

    // Function to add new white square at mouse position
    const addSquare = (event) => {
      if (!isMouseDown.current) return; // Exit if the mouse is not down
    
      // Calculate mouse position relative to the canvas
      const rect = refContainer.current.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
      // Map mouse coordinates to grid indices
      const gridX = Math.floor((gridSize / 2) * (1 + mouseX)); // Convert mouseX to gridX
      const gridY = Math.floor((gridSize / 2) * (1 - mouseY)); // Convert mouseY to gridY
    
      // Check bounds and add square
      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize && grid[gridY][gridX] === 0) {
        grid[gridY][gridX] = 1;
        const square = new THREE.Mesh(PlaneGeometry, materialWhite);
        square.position.set(
          (gridX - (gridSize / 2)) * squareSize + squareSize / 2,
          -(gridY - (gridSize / 2)) * squareSize + squareSize / 2,
          0
        );
        scene.add(square);
        squares[gridY][gridX] = square; // Update reference
      }
    };

    // Mouse event listeners
    window.addEventListener('mousedown', () => {
      isMouseDown.current = true; // Set mouse button state to down
    });
    window.addEventListener('mouseup', () => {
      isMouseDown.current = false; // Set mouse button state to up
    });
    window.addEventListener('mousemove', addSquare); // Call addSquare only if mouse is down

    const animate = (time) => {
      requestAnimationFrame(animate);

      // Only update if the specified interval has passed
      if (time - lastUpdateTime > updateInterval) {
        lastUpdateTime = time;

        // Iterate through each cell of the grid from bottom to top, and update its position if possible
        for (let row = grid.length - 2; row >= 0; row--) { // Start from the second-to-last row
          for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 1 && grid[row + 1][col] === 0) { // If the square can move down
              // Swap the squares in the grid
              grid[row][col] = 0;
              grid[row + 1][col] = 1;

              // Move the square in the scene
              
              const square = squares[row][col];
              squares[row][col] = null; // Clear old reference
              squares[row + 1][col] = square; // Update reference
              square.position.y -= squareSize; // Move the square down
            }
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    

    // Cleanup on component unmount
    return () => {
      // Remove event listeners
      window.removeEventListener('mousedown', () => isMouseDown.current = true);
      window.removeEventListener('mouseup', () => isMouseDown.current = false);
      window.removeEventListener('mousemove', addSquare);
      
      // Remove the renderer from the DOM
      refContainer.current.removeChild(renderer.domElement);
      renderer.dispose(); // Dispose the renderer to free up resources
    };
  }, []);

  return <div ref={refContainer}></div>;
}

export default MyThree;
