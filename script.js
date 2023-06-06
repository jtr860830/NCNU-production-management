let matrix = [
  [0, 0],
  [0, 0],
];
updateMatrix();

function addRow() {
  matrix.push(new Array(matrix[0].length).fill(0));
  updateMatrix();
}

function addColumn() {
  for (let row of matrix) {
    row.push(0);
  }
  updateMatrix();
}

function updateMatrix() {
  const container = document.getElementById("matrix-input");
  container.innerHTML = "";
  for (let i = 0; i < matrix.length; i++) {
    let rowHtml = "<tr>";
    for (let j = 0; j < matrix[i].length; j++) {
      rowHtml += `<td><input id="cell-${i}-${j}" type="number" class="validate" value="${
        matrix[i][j] || 0
      }"></td>`;
    }
    rowHtml += "</tr>";
    container.innerHTML += rowHtml;
  }
}

function compute() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = Number(document.getElementById(`cell-${i}-${j}`).value);
    }
  }
  console.log(matrix);
  const result = computeMunkres(matrix);
  console.log(result);
  const resultContainer = document.getElementById("result");
  const cost = result.reduce((acc, cur) => acc + matrix[cur[0]][cur[1]], 0);
  resultContainer.innerHTML = `<h5>Minimum Cost: ${cost}</h5>`;
}
