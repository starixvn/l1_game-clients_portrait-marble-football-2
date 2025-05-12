export class DOMBackgroundVideo {
    static readonly GAME_CONTAINER_ID = "Cocos3dGameContainer";
    static readonly GAME_CANVAS_ID = "GameCanvas";

    static readonly VIDEO_ID = "VideoBackground";

    static resizeObserver: ResizeObserver = new ResizeObserver(() => {
        DOMBackgroundVideo.onResize();
    });

    static createOrLoadVideoElement(): HTMLVideoElement {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);
        const game = document.getElementById(DOMBackgroundVideo.GAME_CANVAS_ID);
        const video = document.getElementById(DOMBackgroundVideo.VIDEO_ID) as HTMLVideoElement;

        if (game) {
            DOMBackgroundVideo.applyGameStyles(game);
        }

        if (!video) {
            const video = document.createElement("video");
            const size = container.getBoundingClientRect();
            console.log("createOrLoadVideoElement size-----", size);

            video.id = DOMBackgroundVideo.VIDEO_ID;
            video.muted = true;

            DOMBackgroundVideo.applyVideoStyles(video, size);

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

    private static applyVideoStyles(video: HTMLVideoElement, size: DOMRect) {
        const MAX_HEIGHT = 466;
        const ASPECT_RATIO = 828 / 1107;

        let width = size.width;
        let height = width / ASPECT_RATIO;

        // If calculated height exceeds MAX_HEIGHT, scale down proportionally
        if (height > MAX_HEIGHT) {
            height = MAX_HEIGHT;
            // width = height * ASPECT_RATIO;
        }

        video.style.visibility = "visible";
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.style.top = "0px";
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.zIndex = "10";
        video.width = width;
        video.height = height;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
    }

    private static applyGameStyles(game: HTMLElement) {
        game.style.zIndex = "11";
        game.style.position = "relative";
    }

    private static onResize() {
        const container = document.getElementById(DOMBackgroundVideo.GAME_CONTAINER_ID);
        const size = container.getBoundingClientRect();
        console.log("onResize size-----", size);
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
