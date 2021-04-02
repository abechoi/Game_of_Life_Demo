import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 20;
const numCols = 10;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; ++i) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => generateEmptyGrid());

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      return;
    }
    // simulate
    setGrid((g) => {
      // produce generates a new grid and updates the setGrid value
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; ++i) {
          for (let j = 0; j < numCols; ++j) {
            let neighbors = 0;
            // compute the number of neighbors
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });
            // decide whether the cell is 0 or 1
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 1000);
  }, []);

  console.log(grid);

  return (
    <div
      style={{
        width: "250px",
        height: "450px",
        backgroundColor: "#20232A",
        margin: "0 auto",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "10px",
        }}
      >
        <button
          style={{
            width: "65px",
            height: "25px",
            backgroundColor: "#7B61F8",
            color: "#FDF200",
            border: "none",
            outline: "none",
            borderRadius: "5px",
          }}
          onClick={() => {
            setRunning(!running);
            runningRef.current = true;
            runSimulation();
          }}
        >
          {running ? "stop" : "start"}
        </button>
        <button
          style={{
            width: "65px",
            height: "25px",
            backgroundColor: "#7B61F8",
            color: "#FDF200",
            border: "none",
            outline: "none",
            borderRadius: "5px",
          }}
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          clear
        </button>
        <button
          style={{
            width: "65px",
            height: "25px",
            backgroundColor: "#7B61F8",
            color: "#FDF200",
            border: "none",
            outline: "none",
            borderRadius: "5px",
          }}
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; ++i) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.6 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          random
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          justifyContent: "center",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "#FF85EA" : "#20232A",
                boxSizing: "border-box",
                borderRadius: "5px",
                border: "solid 1px #00FECA",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
