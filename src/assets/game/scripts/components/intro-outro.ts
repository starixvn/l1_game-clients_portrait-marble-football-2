import { _decorator, Component, tween, UIOpacity } from "cc";

const { ccclass, property } = _decorator;

@ccclass("IntroOutro")
export class IntroOutro extends Component {
    @property(UIOpacity)
    private gameBackground: UIOpacity = null;

    @property(UIOpacity)
    private field: UIOpacity = null;

    @property(UIOpacity)
    private backgroundBlur: UIOpacity = null;

    private readonly maxOpacity = 255;

    set showGameBackground(value: boolean) {
        this.gameBackground.node.active = value;
        this.backgroundBlur.node.active = value;
    }

    set showField(value: boolean) {
        this.field.node.active = value;
    }

    private processOpacity(value: number) {
        if (this.gameBackground) {
            this.gameBackground.opacity = value;
        }
        if (this.backgroundBlur) {
            this.backgroundBlur.opacity = value;
        }
    }

    private processTween(targetOpacity: number, duration: number) {
        const processTween = [];
        if (this.gameBackground) {
            processTween.push(tween(this.gameBackground).to(duration, { opacity: targetOpacity }));
        }
        if (this.backgroundBlur) {
            processTween.push(tween(this.backgroundBlur).to(duration, { opacity: targetOpacity }));
        }
        if (processTween.length > 0) {
            tween()
                .parallel(...processTween)
                .start();
        }
    }

    playIntroAnimation(at = 0, duration = 2) {
        if (at >= duration || at < 0 || duration < 0) {
            return;
        }

        const percent = 1 - at / duration;
        this.processOpacity(this.maxOpacity * percent);
        this.processTween(0, duration - at);
    }

    playOutroAnimation(at = 0, duration = 2) {
        if (at >= duration || at < 0 || duration < 0) {
            return;
        }

        const percent = at / duration;
        this.processOpacity(this.maxOpacity * percent);
        this.processTween(this.maxOpacity, duration - at);
    }

    setMaxBackgroundOpacity() {
        this.gameBackground.opacity = this.maxOpacity;
        this.backgroundBlur.opacity = this.maxOpacity;
    }
}
