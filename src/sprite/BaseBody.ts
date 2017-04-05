/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class BaseBody extends p2.Body {

    static factor: number = 50;

    private static dragonBonesFactory: dragonBones.EgretFactory;

    private _sprite: BaseSprite;

    get sprite(): BaseSprite {
        return this._sprite;
    }

    static createWithDisplay(display: egret.DisplayObject, sprite: BaseSprite, config?: {
        width?: number;
        height?: number;
    }): BaseBody {
        config = config || {};
        config.width = config.width || display.width;
        config.height = config.height || display.height;

        let body = new BaseBody({
            mass: 1
        });
        body.addShape(new p2.Box({
            width: config.width / BaseBody.factor,
            height: config.height / BaseBody.factor
        }));

        body.displays = [display];
        sprite.ctx.addChild(display);
        sprite.world.addBody(body);
        body._sprite = sprite;
        return body;
    }

    static createFromTexture(texture: egret.Texture, sprite: BaseSprite, config?: any): BaseBody {
        config = config || {};
        config.scaleX = config.scaleX || 1;
        config.scaleY = config.scaleY || 1;

        let display = new egret.Bitmap();
        display.texture = texture;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;

        let body = new BaseBody({
            mass: 1
        });
        body.addShape(new p2.Box({
            width: display.width / BaseBody.factor * config.scaleX,
            height: display.height / BaseBody.factor * config.scaleY
        }));

        body.displays = [display];
        sprite.ctx.addChild(display);
        sprite.world.addBody(body);
        body._sprite = sprite;
        return body;
}

    static createFromDB(dbName: string, slotName: string, sprite: BaseSprite): BaseBody {
        if (!BaseBody.dragonBonesFactory) {
            BaseBody.dragonBonesFactory = new dragonBones.EgretFactory();
        }

        let data = BaseBody.dragonBonesFactory.getDragonBonesData(dbName);
        if (!data) {
            data = BaseBody.dragonBonesFactory.parseDragonBonesData(RES.getRes(dbName + "_ske_json"));
            BaseBody.dragonBonesFactory.addDragonBonesData(data, dbName);
            BaseBody.dragonBonesFactory.parseTextureAtlasData(RES.getRes(dbName + "_tex_json"), RES.getRes(dbName + "_tex_png"))
        }

        let display = BaseBody.dragonBonesFactory.buildArmatureDisplay(data.armatureNames[0], data.name);

        let body = new BaseBody({
            mass: 1
        });

        let slot = display.armature.getSlot(slotName);
        let transform = slot.global;
        let bitmap = slot.display;
        body.addShape(new p2.Box({
            width: bitmap.width * transform.scaleX / this.factor,
            height: bitmap.height * transform.scaleY / this.factor,
        }));
        body.displays = [display];
        sprite.ctx.addChild(display);
        sprite.world.addBody(body);
        body._sprite = sprite;
        return body;
    }

    setEgretPosition(x: number, y: number) {
        if (this.displays && this.displays.length > 0) {
            this.displays.forEach(display => {
                display.x = x;
                display.y = y;
            })
        }

        this.position = [
            x / BaseBody.factor,
            (this._sprite.ctx.stage.stageHeight - y) / BaseBody.factor
        ];
    }

    setP2Position(x: number, y: number) {
        if (this.displays && this.displays.length > 0) {
            this.displays.forEach(display => {
                display.x = x * BaseBody.factor;
                display.y = this._sprite.ctx.stage.stageHeight - y * BaseBody.factor;
            })
        }

        this.position = [
            x,
            y
        ];
    }

    updateDisplays() {
        if (this.displays && this.displays.length > 0) {
            this.displays.forEach(display => {
                display.x = this.position[0] * BaseBody.factor;
                display.y = this._sprite.ctx.stage.stageHeight - this.position[1] * BaseBody.factor;
                display.rotation = 360 - this.angle * 180 / Math.PI;
            });
        }
    }

}