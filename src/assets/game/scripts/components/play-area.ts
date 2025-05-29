import gc from "@sg/game-client-base";
import { Button, Node, _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { GamePhase, PhaseId } from "../features/game-phase/game-phase-definitions";
import { GamePhaseStore } from "../features/game-phase/game-phase-store";
import { settings } from "../game-settings";
import { BetChoicesContainer } from "./bet-options/bet-choices-container";
import { AnimationHelper } from "./helpers/animation-helper";
import { DEFAULT_TWEEN_CONFIGS, DEFAULT_TWEEN_CONFIGS_PORTRAIT, TweenConfigs, TweenKey } from "./helpers/tween-configs";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

type BetState = "prev" | "live" | "final";

@ccclass("PlayArea")
export class PlayArea extends ObserverComponent {
    @property(Node)
    private chipContainersParent: Node = null;

    @property(BetChoicesContainer)
    private betChoicesContainer: BetChoicesContainer = null;

    @property(Node)
    private scoreBoard: Node = null;

    @property(Node)
    private chips: Node = null;

    @property(Node)
    private teamScore: Node = null;

    @property(Node)
    private hiddenPlayersNode: Node = null;

    @property
    private isPortrait = false;

    private isZoomOut: boolean = false;

    private tweenConfigs: Record<TweenKey, TweenConfigs> = DEFAULT_TWEEN_CONFIGS;

    private phasePreviewBets: BetState = "prev";
    private phaseShowBetChoices: BetState = "prev";

    protected betChoicesParentContainer: Node = null;

    onLoad() {
        if (this.isPortrait) {
            this.tweenConfigs = DEFAULT_TWEEN_CONFIGS_PORTRAIT;
            console.log("this.tweenConfigs", this.tweenConfigs);
        }
        this.initBetChoicesContainer();
        this.setupStaticTargets();
        super.onLoad();

        this.betChoicesContainer.swapBetsButton.on(Button.EventType.CLICK, this.swapBets, this);
    }

    private initBetChoicesContainer() {
        this.betChoicesParentContainer = this.betChoicesContainer?.betChoicesPrev?.parent;
    }

    private setupStaticTargets() {
        const staticTargets = [
            { node: this.teamScore, config: this.tweenConfigs.fadeInOut.out },
            { node: this.scoreBoard, config: this.tweenConfigs.fadeInOut.out },
            { node: this.chips, config: this.tweenConfigs.fadeInOut.out },
            { node: this.hiddenPlayersNode, config: this.tweenConfigs.hiddenPlayersFlyUpBet.out },
        ];

        staticTargets.forEach(({ node, config }) => {
            AnimationHelper.setStaticTarget(node, config);
        });
    }

    @render(GamePhaseStore, (store) => store.enterPhase)
    async renderEnterPhase(phase: GamePhase) {
        if (!phase) {
            return;
        }

        if (phase.id === PhaseId.Settlement || phase.id === PhaseId.ShowWinnerAndTournament) {
            AnimationHelper.playAnimByPhaseProgress(this.hiddenPlayersNode, this.tweenConfigs.hiddenPlayersWhenLive.in, phase.progress);
            if (phase.progress === 0) {
                AnimationHelper.playAnimByPhaseProgress(
                    [this.betChoicesParentContainer, this.chipContainersParent],
                    [this.tweenConfigs.betChoiceSettlement.in, this.tweenConfigs.chipContainerSettlement.in],
                    0
                );
            }
        }

        if (phase.id === PhaseId.MatchWinner) {
            !this.isZoomOut && this.zoomBetChoices("out", phase.progress);
            AnimationHelper.playAnimByPhaseProgress([this.hiddenPlayersNode], [this.tweenConfigs.fadeInOut.out], phase.progress);

            return;
        }

        if (phase.id === PhaseId.ShowBetChoicesPrev || phase.id === PhaseId.ShowBetChoicesLive) {
            this.phaseShowBetChoices = phase.id === PhaseId.ShowBetChoicesPrev ? "prev" : "live";
            await Promise.all([
                this.isZoomOut && this.zoomBetChoices("in", phase.progress),

                AnimationHelper.playAnimByPhaseProgress(
                    [this.scoreBoard, this.chips, this.hiddenPlayersNode, this.teamScore, this.betChoicesContainer.swapBetsButton],
                    [
                        this.tweenConfigs.fadeInOut.in,
                        this.tweenConfigs.fadeInOut.in,
                        this.tweenConfigs.hiddenPlayersFlyUpBet.in,
                        this.tweenConfigs.fadeInOut.in,
                        this.tweenConfigs.swapButtonWhenBet.in,
                    ],
                    phase.progress
                ),
            ]);
        }

        if (phase.id === PhaseId.ShowIntroVideo || phase.id === PhaseId.ShowPrevVideo || phase.id === PhaseId.ShowLiveVideo) {
            this.phasePreviewBets = phase.id === PhaseId.ShowLiveVideo ? "live" : "prev";

            await Promise.all([
                AnimationHelper.playAnimByPhaseProgress(
                    [this.teamScore, this.scoreBoard, this.chips, this.hiddenPlayersNode, this.betChoicesContainer.swapBetsButton],
                    [
                        this.tweenConfigs.fadeInOut.in,
                        this.tweenConfigs.fadeInOut.out,
                        this.tweenConfigs.fadeInOut.out,
                        this.tweenConfigs.hiddenPlayersWhenLive.out,
                        this.tweenConfigs.swapButtonWhenLive.in,
                    ],
                    phase.progress
                ),
                !this.isZoomOut && this.zoomBetChoices("out", phase.progress),
            ]);

            return;
        }
    }

    @render(GamePhaseStore, (store) => store.exitPhase)
    async renderExitPhase(phase: GamePhase) {
        if (!phase) {
            return;
        }

        if (phase.id === PhaseId.Halftime) {
            AnimationHelper.playAnimByPhaseProgress(this.teamScore, this.tweenConfigs.fadeInOut.out, phase.progress);
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.currentFinish, {
        fireImmediately: false,
    })
    async showPlayArea(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish) {
            return;
        }
        try {
            await AnimationUtils.delayTime(settings.durations.outro);
            AnimationHelper.playAnimByPhaseProgress(
                [this.teamScore, this.betChoicesParentContainer, this.chipContainersParent],
                [this.tweenConfigs.fadeInOut.out, this.tweenConfigs.betChoiceSettlement.in, this.tweenConfigs.chipContainerSettlement.in],
                0
            );
        } catch (e) {}
    }

    private async zoomBetChoices(direction: "in" | "out", progress: number): Promise<void> {
        this.isZoomOut = direction === "out";

        const target = { target: this.betChoicesParentContainer, key: "betChoiceZoomInOut" as TweenKey };
        if (progress === 0) {
            await AnimationHelper.playAnimForTarget(target.target, this.tweenConfigs[target.key][direction]);
        } else {
            await this.setStaticBetChoices(direction);
        }
    }

    private async setStaticBetChoices(direction: "in" | "out"): Promise<void> {
        this.isZoomOut = direction === "out";

        const target = { target: this.betChoicesParentContainer, key: "betChoiceZoomInOut" as TweenKey };
        await AnimationHelper.setStaticTarget(target.target, this.tweenConfigs[target.key][direction]);
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    swapBets() {
        if (this.phaseShowBetChoices === "live" || this.phasePreviewBets === "live") {
            const isSwapBets = this.betChoicesContainer.getIsSwapBets();
            this.betChoicesContainer.setIsSwapBets(!isSwapBets);
            this.betChoicesContainer.setEnableBetChoices("live");
        }
    }
}
