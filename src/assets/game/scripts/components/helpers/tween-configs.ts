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
    | "chipContainerFlyDown"
    | "fadeInOut"
    | "chipsFlyDown"
    | "teamScoreFlyUp"
    | "betChoiceZoomInOut"
    | "scoreboardFlyUp"
    | "teamScorePlaceBetFlyUp"
    | "hiddenPlayersFlyUp";

export const DURATION_ANIM_IN = 0.5;
export const DURATION_ANIM_OUT = 0.7;

export const DEFAULT_TWEEN_CONFIGS: Record<TweenKey, TweenConfigs> = {
    betChoiceZoomInOut: {
        in: { position: v3(0, -68, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -278, 0), time: DURATION_ANIM_OUT },
    },
    chipContainerFlyDown: {
        in: { position: v3(0, 0, 0), time: DURATION_ANIM_IN },
        out: { position: v3(0, -560, 0), time: DURATION_ANIM_OUT },
    },
    fadeInOut: {
        in: { opacity: 255, time: DURATION_ANIM_IN },
        out: { opacity: 1, time: DURATION_ANIM_OUT },
    },
    chipsFlyDown: {
        in: { positionY: -369, opacity: 255, time: DURATION_ANIM_IN },
        out: { positionY: -835, opacity: 1, time: DURATION_ANIM_OUT },
    },
    teamScorePlaceBetFlyUp: {
        in: { positionY: 289, opacity: 255, time: DURATION_ANIM_IN },
        out: { positionY: 555, opacity: 1, time: DURATION_ANIM_OUT },
    },
    scoreboardFlyUp: {
        in: { positionY: -400, opacity: 255, time: DURATION_ANIM_IN },
        out: { positionY: -750, opacity: 1, time: DURATION_ANIM_OUT },
    },
    teamScoreFlyUp: {
        in: { positionY: 353, opacity: 255, time: DURATION_ANIM_IN },
        out: { positionY: 560, opacity: 1, time: DURATION_ANIM_OUT },
    },
    hiddenPlayersFlyUp: {
        in: { positionY: -379, opacity: 255, time: DURATION_ANIM_IN },
        out: { positionY: -571, opacity: 1, time: DURATION_ANIM_OUT },
    },
};

// change bets: in
