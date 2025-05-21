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
    static readonly TOP_OFFSET = 12;

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

    private static applyVideoStyles(video: HTMLVideoElement, size: DOMRect, parentHeight?: number) {
        const { width, height } = this.getVideoDimensions(size.width);

        // --- Apply styles ---
        console.log("applyVideoStyles top:--- ", 12);
        video.style.visibility = "visible";
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.style.top = `${this.TOP_OFFSET}px`;
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.zIndex = "10";
        video.width = width;
        video.height = height;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
    }

    static updateVideoPosition(data: any) {
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;
        if (!video) {
            console.log("video not found----------");
            return;
        }

        console.log("data-----------", data);
        const topPosition = this.getTopPosition(+data?.parentHeight || 0, +data?.gameHeight || 0, +data?.verticalCenter || 0);
        console.log("topPosition-----------", topPosition);
        // video.style.top = topPosition;
    }

    private static getTopPosition(parentHeight: number, gameHeight: number, verticalPercent: number): string {
        if (verticalPercent === 0) {
            return `${this.TOP_OFFSET}px`;
        }
        const currentHeight = view.getVisibleSize()?.height || 0;

        // Chuyển verticalPercent (tính theo parentHeight) thành phần trăm tương ứng trong currentHeight
        const adjustedPercent = ((verticalPercent / 100) * parentHeight) / currentHeight;
        // Tính ra số pixel tuyệt đối dựa trên currentHeight
        const topInPx = adjustedPercent * currentHeight;

        console.log("verticalPercent:", verticalPercent);
        console.log("adjustedPercent:", adjustedPercent);
        console.log("topInPx:", topInPx);

        return `${topInPx}px`;
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
