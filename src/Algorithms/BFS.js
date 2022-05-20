import { UNVISITED, START, TARGET, VISITED, POINTS, PATH } from '../Components/Visualizations.jsx';

let pathLength = 0;

/**
 * This function visualizes BFS algorithm on the graph.
 * @param graph The graph
 * @param startVertex The starting vertex or source vertex
 * @returns The path length and the animation of the algorithm
 */
export default function bfs(graph, startVertex) {
  const tempGraph = JSON.parse(JSON.stringify(graph));
  let animation = [];
  pathLength = 0;

  bfsImplementation(tempGraph, startVertex, animation);

  return { pathLength: pathLength, animation: animation };
}

/**
 * This function is the implementation of BFS algorithm.
 * @param graph The graph
 * @param startVertex The starting vertex or source vertex
 * @param animation The animation of the BFS algorithm
 */
function bfsImplementation(graph, startVertex, animation) {
  var algoRunning = true, currentVertex = 0, points = [];

  points.push(startVertex);

  while (algoRunning) {
    if (points.length === 0) {
      algoRunning = false;
    } else { // points is not empty
      currentVertex = points.shift(); // remove and return the first element of points inside currentVertex
      const currentNeighbor = graph[currentVertex.height][currentVertex.width];
      if (currentNeighbor.status === TARGET)
        algoRunning = false;
      else {
        if (currentNeighbor.status !== START) {
          currentNeighbor.status = VISITED;
          animation.push([VISITED, currentNeighbor]);
        }
        // check unvisited neighbors in 4 directions
        // Upwards
        if (algoRunning && currentVertex.height + 1 < graph.length) {
          algoRunning = checkNeighbors(currentVertex, currentVertex.height + 1, currentVertex.width, graph, points);
        }
        // Downwards
        if (algoRunning && currentVertex.height > 0) {
          algoRunning = checkNeighbors(currentVertex, currentVertex.height - 1, currentVertex.width, graph, points);
        }
        // Left
        if (algoRunning && currentVertex.width > 0) {
          algoRunning = checkNeighbors(currentVertex, currentVertex.height, currentVertex.width - 1, graph, points);
        }
        // Right
        if (algoRunning && currentVertex.width + 1 < graph[0].length) {
          algoRunning = checkNeighbors(currentVertex, currentVertex.height, currentVertex.width + 1, graph, points);
        }
        if (!algoRunning) { //show path when target found
          showBFSPath(graph, currentVertex, animation);
        }
      }
    }
  }
}

/**
 * This function checks all neighboring vertices.
 * @param currentVertex The current vertex that is being visited
 * @param height The height of the current vertex in the graph
 * @param width The width of the current vertex in the graph
 * @param graph The graph
 * @param points The point from the starting vertex
 * @returns {boolean} Whether the neighbor is unvisited or is the target vertex.
 */
function checkNeighbors(currentVertex, height, width, graph, points) {
  const neighbor = graph[height][width];

  if (neighbor.status === TARGET) {
    return false;
  } else if (neighbor.status === UNVISITED) {
    // add it to points
    neighbor.status = POINTS;
    neighbor.parent = [currentVertex.height, currentVertex.width];
    points.push(neighbor);
  }
  return true;
}

/**
 * This functions shows the animated path of BFS algorithm.
 * @param graph The graph
 * @param vertex The information from Vertex.jsx of the shortest path vertex or vertices
 * @param animation The animation of BFS path
 */
function showBFSPath(graph, vertex, animation) {
  let temp = [];
  while (vertex.status !== START) {
    temp.push([PATH, graph[vertex.height][vertex.width]]);
    vertex = graph[vertex.parent[0]][vertex.parent[1]];
  }
  pathLength = temp.length; //path = edge count not vertex count

  for (var i = temp.length - 1; i >= 0; i--) {
    animation.push(temp[i]);
  }
}