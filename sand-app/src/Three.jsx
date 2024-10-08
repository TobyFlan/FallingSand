import * as THREE from 'three';
import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);
  const isMouseDown = useRef(false); // Track mouse button state

  useEffect(() => {
    // Setup the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Add antialiasing for smoother visuals

    // Set the size of the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild(renderer.domElement);

    // Create a 2D grid array
    const grid = [];
    const gridSize = 50;
    for (let i = 0; i < gridSize; i++) {
      grid[i] = Array(gridSize).fill(0); // Initialize all to 0
    }
    
    const squareSize = 0.1;
    const materialBlack = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black material
    const materialWhite = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White material

    // Create squares based on the grid array
    const squares = [];
    for (let row = 0; row < grid.length; row++) {
      squares[row] = [];
      for (let col = 0; col < grid[row].length; col++) {
        const value = grid[row][col];
        const geometry = new THREE.PlaneGeometry(squareSize, squareSize);

        // Use black material if value is 0, white otherwise
        const material = value === 0 ? materialBlack : materialWhite;
        const square = new THREE.Mesh(geometry, material);

        // Position the square
        square.position.x = col * squareSize - (grid.length * squareSize) / 2 + squareSize / 2; // Centering the grid
        square.position.y = -(row * squareSize - (grid.length * squareSize) / 2 + squareSize / 2); // Invert the y-axis positioning
        square.position.z = 0;

        scene.add(square);
        squares[row][col] = square;
      }
    }

    // Set camera position
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

      const gridX = Math.floor((gridSize / 2) * (1 + mouseX));
      const gridY = Math.floor((gridSize / 2) * (1 - mouseY));

      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize && grid[gridY][gridX] === 0) {
        grid[gridY][gridX] = 1;
        const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
        const square = new THREE.Mesh(geometry, materialWhite);
        square.position.x = gridX * squareSize - (grid.length * squareSize) / 2 + squareSize / 2;
        square.position.y = -(gridY * squareSize - (grid.length * squareSize) / 2 + squareSize / 2);
        square.position.z = 0;
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
