/**
 * Created by xiyuan_fengyu on 2017/4/4.
 */
class EjectionRaySkill extends BaseSkill {

    private ray: egret.Shape;

    private maxRayWidth: number = 6;

    private rayColor: number = 0xE35867;

    private maxPathNum: number = 15;

    private rayWidthChangeRate: number = Math.pow(this.maxRayWidth, 1 / this.maxPathNum);

    private rayPath = [];

    private contactIndex = 0;

    private contractMax = 5;

    private velocityDeltaRate = 0.4;

    private lastTarget: Enemy;

    private nextTarget: Enemy;

    //每穿透一个敌人，伤害衰减为当前的0.8
    private power: number = 100;

    private powerDeltaRate = 0.8;

    constructor(ctx: egret.DisplayObjectContainer, world: p2.World, x: number, y: number) {
        super(ctx, world, "EjectionRaySkill");

        this.maxSpeed = 35;

        this.safeBounds = {
            left: -200,
            right: this.ctx.stage.stageWidth + 200,
            top: -200,
            bottom: this.ctx.stage.stageHeight + 200
        };

        this.create(x, y - this.maxRayWidth / 2);
    }

    private create(x: number, y: number) {
        this.ray = new egret.Shape();
        this.ray.width = this.ctx.stage.stageWidth;
        this.ray.height = this.ctx.stage.stageHeight;

        this._body = BaseBody.createWithDisplay(this.ray, this, {
            width: this.maxRayWidth,
            height: this.maxRayWidth
        });
        this._body.velocity[1] = this.maxSpeed;
        this._body.collisionResponse = false;
        this._body.position = [x / BaseBody.factor, (this.ctx.stage.stageHeight - y) / BaseBody.factor];
        this.ray.x = 0;
        this.ray.y = 0;
    }

    beginContact(event, other) {
        let otherSprite = other.sprite;
        if (otherSprite) {
            if (otherSprite instanceof Enemy && (this.lastTarget != otherSprite)) {
                if (this.contactIndex < this.contractMax) {
                    this.contactIndex += 1;

                    this.nextTarget = otherSprite;
                    this.findNextTarget();
                }
                else {
                    this.nextTarget = null;
                }

                (<Enemy>otherSprite).takeDamage(this.power);
                this.power *= this.powerDeltaRate;
            }
        }
    }

    private findNextTarget() {
        let otherEnemys = this.findSpriteByFlag<Enemy>("Enemy").filter(enemy => enemy != this.nextTarget);
        if (otherEnemys.length > 0) {
            this.lastTarget = this.nextTarget;
            this.nextTarget = otherEnemys[parseInt("" + Math.random() * otherEnemys.length)];
        }
    }

    beforeWorldUpdate(delta: number) {
        if (this.nextTarget && !this.nextTarget.destroyed && this.contactIndex < this.contractMax) {
            let x = this._body.position[0];
            let y = this._body.position[1];

            let targetX = this.nextTarget.body.position[0];
            let targetY = this.nextTarget.body.position[1];

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

    afterWorldUpdate(delta: number) {
        let x = this._body.position[0] * BaseBody.factor;
        let y = this.ctx.stage.stageHeight - this._body.position[1] * BaseBody.factor;
        this.rayPath.push([x, y]);

        this.drawRay();

        this.checkSafeBounds(x, y);
    }

    drawRay() {
        if (this.rayPath.length > 1) {
            let display = <egret.Shape> this._body.displays[0];
            let g = display.graphics;
            g.clear();

            let len = this.rayPath.length;
            let curWidth = 1;
            for (let i = Math.max(1, len - this.maxPathNum + 1); i < len; i++) {
                g.lineStyle(curWidth, this.rayColor, curWidth / this.maxRayWidth + 0.3);

                let lastPoint = this.rayPath[i - 1];
                g.moveTo(lastPoint[0], lastPoint[1]);

                let point = this.rayPath[i];
                g.lineTo(point[0], point[1]);

                curWidth *= this.rayWidthChangeRate;
            }
        }
    }

    onDestory() {
        this.rayPath = null;
    }

}