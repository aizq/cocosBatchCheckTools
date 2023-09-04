
import { UIMeshRenderer } from 'cc';
import { SpriteFrame } from 'cc';
import { Material } from 'cc';
import { profiler } from 'cc';
import { Scene } from 'cc';
import { AnimationClip } from 'cc';
import { Prefab } from 'cc';
import { UIRenderer } from 'cc';
import { MeshRenderer } from 'cc';
import { _decorator, assetManager, BaseNode, Component, director, EventKeyboard, Input, input, KeyCode, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('GetBundleResourcePath')
export class GetBundleResourcePath extends Component {
    private bundleMaps = {};

    protected onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown (event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_Q:
                this.bundleMaps = {};
                let cache = assetManager.bundles;
                cache.forEach((val, key) => {
                    let pathhead = val.config.base;
                    val.config.assetInfos.forEach((val, key) => {
                        if (val.path) {
                            this.bundleMaps[key] = pathhead + val.path
                        }
                    })
                });
                // console.log(this.bundleMaps);
                this.traverseNode(director.getScene())
                break;
        }
    }

    private traverseNode(node: BaseNode) {
        if (node.active) {
            const spriteComponent = node.getComponent(Sprite);
            const labelComponent = node.getComponent(Label);
            const uiMeshRendererComponent = node.getComponent(UIMeshRenderer);
            // const meshRendererComponent = node.getComponent(MeshRenderer);
            const uiRendererComponent = node.getComponent(UIRenderer);
            const nodepath = this.getNodePath(node);
            if (spriteComponent) {
                if (spriteComponent.spriteFrame) {
                    const uuid = spriteComponent.spriteFrame.uuid;
                    const bundlePath = this.bundleMaps[uuid];
                    const path = bundlePath ? bundlePath : "";//uuid;
                    const str = `Sprite节点树路径：${nodepath}，资源名：${spriteComponent.spriteFrame.name}，资源路径：${path}`;
                    console.log(str);
                }
            } else if (labelComponent) {
                const str = `Label节点树路径：${nodepath}`;
                console.warn(str);
            } else if (uiMeshRendererComponent || /*meshRendererComponent || */uiRendererComponent) {
                const str = `Renderer节点树路径：${nodepath}`;
                console.error(str);
            }
        
            for (const child of node.children) {
                this.traverseNode(child);
            }
        }
    }

    private getNodePath (node) {
        let path;
        while (node && !(node instanceof Scene)) {
            if (path) {
                path = node.name + '/' + path;
            }
            else {
                path = node.name;
            }
            node = node.parent;
        }
        return path;
    }

    preSpriteFrames = []
    prePrefabs = []
    preMaterials = []
    preAnimationClips = []
    preOthers = []
    btn1() {
        this.preSpriteFrames = []
        this.prePrefabs = []
        this.preMaterials = []
        this.preAnimationClips = []
        this.preOthers = []
        assetManager.assets.forEach(asset => {
            if (asset.refCount > 0) {
                if (asset instanceof SpriteFrame) {
                    this.preSpriteFrames.push(asset.uuid)
                } else if (asset instanceof Prefab) {
                    this.prePrefabs.push(asset.uuid)
                } else if (asset instanceof Material) {
                    this.preMaterials.push(asset.uuid)
                } else if (asset instanceof AnimationClip) {
                    this.preAnimationClips.push(asset.uuid)
                } else {
                    this.preOthers.push(asset.uuid)
                }
            }
        })
        console.log("=====记录之前的assets")
    }

    btn2() {
        console.log("=====计算新增的assets")
        assetManager.assets.forEach(asset => {
            if (asset.refCount > 0) {
                if (!this.preSpriteFrames.includes(asset.uuid) && asset instanceof SpriteFrame) {
                    console.log(`=====新增spriteframe:${asset.uuid}:${asset.name}:${asset.refCount}`)
                } else if (!this.prePrefabs.includes(asset.uuid) && asset instanceof Prefab) {
                    console.log(`=====新增prefab:${asset.uuid}:${asset.name}:${asset.refCount}`)
                } else if (!this.preMaterials.includes(asset.uuid) && asset instanceof Material) {
                    console.log(`=====新增material:${asset.uuid}:${asset.name}:${asset.refCount}`)
                } else if (!this.preAnimationClips.includes(asset.uuid) && asset instanceof AnimationClip) {
                    console.log(`=====新增animationclip:${asset.uuid}:${asset.name}:${asset.refCount}`)
                } else if (!this.preOthers.includes(asset.uuid) && 
                    !(asset instanceof SpriteFrame) && 
                    !(asset instanceof Prefab) && 
                    !(asset instanceof Material) && 
                    !(asset instanceof AnimationClip)) {
                    console.log(`=====新增其他assets:${asset.uuid}:${asset.name}:${asset.refCount}`)
                }
            }
        })
    }

    btn3() {
        assetManager.assets.forEach(asset => {
            if (asset.refCount > 0) {
                console.log(`=====显示所有assets:${asset.uuid}:${asset.name}:${asset.refCount}`)
            }
        })
    }

    btn4() {
        if (profiler.isShowingStats()) {
            profiler.hideStats()
        } else {
            profiler.showStats()
        }
        
    }

}
