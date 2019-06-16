var board = new Array()
var score = 0 //初始化游戏分数

$(function() {
	newgame()
})

function newgame() {
	//初始化棋盘格
	init()
	//在随机两个格子生成数字
	generateOneNumber()
	generateOneNumber()
}

function init() {
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-" + i + "-" + j)
			gridCell.css("top", getPosTop(i, j))
			gridCell.css("left", getPosLeft(i, j))
		}
	}
	for(var i = 0; i < 4; i++) {
		board[i] = new Array();
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
		}
	}
	updateBoardView()
	score = 0;  //分数的初始化
}
//渲染显示格子的样式
function updateBoardView() {
	$(".number-cell").remove()
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			$(".grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
			var theNumberCell = $("#number-cell-" + i + "-" + j)
			if(board[i][j] == 0) {
				theNumberCell.css("width", "0px")
				theNumberCell.css("height", "0px")
				theNumberCell.css("top", getPosTop(i, j) + 50)
				theNumberCell.css("left", getPosLeft(i, j) + 50)
			} else {
				theNumberCell.css("width", "100px")
				theNumberCell.css("height", "100px")
				theNumberCell.css("top", getPosTop(i, j))
				theNumberCell.css("left", getPosLeft(i, j))
				theNumberCell.css("background", getNumberBackground(board[i][j]))
				theNumberCell.text(board[i][j])
			}

		}
	}
}

//每个格子距离顶部的距离
function getPosTop(i, j) {
	return 20 + i * 120
}
//每个格子距离左边的距离
function getPosLeft(i, j) {
	return 20 + j * 120
}
//每一个背景颜色
function getNumberBackground(number) {
	switch(number) {
		case 2:
			return "#FFFF00";
			break
		case 4:
			return "#FFCC99";
			break
		case 8:
			return "#FF99FF";
			break
		case 16:
			return "#FF9999";
			break
		case 32:
			return "#FF6666";
			break
		case 64:
			return "#FF33FF";
			break
		case 128:
			return "#66FF33";
			break
		case 256:
			return "#6699FF";
			break
		case 512:
			return "#666666";
			break
		case 1024:
			return "#660066";
			break
		case 2048:
			return "#00FFFF";
			break
	}
	return "black"
}
//随机生成一个数字
function generateOneNumber() {
	//判断是否还有位置
	if(nospace(board)) {
		return false
	} else {
		//随机一个位置
		var randx = parseInt(Math.floor(Math.random() * 4))
		var randy = parseInt(Math.floor(Math.random() * 4))
		//判断位置是否有值
		while(true) {
			if(board[randx][randy] == 0) {
				break
			}
			randx = parseInt(Math.floor(Math.random() * 4))
			randy = parseInt(Math.floor(Math.random() * 4))
		}
		//随机一个数字
		var randNumber = Math.random() < 0.5 ? 2 : 4
		//在随机位置上显示随机的数字
		board[randx][randy] = randNumber
		showNumberAnimation(randx, randy, randNumber)

		return true
	}

}
//是否还有位置
function nospace(board) {
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			if(board[i][j] == 0) {
				return false
			}
			return true
		}
	}
}
//根据不同按键触发不同函数
$(document).keydown(function(event) {
	switch(event.keyCode) {
		case 37: //左
			if(moveLeft()) {
				setTimeout("generateOneNumber()",210) //产生一个新的数字
				gameover() //游戏是否结束
			}
			break
		case 38: //上
			if(moveUp()) {
				setTimeout("generateOneNumber()",210) //产生一个新的数字
				gameover() //游戏是否结束
			}
			break
		case 39: //右
			if(moveRight()) {
				setTimeout("generateOneNumber()",210) //产生一个新的数字
				gameover() //游戏是否结束
			}
			break
		case 40: //下
			if(moveDown()) {
				setTimeout("generateOneNumber()",210) //产生一个新的数字
				gameover() //游戏是否结束
			}
			break
		default:
			break
	}
})
//向左移动
function moveLeft() {
	if(!canMoveLeft(board)) {
		return false
	} else {
		for(var i = 0; i < 4; i++) {
			for(var j = 1; j < 4; j++) {
				if(board[i][j] != 0) {
					for(var k=0 ; k<j ; k++) {
						if(board[i][k] == 0 && noHorizontal(i,k,j,board)) {
							//move
							showMoveAnimation(i,j,i,k)
							board[i][k] = board[i][j]
							board[i][j] = 0
							continue
						}else if(board[i][k] == board[i][j] && noHorizontal(i,k,j,board)) {
							//move
							showMoveAnimation(i,j,i,k)
							//add
							board[i][k] += board[i][j]
							board[i][j] = 0
							//add score
							score += board[i][k]
							updateScore(score)   //更新页面显示的score
							continue
						}
					}
				}
			}
		}
		//等待200毫秒重置
		setTimeout("updateBoardView()",200)
		return true
	}
}
//向上移动
function moveUp() {
	if(!canMoveUp(board)) {
		return false
	} else {
		for(var j = 0; j < 4; j++) {
			for(var i = 1; i < 4; i++) {
				if(board[i][j] != 0) {
					for(var k=0 ; k<i ; k++) {
						if(board[k][j] == 0 && noVertical(j,k,i,board)) {
							//move
							showMoveAnimation(i,j,k,j)
							board[k][j] = board[i][j]
							board[i][j] = 0
							continue
						}else if(board[k][j] == board[i][j] && noHorizontal(j,k,i,board)) {
							//move
							showMoveAnimation(i,j,k,j)
							//add
							board[k][j] *= 2
							board[i][j] = 0
							//add score
							score += board[k][j]
							updateScore(score)   //更新页面显示的score
							continue
						}
					}
				}
			}
		}
		//等待200毫秒重置
		setTimeout(function() {
			updateBoardView()
		},200)
		return true
	}
}
//向右移动
function moveRight() {
	if(!canMoveRight(board)) {
		return false
	} else {
		for(var i = 0; i < 4; i++) {
			for(var j = 2; j >= 0; j--) {
				if(board[i][j] != 0) {
					for(var k=3 ; k>j ; k--) {
						if(board[i][k] == 0 && noHorizontal(i,j,k,board)) {
							//move
							showMoveAnimation(i,j,i,k)
							board[i][k] = board[i][j]
							board[i][j] = 0
							continue
						}else if(board[i][k] == board[i][j] && noHorizontal(i,j,k,board)) {
							//move
							showMoveAnimation(i,j,i,k)
							//add
							board[i][k] *= 2
							board[i][j] = 0
							//add score
							score += board[i][k]
							updateScore(score)   //更新页面显示的score
							continue
						}
					}
				}
			}
		}
		//等待200毫秒重置
		setTimeout(function() {
			updateBoardView()
		},200)
		return true
	}
}
//向下移动
function moveDown() {
	if(!canMoveDown(board)) {
		return false
	} else {
		for(var j = 0; j < 4; j++) {
			for(var i = 2; i >= 0; i--) {
				if(board[i][j] != 0) {
					for(var k=3 ; k>i ; k--) {
						if(board[k][j] == 0 && noVertical(j,i,k,board)) {
							//move
							showMoveAnimation(i,j,k,j)
							board[k][j] = board[i][j]
							board[i][j] = 0
							continue
						}else if(board[k][j] == board[i][j] && noHorizontal(j,i,k,board)) {
							//move
							showMoveAnimation(i,j,k,j)
							//add
							board[k][j] *= 2 
							board[i][j] = 0
							//add score
							score += board[k][j]
							updateScore(score)   //更新页面显示的score
							continue
						}
					}
				}
			}
		}
		//等待200毫秒重置
		setTimeout(function() {
			updateBoardView()
		},200)
		return true
	}
}
//判断能否向左移动
function canMoveLeft(board)　 {
	for(var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			if(board[i][j] != 0) {
				if(board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}
//判断能否向上移动
function canMoveUp(board)　 {
	for(var j = 0; j < 4; j++) {
		for(var i = 1; i < 4; i++) {
			if(board[i][j] != 0) {
				if(board[i-1][j] == 0 || board[i-1][j] == board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}
//判断能否向右移动
function canMoveRight(board)　 {
	for(var i = 0; i < 4; i++) {
		for(var j = 2; j >= 0; j--) {
			if(board[i][j] != 0) {
				if(board[i][j+1] == 0 || board[i][j+1] == board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}
//判断能否向下移动
function canMoveDown(board)　 {
	for(var j = 0; j < 4; j++) {
		for(var i = 2; i >= 0; i--) {
			if(board[i][j] != 0) {
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}

//判断左右移动期间是否有障碍物
function noHorizontal(row,col1,col2,board) {
	for(var i=col1 + 1 ; i<col2 ; i++) {
		if(board[row][i] != 0) {
			return false
		}
	}
	return true
}

//判断上下移动期间是否有障碍物
function noVertical(col,row1,row2,board) {
	for(var i=row1 + 1 ; i<row2 ; i++) {
		if(board[i][col] != 0) {
			return false
		}
	}
	return true
}

//更新显示分数
function updateScore(score) {
	$("#score").text(score)
}

//游戏结束模块
//判断是否结束
function gameover() {
	if(nospace(board) && nomove(board)) {
		over()
	}
}
//判断能否移动
function nomove(board) {
	if(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board)) {
		return false
	}
	return true
}

//游戏结束
function over() {
	alert("gameover!!")
}
