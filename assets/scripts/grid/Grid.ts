
import { _decorator, Component, Node, Vec2, EventTarget, log, find, Vec3 } from 'cc';
import { BasicCell, CellCalback } from './BasicCell';
import { BasicCellObject } from './BasicCellObject';
const { ccclass, property } = _decorator;
 
@ccclass('Grid')
export class Grid extends Component {
    @property({type: Number}) cellSize: number;
    private size: Vec2
    private cells: BasicCell[][]
    private static _instance: Grid = null
    public static instance(): Grid{
        if(Grid._instance == null){
            Grid._instance = find("Grid").getComponent(Grid)
        }
        return Grid._instance
    }
    public eventTarget: EventTarget = new EventTarget()
    
    public createGrid(size:Vec2){
        this.size = size
        this.cells = []
        for(let x = 0; x < size.x; x++){
            this.cells[x] = []
            for(let y = 0; y < size.y; y++){
                this.cells[x][y] = new BasicCell(x*100+y, x, y);
            }
        }
        this.eventTarget.emit("GridCreated")
    }

    public tryPopulateCells(objects: BasicCellObject[]){
        let i = 0
        for(let x = 0; x < this.size.x; x++){
            for(let y = 0; y < this.size.y; y++){
                this.tryFillCell(x,y, objects[i])
                i++
            }
        }
    }

    public tryFillCell(x, y, obj: BasicCellObject){
        if(obj == null){
            return
        }
        this.cells[x][y].tryFill(obj)
    }

    public getClosestCell(pos: Vec3): BasicCell{
        let vecs = this.getCellsPositions()
        pos.z = 0
        let closestCell: BasicCell = null
        let closestDistance = 1000000
        for(let x = 0; x < this.size.x; x++){
            for(let y = 0; y < this.size.y; y++){
                let p = new Vec3(vecs[x][y].x, vecs[x][y].y)
                let distance = Vec2.distance(pos, p)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestCell = this.cells[x][y]
                }
            }
        }
        if(closestDistance > 40){
            return null
        }
        return closestCell
    }

    public getCellsPositions(): Vec2[][]{
        let ar = []
        for(let x = 0; x < this.size.x; x++){
            ar[x] = []
            for(let y = 0; y < this.size.y; y++){
                ar[x][y] = new Vec2(x * this.cellSize, y * this.cellSize);
            }
        }
        return ar
    }

    public checkNeightbourCells(cell: BasicCell): BasicCell{
        if(cell.x < this.size.x - 1){
            let callback = this.cells[cell.x + 1][cell.y].checkFiil()
            if(callback == CellCalback.empty){
                return this.cells[cell.x + 1][cell.y]
            }
        }
        if(cell.x > 0){
            let callback = this.cells[cell.x - 1][cell.y].checkFiil()
            if(callback == CellCalback.empty){
                return this.cells[cell.x - 1][cell.y]
            }
        }
        if(cell.y < this.size.y - 1){
            let callback = this.cells[cell.x][cell.y + 1].checkFiil()
            if(callback == CellCalback.empty){
                return this.cells[cell.x][cell.y + 1]
            }
        }
        if(cell.y > 0){
            let callback = this.cells[cell.x][cell.y - 1].checkFiil()
            if(callback == CellCalback.empty){
                return this.cells[cell.x][cell.y - 1]
            }
        }
        return null
    }

    public fillCell(x:number, y: number,cellObject: BasicCellObject){
        this.cells[x][y].fillCell(cellObject)
    }
    public getCellPos(pos: Vec2): Vec3{
        return new Vec3(pos.x * this.cellSize, pos.y * this.cellSize)
    }
}
