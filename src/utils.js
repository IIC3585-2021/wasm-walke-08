import Module from "./wasm/main.js"
import {renderGraph2, paintEdges, container} from "./graphRender.js"
import {makePtrArray, getGraph, makePtrOfArray} from "./graphStructure.js"

Module().then(function (myModule) {
  let startBtn = document.getElementById("start");
  let solveBtn = document.getElementById("solve");
  let edges, n, nodesMap, nodesNames;
  const path = [] 
  startBtn.onclick = e => {
    e.preventDefault();
    [edges, nodesNames, nodesMap, n] = getGraph();
    renderGraph2(edges, nodesNames, nodesMap, n, container)
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

    const newPath = path
      .map((posicion,idx) => ({nombre: nodesNames[idx], posicion: posicion !== 0 ? posicion: path.length}))
      .sort((elemento1, elemento2) => elemento1.posicion - elemento2.posicion)
    console.log(newPath)
    const links = newPath.reduce((a,b) => {
      if (a.length === 0){
        const newedge = {source: null, target: b.nombre}
        return [...a,newedge]
      } 
      const newlink = {source: a[a.length - 1].target, target: b.nombre}
      return [...a,newlink]
    }, [])

    const edgesMap = edges.map(edge => ([
      nodesNames[edge[0]],
      nodesNames[edge[1]], 
      parseInt(edge[2])
    ]));

    const costsArr = [];
    links.forEach(link => {
      if (link.source !== null) {
        edgesMap.forEach(edge => {
          if ((edge[0] === link.source && edge[1] === link.target) ||
              (edge[1] === link.source && edge[0] === link.target)) {
            costsArr.push(edge[2])
          }
        })
      }
    })

    let stringFinal = ""
    newPath.forEach((objeto, idx) => {
      stringFinal += objeto.nombre + ` -(${costsArr[idx]})-> `
    })

    paintEdges(container, links)
    document.getElementById("answer").innerHTML = "Path:  " + stringFinal.substring(0,stringFinal.length - 16) + " = " + resultCost + "  ||   Time: " +  (endDate - startDate) + " ms"
    alert(`Excecution time: ${(endDate - startDate)} ms || cost: ${resultCost} || final path: ${stringFinal.substring(0,stringFinal.length - 16)}`);
    console.log(path);
  }
})
