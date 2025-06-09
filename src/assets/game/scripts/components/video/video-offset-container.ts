import { _decorator, Component, Node, screen, UITransform, Vec3, view } from "cc";
import { EDITOR } from "cc/env";
import { ComponentUtils, FunctionUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

export const SYNC_TOP_OFFSET_EVENT = "syncTopOffset";
export const SYNC_VIDEO_DIMENSION_EVENT = "syncWidthOffset";
export const TOP_OFFSET_DEFAULT = 41;
@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    private containerNode: Node = null;

    @property(Node)
    private targetNode: Node = null;

    @property(Node)
    private fieldNode: Node = null;

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
        console.log("scaleX", scaleX);

        const position = ComponentUtils.convertPosition(this.containerNode, this.targetNode);
        const topOffset = position.y ?? 0;
        const topOffsetAbs = Math.abs(topOffset) * scaleX;
        // this.node.emit(SYNC_TOP_OFFSET_EVENT, topOffsetAbs);

        const dpr = screen.devicePixelRatio;
        const fieldWidth = this.fieldNode?.getComponent(UITransform)?.getBoundingBoxToWorld()?.width || 0;
        const fieldHeight = this.fieldNode?.getComponent(UITransform)?.getBoundingBoxToWorld()?.height || 0;

        const currentScreenWidth = screen.windowSize?.width;
        const designScreenWidth = view.getDesignResolutionSize().width;
        const scaleXCanvas = currentScreenWidth / designScreenWidth;
        console.log("screenWidth", currentScreenWidth);
        console.log("viewWidth", designScreenWidth);
        console.log("scaleXCanvas", scaleXCanvas);

        const widthFinal = (fieldWidth * scaleXCanvas) / dpr;
        const heightFinal = (fieldHeight * scaleXCanvas) / dpr;
        console.log("widthFinal - heightFinal", widthFinal, heightFinal);

        this.node.emit(SYNC_VIDEO_DIMENSION_EVENT, {
            width: widthFinal,
            height: heightFinal,
            top: topOffsetAbs,
        });
    }
}
