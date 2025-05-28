import { _decorator, Component, Node, Vec3 } from "cc";
import { EDITOR } from "cc/env";
import { ComponentUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

export const SYNC_TOP_OFFSET_EVENT = "syncTopOffset";
export const TOP_OFFSET_DEFAULT = 82;
@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    private containerNode: Node = null;

    @property(Node)
    private targetNode: Node = null;

    @property
    private topOffset = 82;

    private lastContainerPosition: Vec3 = new Vec3();

    onLoad() {
        this.topOffset = TOP_OFFSET_DEFAULT;
    }

    private onParentSizeChanged = () => {
        this.updateDisplay();
    };

    private toggleSizeChangedListener(enable: boolean) {
        const method = enable ? "on" : "off";
        if (this.node.parent) {
            this.node.parent[method](Node.EventType.SIZE_CHANGED, this.onParentSizeChanged, this);
        }
        if (this.node) {
            this.node[method](Node.EventType.SIZE_CHANGED, this.onParentSizeChanged, this);
        }
    }

    public onEnable(): void {
        this.toggleSizeChangedListener(true);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.toggleSizeChangedListener(false);
    }

    public update(delta: number): void {
        if (this.containerNode && !this.containerNode.position.equals(this.lastContainerPosition)) {
            this.updateDisplay();
            this.lastContainerPosition.set(this.containerNode.position);
        }

        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected updateDisplay(): void {
        const position = ComponentUtils.convertPosition(this.containerNode, this.targetNode);
        console.log("position---------", position.x, position.y);
        const topOffset = position.y ?? 0;
        const topOffsetAbs = Math.abs(topOffset);
        this.node.emit(SYNC_TOP_OFFSET_EVENT, Math.round(topOffsetAbs > this.topOffset ? topOffsetAbs : this.topOffset));
    }
}
