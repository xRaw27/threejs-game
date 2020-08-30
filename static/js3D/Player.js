class Player {
    constructor(model) {
        this.container = new THREE.Object3D()
        this.player = model.scene
        this.player.scale.set(100, 100, 100)
        this.axes = new THREE.AxesHelper(200)

        this.light = new THREE.SpotLight(0xffffff, 0.5, 400, Math.PI / 4, 1)
        this.light.position.set(0, 150, 0)
        this.container.add(this.light)
        this.light.target = this.player

        this.container.add(this.player)
        this.container.position.set(0, 0, 0)
    }
    getContainer() {
        return this.container
    }
    getMesh() {
        return this.player
    }
    getAxes() {
        return this.axes
    }
}