
import { _decorator, Component, Node, find, resources, Prefab, instantiate, Vec3, tween } from 'cc';
import { BasicCell } from '../grid/BasicCell';
import { BasicCellObject } from '../grid/BasicCellObject';
import { CellObjectMover } from '../grid/CellObjectMover';
import { Grid } from '../grid/Grid';
const { ccclass, property } = _decorator;

@ccclass('CellObjcetsController')
export class CellObjcetsController extends Component {
    private static _instance: CellObjcetsController = null
    public static instance(): CellObjcetsController{
        if(CellObjcetsController._instance == null){
            CellObjcetsController._instance = find("CellObjectsController").getComponent(CellObjcetsController)
        }
        return CellObjcetsController._instance
    }
    @property({type: Node}) objectsParent: Node
    private cells: BasicCellObject[] = []

    public createMergeObject(objectName: string, cell: BasicCell){
        let vec = Grid.instance().getCellsPositions()
        let x = cell.x
        let y = cell.y
        resources.load("prefabs/cellObjects/" + objectName, Prefab, (err, prefab)=>{
            let n = instantiate(prefab)
            n.setParent(this.objectsParent)
            let pos = new Vec3(vec[x][y].x, vec[x][y].y)
            n.position = pos
            n.scale = new Vec3(0,0,0)
            tween(n)
            .to(0.2, {scale: new Vec3(1,1,1)})
            .start()
            let obj = n.getComponent(BasicCellObject)
            this.cells.push(obj)
            Grid.instance().fillCell(x,y,obj)
        })
    }

    public createObjects(objectNames: string[]){
        this.cells = []
        let vec = Grid.instance().getCellsPositions()
        let i = 0
        for(let x = 0; x < vec.length;x++){
            for(let y = 0; y < vec[x].length; y++){
                if(objectNames[i] === "empty"){
                    i++
                    continue
                }
                resources.load("prefabs/cellObjects/" + objectNames[i], Prefab, (err, prefab)=>{
                    let n = instantiate(prefab)
                    n.setParent(this.objectsParent)
                    let pos = new Vec3(vec[x][y].x, vec[x][y].y)
                    n.position = pos
                    this.cells[i] = n.getComponent(BasicCellObject)
                    Grid.instance().fillCell(x,y,this.cells[i])
                })
                i++
            }
        }
    }
}
