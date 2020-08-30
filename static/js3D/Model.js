class Model {
    constructor() {
        this.container = new THREE.Object3D()
        this.stopped = false
        this.mixer = null
        this.walkReset = false
    }
    loadModel(url, callback) {
        let loader = new THREE.GLTFLoader()
        loader.load(url, gltf => {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            })
            this.mixer = new THREE.AnimationMixer(gltf.scene)
            this.container = gltf
            console.log(gltf.animations)
            callback(this.container)
        })
    }
    updateModel(delta) {
        if (this.mixer) this.mixer.update(delta)
    }
    stop() {
        if (this.walkReset) {
            this.mixer.clipAction(this.container.animations[1]).fadeOut(0.2)
        }
        this.walkReset = false
        this.mixer.clipAction(this.container.animations[0]).setEffectiveWeight(1)
    }
    walk() {
        if (!this.walkReset) {
            this.walkReset = true
            this.mixer.clipAction(this.container.animations[0]).setEffectiveWeight(0)
            this.mixer.clipAction(this.container.animations[1]).reset()
            this.mixer.clipAction(this.container.animations[1]).setEffectiveWeight(1)
        }
    }
    init() {
        this.mixer.clipAction(this.container.animations[0]).play()
        this.mixer.clipAction(this.container.animations[1]).play()
        this.mixer.clipAction(this.container.animations[1]).setEffectiveWeight(0)
    }
}