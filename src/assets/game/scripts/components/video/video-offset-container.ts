import { _decorator, Component, UITransform, Node, Vec3, director } from "cc";
import { EDITOR } from "cc/env";
const { ccclass, property } = _decorator;

export const SYNC_TOP_OFFSET_EVENT = "syncTopOffset";

@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    private targetContainer: Node = null;

    @property(Node)
    private destinationContainer: Node = null;

    onLoad() {}

    public onEnable(): void {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.node.parent.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
    }

    public update(delta: number): void {
        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected updateDisplay(): void {
        let topOffset = 12;
        const position = this.targetContainer.parent
            .getComponent(UITransform)
            .convertToNodeSpaceAR(this.destinationContainer.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO));
        if (position && position?.y > 0) {
            topOffset = position.y / 2;
        }

        this.node.emit(SYNC_TOP_OFFSET_EVENT, topOffset);
    }
}
