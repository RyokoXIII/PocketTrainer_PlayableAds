
import { _decorator, AudioSource, CapsuleCollider, Collider, Component, EventTouch, Input, input, instantiate, ITriggerEvent, Label, Node, NodePool, PhysicsSystem, Prefab, RigidBody, SkeletalAnimation, SphereCollider, SystemEventType, tween, Tween, v3, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { RigidCharacter } from './RigidCharacter';
import { PREVIEW } from 'cc/env';
import { CameraFollow } from './CameraFollow';
import { Projectile } from './Projectile';
const { ccclass, property } = _decorator;
const v3_0 = new Vec3();

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property(RigidCharacter)
    character: RigidCharacter = null!;
    @property(Node)
    pokemon: Node = null;
    @property(Node)
    monsterPlant: Node = null;
    @property(GameManager)
    manager: GameManager = null;
    @property(Node)
    bossPos: Node = null;
    @property(Node)
    shootPos: Node = null;

    @property(Prefab)
    fireBallPrefab: Prefab = null;

    // VFX
    @property(Node)
    fireFx: Node = null;
    @property(Prefab)
    collectVfx: Prefab = null;
    @property(Prefab)
    hitVfx: Prefab = null;
    @property(Node)
    runVfx: Node = null;

    // Camera
    @property(Node)
    mainCamera: Node = null;
    @property(Node)
    subCamera: Node = null;
    @property(Node)
    subCamera2: Node = null;

    @property
    speed: Vec3 = new Vec3(1, 0, 1);

    protected _stateX: number = 0;  // 1 positive, 0 static, -1 negative
    protected _stateZ: number = 0;
    public moneyCount: number = 0;
    public candyCount: number = 0;
    public mushroomCount: number = 0;
    protected _speed = 0;
    currentPos: Vec3;

    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;
    private tweenThen4!: Tween<Node>;
    private tweenThen5!: Tween<Node>;
    private tweenThen6!: Tween<Node>;

    isRunning = false;
    public isMoving: boolean = false;
    fireBallPool: NodePool;


    protected onLoad(): void {
        // create node pool
        this.fireBallPool = new NodePool();
        let fireBallNum = 10;

        for (let i = 0; i < fireBallNum; i++) {
            let mFireBall = instantiate(this.fireBallPrefab);
            this.fireBallPool.put(mFireBall);
        }
    }

    start() {
        let myCollider = this.getComponent(CapsuleCollider);
        myCollider.on('onTriggerEnter', (target: ITriggerEvent) => {

            // Collect items
            if (target.otherCollider.node.name == 'money') {
                target.otherCollider.node.getChildByName('Box002').active = false;
                const myVfx = instantiate(this.collectVfx);
                myVfx.setParent(target.otherCollider.node);
                this.moneyCount += 10;
                this.manager.moneyText.string = this.moneyCount.toString();
                this.manager.moneyText2.string = this.moneyCount.toString();
                this.manager.collectSfx.play();
            }
            else if (target.otherCollider.node.name == 'candy') {
                target.otherCollider.node.getChildByName('candy').active = false;
                const myVfx = instantiate(this.collectVfx);
                myVfx.setParent(target.otherCollider.node);
                this.candyCount += 5;
                this.manager.candyText.string = this.candyCount.toString();
                this.manager.candyText2.string = this.candyCount.toString();
                this.manager.collectSfx.play();
            }
            else if (target.otherCollider.node.name == 'mushroom') {
                target.otherCollider.node.getChildByName('Cylinder005').active = false;
                const myVfx = instantiate(this.collectVfx);
                myVfx.setParent(target.otherCollider.node);
                this.mushroomCount += 5;
                this.manager.mushroomText.string = this.mushroomCount.toString();
                this.manager.mushroomText2.string = this.mushroomCount.toString();
                this.manager.collectSfx.play();
            }

            // Shooting trigger
            else if (target.otherCollider.node.name == 'target trigger') {
                this.monsterPlant.getComponent(SkeletalAnimation).play('detect');
                this.manager.shootSfx.play();

                for (let i = 0; i < 10; i++) {
                    // let mFireBall = instantiate(this.fireBallPrefab);
                    // this.fireBallPool.put(mFireBall);
                    // get fire ball
                    let fireBall = null;
                    fireBall = instantiate(this.fireBallPrefab);
                    fireBall.parent = this.shootPos; // add new enemy node to the node tree
                    fireBall.addComponent(Projectile);
                    fireBall.addComponent(SphereCollider);
                    fireBall.addComponent(RigidBody);
                    fireBall.getComponent(SphereCollider).isTrigger = true;
                    fireBall.getComponent(RigidBody).isKinematic = true;
                    // fireBall = this.fireBallPool.get();
                    // if (this.fireBallPool.size() > 0) { // use size method to check if there're nodes available in the pool
                    //     fireBall = this.fireBallPool.get();
                    // } else { // if not enough node in the pool, we call cc.instantiate to create node
                    this.schedule(this.onShoot, 0.3);
                    // }
                }
            }

            // hit obstacles
            else if (target.otherCollider.node.name == 'obstacle' || target.otherCollider.node.name == 'polySurface5' ||
                target.otherCollider.node.name == 'wall') {
                this.manager.isStarted = false;
                this.node.getComponent(RigidBody).type = RigidBody.Type.KINEMATIC
                this.node.setPosition(this.currentPos);
                this.node.getComponent(SkeletalAnimation).play('death');
                this.pokemon.getComponent(SkeletalAnimation).play('idle');
                this.fireFx.active = false;
                const myVfx2 = instantiate(this.hitVfx);
                myVfx2.setParent(this.node);
                this.runVfx.active = false;
                this.manager.hitSfx.play();

                // stop shooting
                this.manager.shootSfx.stop();
                this.unschedule(this.onShoot);

                this.scheduleOnce(this.onLoseSchedule, 1);
            }
        });

        // set current node pos
        this.currentPos = this.node.position;
    }

    onShoot() {
        let fireBall = null;
        fireBall = instantiate(this.fireBallPrefab);
        fireBall.parent = this.shootPos; 
        fireBall.addComponent(Projectile);
        fireBall.addComponent(SphereCollider);
        fireBall.addComponent(RigidBody);
        fireBall.getComponent(SphereCollider).isTrigger = true;
        fireBall.getComponent(RigidBody).isKinematic = true;
    }

    onLoseSchedule() {
        this.manager.loseUI.active = true;
        this.manager.loseUI2.active = true;
        this.manager.loseMusic.play();
        this.manager.cta.active = true;
    }

    update(deltaTime: number) {
        const dt = PhysicsSystem.instance.fixedTimeStep;

        if (this.manager.isStarted == true) {

            // // Move player
            this.currentPos = this.node.position;
            this.updateCharacter(dt);

            if (this.isRunning == false) {
                this.node.getComponent(SkeletalAnimation).play('run');
                this.pokemon.getComponent(SkeletalAnimation).play('run');
                this.fireFx.active = true;
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

    // Character Controller
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

