/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class Enemy extends BaseSprite {

    //普通攻击间隔，单位毫秒
    protected normalShootRate = 200;

    protected normalShootTime = 0;

    private velocityDeltaRate = 0.1;

    private velocityChangeTime = 800;

    constructor(ctx: egret.DisplayObjectContainer, world: p2.World, x?: number, y?: number) {
        super(ctx, world, "Enemy");

        this.initLife(120);

        this.safeBounds.top = -300;
        this.maxSpeed = 15;

        this._body = BaseBody.createFromDB("enemy_1", "body", this);
        this.curAnimationName = "fly_normal";
        this._body.displays[0]["animation"].play(this.curAnimationName, 0);
        this._body.fixedRotation = true;
        this._body.setEgretPosition(x, y);
    }

    beforeWorldUpdate(delta: number) {
        this.velocityChangeTime -= delta;
        if (this.velocityChangeTime <= 0) {
            this._body.velocity = [0, -this.maxSpeed];
            return;
        }


        let players = this.findSpriteByType(Player);
        if (players.length > 0) {
            let player = players[0];

            let x = this._body.position[0];
            let y = this._body.position[1];

            let targetX = player.body.position[0];
            let targetY = player.body.position[1];

            let targetV = [targetX - x, targetY - y];
            let curV = this._body.velocity;
            let targetVLen = Math.pow(targetV[0] * targetV[0] + targetV[1] * targetV[1], 0.5);
            if (targetVLen > 0) {
                targetV[0] = targetV[0] / targetVLen * this.maxSpeed;
                targetV[1] = targetV[1] / targetVLen * this.maxSpeed;
                let deltaV = [(targetV[0] - curV[0]) * this.velocityDeltaRate, (targetV[1] - curV[1]) * this.velocityDeltaRate];
                let newV = [curV[0] + deltaV[0], curV[1] + deltaV[1]];
                let newVLen = Math.pow(newV[0] * newV[0] + newV[1] * newV[1], 0.5);
                newV[0] = newV[0] / newVLen * this.maxSpeed;
                newV[1] = newV[1] / newVLen * this.maxSpeed;
                this._body.velocity = newV;
            }
        }
    }

    onZeroLife() {
        if (this.curAnimationName != "explosion") {
            this.curAnimationName = "explosion";
            let display = this._body.displays[0];
            display["animation"].play(this.curAnimationName, 0);
            display.addEventListener( dragonBones.AnimationEvent.LOOP_COMPLETE, event => {
                this.destory();
            },this);
        }
    }

}