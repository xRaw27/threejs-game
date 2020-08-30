class Hex3D {
    constructor(doors1, doors2) {
        this.container = new THREE.Object3D()

        let radius = Settings.radius
        let thickness = Settings.thickness
        let height = Settings.height
        let geometry = new THREE.BoxGeometry(2 * radius / Math.sqrt(3) + thickness / Math.sqrt(3), height, thickness) //* (1 + radius / 1000)
        let materials = []
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        materials.push(new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/textures/3.png') }))
        materials.push(new THREE.MeshBasicMaterial({ color: 0x000000 }))
        this.wall = new THREE.Mesh(geometry, materials)
        this.wall.castShadow = true
        for (let i = 0; i < 6; i++) {
            let side
            if (i == doors1 || i == doors2) side = new Doors3D()
            else side = this.wall.clone()
            side.position.x = radius * Math.cos(i * Math.PI / 3)
            side.position.z = radius * Math.sin(i * Math.PI / 3)
            side.lookAt(this.container.position)
            this.container.add(side)
            allWalls.push(side)
        }
        let floorGeometry = new THREE.CylinderGeometry(2 * radius / Math.sqrt(3), 2 * radius / Math.sqrt(3), 1, 6) // thickness / Math.sqrt(3)
        let floorMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/textures/1.jpg') })
        let floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.receiveShadow = true
        floor.position.y = - height / 2
        this.container.add(floor)

        return this.container
    }
}