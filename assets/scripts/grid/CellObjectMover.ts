
import { _decorator, Component, Node, Input, Vec3, tween, find, UITransform, Sprite } from 'cc';
import { BasicCell, CellCalback } from './BasicCell';
import { BasicCellObject } from './BasicCellObject';
import { Grid } from './Grid';
const { ccclass, property } = _decorator;

@ccclass('CellObjectMover')
export class CellObjectMover extends Component {
    private dragging: boolean = false
    private baseParent: Node
    private object: BasicCellObject
    private canDrag = true
    public basePos: Vec3
    start () {
        this.baseParent = this.node.parent
        this.object = this.getComponent(BasicCellObject)
        this.basePos = new Vec3(this.node.position)
        this.node.on(Node.EventType.MOUSE_DOWN, this.startDrag, this)
        this.node.on(Node.EventType.MOUSE_MOVE, this.move, this)
        this.node.on(Node.EventType.MOUSE_UP, this.stopDrag, this)
        //this.node.on(Node.EventType.MOUSE_LEAVE, this.stopDrag, this)
    }

    private startDrag(){
        if(this.canDrag){
            this.node.setSiblingIndex(this.node.children.length - 1)
            this.dragging = true;
            this.node.position = new Vec3(this.node.position.x, this.node.position.y, 100)
            //this.node.setParent(find("Canvas/MouceController/Zero/CellParent/DragParent"))
            console.log(this.node.parent.children);
        }
    }

    private move(event){
        if(!this.dragging || !this.canDrag){
            return
        }
        let dir = new Vec3(event.getLocation().x, event.getLocation().y)
        this.node.worldPosition = dir
    }

    private stopDrag(){
        if(this.dragging){
            this.dragging = false
            let cell = Grid.instance().getClosestCell(new Vec3(this.node.position))
            if(cell == null || this.object == null){
                this.returnToPos()
                return
            }
            let callback = cell.tryFill(this.object)
            console.log(callback);
            if(callback == CellCalback.full){
                this.returnToPos()
                return
            }
            if(callback == CellCalback.empty){
                this.node.emit("LeftCell")
                this.basePos = cell.getPosition()
                this.returnToPos()
                cell.fillCell(this.object)
                return
            }
            if(callback == CellCalback.merge){
                this.node.emit("LeftCell")
                this.object.kill()
                return
            }
        }
    }

    public setNeighbourPosition(cell: BasicCell){
        if(this.dragging){
            return
        }
        cell.cellInsides = this.object
        this.node.emit("LeftCell")
        this.basePos = cell.getPosition()
        this.returnToPos()
        cell.fillCell(this.object)
    }
    
    private returnToPos(){
        this.canDrag = false
        tween(this.node)
        .to(0.2,{position: this.basePos})
        .call(() =>{
            this.node.position = new Vec3(this.node.position.x, this.node.position.y, 1)
            this.canDrag = true
            this.node.setParent(this.baseParent)
        }).start()
    }
}
