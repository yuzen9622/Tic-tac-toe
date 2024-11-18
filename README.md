# 圈圈叉叉遊戲 (Tic-Tac-Toe Game)
## 介紹
### 這是一個使用 React 和 Socket.io 開發的多人線上圈圈叉叉遊戲。遊戲允許兩位玩家連線並對戰，並且會即時同步雙方的動作。玩家可以選擇在同一個房間中進行遊戲，或是等待其他玩家加入。

## 功能特點
### *多人即時連線*：支援多位玩家同時連線，兩位玩家將在同一房間內對戰。
### *即時同步：透過* Socket.io 即時同步雙方玩家的遊戲操作。
### *簡單直覺的 UI*：使用 React 提供流暢的使用者介面。
### *配對系統*：可以選擇想要的玩家一起對戰。
## 技術堆疊
### React: 用於構建使用者介面。
### Socket.io: 提供即時的雙向通訊，實現多人連線功能。
### Node.js: 伺服器端技術，用於處理 Socket.io 通訊。
### Java:後端使用java spring boot 儲存使用者資訊以及歷史紀錄。
## 遊戲玩法
### 兩位玩家進入相同的房間。
### 先到的玩家將隨機分配為 "X" 或 "O"。
### 輪流在 3x3 的棋盤上放置標記，三個相同標記連成一線的玩家勝利。
### 遊戲結束後，玩家可以選擇重新開始或離開遊戲。

## 未來改進
### 增加玩家排行榜系統
### 增強遊戲音效與動畫效果
### AI對戰功能

## 專案架構
### Tic-tac-toe
### ├── client/                
### │   ├── public/         
### │   ├── src/               
### │   └── package.json   
### └── README.md 

### [tic-tac-toe-socket-server](https://github.com/yuzen9622/tic-tac-toe-socket-server)
### ├── server/                
### │   ├── index.js           
### │   └── package.json

### [Tic-tac-toe-Java-Server](https://github.com/yuzen9622/Tic-tac-toe-Java-Server)
### ├── .gitignore                  
### ├── .mvn/                       
### ├── DockerFile                 
### ├── mvnw                         
### ├── mvnw.cmd                    
### ├── pom.xml                     
### ├── src/                                                                                            
### └── README.md        



             
