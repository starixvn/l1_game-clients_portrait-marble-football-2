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

    static createOrLoadVideoElement(parentHeight?: number): HTMLVideoElement {
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

    private static calculateVerticalCenterOffset(parentHeight: number, gameHeight: number, value: number): number {
        const deltaHeight = parentHeight - gameHeight;
        const maxOffset = deltaHeight / 2;

        let verticalOffset = 0;
        if (parentHeight > gameHeight) {
            if (Math.abs(value) * parentHeight >= maxOffset) {
                const normalizedOffset = maxOffset / parentHeight;
                verticalOffset = value < 0 ? -normalizedOffset : normalizedOffset;
            } else {
                verticalOffset = value;
            }
            // Convert normalized offset to pixels
            verticalOffset = verticalOffset * parentHeight + (parentHeight - gameHeight) / 2;
        }
        // If parentHeight <= gameHeight, verticalOffset remains 0
        return verticalOffset;
    }

    private static applyVideoStyles(video: HTMLVideoElement, size: DOMRect, parentHeight?: number) {
        const { width, height } = this.getVideoDimensions(size.width);
        const verticalOffset = this.calculateVerticalCenterOffset(parentHeight, height, this.VERTICAL_CENTER_VALUE);
        // --- Apply styles ---
        video.style.visibility = "visible";
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.style.top = `${verticalOffset}px`;
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.zIndex = "10";
        video.width = width;
        video.height = height;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
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
