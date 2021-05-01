const width = 1500
const height = 800


export const container = d3.select("#grafo")
.append("svg")
.attr("width", width)
.attr("height", height)


export const renderGraph2 = (edges, nodesNames, nodesMap, n, container) => {
	const nodes = [];
	nodesNames.forEach(nombre => {
		nodes.push({name: nombre})
	})

	const links = [];
	edges.forEach(lista => {
		links.push({source: nodesNames[lista[0]], target: nodesNames[lista[1]], cost: lista[2]})
	})

	const ges = container.selectAll("g")
		.data(links)
		.join("g")
			.attr("class", "lineas")

	const edgeSelection = container
		.selectAll("g.lineas")
		.append("line")
		.attr("stroke", "black")
		.attr("stroke-width", "3");

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
	}
	
	function dragStart(event) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.subject.x;
		event.subject.fy = event.subject.y;
	}
	
	function drag(event) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}
	
	function dragEnd(event) {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	}
}

export const paintEdges = (container, edges) => {
  container.selectAll("g.lineas")
    .selectAll("line")
    .filter((d) => {
      let verdadero = false;
      console.log("d: ", d)
      edges.forEach(arista => {
        if ((arista.source == d.source.name && arista.target == d.target.name) || (arista.source == d.target.name && arista.target == d.source.name)) {
          console.log("laksdfj")
          verdadero = true
        }
      })
      return verdadero 
    })
    .attr("stroke", "red")
}