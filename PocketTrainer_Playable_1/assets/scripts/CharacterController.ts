
import { _decorator, AudioSource, CapsuleCollider, Component, EventTouch, Input, input, instantiate, ITriggerEvent, Label, Node, ParticleSystem, PhysicsSystem, Prefab, RigidBody, SkeletalAnimation, SystemEventType, tween, Tween, v3, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { RigidCharacter } from './RigidCharacter';
import { PREVIEW } from 'cc/env';
import { CameraFollow } from './CameraFollow';
const { ccclass, property } = _decorator;
const v3_0 = new Vec3();

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property(RigidCharacter)
    character: RigidCharacter = null!;
    @property(GameManager)
    gameManager: GameManager = null;
    @property(Node)
    bossPos: Node = null;
    @property(Prefab)
    collectVfx: Prefab = null;
    @property(ParticleSystem)
    hitVfx: ParticleSystem = null;
    @property(Node)
    runVfx: Node = null;


    @property(Node)
    mainCamera: Node = null;
    @property(Node)
    subCamera: Node = null;
    @property(Node)
    subCamera2: Node = null;

    // Game UI
    @property(Node)
    loseUI: Node = null;
    @property(Node)
    winUI: Node = null;
    @property(Label)
    moneyText: Label = null;
    @property(Node)
    cta: Node = null;

    @property(Node)
    loseUI2: Node = null;
    @property(Node)
    winUI2: Node = null;
    @property(Label)
    moneyText2: Label = null;

    @property(AudioSource)
    music: AudioSource = null;
    @property(AudioSource)
    battleMusic: AudioSource = null;
    @property(AudioSource)
    loseMusic: AudioSource = null;
    @property(AudioSource)
    collectSfx: AudioSource = null;
    @property(AudioSource)
    hitSfx: AudioSource = null;

    @property
    speed: Vec3 = new Vec3(1, 0, 1);

    protected _stateX: number = 0;  // 1 positive, 0 static, -1 negative
    protected _stateZ: number = 0;
    protected _speed = 0;

    isRunning = false;
    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;
    private tweenThen4!: Tween<Node>;
    private tweenThen5!: Tween<Node>;
    private tweenThen6!: Tween<Node>;

    public moneyCount: number = 0;
    currentPos: Vec3;
    public isMoving: boolean = false;


    start() {
        let myCollider = this.getComponent(CapsuleCollider);
        myCollider.on('onTriggerEnter', (target: ITriggerEvent) => {
            if (target.otherCollider.node.name == 'money') {
                target.otherCollider.node.getChildByName('Box002').active = false;
                const myVfx = instantiate(this.collectVfx);
                myVfx.setParent(target.otherCollider.node);
                this.moneyCount += 10;
                this.moneyText.string = this.moneyCount.toString();
                this.moneyText2.string = this.moneyCount.toString();
                this.collectSfx.play();
            }

            else if (target.otherCollider.node.name == 'goal trigger') {
                this.gameManager.isStarted = false;
                this.node.getComponent(RigidBody).type = RigidBody.Type.KINEMATIC
                this.node.setPosition(this.currentPos);

                // move to boss pos
                let move = tween().to(1.5, { position: new Vec3(this.bossPos.position.x, this.node.position.y, this.bossPos.position.z) }, { easing: 'smooth' });
                this.tweenThen = tween(this.node)
                    .then(move)
                    .call(() => {
                        this.node.getComponent(SkeletalAnimation).play('idle');
                        // this.gameManager.pet.getComponent(SkeletalAnimation).play('idle');
                        this.runVfx.active = false;
                        this.mainCamera.getComponent(CameraFollow).enabled = false;
                        this.music.stop();
                    })
                    .start();

                // Zoom in boss
                let move2 = tween().to(1, { position: new Vec3(this.subCamera.position.x, this.subCamera.position.y, this.subCamera.position.z) }, { easing: 'smooth' });
                this.tweenThen2 = tween(this.mainCamera)
                    .delay(2)
                    .then(move2)
                    .delay(0.5)
                    .call(() => {
                        this.subCamera.active = true;
                        this.winUI.active = true;
                        this.winUI2.active = true;
                        this.cta.active = true;
                        this.battleMusic.play();
                    })
                    .start();

                if (this.subCamera2.active == true) {
                    this.tweenThen3 = tween(this.subCamera2)
                        .delay(2)
                        .then(move2)
                        .delay(0.5)
                        .call(() => {
                            this.subCamera.active = true;
                            this.winUI.active = true;
                            this.winUI2.active = true;
                            this.cta.active = true;
                        })
                        .start();
                }
            }

            // hit obstacles
            else if (target.otherCollider.node.name == 'obstacle') {
                this.gameManager.isStarted = false;
                this.node.getComponent(RigidBody).type = RigidBody.Type.KINEMATIC
                this.node.setPosition(this.currentPos);
                this.node.getComponent(SkeletalAnimation).play('death');
                // this.gameManager.pet.getComponent(SkeletalAnimation).play('idle');
                this.hitVfx.play();
                this.runVfx.active = false;
                this.hitSfx.play();

                this.scheduleOnce(this.onLoseSchedule, 1);
            }
        });

        // set current node pos
        this.currentPos = this.node.position;
    }

    onLoseSchedule() {
        this.loseUI.active = true;
        this.loseUI2.active = true;
        this.loseMusic.play();
        this.cta.active = true;
    }

    update(deltaTime: number) {
        const dt = PhysicsSystem.instance.fixedTimeStep;

        if (this.gameManager.isStarted == true) {

            // // Move player
            this.currentPos = this.node.position;
            this.updateCharacter(dt);

            if (this.isRunning == false) {
                this.node.getComponent(SkeletalAnimation).play('run');
                this.runVfx.active = true;
                this.isRunning = true;
            }

            // set dead zone
            // if (this.node.position.x >= 53.237) {
            //     this.node.setPosition(new Vec3(53.237, this.node.position.y, this.node.position.z));
            // }
            // else if (this.node.position.x <= -51.601) {
            //     this.node.setPosition(new Vec3(-51.601, this.node.position.y, this.node.position.z));
            // }
            // else if (this.node.position.z <= -82.05) {
            //     this.node.setPosition(new Vec3(this.node.position.x, this.node.position.y, -82.05));
            // }
            // else if (this.node.position.z >= 21.918) {
            //     this.node.setPosition(new Vec3(this.node.position.x, this.node.position.y, 21.918));
            // }
        }
    }

    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.touchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);

    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.touchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);
    }

    touchStart(touch: EventTouch) {
        this._stateX = 0;
    }

    touchMove(touch: EventTouch) {
        let x = touch.getUIDelta().x;
        if (x > 0) {
            this._stateX = this.speed.x;
        } else {
            this._stateX = -this.speed.x;
        }
    }

    touchEnd(touch: EventTouch) {
        this._stateX = 0;
    }

    touchCancel(touch: EventTouch) {
        this._stateX = 0;
    }

    updateCharacter(dt: number) {
        // this.character.updateFunction(dt);

        // move
        this._stateZ = this.speed.z;
        if (!this.character.onGround) return;
        if (this._stateX || this._stateZ) {
            v3_0.set(this._stateX, 0, this._stateZ);
            v3_0.normalize();
            this.character.move(v3_0, 5);
        }
    }
}

