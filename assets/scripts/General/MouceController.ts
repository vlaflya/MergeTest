
import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('MouceController')
export class MouceController extends Component {
    public static moucePos: Vec3
    onEnable () {
    }
    onMouce(){}
}