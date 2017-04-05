import Constraint = p2.Constraint;
/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class BaseSprite {

    protected _flag;

    private _destroyed = false;

    protected _ctx: egret.DisplayObjectContainer;

    protected _world: p2.World;

    protected _body: BaseBody;

    private followTarget: BaseSprite;

    private followOffset: Array<number>;

    protected textures;

    protected curAnimationName: string;

    //绝对值
    protected maxSpeed: number;

    protected speedDelta: number;

    //超出这个范围则销毁
    protected safeBounds?: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };

    //最大生命值
    protected maxLife: number;

    //当前生命值
    protected curLife: number;

    //最大能量值
    protected maxEnergy: number;

    //当前能量值
    protected curEnergy: number;

    get flag(): string {
        return this._flag;
    }

    get destroyed(): boolean {
        return this._destroyed;
    }

    get ctx(): egret.DisplayObjectContainer {
        return this._ctx;
    }

    get world(): p2.World {
        return this._world;
    }

    get body(): BaseBody {
        return this._body;
    }

    constructor(ctx: egret.DisplayObjectContainer, world: p2.World, flag: string) {
        this._ctx = ctx;
        this._world = world;
        this._flag = flag;

        this.safeBounds = {
            left: -100,
            right: this.ctx.stage.stageWidth + 100,
            top: -100,
            bottom: this.ctx.stage.stageHeight + 100
        };
    }

    /**
     * 初始化生命值
     * @param life
     */
    protected initLife(life: number) {
        this.maxLife = life;
        this.curLife = life;
    }

    /**
     * damage > 0:受到伤害
     * damage < 0:恢复血量
     * @param damage
     */
    takeDamage(damage: number) {
        this.curLife -= damage;

        if (this.curLife <= 0) {
            this.curLife = 0;
            this.onZeroLife();
        }
    }

    /**
     * 血量小于等于0时的回调函数
     */
    protected onZeroLife() {

    }

    findSpriteByFlag<T extends BaseSprite>(flag: string): Array<T> {
        return this._world.bodies.filter(body => body instanceof BaseBody && (<BaseBody>body).sprite.flag == flag).map(body => <T>(<BaseBody>body).sprite);
    }

    findSpriteByType<T extends BaseSprite>(type: {new(...args): T}): Array<T> {
        return this._world.bodies.filter(body => body instanceof BaseBody && (<BaseBody>body).sprite instanceof type).map(body => <T>(<BaseBody>body).sprite);
    }

    beforeWorldUpdate(delta: number) {

    }

    protected follow(target: BaseSprite) {
        this.followTarget = target;
        let targetPos = target._body.position;
        let curPos = target._body.position;
        this.followOffset = [curPos[0] - targetPos[0], curPos[1] - targetPos[1]];
    }

    protected cancleFollow() {
        this.followTarget = null;
        this.followOffset = null;
    }

    afterWorldUpdate(delta: number) {
        if (this.followTarget != null) {
            let targetPos = this.followTarget._body.position;
            this._body.setP2Position(targetPos[0] + this.followOffset[0], targetPos[1] + this.followOffset[1]);
        }

        this._body.updateDisplays();

        this.checkSafeBounds();
    }

    protected checkSafeBounds(x?: number, y?: number) {
        if (this.safeBounds) {
            if (x == null || y == null) {
                let display = this._body.displays[0];
                x = display.x;
                y = display.y;
            }
            if (
                x < this.safeBounds.left
                || x > this.safeBounds.right
                || y < this.safeBounds.top
                || y > this.safeBounds.bottom
            ) {
                this.destory();
            }
        }
    }

    destory() {
        if (!this.destroyed) {
            this._destroyed = true;
            this.onDestory();

            this._world.removeBody(this._body);
            this._body.displays.forEach(display => {
                display.parent.removeChild(display);
            });
        }
    }

    protected onDestory() {

    }

}