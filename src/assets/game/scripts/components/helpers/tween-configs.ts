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

export type TweenKey =
    | "fadeInOut"
    | "betChoiceZoomInOut"
    | "hiddenPlayersFlyUpBet"
    | "hiddenPlayersWhenLive"
    | "swapButtonWhenBet"
    | "swapButtonWhenLive"
    | "betChoiceSettlement"
    | "chipContainerSettlement";

export const DURATION_ANIM_IN = 0.5;
export const DURATION_ANIM_OUT = 0.7;

export const DEFAULT_TWEEN_CONFIGS: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, 22, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -272, 0), time: DURATION_ANIM_OUT },
    },
    betChoiceSettlement: {
        in: { position: v3(0, -237, 0), time: 0 },
        out: { time: DURATION_ANIM_OUT },
    },
    chipContainerSettlement: {
        in: { position: v3(0, -215, 0), time: DURATION_ANIM_IN },
        out: { time: DURATION_ANIM_OUT },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBet: {
        in: { positionY: -270, opacity: 255, time: 0 },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersWhenLive: {
        in: { positionY: 22, opacity: 255, time: 0 },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    swapButtonWhenBet: {
        in: { positionY: -294, opacity: 255, time: 0 },
        out: { opacity: 1, time: DURATION_ANIM_IN },
    },
    swapButtonWhenLive: {
        in: { positionY: 260, opacity: 255, time: 0 },
        out: { opacity: 1, time: DURATION_ANIM_IN },
    },
};

export const DEFAULT_TWEEN_CONFIGS_PORTRAIT: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, -123, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -123, 0), time: DURATION_ANIM_OUT },
    },
    betChoiceSettlement: {
        in: { position: v3(0, -237, 0), time: DURATION_ANIM_IN },
        out: { time: DURATION_ANIM_OUT },
    },
    chipContainerSettlement: {
        in: { position: v3(0, 215, 0), time: DURATION_ANIM_IN },
        out: { time: DURATION_ANIM_OUT },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUpBet: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersWhenLive: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    swapButtonWhenBet: {
        in: { positionY: -294, opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_IN },
    },
    swapButtonWhenLive: {
        in: { positionY: -34, opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_IN },
    },
};
