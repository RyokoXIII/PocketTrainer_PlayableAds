
import { _decorator, AudioSource, Component, EventTouch, Label, Node, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;
declare var window;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    subCamera2: Node = null;
    @property(Node)
    character: Node = null;

    // UI
    @property(Node)
    startGameBtn: Node = null;
    @property(Node)
    startGameBtn2: Node = null;
    @property(Node)
    tut: Node = null;
    @property(Node)
    tut2: Node = null;

    @property(Node)
    portraitUI: Node = null;
    @property(Node)
    landscapeUI: Node = null;
    @property(Node)
    loseUI: Node = null;
    @property(Label)
    moneyText: Label = null;
    @property(Label)
    candyText: Label = null;
    @property(Label)
    mushroomText: Label = null;
    @property(Node)
    cta: Node = null;

    @property(Node)
    loseUI2: Node = null;
    @property(Label)
    moneyText2: Label = null;
    @property(Label)
    candyText2: Label = null;
    @property(Label)
    mushroomText2: Label = null;

    @property(AudioSource)
    battleMusic: AudioSource = null;
    @property(AudioSource)
    loseMusic: AudioSource = null;
    @property(AudioSource)
    collectSfx: AudioSource = null;
    @property(AudioSource)
    hitSfx: AudioSource = null;
    @property(AudioSource)
    shootSfx: AudioSource = null;
    @property(AudioSource)
    monsterHitSfx: AudioSource = null;

    @property(AudioSource)
    music: AudioSource = null;

    public isStarted = false;


    onLoad() {
        window.gameReady && window.gameReady();
    }

    start() {
        this.startGameBtn.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.startGameBtn2.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    update(dt: number) {
        // Check Device orientation
        var frameSize = view.getVisibleSize();
        if (frameSize.height > frameSize.width) {
            // portrait
            this.portraitUI.active = true;
            this.landscapeUI.active = false;

            this.subCamera2.active = false;
        }
        else if (frameSize.height < frameSize.width) {
            // landscape
            this.portraitUI.active = false;
            this.landscapeUI.active = true;

            this.subCamera2.active = true;
        }
    }

    onTouchStart() {
        this.isStarted = true;
        this.startGameBtn.active = false;
        this.startGameBtn2.active = false;
        this.tut.active = false;
        this.tut2.active = false;
        this.music.play();
    }
}

