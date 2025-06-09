import { _decorator, Component, Node, screen, UITransform, Vec3, view } from "cc";
import { EDITOR } from "cc/env";
import { ComponentUtils, FunctionUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

export const SYNC_TOP_OFFSET_EVENT = "syncTopOffset";
export const SYNC_WIDTH_OFFSET_EVENT = "syncWidthOffset";
export const TOP_OFFSET_DEFAULT = 41;
@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    private containerNode: Node = null;

    @property(Node)
    private targetNode: Node = null;

    private readonly lastContainerPosition = new Vec3();

    private readonly onParentSizeChanged = () => {
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

    public async onEnable() {
        this.toggleSizeChangedListener(true);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.toggleSizeChangedListener(false);
    }

    public async update(delta: number) {
        if (this.containerNode && !this.containerNode.position.equals(this.lastContainerPosition)) {
            this.updateDisplay();
            this.lastContainerPosition.set(this.containerNode.position);
        }

        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected async updateDisplay() {
        await FunctionUtils.delay(300);
        const scaleX = this.node?.scale?.x || 1;

        const position = ComponentUtils.convertPosition(this.containerNode, this.targetNode);
        const topOffset = position.y ?? 0;
        const topOffsetAbs = Math.abs(topOffset) * scaleX;
        this.node.emit(SYNC_TOP_OFFSET_EVENT, topOffsetAbs);

        // Only update width when component AutoScaleWidget update display
        if (scaleX < 1) {
            const width = this.node?.getComponent(UITransform)?.getBoundingBoxToWorld()?.width || 0;
            const scaleXCanvas = screen.windowSize?.width / view.getVisibleSize()?.width;
            this.node.emit(SYNC_WIDTH_OFFSET_EVENT, width * scaleXCanvas);
        }
    }
}
