import Module from "./wasm/main.js"

const addPlayer = document.getElementById('add');
const startGame = document.getElementById('start');
const form = addPlayer.parentElement

const matrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))

const getGraph = () => {
  const inputs = Array.from(form.children).filter(x => x instanceof HTMLDivElement)
  
  let edges = [];
  let nodeNames = new Set();
  inputs.forEach(el => {
    const aux = []
    const edge = el.querySelectorAll('.form-control')
    edge.forEach(val => {
      aux.push(val.value.toUpperCase());
      val.disabled = true;
    })
    nodeNames.add(aux[0]).add(aux[1]);
    edges.push(aux);
  });
  nodeNames = Array.from(nodeNames);
  const nodes = {};
  nodeNames.forEach((node, i) => nodes[node] = i);
  edges = edges.map(edge => ([nodes[edge[0]],nodes[edge[1]],edge[2]]));

  addPlayer.remove();
  startGame.remove();

  document.getElementById('solve').removeAttribute('hidden');
  console.log(edges, nodeNames, nodes)
  return [edges, nodeNames.length, nodes];
}

const makePtrOfArray = (myModule, n, nodes) => {
  const arrayPtr = myModule._calloc(n, 4);
  for (let i = 0; i < n; i++) {
    let rowsPtr = myModule._calloc(n, 4);
    myModule.setValue(arrayPtr + i * 4, rowsPtr, "i32");
  }
  myModule._new_graph(n, arrayPtr);
  for (let i = 0; i < nodes.length; i++) {
    myModule._assign_cell(arrayPtr, nodes[i][0], nodes[i][1], nodes[i][2]);
  }
  return arrayPtr;
}

const makePtrArray = (myModule, n) => {
  return myModule._calloc(n, 4);
}

Module().then(function (myModule) {
  let startBtn = document.getElementById("start");
  let solveBtn = document.getElementById("solve");
  let edges, n, nodesMap;
  const path = [] 
  startBtn.onclick = e => {
    e.preventDefault();
    [edges, n, nodesMap] = getGraph();
  }
  solveBtn.onclick = e => {
    e.preventDefault();

    let arrPtr = makePtrOfArray(myModule, n, edges);
    let nodesAv = makePtrArray(myModule, n);
    let min_path = makePtrArray(myModule, n);
    let min_cost = makePtrArray(myModule, 1);
    myModule.setValue(min_cost, -1, "i32");
    let startDate = window.performance.now();
    myModule._tsp(arrPtr, -1, nodesAv, 0, n, n, min_cost, min_path);
    let endDate = window.performance.now();
    let resultCost = myModule.getValue(min_cost, "i32");
    for (let i = 0; i < n; i++) {
      path[i] = myModule.getValue(min_path + i * 4, "i32");
    }

    alert(`Excecution time: ${(endDate - startDate)} ms || cost: ${resultCost}`);
    console.log(path);
  }
})
