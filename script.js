document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game');
    let squares = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    bestScoreDisplay.innerText = bestScore;

    // 初始化游戏
    function createBoard() {
        gridContainer.innerHTML = '';
        squares = [];
        for (let i = 0; i < 16; i++) {
            let square = document.createElement('div');
            square.classList.add('grid-cell');
            square.innerHTML = '';
            gridContainer.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }

    // 生成新的数字
    function generate() {
        let emptySquares = squares.filter(square => square.innerHTML == '');
        if (emptySquares.length > 0) {
            let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            randomSquare.innerHTML = 2;
            updateColors();
            checkForGameOver();
        }
    }

    // 更新颜色
    function updateColors() {
        squares.forEach(square => {
            const value = square.innerHTML;
            square.setAttribute('data-value', value);
        });
    }

    // 移动逻辑
    function move(direction) {
        let moved = false;
        if (direction === 'right' || direction === 'left') {
            for (let i = 0; i < 16; i += 4) {
                let row = [
                    parseInt(squares[i].innerHTML) || 0,
                    parseInt(squares[i + 1].innerHTML) || 0,
                    parseInt(squares[i + 2].innerHTML) || 0,
                    parseInt(squares[i + 3].innerHTML) || 0
                ];
                let newRow = direction === 'right' ? slide(row.reverse()).reverse() : slide(row);
                for (let j = 0; j < 4; j++) {
                    if (squares[i + j].innerHTML != newRow[j]) {
                        moved = true;
                        squares[i + j].innerHTML = newRow[j] || '';
                    }
                }
            }
        } else {
            for (let i = 0; i < 4; i++) {
                let column = [
                    parseInt(squares[i].innerHTML) || 0,
                    parseInt(squares[i + 4].innerHTML) || 0,
                    parseInt(squares[i + 8].innerHTML) || 0,
                    parseInt(squares[i + 12].innerHTML) || 0
                ];
                let newColumn = direction === 'down' ? slide(column.reverse()).reverse() : slide(column);
                for (let j = 0; j < 4; j++) {
                    if (squares[i + j * 4].innerHTML != newColumn[j]) {
                        moved = true;
                        squares[i + j * 4].innerHTML = newColumn[j] || '';
                    }
                }
            }
        }
        if (moved) {
            generate();
            updateColors();
        }
    }

    // 滑动和合并
    function slide(row) {
        let filteredRow = row.filter(num => num);
        for (let i = 0; i < filteredRow.length - 1; i++) {
            if (filteredRow[i] === filteredRow[i + 1]) {
                filteredRow[i] *= 2;
                score += filteredRow[i];
                filteredRow[i + 1] = 0;
            }
        }
        scoreDisplay.innerText = score;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.innerText = bestScore;
        }
        return filteredRow.filter(num => num).concat(Array(4 - filteredRow.filter(num => num).length).fill(0));
    }

    // 检查游戏状态
    function checkForGameOver() {
        if (squares.every(square => square.innerHTML != '')) {
            alert('游戏结束! 你的分数是 ' + score);
        }
    }

    // 监听键盘事件
    function control(e) {
        if (e.keyCode === 39) {
            move('right');
        } else if (e.keyCode === 37) {
            move('left');
        } else if (e.keyCode === 38) {
            move('up');
        } else if (e.keyCode === 40) {
            move('down');
        }
    }
    document.addEventListener('keydown', control);

    // 新游戏按钮
    newGameButton.addEventListener('click', () => {
        score = 0;
        scoreDisplay.innerText = score;
        createBoard();
    });

    createBoard();
}); 