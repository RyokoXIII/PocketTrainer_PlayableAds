
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    followTarget: Node | null = null!;

    lateUpdate(deltaTime: number) {
        if (this.followTarget) {
            const pos = this.followTarget.worldPosition;
            const pos2 = this.node.worldPosition;
            this.node.worldPosition = new Vec3(pos2.x, pos2.y, pos.z);
        }
    }
}

