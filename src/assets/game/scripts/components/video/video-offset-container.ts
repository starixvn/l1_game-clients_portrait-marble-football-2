import { _decorator, Component, Node, screen, Vec3 } from "cc";
import { EDITOR } from "cc/env";
import { ComponentUtils, FunctionUtils, isIOS } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

export const SYNC_TOP_OFFSET_EVENT = "syncTopOffset";
export const TOP_OFFSET_DEFAULT = 82;
@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    private containerNode: Node = null;

    @property(Node)
    private targetNode: Node = null;

    private lastContainerPosition: Vec3 = new Vec3();

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

    private isPortraitMode(): boolean {
        if (typeof window !== "undefined" && window?.matchMedia) {
            return window.matchMedia("(orientation: portrait)").matches;
        }

        const frameSize = screen.windowSize;
        return frameSize.width < frameSize.height;
    }

    protected async updateDisplay() {
        if (isIOS()) {
            await FunctionUtils.delay(500);
        }

        if (this.isPortraitMode()) {
            const position = ComponentUtils.convertPosition(this.containerNode, this.targetNode);
            const topOffset = position.y ?? 0;
            const topOffsetAbs = Math.abs(topOffset);
            this.node.emit(SYNC_TOP_OFFSET_EVENT, topOffsetAbs);
        }
    }
}
