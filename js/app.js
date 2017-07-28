import React from 'react'
import ReactDOM from 'react-dom'
import ReactBootstrap from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { ListGroup } from 'react-bootstrap'


document.addEventListener("keydown", function (e) {
  if([37,38,39,40].indexOf(e.keyCode) > -1){
    e.preventDefault();
    // Do whatever else you want with the keydown event (i.e. your navigation).
  }
}, false);



let map = generateMap();
function generateMap() {
  let map = [];
  let wallSetup = {
    wall1: Math.floor(Math.random() * 95+2),
    opening1: Math.floor(Math.random() * 9),
    wall2: Math.floor(Math.random() * 95+2),
    opening2: Math.floor(Math.random() * 9 + 10),
    wall3: Math.floor(Math.random() * 95+2),
    opening3: Math.floor(Math.random() * 9 + 20),
    wall4: Math.floor(Math.random() * 95+2),
    opening4: Math.floor(Math.random() * 9 + 30),
    wall5: Math.floor(Math.random() * 95+2),
    opening5: Math.floor(Math.random() * 9 + 40),
    wall6: Math.floor(Math.random() * 95+2),
    opening6: Math.floor(Math.random() * 9 + 50),
    wall7: Math.floor(Math.random() * 95+2),
    opening7: Math.floor(Math.random() * 9 + 60),
    wall8: Math.floor(Math.random() * 95+2),
    opening8: Math.floor(Math.random() * 9 + 70),
    wall9: Math.floor(Math.random() * 95+2),
    opening9: Math.floor(Math.random() * 9 + 80),
    wall10: Math.floor(Math.random() * 95+2),
    opening10: Math.floor(Math.random() * 9 + 90)
  }

  function decideWall(i) {
    let wall;
    let opening;
    if (i < 10) {
      wall = wallSetup.wall1;
      opening = wallSetup.opening1;
    } else if (i>=10 && i<20) {
      wall = wallSetup.wall2;
      opening = wallSetup.opening2;
    } else if (i>=20 && i<30) {
      wall = wallSetup.wall3;
      opening = wallSetup.opening3;
    } else if (i>=30 && i<40) {
      wall = wallSetup.wall4;
      opening = wallSetup.opening4;
    } else if (i>= 40 && i<50) {
      wall = wallSetup.wall5;
      opening = wallSetup.opening5;
    } else if (i>= 50 && i<60) {
      wall = wallSetup.wall6;
      opening = wallSetup.opening6;
    } else if (i>= 60 && i<70) {
      wall = wallSetup.wall7;
      opening = wallSetup.opening7;
    } else if (i>= 70 && i<80) {
      wall = wallSetup.wall8;
      opening = wallSetup.opening8;
    } else if (i>= 80 && i<90) {
      wall = wallSetup.wall9;
      opening = wallSetup.opening9;
    } else if (i>= 90 && i<100) {
      wall = wallSetup.wall10;
      opening = wallSetup.opening10;
    }
    return [wall, opening];
  }

  for (var i = 0; i<100; i++) {
    let rowArray = [];
    let wall = decideWall(i)[0];
    let opening = decideWall(i)[1];
    let nextWall = decideWall(i+1)[0];

    for (var j = 0; j<100; j++) { //Columns in rows
     if ((i == 0 || i == 99) || (j == 0 || j == 99)) {
        rowArray.push({status:"cell wall"});
      } else if (j == wall && i == opening) {
        rowArray.push({status:"cell"});
      } else if ((j == wall) && (i>0 && i<99) && (j>0 && j<99)) {
        rowArray.push({status:"cell wall"});
      } else if ((j > wall && j<=nextWall) || (j>=nextWall && j<wall)) {
        rowArray.push({status:"cell wall"});
      } else {
        rowArray.push({status:"cell"});
      }

    }

    map.push(rowArray);
  }
  return map;
}

function getXP (level) {
  switch(level) {
    case 2:
      return 30;
      break;
    case 3:
      return 40;
      break;
    case 4:
      return 50;
      break;
    case 5:
      return 60;
      break;
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    let numWeps = Math.round(Math.random() * 14 + 5);
    let weps = [];
    for (let i = 0; i<numWeps; i++) {
      weps.push(i+1);
    }
    let numHealths = Math.round(Math.random() * 14 + 5);
    let healths = [];
    for (let i = 0; i<numHealths; i++) {
      healths.push(i+1);
    }
    let numEnemies = Math.round(Math.random() * 11 + 5);
    let enemies = [];
    for (let i = 0; i<numEnemies; i++) {
      enemies.push(i+1);
    }
    this.state = {
      gameBoard: map,
      currentWeapon: "Stick",
      health: 100,
      healths: healths,
      currentDam: 2,
      numWeps: numWeps,
      weps: weps,
      weaponTypes: ["Stick", "Sword", "Machete", "Machine Gun"],
      level: 1,
      xpToNext: 20,
      numEnemies: numEnemies,
      enemies: enemies,
      playerX: null,
      playerY: null,
      darkToggle: "off"
    };
    this.export = this.export.bind(this);
    this.updatePos = this.updatePos.bind(this);
    this.updateWepDrop = this.updateWepDrop.bind(this);
    this.updateHealthDrop = this.updateHealthDrop.bind(this);
    this.updateEnemy = this.updateEnemy.bind(this);
    this.getRAP = this.getRAP.bind(this);
    this.updateBoss = this.updateBoss.bind(this);
    this.sendPos = this.sendPos.bind(this);
    this.toggleDarkness = this.toggleDarkness.bind(this);
  }
  export() {
    console.log(this.state.gameBoard);
  }
  toggleDarkness() {
    if (this.state.darkToggle == "on")
      this.setState({darkToggle: "off"});
    else
      this.setState({darkToggle: "on"});
  }
  sendPos(x, y) {
    this.setState({
      playerX: x,
      playerY: y
    });
  }
  componentDidMount() {

  }
  getRAP() { //Random Available Position
    let map = this.state.gameBoard;
    let randomX;
    let randomY;
    do {
      randomX = Math.round(Math.random() * 99);
      randomY = Math.round(Math.random() * 99);
    } while (map[randomY][randomX] == undefined ||
          map[randomY][randomX].status == "cell wall" ||
          map[randomY][randomX].status == "cell player" ||
          map[randomY][randomX].status == "cell enemy" ||
          map[randomY][randomX].status == "cell drop");
    return [randomY, randomX];
  }
  findPlayer() {
    let map = this.state.gameBoard;
    for (let i = 0; i<map.length; i++) {
      for (let j = 0; j<map[i].length; j++) {
        if (map[i][j].status == "cell player") {
          return [i, j];
        }
      }
    }
    return false;
  }
  updatePos(x, y) {
    let oldPos = this.findPlayer();
    let newMap = this.state.gameBoard;
    let weapon = this.state.currentWeapon;
    let damage = this.state.currentDam;
    let health = this.state.health;
    let xp = this.state.xpToNext;
    let level = this.state.level;
    if (newMap[y][x].status == "cell wall") {
      return;
    } else if (newMap[y][x].status == "cell drop") {
      weapon = newMap[y][x].drop;
      damage = newMap[y][x].damage;
    } else if (newMap[y][x].status == "cell health") {
      health += newMap[y][x].health;
      if (level == 5) {
        level = level;
        xp = 0;
      } else if (xp - 10 <= 0) {
        level++;
        xp = getXP(level + (xp-10));
      } else {
        xp = xp-10;
      }
    } else if (newMap[y][x].status == "cell enemy") {
      console.log("Monster located at: " + [y, x]);
      let enemy = newMap[y][x];
      if (damage > enemy.health) {
        if (level == 5) {
          level = level;
          xp = 0;
        } else if (xp - 20 <= 0) {
          level++;
          health += 20;
          xp = getXP(level + (xp-20));
        } else {
          xp = xp-20;
        }
      } else if (enemy.damage >= health) {
        alert("You lose!");
        window.location.reload();
      } else {
        health -= enemy.damage;
        enemy.health = enemy.health - damage;
        newMap[y][x] = enemy;
        console.log("Old player position: " + oldPos);
        console.log("Player is trying to go: " + [y, x]);
        newMap[oldPos[0]][oldPos[1]].status = "cell player";
        this.setState({
          gameBoard: newMap,
          health: health
        });
        return false;
      }
    } else if (newMap[y][x].status == "cell boss") {
      console.log("Boss located at: " + [y, x]);
      let enemy = newMap[y][x];
      if (damage > enemy.health) {
        alert("You win! Congragulations!");
        window.location.reload();
      } else if (enemy.damage >= health) {
        alert("You lose!");
        window.location.reload();
      } else {
        health -= enemy.damage;
        enemy.health = enemy.health - damage;
        newMap[y][x] = enemy;
        console.log("Old player position: " + oldPos);
        console.log("Player is trying to go: " + [y, x]);
        newMap[oldPos[0]][oldPos[1]].status = "cell player";
        this.setState({
          gameBoard: newMap,
          health: health
        });
        return false;
      }
    }
      newMap[y][x].status = "cell player";
      if (oldPos)
      newMap[oldPos[0]][oldPos[1]].status = "cell";
      this.setState({
        xpToNext: xp,
        level: level,
        gameBoard: newMap,
        currentWeapon: weapon,
        currentDam: damage,
        health: health
      });
    return true;
  }
  updateWepDrop(x, y) {
    let newMap = this.state.gameBoard;
    newMap[y][x].status = "cell drop";
    let wepT = Math.round(Math.random()*3);
    let damage;
    switch(wepT) {
      case 0:
        damage = 2;
        break;
      case 1:
        damage = 10;
        break;
      case 2:
        damage = 15;
        break;
      case 3:
        damage = 50;
        break;
    }
    newMap[y][x].drop = this.state.weaponTypes[wepT];
    newMap[y][x].damage = damage;
    this.setState({gameBoard: newMap});
  }
  updateHealthDrop(x, y) {
    let newMap = this.state.gameBoard;
    newMap[y][x].status = "cell health";
    let healthValues = [30, 40, 50, 60, 70]
    let healthV = Math.round(Math.random()*4);
    newMap[y][x].health = healthValues[healthV];
    this.setState({gameBoard: newMap});
  }
  updateEnemy(x, y) {
    let newMap = this.state.gameBoard;
    newMap[y][x].status = "cell enemy";
    let damage = Math.round(Math.random()*50);
    newMap[y][x].damage = damage;
    newMap[y][x].health = 100;
    this.setState({gameBoard: newMap});
  }
  updateBoss(x, y) {
    let newMap = this.state.gameBoard;
      newMap[y][x].status = "cell boss";
      newMap[y][x].damage = 80;
      newMap[y][x].health = 200;
      this.setState({gameBoard: newMap});
  }
  render() {
    return (
      <div>
        <Instructions />
        <Stats dark={this.toggleDarkness} weapon={this.state.currentWeapon} damage={this.state.currentDam} level={this.state.level} xp={this.state.xpToNext} health={this.state.health}/>
        <Player toggled={this.state.darkToggle} update={this.updatePos} sendPos={this.sendPos} board={this.state.gameBoard}/>
        {this.state.weps.map((item) => {
          return <WepDrop drop={this.updateWepDrop} number={item} pos={this.getRAP()} />
        })}

        {this.state.healths.map((item) => {
          return <HealthDrop drop={this.updateHealthDrop} number={item} pos={this.getRAP()} />
        })}
        {this.state.enemies.map((item) => {
          return <Enemy update={this.updateEnemy} number={item} pos={this.getRAP()} />
        })}
        <Boss update={this.updateBoss} pos={this.getRAP()} />
        <Cell clicker={this.clicker} board={this.state.gameBoard}/>

      </div>
    );
  }
}


class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    }
  }
  render() {
    return (
    <Modal show={this.state.show} onHide={()=> this.setState({show: false})} bsSize="large" className="myMod" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg" className="ins"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 className="modalHeader">Welcome To Janne's Roguelike Dungeon Game</h1>
          <h3 className="link">This game was based off a <a href="https://www.freecodecamp.org/challenges/build-a-roguelike-dungeon-crawler-game">project</a> from <a href="https://www.freecodecamp.org/">freeCodeCamp</a>, below you will find the rules to the game: </h3>
          <ListGroup>
            <ListGroupItem className="plMod">You are the blue player on the screen. Move using the arrow keys</ListGroupItem>
            <ListGroupItem className="enMod">Enemies (Red) have a damage between 1-50</ListGroupItem>
            <ListGroupItem className="wepMod">Weapons (Green) can give you 1 of 4 random weapons, but be careful, a new weapon may not always be the best!</ListGroupItem>
            <ListGroupItem className="helMod">Health Drops (Pink) give you a health boost, and contribute to your XP</ListGroupItem>
            <ListGroupItem className="enMod">Killing enemies can also boost your XP and level. To fight, continuously run into a monster until it dies</ListGroupItem>
            <ListGroupItem className="levMod">You can be up to level 5, and every level increment gives you a tad bit of health</ListGroupItem>
            <ListGroupItem className="enMod">The Boss (Black & Red) is no joke. Collect health points and weapons in order to have a chance at winning</ListGroupItem>
            <ListGroupItem className="fun">Have fun!</ListGroupItem>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=> this.setState({show: false})}>Close</Button>
        </Modal.Footer>
    </Modal>
      );
  }
}


class Stats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
    <div>
        <h1 className="title">Roguelike Dungeons</h1>
        <h4 onClick={this.props.dark} className="darkToggle">Click to toggle darkness!</h4>
    <div className="row statBar">
      <h2 className="col-md-2 stat">Health: <h2 className="statNum">{this.props.health}</h2></h2>
      <h2 className="col-md-3 stat">Current Weapon: <h2 className="statNum">{this.props.weapon}</h2></h2>
      <h2 className="col-md-2 stat">Attack: <h2 className="statNum">{this.props.damage}</h2></h2>
      <h2 className="col-md-2 stat">Level: <h2 className="statNum">{this.props.level}</h2></h2>
      <h2 className="col-md-3 stat">XP to next level: <h2 className="statNum">{this.props.xp}</h2></h2>
    </div>
    </div>
      );
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
       {this.props.board.map((row) => {
          return row.map((cell) => {
            let style = {};
            return (<div id={cell.id} className={cell.status}></div>)
          });
		    })}
      </div>
    );
  }
}

class Player extends React.Component {
  constructor(props) {
    super(props);
    let initialX = Math.round(Math.random() * 97 + 1);
    let initialY = Math.round(Math.random() * 13 + 2);
    while(this.props.board[initialY][initialX].status == "cell wall") {
      //This loop prevents the inital state of the player to be on a wall
      initialX = Math.round(Math.random() * 97 + 1);
      initialY = Math.round(Math.random() * 13 + 2);
    }
    this.props.sendPos(initialX, initialY);

    let map = [];
    let playerPos;
    if (this.state == undefined) {
      playerPos = [initialY, initialX];
    } else {
      playerPos = [this.state.y, this.state.x]
    }
    for (var i = 0; i<100; i++) {
      let rowArray = [];
      for (var j = 0; j<100; j++) { //Columns in rows
         if ((i <= playerPos[0] + 3 && i >= playerPos[0] - 3) && (j <= playerPos[1] + 3 && j>= playerPos[1] - 3)) {
            rowArray.push({status: "overlay"});
       } else if ((i >= playerPos[0] - 5 && i <= playerPos[0] + 5) && j==playerPos[1]) {
            rowArray.push({status: "overlay"});
       } else if ((i >= playerPos[0] - 4 && i <= playerPos[0] + 4) && (j>=playerPos[1]-1 && j<=playerPos[1]+1)) {
            rowArray.push({status: "overlay"});
       } else if ((j >= playerPos[1] - 5 && j <= playerPos[1] + 5) && i==playerPos[0]) {
            rowArray.push({status: "overlay"});
       } else if ((j >= playerPos[1] - 4 && j <= playerPos[1] + 4) && (i>=playerPos[0]-1 && i<=playerPos[0]+1)) {
            rowArray.push({status: "overlay"});
       } else {
          rowArray.push({status: "overlay dark"});
       }
      }

      map.push(rowArray);
    }



    this.state = {
      x: initialX,
      y: initialY,
      darkBoard: map
    }

    this.props.update(this.state.x, this.state.y);
  }
  componentDidMount() {
    document.onkeydown = this.key.bind(this);
  }
  key (event) {
    let keyPressed = event.keyCode;
    let X = this.state.x;
    let Y = this.state.y
    let nextX = X;
    let nextY = Y;
    switch(keyPressed) {
      case 37  :
        nextX--;
        break;
      case 39 :
        nextX++;
        break;
      case 38    :
        nextY--;
        break;
      case 40  :
        nextY++;
        break;
    }
    if (this.props.board[nextY][nextX].status == "cell wall")
      return;
    if(this.props.update(nextX, nextY) == true) {
      this.props.sendPos(nextX, nextY);

       let map = [];
    let playerPos = [nextY, nextX];
    for (var i = 0; i<100; i++) {
      let rowArray = [];
      for (var j = 0; j<100; j++) { //Columns in rows
         if ((i <= playerPos[0] + 3 && i >= playerPos[0] - 3) && (j <= playerPos[1] + 3 && j>= playerPos[1] - 3)) {
            rowArray.push({status: "overlay"});
       } else if ((i >= playerPos[0] - 5 && i <= playerPos[0] + 5) && j==playerPos[1]) {
            rowArray.push({status: "overlay"});
       } else if ((i >= playerPos[0] - 4 && i <= playerPos[0] + 4) && (j>=playerPos[1]-1 && j<=playerPos[1]+1)) {
            rowArray.push({status: "overlay"});
       } else if ((j >= playerPos[1] - 5 && j <= playerPos[1] + 5) && i==playerPos[0]) {
            rowArray.push({status: "overlay"});
       } else if ((j >= playerPos[1] - 4 && j <= playerPos[1] + 4) && (i>=playerPos[0]-1 && i<=playerPos[0]+1)) {
            rowArray.push({status: "overlay"});
       } else {
          rowArray.push({status: "overlay dark"});
       }
      }

      map.push(rowArray);
    }


      this.setState({x:nextX, y:nextY, darkBoard:map});
    } else {
      this.props.sendPos(X, Y);

         let map = [];
    let playerPos = [Y, X];
    for (var i = 0; i<100; i++) {
      let rowArray = [];
      for (var j = 0; j<100; j++) { //Columns in rows
         if ((i <= playerPos[0] + 3 && i >= playerPos[0] - 3) && (j <= playerPos[1] + 3 && j>= playerPos[1] - 3)) {
            rowArray.push({status: "overlay"});
       } else if ((i >= playerPos[0] - 5 && i <= playerPos[0] + 5) && j==playerPos[1]) {
            rowArray.push({status: "overlay"});
       } else if ((i >= playerPos[0] - 4 && i <= playerPos[0] + 4) && (j>=playerPos[1]-1 && j<=playerPos[1]+1)) {
            rowArray.push({status: "overlay"});
       } else if ((j >= playerPos[1] - 5 && j <= playerPos[1] + 5) && i==playerPos[0]) {
            rowArray.push({status: "overlay"});
       } else if ((j >= playerPos[1] - 4 && j <= playerPos[1] + 4) && (i>=playerPos[0]-1 && i<=playerPos[0]+1)) {
            rowArray.push({status: "overlay"});
       } else {
          rowArray.push({status: "overlay dark"});
       }
      }

      map.push(rowArray);
    }

      this.setState({x: X, y: Y, darkBoard:map});
    }


    return true;
  }
  render() {
    return (
      <div id="grid" className={this.props.toggled}>
        {this.state.darkBoard.map((row) => {
          return row.map((item) => {
            return (<div className={item.status}></div>)
          });
		    })}
      </div>
    );
  }
}

class WepDrop extends React.Component {
  constructor(props) {
    super(props);
    let posX = this.props.pos[1];
    let posY = this.props.pos[0];
    this.props.drop(posX, posY);
  }
  render() {
    return null;
  }
}

class HealthDrop extends React.Component {
  constructor(props) {
    super(props);
    let posX = this.props.pos[1];
    let posY = this.props.pos[0];
    this.props.drop(posX, posY);
  }
  render() {
    return null;
  }
}

class Enemy extends React.Component {
  constructor(props) {
    super (props);
    let posX = this.props.pos[1];
    let posY = this.props.pos[0];
    this.props.update(posX, posY);
  }
  render() {
    return null;
  }
}
class Boss extends React.Component {
  constructor(props) {
    super (props);
    let posX = this.props.pos[1];
    let posY = this.props.pos[0];
    this.props.update(posX, posY);
  }
  render() {
    return null;
  }
}

const Footer = (props) => {
  return (
    <div className="foot container-fluid">
      <h2 className="footTitle">Nick Janne</h2>
      <div className="row icons">
        <a className="col-md-4" href="https://github.com/njanne19"><i className="fa fa-github"></i></a>
        <a className="col-md-4" href="https://www.freecodecamp.org/njanne19"><i className="fa fa-free-code-camp"></i></a>
        <a className="col-md-4" href="https://codepen.io/njanne19/"><i className="fa fa-codepen"></i></a>
      </div>
    </div>
  );
};






ReactDOM.render(<Board />, document.getElementById("render"));
ReactDOM.render(<Footer/>, document.getElementById("footer"));
