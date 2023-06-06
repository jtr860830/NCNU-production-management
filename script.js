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
  const result = hungarian(matrix);
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<h5>Minimum Cost Assignment:</h5>";
  let outputHTML =
    '<table class="striped"><thead><tr><th>Worker</th><th>Job</th></tr></thead><tbody>';
  for (let i = 0; i < result.length; i++) {
    outputHTML += `<tr><td>${result[i][0] + 1}</td><td>${
      result[i][1] + 1
    }</td></tr>`;
  }
  outputHTML += "</tbody></table>";
  resultContainer.innerHTML += outputHTML;
}

function hungarian(costs) {
  // subtract min of rows
  for (let i = 0; i < costs.length; i++) {
    const min = Math.min(...costs[i]);
    for (let j = 0; j < costs[i].length; j++) {
      costs[i][j] -= min;
    }
  }

  // subtract min of columns
  for (let j = 0; j < costs[0].length; j++) {
    let min = Infinity;
    for (let i = 0; i < costs.length; i++) {
      min = Math.min(min, costs[i][j]);
    }
    for (let i = 0; i < costs.length; i++) {
      costs[i][j] -= min;
    }
  }

  // creating the mask
  let mask = costs.map((row) => row.map((cell) => (cell === 0 ? 1 : 0)));

  let coveredColumns = [];
  let coveredRows = [];

  //Cover all zero in a row or column that doesn't have any other covered zero
  for (let i = 0; i < mask.length; i++) {
    for (let j = 0; j < mask[i].length; j++) {
      if (
        mask[i][j] === 1 &&
        !coveredRows.includes(i) &&
        !coveredColumns.includes(j)
      ) {
        coveredRows.push(i);
        coveredColumns.push(j);
        break;
      }
    }
  }

  while (coveredColumns.length < costs[0].length) {
    let min = Infinity;
    for (let i = 0; i < costs.length; i++) {
      for (let j = 0; j < costs[i].length; j++) {
        if (!coveredRows.includes(i) && !coveredColumns.includes(j)) {
          min = Math.min(min, costs[i][j]);
        }
      }
    }

    for (let i = 0; i < costs.length; i++) {
      for (let j = 0; j < costs[i].length; j++) {
        if (!coveredRows.includes(i) && !coveredColumns.includes(j)) {
          costs[i][j] -= min;
        } else if (coveredRows.includes(i) && coveredColumns.includes(j)) {
          costs[i][j] += min;
        }
      }
    }

    mask = costs.map((row) => row.map((cell) => (cell === 0 ? 1 : 0)));
    coveredColumns = [];
    coveredRows = [];

    for (let i = 0; i < mask.length; i++) {
      for (let j = 0; j < mask[i].length; j++) {
        if (
          mask[i][j] === 1 &&
          !coveredRows.includes(i) &&
          !coveredColumns.includes(j)
        ) {
          coveredRows.push(i);
          coveredColumns.push(j);
          break;
        }
      }
    }
  }

  // return the minimum cost assignment
  return coveredRows.map((row, i) => [row, coveredColumns[i]]);
}
