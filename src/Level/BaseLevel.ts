import DisplayObjectContainer = egret.DisplayObjectContainer;
/**
 * Created by xiyuan_fengyu on 2017/4/2.
 */
class BaseLevel extends DisplayObjectContainer {

    private world: p2.World;

    private player: Player;

    private bgm: egret.Sound;

    private timestamp: number = 0;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.bgm = RES.getRes("bgm_0_ogg");
        this.bgm.play();

        this.createWorld();
        this.createMap("map_1_jpg");

        this.player = new Player(this, this.world);
        new Enemy(this, this.world, this.stage.stageWidth / 4, 300);
        new Enemy(this, this.world, this.stage.stageWidth / 4 * 2, 200);
        new Enemy(this, this.world, this.stage.stageWidth / 4 * 3, 300);
    }

    private createWorld() {
        this.world = new p2.World({
            gravity: [0, 0]
        });

        let handWorldEvent = function (event) {
            let type = event.type;
            let bodyA = event.bodyA;
            let bodyB = event.bodyB;
            if (bodyA.sprite && typeof bodyA.sprite[type] == "function") {
                bodyA.sprite[type](event, bodyB);
            }

            if (bodyB.sprite && typeof bodyB.sprite[type] == "function") {
                bodyB.sprite[type](event, bodyA);
            }
        };

        this.world.on("beginContact", handWorldEvent, this);
        this.world.on("impact", handWorldEvent, this);
        this.world.on("endContact", handWorldEvent, this);

        egret.startTick(this.updateWorld, this);
    }

    private updateWorld(timestamp: number): boolean {
        let delta = timestamp - this.timestamp;
        this.timestamp = timestamp;
        if (delta <= 0 || delta >= 30) {
            return;
        }

        this.world.bodies.forEach(body => {
            if (body instanceof BaseBody) {
                (<BaseBody> body).sprite.beforeWorldUpdate(delta);
            }
        });
        this.world.step(delta / 1000);
        this.world.bodies.forEach(body => {
            if (body instanceof BaseBody) {
                (<BaseBody> body).sprite.afterWorldUpdate(delta);
            }
        });

        return true;
    }

    private createMap(mapName) {
        let duration = 3000;

        let texture: egret.Texture = RES.getRes(mapName);
        let stageH = this.stage.stageHeight;
        let mapItemW = this.stage.stageWidth;
        let mapItemH = mapItemW * texture.textureHeight / texture.textureWidth;
        let itemNum = parseInt("" + this.stage.stageHeight / mapItemH) + 2;

        let mapItems = [];
        for (let i = 0; i < itemNum; i++) {
            let mapItem = new egret.Bitmap(texture);
            mapItem.width = mapItemW;
            mapItem.height = mapItemH;
            mapItem.x = 0;
            mapItem.y = this.stage.stageHeight - mapItemH * i;
            this.addChild(mapItem);
            mapItems.push(mapItem);
        }

        let delta = 5;
        let timer =new egret.Timer(0);
        timer.addEventListener(egret.TimerEvent.TIMER, (event: egret.TimerEvent) => {
            for (let i = 0; i < itemNum; i++) {
                let mapItem = mapItems[i];
                if (mapItem.y >= stageH) {
                    mapItem.y -= mapItemH * itemNum;
                }
                mapItem.y += delta;
            }
        }, this);
        timer.start();
    }

}