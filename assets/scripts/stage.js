cc.Class({
    extends: cc.Component,

    properties: {
        data: null,
        platformPrefab: {
            default: null,
            type: cc.Prefab,
        },
        dotPlatformPrefab: {
            default: null,
            type: cc.Prefab,
        },
        squarePrefab: {
            default: null,
            type: cc.Prefab,
        },
        orbPrefab: {
            default: null,
            type: cc.Prefab,
        },
        trianglePrefab: {
            default: null,
            type: cc.Prefab,
        },
        jointPrefab: {
            default: null,
            type: cc.Prefab,
        },
        platformPool: null,
        dotPlatformPool: null,
        squarePool: null,
        orbPool: null,
        trianglePool: null,
        jointPool: null,
        container: {
            default: null,
            type: cc.Node,
        },
        jointGraphics: {
            default: null,
            type: cc.Node,
        },
        indicator: {
            default: null,
            type: cc.Node,
        },
        countDownBar: {
            default: null,
            type: cc.Node,
        },
        feedBack: {
            default: null,
            type: cc.Node,
        },
        tools: {
            default: null,
            type: cc.Node,
        },
        progress: 0,
        currentPair: null,
        series: {
            default: 0,
            type: cc.Integer
        },
        stage: {
            default: 0,
            type: cc.Integer
        },
        passSe: {
            default: null,
            type: cc.AudioClip
        },
        failSe: {
            default: null,
            type: cc.AudioClip
        },
        dropLock: true,
        bgm1: {
            default: null,
            type: cc.AudioClip
        },
        bgm2: {
            default: null,
            type: cc.AudioClip
        },
        themeColor: [],
    },
    start() {
        this.node.runAction(cc.fadeIn(0.6))
    },
    onLoad() {
        this.changeTheme(window.ext.temp.series)
        this.platformPool = new cc.NodePool()
        this.dotPlatformPool = new cc.NodePool()
        this.squarePool = new cc.NodePool()
        this.orbPool = new cc.NodePool()
        this.trianglePool = new cc.NodePool()
        this.jointPool = new cc.NodePool()
        cc.audioEngine.stopMusic()

        this.tools.width = cc.winSize.width;
        this.series = Number(window.ext.temp.series) + 1
        this.stage = Number(window.ext.temp.stage) + 1
        let manager = cc.director.getPhysicsManager()
        manager.enabled = true;
        manager.gravity = cc.v2(0, -960);
        manager.POSITION_ITERATIONS = 10
        manager.VELOCITY_ITERATIONS = 10
        manager.enabledAccumulator = true
        manager.FIXED_TIME_STEP = 1 / 60
        let jointGraphics = this.jointGraphics.getComponent(cc.Component)
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
            jointGraphics.reDraw()
        })
        //物理步长，默认 FIXED_TIME_STEP 是 1/60
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;
        this.loadStageJSON()
        //TODO:根据serie播放不同音乐
        let bgm = null
        switch (Number(window.ext.temp.series)) {
            case 0:
                bgm = this.bgm1
                break;
            case 1:
                bgm = this.bgm2
                break;
        }
        cc.audioEngine.playMusic(bgm, true);
        this.node.on('touchstart', () => {
            this.dropBlock()
        })
    },

    changeTheme(series) {
        let color = null
        let hexColor = null
        switch (Number(series)) {
            case 1:
                color = new cc.Color(0, 171, 100)
                hexColor = '#00C674'
                break;
            case 2:
                color = new cc.Color(207, 42, 0)
                hexColor = '#FF3400'
                break;
            default:
                color = new cc.Color(0, 150, 223)
                hexColor = '#00ACFF'
                break;
        }
        this.themeColor = [color, hexColor]
        let bg = this.node.getChildByName("bg")
        bg.color = this.themeColor[0]
        let gameOverMask = this.node.getChildByName('gameover')
        gameOverMask.getComponent(cc.Component).hexColor = this.themeColor[1]
        let maskShade = gameOverMask.getChildByName('shade')
        maskShade.color = this.themeColor[0]
    },
    loadStageJSON() {
        this.dropLock = true
        let stageID = this.series + '-' + this.stage
        this.data = window.stagesData[stageID]
        this.init()
        this.dropLock = false
    },
    init() {
        this.progress = 0
        this.indicator.getComponent(cc.Component).init(this.data.blocks.length)
        this.createPlatforms()
        this.dropNext(true)
    },
    destruct() {
        let nodes = this.container.children.concat()
        //1 方砖
        //2 长条平台
        //3 点平台
        //4 joint
        //5 圆形砖
        for (let i = 0; i < nodes.length; i++) {
            let type = 0
            switch (nodes[i].name) {
                case 'square':
                    type = 1;
                    break;
                case 'platform':
                    type = 2;
                    break;
                case 'dotPlatform':
                    type = 3;
                    break;
                case 'joint':
                    type = 4;
                    break;
                case 'orb':
                    type = 5;
                    break;
                case 'triangle':
                    type = 6;
                    break;
            }
            this.recoverNode(nodes[i], type)
        }
        if (this.container.children[0]) {
            this.container.removeAllChildren()
        }
    },
    dropBlock() {
        if (!this.currentPair || this.dropLock) return;
        this.feedBack.getComponent(cc.Component).vibe()
        let block = this.currentPair[0]
        let joint = this.currentPair[1]
        this.currentPair = null
        block.getChildByName("dot").active = false
        this.recoverNode(joint, 4)
        this.indicator.getComponent(cc.Component).next()
        this.dropNext()
    },
    dropNext(immediate) {
        if (this.progress == this.data.blocks.length) {
            this.countDown()
            return
        }
        this.node.runAction(
            cc.sequence(cc.delayTime(immediate ? 0.5 : 2), cc.callFunc(() => {
                this.createBlocks(this.progress)
                this.progress++
            }))
        )
    },
    createPlatforms() {
        for (let i = 0; i < this.data.platforms.length; i++) {
            let data = this.data.platforms[i]
            let platform = null
            if (!data.dot) {
                platform = this.getNodeFromPool(2)
                platform.width = data.width;
                if (data.rotation) {
                    platform.angle = -data.rotation
                } else {
                    platform.angle = 0
                }
                let collider = platform.getComponent(cc.PhysicsBoxCollider)
                collider.size.width = data.width;
                collider.offset.x = data.width / 2
            } else {
                platform = this.getNodeFromPool(3)
            }
            platform.position = cc.v2(data.position[0], data.position[1])
            platform.stopAllActions();
            if (data.movement) {
                platform.getComponent(cc.RigidBody).type = 3
                let distance = (data.movement[0] === 0) ? data.movement[1] : data.movement[0]
                let duration = (distance / 12 * 0.1).toFixed(1)
                let action = cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(duration, cc.v2(data.position[0] + data.movement[0], data.position[1] + data.movement[1])).easing(cc.easeInOut(1.8)),
                        cc.moveTo(duration, cc.v2(data.position[0], data.position[1])).easing(cc.easeInOut(1.8))
                    ))
                platform.runAction(action)
            } else {
                platform.action = null
                platform.getComponent(cc.RigidBody).type = 0
            }
            platform.parent = this.container
        }
    },
    createBlocks(index) {
        let data = this.data.blocks[index]
        let jointNode = this.getNodeFromPool(4)
        jointNode.x = data.jointPos
        let joint = jointNode.getComponent(cc.DistanceJoint)
        joint.distance = data.jointDistance
        //TODO:根据类型选择prefab
        let block = null
        switch (data.shape) {
            case 1:
                block = this.getNodeFromPool(1)
                break;
            case 2:
                block = this.getNodeFromPool(5)
                break;
            case 3:
                block = this.getNodeFromPool(6)
                break;
        }
        let dot = block.getChildByName('dot');
        dot.active = true
        let size = data.diam ? [data.diam, data.diam] : [data.width, data.height]
        if (data.shape == 3) {
            size[1] = size[0] * 0.86
        }
        block.angle = 0
        block.setContentSize(...size)
        block.position = cc.v2(data.initPos[0], data.initPos[1])
        let rigid = block.getComponent(cc.RigidBody)
        rigid.angularVelocity = data.angularVelocity
        joint.connectedBody = rigid
        let collider = block.getComponent(cc.PhysicsCollider)
        switch (data.shape) {
            case 1:
                collider.size = new cc.size(...size);
                break;
            case 2:
                collider.radius = data.diam / 2
                break;
            case 3:
                let points = collider.points
                points[0] = cc.v2(0, size[1] / 2)
                points[1] = cc.v2(-size[0] / 2, -size[1] / 2)
                points[2] = cc.v2(size[0] / 2, -size[1] / 2)
                break;
        }

        switch (data.type) {
            case 1:
                block.color = new cc.Color(255, 255, 255)
                collider.friction = 0.2
                collider.restitution = 0
                break;
            case 2:
                collider.friction = 0
                block.color = new cc.Color(164, 225, 255)
                break;
            case 3:
                collider.restitution = 0.6
                block.color = new cc.Color(255, 248, 105)
                break;
        }
        let point = null
        switch (true) {
            case Boolean(data.jointOffset):
                point = cc.v2(data.jointOffset[0], data.jointOffset[1])
                break;
            case data.shape == 3:
                point = cc.v2(0, -(size[0] - size[1]))
                break;
            default:
                point = cc.v2(0, 0)
                break;
        }
        joint.connectedAnchor = point
        dot.position = point
        block.jointOffset = point;

        joint.apply()
        collider.apply()
        block.parent = this.container
        jointNode.parent = this.container
        this.currentPair = [block, jointNode]
    },
    countDown() {
        let frameRate = cc.game.getFrameRate()
        let total = 3.6
        let barComponent = this.countDownBar.getComponent(cc.ProgressBar)
        barComponent.step = 1 / (total * frameRate)
        this.indicator.active = false
        this.countDownBar.active = true
    },
    showMask(mode) {
        let gameOverMask = this.node.getChildByName('gameover')
        if (gameOverMask.active) return;
        this.node.stopAllActions()
        this.countDownBar.getComponent("countDownComponent").stop()
        //mode 0:失败
        //mode 1:过关
        //mode 2:通关
        //mode 3:机会用完
        //mode 4:无尽模式通过
        //mode 5:无尽模式结算
        let ext = ''
        if (mode == 0) {
            cc.audioEngine.playEffect(this.failSe);
        }
        if (mode == 1) {
            cc.audioEngine.playEffect(this.passSe);
            if (this.stage >= 30) {
                mode = 2;
            }
            window.ext.updateCampaignProgress(window.ext.temp.series, window.ext.temp.stage);
            window.ext.temp.stage++;
        }
        gameOverMask.getComponent(cc.Component).changeMode(mode, ext)
    },
    nextStage() {
        this.stage++
        this.destruct()
        this.currentPair = null
        this.loadStageJSON()
    },
    reloadStage() {
        this.currentPair = null
        this.destruct()
        this.init()
    },
    getNodeFromPool(type) {
        //1 方砖
        //2 长条平台
        //3 点平台
        //4 joint
        //5 圆形砖
        //6 三角砖
        let pool = null
        let prefab = null
        let node = null
        switch (type) {
            case 1:
                pool = this.squarePool
                prefab = this.squarePrefab
                break;
            case 2:
                pool = this.platformPool
                prefab = this.platformPrefab
                break;
            case 3:
                pool = this.dotPlatformPool
                prefab = this.dotPlatformPrefab
                break;
            case 4:
                pool = this.jointPool
                prefab = this.jointPrefab
                break;
            case 5:
                pool = this.orbPool
                prefab = this.orbPrefab
                break;
            case 6:
                pool = this.trianglePool
                prefab = this.trianglePrefab
                break;
        }
        if (pool.size() > 0) {
            node = pool.get();
        } else {
            node = cc.instantiate(prefab);
        }
        return node
    },
    recoverNode(node, type) {
        let pool = null
        switch (type) {
            case 1:
                pool = this.squarePool
                break;
            case 2:
                pool = this.platformPool
                break;
            case 3:
                pool = this.dotPlatformPool
                break;
            case 4:
                pool = this.jointPool
                break;
            case 5:
                pool = this.orbPool
                break;
            case 6:
                pool = this.trianglePool
                break;
        }
        pool.put(node)
    }
});