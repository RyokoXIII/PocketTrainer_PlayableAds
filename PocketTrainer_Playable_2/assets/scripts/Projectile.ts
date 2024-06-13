
import { _decorator, Component, ITriggerEvent, Node, SphereCollider, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Projectile')
export class Projectile extends Component {
    

    start () {
        let myCollider = this.getComponent(SphereCollider);
        myCollider.on('onTriggerEnter', (target: ITriggerEvent) => {

            // Detect Monster hit
            if (target.otherCollider.node.name == 'polySurface5') {
                console.log("hit Monster!");
                this.node.active = false;
            }
            else if (target.otherCollider.node.name == 'obstacle Zone') {
                this.node.active = false;
            }
        });
    }

    update (deltaTime: number) {
        this.node.translate(new Vec3(0,0, -1 * 30 * deltaTime));
    }
}

