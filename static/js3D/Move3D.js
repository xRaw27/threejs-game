class Move {
    constructor() {
        this.init()
    }
    init() {
        let raycaster = new THREE.Raycaster() // obiekt symulujący "rzucanie" promieni
        let mouseVector = new THREE.Vector2()
        let clickedVect = new THREE.Vector3(0, 0, 0); // wektor określający PUNKT kliknięcia
        let directionVect = new THREE.Vector3(0, 0, 0); // wektor określający KIERUNEK ruchu playera

        $(document).mousedown((event) => {
            console.log(player.model.animations)
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera(mouseVector, camera)
            let intersects = raycaster.intersectObjects(scene.children)
            if (intersects.length > 0) {
                clickedVect = intersects[0].point
                clickedVect.y = 0
                console.log(clickedVect)
                directionVect = clickedVect.clone().sub(player.getPlayerCont().position).normalize()
                directionVect.y = 0
                console.log(directionVect)

                var angle = Math.atan2(
                    player.getPlayerCont().position.clone().x - clickedVect.x,
                    player.getPlayerCont().position.clone().z - clickedVect.z
                ) + Math.PI
                console.log(angle)


                player.getPlayerMesh().rotation.y = angle
                player.getAxes().rotation.y = angle
                // 5 - przewidywany speed
                //funkcja normalize() przelicza współrzędne x,y,z wektora na zakres 0-1
                //jest to wymagane przez kolejne funkcje	
            }
        })
    }
}