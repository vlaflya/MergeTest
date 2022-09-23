
import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('MergeObject')
export class MergeObject extends Component {
    @property({type: String}) public objectName: string
}
