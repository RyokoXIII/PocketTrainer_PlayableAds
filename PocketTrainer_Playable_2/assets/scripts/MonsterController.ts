
import { _decorator, BoxCollider, Component, ITriggerEvent, Material, MeshRenderer, Node, tween, Tween } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;


@ccclass('MonsterController')
export class MonsterController extends Component {

    @property(GameManager)
    manager: GameManager = null;
    @property(Node)
    body: Node = null;
    @property(Material)
    defaultMat: Material = null;
    @property(Material)
    mat: Material = null;

    private tweenThen!: Tween<Node>;

    start() {
        let myCollider = this.body.getComponent(BoxCollider);
        myCollider.on('onTriggerEnter', (target: ITriggerEvent) => {

            // Detect Monster hit
            if (target.otherCollider.node.name == 'fire ball') {
                const comp = this.body.getComponent(MeshRenderer);
                comp.material = this.mat;
                comp.setMaterial(this.mat, 0);
                this.manager.monsterHitSfx.play();

                this.tweenThen = tween(this.body)
                    .call(() => {
                        comp.setMaterial(this.mat, 0);
                    })
                    .delay(0.15)
                    .call(() => {
                        comp.setMaterial(this.defaultMat, 0);
                    })
                    .start();
            }
        });
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

