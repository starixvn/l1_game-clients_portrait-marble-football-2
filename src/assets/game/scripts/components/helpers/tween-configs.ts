import { Vec3, v3 } from "cc";

export interface TweenConfig {
    scale?: Vec3;
    position?: Vec3;
    opacity?: number;
    positionY?: number;
    time: number;
}

export interface TweenConfigs {
    in: TweenConfig;
    out: TweenConfig;
}

export type TweenKey = "chipContainerFlyDown" | "fadeInOut" | "betChoiceZoomInOut" | "hiddenPlayersFlyUpBet" | "hiddenPlayersFlyUpBlockBet";

export const DURATION_ANIM_IN = 0.5;
export const DURATION_ANIM_OUT = 0.7;

export const DEFAULT_TWEEN_CONFIGS: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, -68, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -268, 0), time: DURATION_ANIM_OUT },
    },
    chipContainerFlyDown: {
        in: { position: v3(0, 0, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -200, 0), time: DURATION_ANIM_OUT },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBet: {
        in: { positionY: -369, opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBlockBet: {
        in: { positionY: -565, opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
};

export const DEFAULT_TWEEN_CONFIGS_PORTRAIT: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, -123, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -123, 0), time: DURATION_ANIM_OUT },
    },
    chipContainerFlyDown: {
        in: { position: v3(0, 0, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, 0, 0), time: DURATION_ANIM_OUT },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBet: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBlockBet: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
};
