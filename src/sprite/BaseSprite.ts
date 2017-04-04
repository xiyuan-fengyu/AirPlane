/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class BaseSprite {

    protected _flag;

    protected _ctx: egret.DisplayObjectContainer;

    protected _world: p2.World;

    protected _body: BaseBody;

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

    get flag(): string {
        return this._flag;
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

    beforeWorldUpdate(delta: number) {

    }

    afterWorldUpdate(delta: number) {
        this._body.updateDisplays();

        this.checkSafeBounds();
    }

    checkSafeBounds(x?: number, y?: number) {
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
        this.onDestory();

        this._world.removeBody(this._body);
        this._body.displays.forEach(display => {
            display.parent.removeChild(display);
        });
    }

    onDestory() {

    }

}