import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { GamePhase, PhaseId } from "../../features/game-phase/game-phase-definitions";
import { GamePhaseStore } from "../../features/game-phase/game-phase-store";
import { settings } from "../../game-settings";
import { AnimationHelper } from "../helpers/animation-helper";
import { DEFAULT_TWEEN_CONFIGS_PORTRAIT } from "../helpers/tween-configs";
import { PlayArea } from "../play-area";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass("PlayAreaPortrait")
export class PlayAreaPortrait extends PlayArea {
    onLoad() {
        this.tweenConfigs = DEFAULT_TWEEN_CONFIGS_PORTRAIT;
        super.onLoad();
    }

    protected override setupStaticTargets() {
        const staticTargets = [
            { node: this.teamScore, config: this.tweenConfigs.fadeInOut.out },
            { node: this.hiddenPlayersNode, config: this.tweenConfigs.fadeInOut.out },
            { node: this.chips, config: this.tweenConfigs.fadeInOut.out },
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
            this.handleSettlementOrShowWinnerPhase(phase);
            return;
        }

        if (phase.id === PhaseId.MatchWinner) {
            this.handleMatchWinnerPhase(phase);
            return;
        }

        if (phase.id === PhaseId.ShowBetChoicesPrev || phase.id === PhaseId.ShowBetChoicesLive) {
            await this.handleShowBetChoicesPhase(phase);
            return;
        }

        if (phase.id === PhaseId.ShowIntroVideo || phase.id === PhaseId.ShowPrevVideo || phase.id === PhaseId.ShowLiveVideo) {
            await this.handleShowVideoPhase(phase);
        }
    }

    protected override async handleShowBetChoicesPhase(phase: GamePhase) {
        this.phaseShowBetChoices = phase.id === PhaseId.ShowBetChoicesPrev ? "prev" : "live";
        const zoomPromise = this.isBetOptionsZoomedOut ? this.zoomBetChoices("in", phase.progress) : undefined;
        const animPromise = AnimationHelper.playAnimByPhaseProgress(
            [this.scoreBoard, this.chips, this.hiddenPlayersNode, this.teamScore, this.betChoicesContainer.swapBetsButton],
            [
                this.tweenConfigs.scoreBoardInOut.in,
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.fadeInOut.in,
            ],
            phase.progress
        );
        await Promise.all([zoomPromise, animPromise]);
    }

    protected override async handleShowVideoPhase(phase: GamePhase) {
        this.phasePreviewBets = phase.id === PhaseId.ShowLiveVideo ? "live" : "prev";
        const animPromise = AnimationHelper.playAnimByPhaseProgress(
            [this.teamScore, this.scoreBoard, this.chips, this.hiddenPlayersNode, this.betChoicesContainer.swapBetsButton],
            [
                this.tweenConfigs.fadeInOut.in,
                this.tweenConfigs.scoreBoardInOut.out,
                this.tweenConfigs.fadeInOut.out,
                this.tweenConfigs.fadeInOut.out,
                this.tweenConfigs.swapButtonWhenLive.in,
            ],
            phase.progress
        );
        const zoomPromise = !this.isBetOptionsZoomedOut ? this.zoomBetChoices("out", phase.progress) : undefined;
        await Promise.all([animPromise, zoomPromise]);
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
                [this.teamScore, this.betChoicesParentContainer],
                [this.tweenConfigs.fadeInOut.out, this.tweenConfigs.betChoiceSettlement.in],
                0
            );
        } catch (e) {}
    }
}
