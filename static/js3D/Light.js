class Light {
    constructor(color, intensity, distance, position) {
        this.color = color
        this.intensity = intensity
        this.distance = distance
        this.position = position
    }
    create() {
        this.container = new THREE.Object3D()
        console.log('ditance: ' + this.distance)
        this.light = new THREE.PointLight(this.color, this.intensity, this.distance, 2)
        this.light.castShadow = true
        this.light.shadow.camera.far = 1500
        this.light.shadow.mapSize.width = 2048
        this.light.shadow.mapSize.height = 2048

        this.light.position.set(0, 0, 0)
        this.container.add(this.light)

        let geometry = new THREE.ConeGeometry(15, 30, 4)
        let material = new THREE.MeshBasicMaterial({ color: this.color, wireframe: true })
        this.mesh = new THREE.Mesh(geometry, material)
        this.container.add(this.mesh)

        this.container.position.set(0, this.position, 0)
        return this.container
    }
    updateIntensity(intensity) {
        this.intensity = intensity
        this.light.intensity = this.intensity
    }
    updateDistance(distance) {
        this.distance = distance
        this.light.distance = this.distance
    }
    updatePosition(position) {
        this.position = position
        this.container.position.setY(this.position)
    }
}