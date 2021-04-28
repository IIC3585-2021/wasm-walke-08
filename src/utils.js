import Module from "./wasm/main.js"

const addPlayer = document.getElementById('add');
const startGame = document.getElementById('start');
const form = addPlayer.parentElement

const width = 1500
const height = 800

const matrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))


const renderGraph2 = (edges, nodesNames, nodesMap, n) => {
  console.log("edges: ", edges)
  console.log("nodesNames: ", nodesNames)
  console.log("nodesMap: ", nodesMap)
  console.log("n: ", n)
  const nodes = [];
  nodesNames.forEach(nombre => {
    nodes.push({name: nombre})
  })

  const links = [];
  edges.forEach(lista => {
    links.push({source: nodesNames[lista[0]], target: nodesNames[lista[1]], cost: lista[2]})
  })
  console.log("links: ", links)
  console.log("nodes: ", nodes)
  const container = d3.select("#grafo")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const ges = container.selectAll("g")
    .data(links)
    .join("g")
      .attr("class", "lineas")

  const edgeSelection = container
    .selectAll("g.lineas")
    .append("line")
    .attr("stroke", "black")
    .attr("stroke-width", "3");

  container.selectAll("g.lineas")
    .append("text")
      .attr("class", "costo")
      .attr("font-size", "40px")
      .text(d => d.cost)

  const ges2 = container.selectAll("g.nodos")
    .data(nodes)
    .join("g")
      .attr("class", "nodos")

  const nodeSelection = container
    .selectAll("g.nodos")
    .append("circle")
    .attr("r", 80)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", "3")
    .call(d3.drag().on("start", dragStart).on("drag", drag).on("end", dragEnd))

  container.selectAll("g.nodos").append("text")
    .attr("class", "nodo")
    .attr("font-size", "40px")
    .text(d => d.name);

  const simulation = d3.forceSimulation(nodes);

  simulation.force("center", d3.forceCenter(width/2, height/2))
    .force("nodes", d3.forceManyBody())
    .force("links", d3.forceLink(links)
      .id((d) => d.name)
      .distance(() => 500)).on("tick", ticked)


  function ticked() {
    // console.log(simulation.alpha());
  
    nodeSelection.attr("cx", d => d.x).attr("cy", d => d.y);
  
    edgeSelection
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    container.selectAll("g.nodos").selectAll("text")
      .attr("x", (d)=> d.x)
      .attr("y", (d) => d.y)

    container.selectAll("g.lineas").selectAll("text")
      .attr("x", (d) => d.source.x + Math.abs(d.source.x - d.target.x)/2)
      .attr("y", (d) => d.source.y + Math.abs(d.source.y - d.target.y)/2)
  }
  
  function dragStart(d) {
    // console.log('drag start');
    simulation.alphaTarget(0.5).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function drag(d) {
    // console.log('dragging');
    // simulation.alpha(0.5).restart()
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragEnd(d) {
    // console.log('drag end');
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

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
  return [edges, nodeNames, nodes, nodeNames.length];
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
  let edges, n, nodesMap, nodesNames;
  const path = [] 
  startBtn.onclick = e => {
    e.preventDefault();
    [edges, nodesNames, nodesMap, n] = getGraph();
    renderGraph2(edges, nodesNames, nodesMap, n)
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
