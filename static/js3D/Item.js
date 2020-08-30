class Item {
    constructor() {

    }
    create() {
        this.container = new THREE.Object3D()

        let geometry = new THREE.BoxGeometry(100, 100, 100)
        let material = new THREE.MeshPhongMaterial({ color: 0xeeeeee, specular: 0xffffff, shininess: 50 })
        this.mesh = new THREE.Mesh(geometry, material)
        //this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.container.add(this.mesh)

        this.container.position.set(0, 0, 0)
        return this.container
    }
}