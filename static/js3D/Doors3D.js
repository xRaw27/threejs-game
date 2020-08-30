class Doors3D {
    constructor() {
        this.doors = new THREE.Object3D()

        let radius = Settings.radius
        let thickness = Settings.thickness
        let height = Settings.height
        let geometry = new THREE.BoxGeometry((2 * radius / Math.sqrt(3) + thickness / Math.sqrt(3)) / 3, height, thickness) //* (1 + radius / 1000)
        let materials = []
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/textures/3.png') }))
        materials.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/textures/3.png') }))
        let doors1 = new THREE.Mesh(geometry, materials)
        let doors2 = new THREE.Mesh(geometry, materials)
        doors1.castShadow = true
        doors2.castShadow = true

        doors1.position.x = -(2 * radius / Math.sqrt(3) + thickness / Math.sqrt(3)) / 3
        doors2.position.x = (2 * radius / Math.sqrt(3) + thickness / Math.sqrt(3)) / 3

        this.doors.add(doors1)
        this.doors.add(doors2)
        return this.doors
    }
}