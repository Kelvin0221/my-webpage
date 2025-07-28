import { useEffect, useState } from "react";
import { WorldMap } from "./world-map";
import type { JSX } from "react/jsx-runtime";
import { EntityMovement } from "./main-entity";
import { EntityItem } from "./entity-item";
import { EntityItemType } from "./entity-item-type";
import { MapEntities } from "./entity-map-type";
import "./assets/style/map-style.css";
import NavBar from "./nav-bar";

function App({ title }: { title: string }) {
  var [m1] = useState(new WorldMap(0,0,10,10));
  var [dispMap, setdispMap] = useState(null as JSX.Element [] | null);
  var [dialogue, setDialogue] = useState("");

    //Generate map
    useEffect(()=>{
      //Generate using WALL: W & PATH: O only
      m1.map[0] = ["O", "O", "W", "O", "W", "O", "O", "O", "O", "O"];
      m1.map[1] = ["W", "O", "W", "O", "W", "O", "W", "W", "W", "W"];
      m1.map[2] = ["W", "O", "W", "O", "O", "O", "W", "O", "O", "O"];
      m1.map[3] = ["W", "O", "W", "O", "W", "O", "W", "O", "W", "O"];
      m1.map[4] = ["W", "O", "W", "O", "W", "W", "W", "O", "W", "O"];
      m1.map[5] = ["W", "O", "W", "O", "W", "O", "W", "O", "W", "W"];
      m1.map[6] = ["W", "O", "W", "O", "O", "O", "W", "O", "W", "O"];
      m1.map[7] = ["W", "O", "W", "O", "W", "O", "W", "O", "O", "O"];
      m1.map[8] = ["O", "O", "O", "O", "W", "O", "W", "O", "W", "O"];
      m1.map[9] = ["W", "W", "W", "W", "W", "O", "O", "O", "W", "O"];

      m1.setObserverSize(6,6);

      m1.addItem(new EntityItem(EntityItemType.KEY,1,1,"Key open door", 2, 8));
      m1.addItem(new EntityItem(EntityItemType.KEY,1,2,"Key open door", 4, 2));
      m1.addItem(new EntityItem(EntityItemType.KEY,9,0,"Key open door", 4, 6));

      m1.addItem(new EntityItem(EntityItemType.NOTE,1,0,"Test Note"));
      m1.addItem(new EntityItem(EntityItemType.NOTE,9,9,"Test Completed"));

      m1.addItem(new EntityItem(EntityItemType.TRAP,1,7,"", 1, 3, MapEntities.WALL));


      setdispMap(viewPointMap(m1));
    }, [])


  function moveEntity(e: React.MouseEvent<HTMLButtonElement>, command: String){
    e.preventDefault();

    switch (command){
      case EntityMovement.UP:
        m1.moveUp();
        break;
      case EntityMovement.DOWN:
        m1.moveDown();
        break;
      case EntityMovement.LEFT:
        m1.moveLeft();
        break;
      case EntityMovement.RIGHT:
        m1.moveRight();
        break;
      default:
        console.log("INVALID MOVEMENT");
    }
    setDialogue(m1.mapDialogue.toString() + m1.mapMessage);

    setdispMap(viewPointMap(m1));
  }

  function keyboardControl(e: React.KeyboardEvent<HTMLDivElement>){
    e.preventDefault();

    switch (e.key){
      case "w":
        document.getElementById("btnMoveUp")?.click();
        break;
      case "a":
        document.getElementById("btnMoveLeft")?.click();
        break;
      case "s":
        document.getElementById("btnMoveDown")?.click();
        break;
      case "d":
        document.getElementById("btnMoveRight")?.click();
        break;
    }
  }

  return <>
    <NavBar active="app" getMode={0}></NavBar>
    <h1>{title}</h1>
    <div tabIndex={1} autoFocus={true} onKeyDown={(e) => keyboardControl(e)}>
      <div>
        <table className="map-style">
          <tbody>
            {dispMap}
          </tbody>
        </table>
      </div>
      <div id="divDialogue">
        {dialogue}
      </div>
      <div>
        <button id='btnMoveUp' type="button" onClick={(e) => moveEntity(e, EntityMovement.UP)}>Up</button>
        <button id='btnMoveDown' type="button" onClick={(e) => moveEntity(e, EntityMovement.DOWN)}>Down</button>
        <button id='btnMoveLeft' type="button" onClick={(e) => moveEntity(e, EntityMovement.LEFT)}>Left</button>
        <button id='btnMoveRight' type="button" onClick={(e) => moveEntity(e, EntityMovement.RIGHT)}>Right</button>
      </div>
    </div>
    </>;

};

/*function DisplayMap(map: WorldMap){
  let table=[];
  let mapSize = map.getMapSize();

  //Clone the map to maintain original map design
  let cloneMap = structuredClone(map.map);

  //Curr location
  cloneMap[map.currPosY][map.currPosX] = 'X';

  for(let i=0; i< mapSize[0]; i++){
      table.push(<tr>{generateCell(cloneMap[i])}</tr>)
  }

  return table;
}*/

function viewPointMap(map: WorldMap){
  let table=[];
  let mapSize = map.getObserverSize();

  //Clone the map to maintain original map design
  let cloneMap = structuredClone(map.getObserverView());

  //Curr location
  cloneMap[map.mappedPosY][map.mappedPosX] = 'X';

  for(let i=0; i< mapSize[0]; i++){
      table.push(<tr>{generateCell(cloneMap[i])}</tr>)
  }

  return table;
}

function generateCell(cellData: Array<string>){
  let cells = [];
  for(let i=0; i< cellData.length; i++){
    cells.push(<td>{convertDisplay(cellData[i])}</td>)
  }
  return cells;
}

function convertDisplay(entities: String){
  switch(entities){
    case MapEntities.WALL:
      return <div className="map-wall-style"></div>;
    case MapEntities.PATH:
      return <div className="map-path-style"></div>;
    case MapEntities.DOOR:
      return <div className="map-door-style">D</div>;
    case MapEntities.VOID:
      return <div className="map-void-style">V</div>;
    case EntityItemType.PLAYERENTITY:
      return <div className="map-path-style">
        <div className="map-entity-player-style pos-relative">
          X
        </div>
      </div>;
    case EntityItemType.NOTE:
      return <div className="map-path-style">
        <div className="map-entity-note-style pos-relative">
          N
        </div>
      </div>;
    case EntityItemType.KEY:
      return <div className="map-path-style">
        <div className="map-entity-key-style pos-relative">
          Key
        </div>
      </div>;
    case EntityItemType.TRAP:
      //Trap should be unseen 
      return <div className="map-path-style"></div>;
    default:
      return <div className="map-path-style"></div>;
  }
}

export default App;
