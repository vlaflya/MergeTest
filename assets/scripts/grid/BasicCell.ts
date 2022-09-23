
import { _decorator, Component, Node, EventTarget, Enum, Vec2, Vec3 } from 'cc';
import { CellObjcetsController } from '../General/CellObjcetsController';
import { MergeManager } from '../merge/MergeManager';
import { MergeObject } from '../merge/MergeObject';
import { BasicCellObject } from './BasicCellObject';
import { CellObjectMover } from './CellObjectMover';
import { Grid } from './Grid';
const { ccclass, property } = _decorator;
 
@ccclass('BasicCell')
export class BasicCell{
    public cellInsides: BasicCellObject
    public cellId: number
    public x: number
    public y: number

    constructor(id: number, x: number, y: number){
        this.cellId = id
        this.x = x
        this.y = y
    }

    public tryFill(filler:BasicCellObject): CellCalback{
        console.log(this.cellInsides);
        if(this.cellInsides == null){
            console.log("Empty");
            console.log(this.cellInsides);
            this.cellInsides = filler
            return CellCalback.empty
        }
        if(filler.getComponent(MergeObject) && this.cellInsides.getComponent(MergeObject) && filler != this.cellInsides){
            console.log("TryMerge");
            let result = MergeManager.instance().checkMerge(filler.getComponent(MergeObject), this.cellInsides.getComponent(MergeObject))
            if(result != ""){
                this.cellInsides.kill()
                CellObjcetsController.instance().createMergeObject(result, this)
                return CellCalback.merge
            }
        }
        let neightbourCell = Grid.instance().checkNeightbourCells(this)
        if(neightbourCell != null){
            console.log("Neight");
            let f = this.cellInsides
            this.cellInsides = filler
            f.getComponent(CellObjectMover).setNeighbourPosition(neightbourCell)
            return CellCalback.empty
        }
        return CellCalback.full
    }

    public checkFiil(): CellCalback{
        if(this.cellInsides == null){
            return CellCalback.empty
        }
        return CellCalback.full
    }

    public fillCell(filler:BasicCellObject){
        this.clear()
        this.cellInsides = filler
        console.log(filler);
        filler.node.on("LeftCell", this.clear, this)
        console.log(this.cellInsides);
    }

    public clear(){
        if(this.cellInsides == null){
            return
        }
        console.log("clear " + this.cellId);
        console.log(this.cellInsides);
        this.cellInsides.getComponent(CellObjectMover).node.off("LeftCell", this.clear, this)
        this.cellInsides = null
    }

    public getPosition(): Vec3{
        return Grid.instance().getCellPos(new Vec2(this.x, this.y))
    }
}
export enum CellCalback{
    full,
    empty,
    merge
}
