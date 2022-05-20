import { UNVISITED, START, TARGET, VISITED, POINTS, PATH } from '../Components/Visualizations.jsx';

let pathLength = 0;

/**
 * This function visualizes Dijkstra's algorithm on the graph.
 * @param graph The graph
 * @param startVertex The starting vertex or source vertex
 * @returns The path length and the animation of the algorithm
 */
export default function dijkstra(graph, startVertex) {
    const tempGraph = JSON.parse(JSON.stringify(graph));
    let animation = [];
    pathLength = 0;

    dijkstraImplementation(tempGraph, startVertex, animation);

    return { pathLength: pathLength, animation: animation };
}

/**
 * This function is the implementation of Dijkstra's algorithm.
 * @param graph The graph
 * @param startVertex The starting vertex or source vertex
 * @param animation The animation of the dijkstra algorithm
 */
function dijkstraImplementation(graph, startVertex, animation) {
    var algoRunning = true, currentVertex = 0, points = [];
    points.push(startVertex);

    while (algoRunning) {
        if (points.length === 0) {
            algoRunning = false;
        } else { // points is not empty dont go into the loop at all LMFAO. parent keeps track of the path between the vertex and the adj vertex which is the parent
            var parent = 0;
            for (var to = 0; to < points.length; to++) {
                if (points[to].distance > points[parent].distance) {
                    parent = to;
                }
            }
            currentVertex = points[parent];
            points.splice(parent, 1); //removes parent at index 1.
            const currentNeighbor = graph[currentVertex.height][currentVertex.width];
            if (currentNeighbor.status === TARGET) { // when target is found
                algoRunning = false;
            } else {
                // paint current VISITED
                if (currentNeighbor.status !== START) {
                    currentNeighbor.status = VISITED;
                    animation.push([VISITED, currentNeighbor]);
                }
                // check unvisited neighbors in 4 directions
                // Upwards
                if (algoRunning && currentVertex.height > 0) {
                    algoRunning = checkNeighbors(currentVertex, currentVertex.height - 1, currentVertex.width, graph, points);
                }
                // Downwards
                if (algoRunning && currentVertex.height + 1 < graph.length) {
                    algoRunning = checkNeighbors(currentVertex, currentVertex.height + 1, currentVertex.width, graph, points);
                }
                // Left
                if (algoRunning && currentVertex.width > 0) {
                    algoRunning = checkNeighbors(currentVertex, currentVertex.height, currentVertex.width - 1, graph, points);
                }
                // Right
                if (algoRunning && currentVertex.width + 1 < graph[0].length) {
                    algoRunning = checkNeighbors(currentVertex, currentVertex.height, currentVertex.width + 1, graph, points);
                }
                if(!algoRunning) {
                    showShortestPath(graph, currentVertex, animation);
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
        neighbor.distance = currentVertex.distance + 1;
        points.push(neighbor);
    }
    return true;
}

/**
 * This functions shows the animated shortest path of dijkstra's algorithm.
 * @param graph The graph
 * @param vertex The information from Vertex.jsx of the shortest path vertex or vertices
 * @param animation The animation of dijkstra's shortest path
 */
function showShortestPath(graph, vertex, animation) {
    let temp = [];
    while (vertex.status !== START) {
        temp.push([PATH, graph[vertex.height][vertex.width]]);
        vertex = graph[vertex.parent[0]][vertex.parent[1]];
    }
    pathLength = temp.length;
    //show the animation distance from start vertex to target vertex
    for (var i = temp.length - 1; i >= 0; i--) {
        animation.push(temp[i]);
    }
}