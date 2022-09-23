
import { _decorator, Component, Node, TextAsset, find, JsonAsset, size } from 'cc';
import { BasicCell, CellCalback } from '../grid/BasicCell';
import { Grid } from '../grid/Grid';
import { MergeObject } from './MergeObject';
const { ccclass, property } = _decorator;

@ccclass('MergeManager')
export class MergeManager extends Component {
    private pairs: MergePair[]
    @property({type: JsonAsset}) pairsJson: JsonAsset
    @property({type: String}) mergeA: string
    @property({type: String}) mergeB: string
    @property({type: String}) mergeR: string

    private static _instance: MergeManager = null
    public static instance(): MergeManager{
        if(MergeManager._instance == null){
            MergeManager._instance = find("MergeManager").getComponent(MergeManager)
        }
        return MergeManager._instance
    }
    start () {
        let p = new MergePair(this.mergeA, this.mergeB, this.mergeR)
        console.log(JSON.stringify(p));
        this.createPairs()
    }
    public createPairs(){
        this.pairs = JSON.parse(JSON.stringify(this.pairsJson.json))
    }

    public checkMerge(a: MergeObject, b: MergeObject): string{
        console.log(a.objectName);
        console.log(b.objectName);
        let result: string = ""
        for(let i = 0; i < this.pairs.length; i++){
            console.log(this.pairs[i]);
            if(this.checkPair(this.pairs[i], a, b)){
                result = this.pairs[i].mergeResult
            }
        }
        return result
    }


    private checkPair(pair: MergePair, a: MergeObject, b: MergeObject){
        if(a.objectName == pair.mergeA && b.objectName == pair.mergeB){
            return true
        }
        if(a.objectName == this.mergeB && b.objectName == pair.mergeA){
            return true
        }
        return false
    }
}
export class MergePair{
    public mergeA: string
    public mergeB: string
    public mergeResult: string

    constructor(a,b,result){
        this.mergeA = a
        this.mergeB = b
        this.mergeResult = result
    }
}