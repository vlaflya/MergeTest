
import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, log } from 'cc';
import { Grid } from './Grid';
const { ccclass, property } = _decorator; 
@ccclass('GridVisuals')

export class GridVisuals extends Component {
    @property({type: Prefab}) cellVisual: Prefab
    @property({type: Node}) cellsParent: Node
    
    onEnable () {
        Grid.instance().eventTarget.on("GridCreated", this.onGridCreated, this)
    }
    public onGridCreated(self: GridVisuals){
        let cells = Grid.instance().getCellsPositions()
        for(let x = 0; x < cells.length; x++){
            for(let y = 0; y < cells[x].length; y++){
                let obj =  instantiate(this.cellVisual)
                obj.setParent(this.cellsParent)
                let pos = cells[x][y]
                obj.setPosition(pos.x, pos.y)
            }
        }
    }
}
