import Bitmap = egret.Bitmap;
/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class Player extends BaseSprite {

    protected keyStatus: any = {};

    //普通攻击间隔，单位毫秒
    protected normalShootRate = 200;

    protected normalShootTime = 0;

    constructor(ctx: egret.DisplayObjectContainer, world: p2.World) {
        super(ctx, world, "Player");

        this.maxSpeed = 15;
        this.speedDelta = this.maxSpeed / 5;

        this._body = BaseBody.createFromDB("player_1", "body", this);
        this.curAnimationName = "fly_normal";
        this._body.displays[0]["animation"].play(this.curAnimationName, 0);
        this._body.fixedRotation = true;
        this._body.setEgretPosition(this.ctx.stage.stageWidth / 2, this.ctx.stage.stageHeight - 200);

        this.setKeyListener();
    }

    protected setKeyListener() {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.keyStatus[event.key] = true;
        }, false);
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.keyStatus[event.key] = false;
        }, false);
    }

    beforeWorldUpdate(delta: number) {
        //左右
        if (this.keyStatus.a) {
            this._body.velocity[0] = Math.max(-this.maxSpeed, this._body.velocity[0] - this.speedDelta);
            let animationIndex = parseInt("" + Math.abs(this._body.velocity[0]) / this.maxSpeed) + 1;
            if (this.curAnimationName != "fly_left_" + animationIndex) {
                this.curAnimationName = "fly_left_" + animationIndex;
                this._body.displays[0]["animation"].play(this.curAnimationName, 0);
                this._body.displays[0].scaleX = 1;
            }
        }
        else if (this.keyStatus.d) {
            this._body.velocity[0] = Math.min(this.maxSpeed, this._body.velocity[0] + this.speedDelta);
            let animationIndex = parseInt("" + Math.abs(this._body.velocity[0]) / this.maxSpeed) + 1;
            if (this.curAnimationName != "fly_left_" + animationIndex) {
                this.curAnimationName = "fly_left_" + animationIndex;
                this._body.displays[0]["animation"].play(this.curAnimationName, 0);
                this._body.displays[0].scaleX = -1;
            }
        }
        else {
            this._body.velocity[0] = 0;
            if (this.curAnimationName != "fly_normal") {
                this.curAnimationName = "fly_normal";
                this._body.displays[0]["animation"].play(this.curAnimationName, 0);
                this._body.displays[0].scaleX = 1;
            }
        }

        //上下
        if (this.keyStatus.w) {
            this._body.velocity[1] = Math.min(this.maxSpeed, this._body.velocity[1] + this.speedDelta);
        }
        else if (this.keyStatus.s) {
            this._body.velocity[1] = Math.max(-this.maxSpeed, this._body.velocity[1] - this.speedDelta);
        }
        else {
            this._body.velocity[1] = 0;
        }

        //普通攻击
        this.normalShootTime += delta;
        if (this.keyStatus.j == true) {
            if (this.normalShootTime >= this.normalShootRate) {
                this.normalShootTime = 0;
                let display = this._body.displays[0];
                new Bullet(this.ctx, this.world, display.x, display.y - display.height / 2);
            }
        }

        //使用EjectionRaySkill,目前仅测试用，没有冷却和能量检测
        if (this.keyStatus.i == true) {
            if (this.normalShootTime >= this.normalShootRate) {
                this.normalShootTime = 0;
                let display = this._body.displays[0];
                new EjectionRaySkill(this.ctx, this.world, display.x, display.y - display.height / 2);
            }
        }
    }


    afterWorldUpdate(delta: number) {
        super.afterWorldUpdate(delta);

        let display = this._body.displays[0];
        let x = display.x;
        let y = display.y;
        let shouldSetPos = false;
        if (x < display.width / 2) {
            x = display.width / 2;
            shouldSetPos = true;
        }
        else if (x > display.stage.stageWidth - display.width / 2) {
            x = display.stage.stageWidth - display.width / 2;
            shouldSetPos = true;
        }

        if (y < display.height / 2) {
            y = display.height / 2;
            shouldSetPos = true;
        }
        else if (y > display.stage.stageHeight - display.height / 2) {
            y = display.stage.stageHeight - display.height / 2;
            shouldSetPos = true;
        }

        if (shouldSetPos) {
            this._body.setEgretPosition(x, y);
        }
    }
}