/**
 * Created by xiyuan_fengyu on 2017/4/3.
 */
class Bullet extends BaseSprite {

    private static shootEffect: egret.Sound;

    constructor(ctx: egret.DisplayObjectContainer, world: p2.World, x: number, y: number) {
        super(ctx, world, "bullet");

        this.maxSpeed = 25;
        this.speedDelta = 0;

        this.textures = [
            RES.getRes("red_0_png"),
            RES.getRes("red_1_png")
        ];

        this._body = BaseBody.createFromDB("bullet_1", "body", this);
        this.curAnimationName = "fly";
        this._body.displays[0]["animation"].play(this.curAnimationName, 0);
        this._body.collisionResponse = false;
        this._body.fixedRotation = true;
        this._body.setEgretPosition(x, y - this._body.displays[0].height / 2);

        if (!Bullet.shootEffect) {
            Bullet.shootEffect = RES.getRes("effect_shoot_wav");
        }
        let soundChannel = Bullet.shootEffect.play(0, 1);
        soundChannel.volume = 0.1;
    }

    beginContact(event, other) {
        let otherSprite = other.sprite;
        if (otherSprite) {
            if (otherSprite instanceof Enemy) {
                this.maxSpeed = 0;

                let enemy = <Enemy> otherSprite;
                this.curAnimationName = "explosion";
                let display = this._body.displays[0];
                display["animation"].play(this.curAnimationName, 1);
                display.addEventListener( dragonBones.AnimationEvent.LOOP_COMPLETE, event => {
                    this.destory();
                },this);
            }
        }
    }

    beforeWorldUpdate() {
        this._body.velocity[1] = this.maxSpeed;
    }

}