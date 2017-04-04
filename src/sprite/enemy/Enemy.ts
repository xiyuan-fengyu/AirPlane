/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class Enemy extends BaseSprite {

    //普通攻击间隔，单位毫秒
    protected normalShootRate = 200;

    protected normalShootTime = 0;

    constructor(ctx: egret.DisplayObjectContainer, world: p2.World, x?: number, y?: number) {
        super(ctx, world, "Enemy");

        this.textures = [
            RES.getRes("enemy_1_0_png")
        ];

        this._body = BaseBody.createFromTexture(this.textures[0], this);
        this._body.fixedRotation = true;
        this._body.setEgretPosition(x, y);
    }

    beforeWorldUpdate(delta: number) {
    }
}