import React, { useCallback } from "react";

import '../StyleSheets/Instructions.css';

import algoOptions from '../Images/graph-algo-options.png';
import wall from '../Images/add-a-wall.gif';
import walls from '../Images/add-multiple-walls.gif';
import draggingVertex from '../Images/immediate-path-change.gif';
import moreOptions from '../Images/more-features.png';

export default function Instructions() {
    /**
     * This function closes the instructions on the screen. 
     */
    const closeButton = useCallback(
        () => {
            document.getElementById("entire-web-screen").style.display = "none";
        },
        [],
    );

    return (
        <div id="entire-web-screen">
            <div className="instruction-screen">
                <h1>Welcome to Graph Algorithm Visualizations!</h1>
                <h2>If you want to start visualizing immediately, you can press the "X" button in the upper right corner.</h2>
                <h2>1. Select an algorithm to visualize by pressing on any of the four graph algorithm options on the navigation bar.</h2>
                <img id="instruction-images" alt="graph algorithm options" src={algoOptions}></img>
                <h2>2. Add walls on the Graph</h2>
                <h3>Click on any empty cell on the graph to add a wall. Click and hold on any cell on the graph then drag the cursor around to draw multiple walls faster.</h3>
                <img id="instruction-images" alt="graph algorithm options" src={wall}></img>
                <img id="instruction-images" alt="graph algorithm options" src={walls}></img>
                <h2>3. Drag the Vertices</h2>
                <h3>Click and drag the start, and target vertices to move them around and click on any of the blank vertices location for placement.</h3>
                <h3>Note: You can drag the vertices after an algorithm finishes running. This will show you the different paths immediately.</h3>
                <img id="instruction-images" alt="graph algorithm options" src={draggingVertex}></img>
                <h2>4. Use the navigation bar buttons to run the algorithms and more!</h2>
                <h3>You can click on "Generate Maze" to populate random mazes as many times as you like, clear the entire board, adjust the animation speed,
                    run the chosen algorithm, and see how many vertices visited and the path length of the running algorithm all from the navigation bar.</h3>
                <img id="instruction-images" alt="graph algorithm options" src={moreOptions}></img>
                <h1>Have fun!</h1>
                <h2>I hope you enjoy spending time learning about the different graph algorithms through the visualizations!</h2>
                <button className="close-button" onClick={closeButton}>X</button>
            </div>
        </div>
    );
}