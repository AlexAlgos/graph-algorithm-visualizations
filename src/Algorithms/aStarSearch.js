import { START, TARGET, VISITED, PATH, WALL } from '../Components/Visualizations.jsx';

let pathLength = 0;

/**
 * This function visualizes A* Search algorithm on the graph.
 * @param graph The graph
 * @param startVertex The starting vertex or source vertex
 * @param targetVertex The target vertex
 * @returns The path length and the animation of the algorithm
 */
export default function aStar(graph, startVertex, targetVertex) {
    const tempGraph = JSON.parse(JSON.stringify(graph));
    let animation = [];
    pathLength = 0;

    aStarImplementation(tempGraph, startVertex, targetVertex, animation);

    return { pathLength: pathLength, animation: animation }
}

/**
 * This function is the implementation of A* Search algorithm.
 * @param graph The graph
 * @param startVertex The starting vertex or source vertex
 * @param targetVertex The target vertex
 * @param animation The animation of the A* Search algorithm
 * @returns Empty list if open list is empty
 */
function aStarImplementation(graph, startVertex, targetVertex, animation) {
    var openList = [], currentVertex = 0;
    openList.push(startVertex);

    while (openList.length > 0) {
        var idx = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f <= openList[idx].f) {
                idx = i;
            }
        }
        currentVertex = openList[idx];
        openList.splice(idx, 1);
        const currentNeighbor = graph[currentVertex.height][currentVertex.width];

        if (currentNeighbor.status === TARGET) {
            return showShortestPath(graph, currentVertex.parent, animation);
        }

        if (currentNeighbor.status !== START) {
            currentNeighbor.status = VISITED;
            animation.push([VISITED, currentNeighbor]);
        }

        var neighbors = getNeighbors(graph, currentVertex);

        for (let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (neighbor.status === VISITED || neighbor.status === WALL) {
                continue;
            }

            var gScore = currentVertex.g + 1;
            var gScoreIsBest = false;

            if (!openList.includes(neighbor)) {
                gScoreIsBest = true;
                neighbor.g = gScore
                neighbor.h = manhattanDistance(neighbor.width, neighbor.height, targetVertex.width, targetVertex.height);
                openList.push(neighbor);
            } else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighbor.parent = currentVertex;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }
    return [];
}

//heuristic
/**
 * This function is the manhattan distance used as the heuristic to estimate the cost for the A* Search algorithm
 * @param ux current neighbor vertex width
 * @param uy current neighbor vertex height
 * @param vx target vertex width
 * @param vy target vertex height
 * @returns The total distance of the width and height of the vertices
 */
function manhattanDistance(ux, uy, vx, vy) {
    const dx = Math.abs(ux - vx), dy = Math.abs(uy - vy);
    return dx + dy;
}

/**
 * This function gets the neighbors in the graph
 * @param graph The graph
 * @param vertex The vertex or vertices of the neighbors
 * @returns The list of neighbors 
 */
function getNeighbors(graph, vertex) {
    const retList = [], x = vertex.width, y = vertex.height;

    if (graph[y - 1] && graph[y - 1][x]) {
        retList.push(graph[y - 1][x]);
    }
    if (graph[y + 1] && graph[y + 1][x]) {
        retList.push(graph[y + 1][x]);
    }
    if (graph[y][x - 1] && graph[y][x - 1]) {
        retList.push(graph[y][x - 1]);
    }
    if (graph[y][x + 1] && graph[y][x + 1]) {
        retList.push(graph[y][x + 1]);
    }
    return retList;
}

/**
 * This functions shows the animated shortest path of the A* Search algorithm.
 * @param graph The graph
 * @param vertex The information from Vertex.jsx of the shortest path vertex or vertices
 * @param animation The animation of the shortest path
 */
function showShortestPath(graph, vertex, animation) {
    let temp = [];
    while (vertex.status !== START) {
        temp.push([PATH, graph[vertex.height][vertex.width]]);
        vertex = vertex.parent;
    }
    pathLength = temp.length; //path = edge count not vertex count

    for (var i = temp.length - 1; i >= 0; i--) {
        animation.push(temp[i]);
    }
}