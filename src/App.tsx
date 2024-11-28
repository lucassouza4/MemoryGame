import { useEffect, useState } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    generateGrid();
  }, []);

  type Cell = {
    row: number;
    col: number;
  };

  const [grid, setGrid] = useState<number[][]>([[]]);

  const [isReveled, setIsReveled] = useState<boolean[][]>([[]]);

  const [lastCard, setLastCard] = useState<Cell>();

  function generateGrid() {
    let value = 12;
    const values = Array.from(
      { length: value },
      (_, index) => Math.floor(index / 2) + 1
    );
    const grid: number[][] = Array(3)
      .fill(null)
      .map(() => Array(4).fill(null));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const index = Math.floor(Math.random() * value);
        grid[i][j] = values[index];
        values.splice(index, 1);
        value -= 1;
      }
    }
    const reveled: boolean[][] = new Array(grid.length)
      .fill("")
      .map(() => new Array(grid[0].length).fill(false));
    setGrid(grid);
    setIsReveled(reveled);
  }

  async function changeCard(row: number, col: number) {
    if (isReveled[row][col]) return;

    const newIsReveled = [...isReveled];
    newIsReveled[row][col] = true;
    setIsReveled(newIsReveled);

    if (lastCard) {
      if (grid[row][col] !== grid[lastCard.row][lastCard.col]) {
        setTimeout(() => {
          isReveled[row][col] = false;
          isReveled[lastCard.row][lastCard.col] = false;
          setIsReveled([...isReveled]);
        }, 1000);
      }
      setLastCard(undefined);
      const win = isReveled.flat().every((states) => states === true);
      if (win) {
        alert("Você ganhou !!!");
      }
    } else {
      setIsReveled(newIsReveled);
      setLastCard({ row: row, col: col });
    }
  }

  function restartGame() {
    generateGrid();
  }

  return (
    <div className="App">
      <h1>Jogo da Memória</h1>
      <button className="restartButton" onClick={restartGame}>
        Reiniciar Jogo
      </button>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((card, columnIndex) => (
              <div
                className="card"
                key={columnIndex}
                onClick={() => changeCard(rowIndex, columnIndex)}
              >
                {isReveled[rowIndex][columnIndex] ? card : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
