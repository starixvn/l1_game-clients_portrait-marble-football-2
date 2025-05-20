import { _decorator, Component, EditBox, sys, view } from "cc";
export class DOMBackgroundVideo {
    static readonly GAME_CONTAINER_ID = "Cocos3dGameContainer";
    static readonly GAME_CANVAS_ID = "GameCanvas";

    static readonly VIDEO_ID = "VideoBackground";

    static resizeObserver: ResizeObserver = new ResizeObserver(() => {
        DOMBackgroundVideo.onResize();
    });

    static readonly ASPECT_RATIO = 828 / 466;
    static readonly MAX_HEIGHT = 466;

    static readonly VERTICAL_CENTER_VALUE = -0.1;

    static createOrLoadVideoElement(parentHeight?: number, scaleY?: number): HTMLVideoElement {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);
        const game = document.getElementById(DOMBackgroundVideo.GAME_CANVAS_ID);
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;

        if (game) {
            DOMBackgroundVideo.applyGameStyles(game);
        }

        if (!video) {
            const video = document.createElement("video");
            const size = container.getBoundingClientRect();

            video.id = DOMBackgroundVideo.VIDEO_ID;
            video.muted = true;
            console.log("parentHeight: ", parentHeight);
            DOMBackgroundVideo.applyVideoStyles(video, size, parentHeight);

            container.insertBefore(video, container.firstChild);

            DOMBackgroundVideo.registerEvents();

            return video;
        }

        return video;
    }

    static removeVideoElement() {
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;

        if (video) {
            DOMBackgroundVideo.unregisterEvents();
            video.remove();
        }
    }

    private static calculateVerticalCenterOffset(parentHeight: number, gameHeight: number, scaleY: number): number {
        const currentHeight = gameHeight * scaleY;
        const deltaHeight = parentHeight - currentHeight;
        const maxOffset = deltaHeight / 2;

        console.log(
            "calculateVerticalCenterOffset maxOffset-parentHeight-scaleY-gameHeight:  --- ",
            maxOffset,
            parentHeight,
            scaleY,
            gameHeight
        );

        if (parentHeight <= currentHeight) {
            return 0;
        }

        if (Math.abs(this.VERTICAL_CENTER_VALUE) * parentHeight >= maxOffset) {
            const normalizedOffset = maxOffset / parentHeight;
            console.log(
                "calculateVerticalCenterOffset normalizedOffset:--- ",
                this.VERTICAL_CENTER_VALUE < 0 ? -normalizedOffset : normalizedOffset
            );
            return this.VERTICAL_CENTER_VALUE < 0 ? -normalizedOffset : normalizedOffset;
        }

        return this.VERTICAL_CENTER_VALUE;
    }

    private static applyVideoStyles(video: HTMLVideoElement, size: DOMRect, parentHeight?: number) {
        const { width, height } = this.getVideoDimensions(size.width);

        // --- Apply styles ---
        video.style.visibility = "visible";
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.style.top = `${12}px`;
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.zIndex = "10";
        video.width = width;
        video.height = height;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
    }

    static updateVideoPosition(parentHeight: number, height: number, scaleY: number) {
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;
        if (!video) {
            return;
        }

        const verticalOffset = this.calculateVerticalCenterOffset(parentHeight, height, scaleY);
        video.style.top = `${verticalOffset}px`;
    }

    static getVideoDimensions(currentWidth: number) {
        const ratio = view.getVisibleSize()?.width / DOMBackgroundVideo.MAX_HEIGHT;
        let width = Math.min(currentWidth, view.getVisibleSize()?.width);
        let height = width / ratio;

        return {
            width: Math.round(width),
            height: Math.round(height),
        };
    }

    private static applyGameStyles(game: HTMLElement) {
        game.style.zIndex = "11";
        game.style.position = "relative";
    }

    private static onResize() {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);
        const size = container.getBoundingClientRect();
        const video = DOMBackgroundVideo.createOrLoadVideoElement();

        DOMBackgroundVideo.applyVideoStyles(video, size);
    }

    private static registerEvents() {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);

        DOMBackgroundVideo.resizeObserver.observe(container);
    }

    private static unregisterEvents() {
        DOMBackgroundVideo.resizeObserver.disconnect();
    }
}
