class Ring extends THREE.Mesh {
    constructor() {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.geometry = new THREE.RingGeometry(35, 40, 6)
        this.material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        this.rotation.x = Math.PI / 2
        this.position.set(0, 20, 0)
        this.visible = false
        this.angle = 0.1
    }
    update() {
        this.rotation.z += this.angle
    }
    setVisible() {
        this.visible = true
    }
    setNotVisible() {
        this.visible = false
    }
}