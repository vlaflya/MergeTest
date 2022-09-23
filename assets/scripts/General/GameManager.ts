
import { _decorator, Component, Node, Vec2, TextAsset, JsonAsset } from 'cc';
import { BasicCellObject } from '../grid/BasicCellObject';
import { Grid } from '../grid/Grid';
import { CellObjcetsController } from './CellObjcetsController';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: JsonAsset}) levelData: JsonAsset
    start () {
        this.startLevel()
    }
    public startLevel(){
        let levelData: LevelParams = JSON.parse(JSON.stringify(this.levelData.json))
        if(levelData.gridSize.x * levelData.gridSize.y != levelData.objectNames.length){
            console.log("Bad data");
            return;
        }
        Grid.instance().createGrid(levelData.gridSize)
        CellObjcetsController.instance().createObjects(levelData.objectNames)
    }
}
export class LevelParams{
    public gridSize: Vec2
    public objectNames: string[]
    constructor(size, names){
        this.gridSize = size
        this.objectNames = names
    }
}
