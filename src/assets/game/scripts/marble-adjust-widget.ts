import { _decorator, UITransform } from "cc";
import { GameAdjustWidget } from "db://direct-shared-components/shared/common-components/game-adjust-widget";
const { ccclass, property } = _decorator;

@ccclass("MarbleAdjustWidget")
export class MarbleAdjustWidget extends GameAdjustWidget {
    @property
    offsetTopPercent = 0;

    protected calculateVerticalCenter(): number {
        const parentHeight = this.node.parent.getComponent(UITransform).height;
        const scaleY = this.node.scale.y;
        const gameHeight = this.node.getComponent(UITransform).height * scaleY;
        const deltaHeight = parentHeight - gameHeight;
        const maxOffset = deltaHeight / 2;

        if (parentHeight <= gameHeight) {
            return 0;
        }

        if (Math.abs(this.value) * parentHeight >= maxOffset) {
            const normalizedOffset = maxOffset / parentHeight;
            return this.value < 0 ? -normalizedOffset : normalizedOffset;
        }

        return this.value + this.offsetTopPercent;
    }
}
