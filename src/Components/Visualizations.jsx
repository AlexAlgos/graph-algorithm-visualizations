import React, { useState, useEffect} from 'react';

import vertex from './Vertex.jsx';
import '../StyleSheets/Visualizations.css';

import aStarSearch from '../Algorithms/aStarSearch.js';
import bfs from '../Algorithms/BFS.js';
import dfs from '../Algorithms/DFS.js';
import dijkstra from '../Algorithms/Dijkstra.js';

export const WALL = "wall";
export const UNVISITED = "unvisited";
export const START = "start";
export const TARGET = "target";
export const VISITED = "visit";
export const POINTS = "points";
export const PATH = "path";

export const BFS = "BFS";
export const DFS = "DFS";
export const A_STAR_SEARCH = "A* Search";
export const DIJKSTRA = "Dijkstra";

const VERTEX_SIZE = 30;

export default function Visualizations() {
  const [grid, setGrid] = useState([]);
  const [algorithm, setAlgorithm] = useState("");
  const [vertexSize, setVertexSize] = useState(VERTEX_SIZE);
  const [startPoint, setStartPoint] = useState({ height: 1, width: 1 });
  const [targetPoint, setTargetPoint] = useState({ height: 1, width: 2 });
  const [isAlgorithmRun, setAlgorithmRun] = useState(false);
  const [animations, setAnimations] = useState([]);
  const [visitedVertexCounter, setVisitedVertexCounter] = useState(0);
  const [pathVertexCounter, setPathVertexCounter] = useState(0);
  const [isShowPath, setShowPath] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isClearBoard, setClearBoard] = useState(true);
  const [speed, setSpeed] = useState(6);
  const [previousStartingVertexStatus, setPreviousStartingVertexStatus] = useState(UNVISITED);
  const [previousTargetVertexStatus, setPreviousTargetVertexStatus] = useState(UNVISITED);
  const [isMousePressed, setMousePressed] = useState(false);
  const [isStartingVertexPressed, setStartingVertexPressed] = useState(false);
  const [isTargetVertexPressed, setTargetVertexPressed] = useState(false);
  const ANIMATION_SPEED = Math.ceil(10 / speed);

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.addEventListener("resize", updateWindowDimensions);
    };
  }, [grid]);

  /**
   * This function sets up the grid/graph.
   * @param vertexSize The size of the vertex.
   * @param isClearBoard The status of the grid depending on if it's cleared with no visited walls or not.
  */
  const setUpGrid = (vertexSize, isClearBoard) => {
    let i, j;
    let height = Math.floor((window.innerHeight - 160) / vertexSize);
    let width = Math.floor((window.innerWidth - 50) / vertexSize);

    clearAll();

    let id = 0;
    for (i = 0; i < height; i++) {
      grid[i] = [];
      for (j = 0; j < width; j++) {
        grid[i][j] = new vertex(++id, i, j, UNVISITED);
      }
    }

    // Setting up the default graph or graph with random spaces/wall visited/unvisited depending on the board status.
    if (!isClearBoard) {
      for (i = 1; i < height - 1; i++) {
        for (j = 1; j < width - 1; j++) {
          if (i % 2 === 0) {
            // spawning random walls (visited spaces)
            if (Math.random() * 100 < 35) grid[i][j].status = WALL;
          } else {
            // spawning random unvisited spaces
            if (Math.random() * 100 < 25) grid[i][j].status = WALL;
          }
        }
      }
      let xStart = Math.floor(Math.random() * (height - 1) + 1);
      let yStart = Math.floor(Math.random() * (width - 1) + 1);
      let xEnd = Math.floor(Math.random() * (height - 1) + 1);
      let yEnd = Math.floor(Math.random() * (width - 1) + 1);
      grid[xStart][yStart].status = START;
      grid[xEnd][yEnd].status = TARGET;
      setStartPoint(grid[xStart][yStart]);
      setTargetPoint(grid[xEnd][yEnd]);
      setClearBoard(false);
    } else {
      grid[5][5].status = START;
      grid[height - 5][width - 5].status = TARGET;
      setStartPoint(grid[5][5]);
      setTargetPoint(grid[height - 5][width - 5]);
      setClearBoard(true);
    }
    setGrid(grid);
  }

  /**
   * The function update the dimensions according to the size of the user's window.
   */
  const updateWindowDimensions = () => {
    setWidth(width);
    setHeight(height);
    if (!isAlgorithmRun) {
      setUpGrid(vertexSize, isClearBoard);
      setVertexSize(vertexSize); //just added to see what happens. can be remove if things messes up
    }
  }

  /**
   * The function clears everything off the grid to it's default state.
   */
  const clearAll = () => {
    for (let i = 0; i < animations.length; i++) {
      const vertex = animations[i][1];

      if (grid[vertex.height][vertex.width].status === UNVISITED) {
        document.getElementById(`${vertex.height}-${vertex.width}`).className =
          "unvisited-vertex";
      }
      if (grid[vertex.height][vertex.width].status === WALL) {
        document.getElementById(`${vertex.height}-${vertex.width}`).className =
          "wall-vertex";
      }
      grid[vertex.height][vertex.width].h = 0;
      grid[vertex.height][vertex.width].g = 0;
      grid[vertex.height][vertex.width].distance = Infinity;
    }
    setGrid(grid);
    setAnimations([]);
    setPathVertexCounter(0);
    setVisitedVertexCounter(0);
    setShowPath(false);
  }

  /**
   * The function runs the following algorithm option selected by the user.
   * @param grid - The graph where the algorithm will display it's actions.
   * @param algorithm - The algorithm that is selected upon the user's preferences.
   * @param startPoint - The starting vertex.
   * @param targetPoint - The targeted vertex.
   * @param withAnimations - The resulting animation of the algorithm displayed on the graph.
   */
  const runAlgorithm = (grid, algorithm, startPoint, targetPoint, withAnimations) => {
    if (algorithm === "") {
      return;
    }

    let changeAlgo = algorithm === BFS ? bfs : algorithm === DFS ? dfs : algorithm === A_STAR_SEARCH ? aStarSearch : algorithm === DIJKSTRA ? dijkstra : null;
    if (!changeAlgo) {
      return;
    }

    clearAll();
    var result = changeAlgo(grid, startPoint, targetPoint);

    setAnimations(result.animation);
    setAlgorithmRun(true);
    setPathVertexCounter(result.pathLength);
    setVisitedVertexCounter(result.animation.length - result.pathLength);
    setShowPath(true);

    if (withAnimations) {
      runAnimation(JSON.parse(JSON.stringify(result.animation)));
    } else {
      changePath(result.animation);
    }
  }

  /**
   * This function reveals the animation of the algorithm then shows the user by changing each of the individual spaces in the graph with in respects 
   * to the colors of the path between the starting vertex to target vertex. And adjust the animation speed based on user's selected speed preferences.
   * @param animations The animation of the selected algorithm.
   */
  const runAnimation = (animations) => {
    if (!animations.length) {
      setTimeout(() => {
        setAlgorithmRun(false);
      }, 100);
      return;
    }
    setTimeout(() => {
      var vertex = animations[0][1];

      if (animations[0][0] === PATH) {
        document.getElementById(`${vertex.height}-${vertex.width}`).className =
          "path-vertex";
      } else {
        document.getElementById(`${vertex.height}-${vertex.width}`).className =
          "visit-vertex";
      }
      animations.shift();
      runAnimation(animations);
    }, speed);
  }

  /**
   * This function shows the result of the algorithm's shortest path by changing the graph color with in respects to it's specified color.
   * @param animations The resulting path of the selected algorithm.
   */
  const changePath = (animations) => {
    for (let i = 0; i < animations.length; i++) {
      var vertex = animations[i][1];
      if (animations[i][0] === PATH) {
        document.getElementById(`${vertex.height}-${vertex.width}`).className =
          "path-vertex";
      } else {
        document.getElementById(`${vertex.height}-${vertex.width}`).className =
          "visit-vertex2";
      }
    }
    setAlgorithmRun(false);
  }

  /**
   * This function let's user pick their graph options based on their preferences whether they would like the default graph setup or
   * a randomly generated maze based on setUpGrid function and change the status of the graph in respect to user's preferences.
   * @param status The status of the graph whether cleared or not.
   */
  const changeBoard = (status) => {
    setClearBoard(status);
    setUpGrid(vertexSize, status);
    setVertexSize(vertexSize, status);
  }

  /**
   * This function is for user's to be able to move the vertex to a location and the graph updates itself based on the user's choices.
   * @param rowIdx The row index location of where the vertex is at.
   * @param vertexIdx The vertex index location.
   */
  const onMouseDown = (rowIdx, vertexIdx) => {
    var vertex = grid[rowIdx][vertexIdx];

    grid[rowIdx][vertexIdx].status =
      vertex.status === WALL ? UNVISITED : vertex.status === UNVISITED ? WALL : vertex.status;

    if (grid[rowIdx][vertexIdx].status === START) {
      setStartingVertexPressed(true);
    }
    if (grid[rowIdx][vertexIdx].status === TARGET) {
      setTargetVertexPressed(true);
    }
    setGrid(grid);
    setMousePressed(true);
  }

  /**
   * This function is for user's to be able to move both starting and target vertices to a location on the graph 
   * and check the status of the space that is located at and updates itself based on the user's choices. Also, the running animation
   * of the algorithm chosen by the user is also updated on the graph.
   * @param rowIdx The row index location of where the vertex is at.
   * @param vertexIdx The vertex index location.
   */
  const onMouseEnter = (rowIdx, vertexIdx) => {
    if (!isMousePressed) {
      return;
    }
    
    if (!isStartingVertexPressed && !isTargetVertexPressed) {
      var vertex = grid[rowIdx][vertexIdx];
      grid[rowIdx][vertexIdx].status =
        vertex.status === WALL ? UNVISITED : vertex.status === UNVISITED ? WALL : vertex.status;
    }

    if (isStartingVertexPressed && grid[rowIdx][vertexIdx].status !== TARGET) {
      let startingVertex = startPoint;
      let prevStartingVertexStatus = previousStartingVertexStatus;
      prevStartingVertexStatus = grid[rowIdx][vertexIdx].status;
      grid[startingVertex.height][startingVertex.width].status = prevStartingVertexStatus;
      grid[rowIdx][vertexIdx].status = START;
      setStartPoint(grid[rowIdx][vertexIdx]);
      setPreviousStartingVertexStatus(prevStartingVertexStatus);
      if (isShowPath) {
        runAlgorithm(grid, algorithm, grid[rowIdx][vertexIdx], targetPoint, false);
      }
    }

    if (isTargetVertexPressed && grid[rowIdx][vertexIdx].status !== START) {
      let targetVertex = targetPoint;
      let prevTargetVertexStatus = previousTargetVertexStatus;
      prevTargetVertexStatus = grid[rowIdx][vertexIdx].status;
      grid[targetVertex.height][targetVertex.width].status = previousTargetVertexStatus;
      grid[rowIdx][vertexIdx].status = TARGET;
      setTargetPoint(grid[rowIdx][vertexIdx]);
      setPreviousTargetVertexStatus(prevTargetVertexStatus);
      if (isShowPath) {
        runAlgorithm(grid, algorithm, startPoint, grid[rowIdx][vertexIdx], false);
      }
    }
    setGrid(grid);
  }

  /**
   * This function checks either starting or target vertices has been pressed and moved on the graph.
   */
  const onMouseUp = () => {
    if (isStartingVertexPressed) {
      setMousePressed(false);
      setStartingVertexPressed(false);
    } else if (isTargetVertexPressed) {
      setMousePressed(false);
      setTargetVertexPressed(false);
    } else {
      setMousePressed(false);
    }
  }

  /**
   * This function allow user's to adjust the speed of how fast or slow they would like to see the algorithm animations.
   * @param e The event object passed to the handler. 
   */
  const changeAnimationSpeed = (e) => { setSpeed(Math.ceil(10 / Number(e.target.value))); }

  return (
    <div>
      <div className="top-navbar">
        <h1>Graph Algorithm Visualizations</h1>
        <button
          className="buttons"
          onClick={
            !isAlgorithmRun
              ? () => setAlgorithm(BFS)
              : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          Breadth-first Search (BFS)
        </button>
        <button
          className="buttons"
          onClick={
            !isAlgorithmRun
              ? () => setAlgorithm(DFS)
              : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          Depth-first Search (DFS)
        </button>
        <button
          className="buttons"
          onClick={
            !isAlgorithmRun
              ? () => setAlgorithm(DIJKSTRA)
              : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          Dijkstra
        </button>
        <button
          className="buttons"
          onClick={
            !isAlgorithmRun
              ? () => setAlgorithm(A_STAR_SEARCH)
              : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          A* Search
        </button>

        <button
          className="buttons"
          onClick={
            !isAlgorithmRun ? () => changeBoard(false) : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          Generate Maze
        </button>
        <button
          className="buttons"
          onClick={
            !isAlgorithmRun ? () => changeBoard(true) : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          Clear Board
        </button>

        <button
          className="buttons"
          onClick={
            !isAlgorithmRun
              ? () => runAlgorithm(grid, algorithm, startPoint, targetPoint, true)
              : null
          }
          style={isAlgorithmRun ? { cursor: "not-allowed" } : null}
          type="button"
        >
          {!isAlgorithmRun ? `Run ${algorithm}` : `Running ${algorithm}`}
        </button>

        <div className="animation-speed">
          <label htmlFor="speed">Animation Speed</label>
          <input type="range" id="speed" name="speed" onChange={changeAnimationSpeed} min="1" max="3" value={ANIMATION_SPEED} disabled={isAlgorithmRun}></input>
        </div>

        <div className="algo-info" >
          {algorithm === ""
            ? "Choose an Algorithm:"
            : "Chosen Algorithm: " + algorithm}
          <div>
            <p
              className="algo-info-font"
              style={{ display: isShowPath ? "block" : "none" }}
            >
              Visited {visitedVertexCounter} Vertices. Path length{" "}
              {pathVertexCounter}.
            </p>
          </div>
        </div>
      </div>

      <div className="graph">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((vertex, vertexIdx) => {
                return (
                  <div
                    id={`${rowIdx}-${vertexIdx}`}
                    key={vertexIdx}
                    className={
                      vertex.status === UNVISITED
                        ? "unvisited-vertex"
                        : vertex.status === WALL
                          ? "wall-vertex"
                          : vertex.status === VISITED
                            ? "visit-vertex"
                            : vertex.status === PATH
                              ? "path-vertex"
                              : vertex.status === START
                                ? "start-vertex"
                                : vertex.status === TARGET
                                  ? "target-vertex"
                                  : "unvisited-vertex"
                    }
                    style={{
                      height: `${vertexSize - 2.5}px`,
                      width: `${vertexSize}px`,
                    }}
                    onMouseDown={
                      !isAlgorithmRun
                        ? () => onMouseDown(rowIdx, vertexIdx) : null
                    }
                    onMouseEnter={
                      !isAlgorithmRun
                        ? () => onMouseEnter(rowIdx, vertexIdx) : null
                    }
                    onMouseUp={
                      !isAlgorithmRun ? () => onMouseUp() : null
                    }
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}