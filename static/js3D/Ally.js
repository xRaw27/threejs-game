class Ally {
    constructor(model) {
        this.container = new THREE.Object3D()
        this.ally = model.scene
        this.ally.scale.set(100, 100, 100)
        this.axes = new THREE.AxesHelper(200)
        this.ring = new Ring()

        this.light = new THREE.SpotLight(0xffffff, 0.5, 400, Math.PI / 4, 1)
        this.light.position.set(0, 150, 0)
        this.container.add(this.light)
        this.light.target = this.ally

        this.container.add(this.ring)
        this.container.add(this.ally)
        this.container.position.set(0, 0, 0)
    }
    getContainer() {
        return this.container
    }
    getMesh() {
        return this.ally
    }
    getAxes() {
        return this.axes
    }
}