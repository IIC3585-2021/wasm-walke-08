const addPlayer = document.getElementById('add');
const startGame = document.getElementById('start');
const form = addPlayer.parentElement

export const getGraph = () => {
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
  
export const makePtrOfArray = (myModule, n, nodes) => {
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
  
export const makePtrArray = (myModule, n) => {
  return myModule._calloc(n, 4);
}