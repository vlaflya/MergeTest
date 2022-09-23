
import { _decorator, Component, Node, Vec3, tween } from 'cc';
import { MergeObject } from '../merge/MergeObject';
import { BasicCell } from './BasicCell';
const { ccclass, property } = _decorator;

@ccclass('BasicCellObject')
export class BasicCellObject extends Component {
    private cell: BasicCell
    public kill(){
        tween(this.node)
        .to(0.2, {worldScale: new Vec3(0,0,0)})
        .call(() =>{
            this.node.destroy()
        })
        .start()
    }
}
