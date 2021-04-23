const addPlayer = document.getElementById('add');
const file = document.getElementById('file');
const fileInput = document.getElementById('file-input');
let nEdges = 1;

const createInput = n => {
  const div = document.createElement('div');
  div.classList.add('player','mb-2', 'row');
  const label = document.createElement('label');
  label.classList.add('col-sm-2', 'col-form-label')
  label.innerHTML = `Arista ${n}: `;
  const inputDiv1 = document.createElement('div');
  inputDiv1.classList.add('col-sm-3');
  const input1 = document.createElement('input');
  input1.classList.add('form-control');
  input1.setAttribute("name", `A${n}`);
  input1.setAttribute("required",'');
  input1.setAttribute("id", `A${n}`);
  const inputDiv2 = document.createElement('div');
  inputDiv2.classList.add('col-sm-3');
  const input2 = document.createElement('input');
  input2.classList.add('form-control');
  input2.setAttribute("name", `B${n}`);
  input2.setAttribute("required",'');
  input2.setAttribute("id", `B${n}`);
  const inputDiv3 = document.createElement('div');
  inputDiv3.classList.add('col-sm-2');
  const input3 = document.createElement('input');
  input3.classList.add('form-control');
  input3.setAttribute("name", `cost${n}`);
  input3.setAttribute("required",'');
  input3.setAttribute("id", `cost${n}`);
  div.appendChild(label);
  div.appendChild(inputDiv1);
  div.appendChild(inputDiv2);
  div.appendChild(inputDiv3);
  inputDiv1.appendChild(input1);
  inputDiv2.appendChild(input2);
  inputDiv3.appendChild(input3);
  addPlayer.parentElement.insertBefore(div, addPlayer);
}

addPlayer.addEventListener('click', (e) => {
  e.preventDefault();
  createInput(++nEdges);
})

// file.addEventListener('click', e => {
//   e.preventDefault();
//   console.log(e);
//   const input = document.getElementById('formFile').files;
//   let edges;
//   const nodes = new Set();
//   if(input.length)
//   {
//     var reader = new FileReader();

//     reader.onload = function(e)
//     {
//       edges = e.target.result.split('\n').map(x => x.split(','));
//       edges = edges.map(x=> [x[0].toUpperCase(), x[1].toUpperCase(), x[2]])
//       edges.forEach(element => {
//         nodes.add(element[0]).add(element[1])
//         element[2] = parseInt(element[2]);
//       });
//       console.log(edges, nodes);
//     };
//     reader.readAsBinaryString(input[0]);
//   }
// });
