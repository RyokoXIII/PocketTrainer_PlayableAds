
import { _decorator, AudioSource, Component, EventTouch, Node, SkeletalAnimation, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;
declare var window;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    startGame: Node = null;
    @property(Node)
    tut: Node = null;
    @property(Node)
    tut2: Node = null;
    @property(Node)
    subCamera2: Node = null;

    @property(Node)
    pet: Node = null;

    @property(Node)
    portraitUI: Node = null;
    @property(Node)
    landscapeUI: Node = null;

    @property(AudioSource)
    music: AudioSource = null;

    public isStarted = false;


    onLoad() {
        window.gameReady && window.gameReady();
    }

    start() {
        this.startGame.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
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
        this.startGame.active = false;
        this.tut.active = false;
        this.tut2.active = false;
        this.music.play();
        // this.pet.getComponent(SkeletalAnimation).play('run');
    }
}

