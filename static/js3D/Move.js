$(document).ready(() => {
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.4, 5000)
    let axes = new THREE.AxesHelper(1000)
    let clock = new THREE.Clock()


    renderer.setClearColor(0xffffff)
    renderer.setSize(window.innerWidth, window.innerHeight)
    $("#root").append(renderer.domElement)

    scene.add(axes)

    camera.position.set(-300, 600, 0)
    camera.lookAt(scene.position)

    //let orbitControl = new THREE.OrbitControls(camera, renderer.domElement)
    // orbitControl.addEventListener('change', function () {
    //     renderer.render(scene, camera)
    // })

    let planeGeometry = new THREE.PlaneGeometry(2500, 1500, 10, 10)
    let planeMaterial = new THREE.MeshBasicMaterial({ color: 0x999999, transparent: true, opacity: 1, side: THREE.DoubleSide })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    scene.add(plane)
    plane.rotation.x = Math.PI / 2


    model = new Model()
    player = null

    allies = []
    alliesModels = []

    model.loadModel('/models/model1/scene.gltf', object => {
        console.log("Model załadowany")
        player = new Player(object)
        scene.add(player.getContainer())
        camera.position.x = player.getContainer().position.x
        camera.position.z = player.getContainer().position.z + 900
        camera.position.y = player.getContainer().position.y + 1100
        camera.lookAt(player.getContainer().position)
        model.init()
    })

    for (let i = 0; i < 5; i++) {
        let allyModel = new Model()
        allyModel.loadModel('/models/model1/scene.gltf', object => {
            console.log("Model Ally załadowany")
            let ally = new Ally(object)
            allies.push(ally)
            //ally.getContainer().lookAt(player.getContainer().position)
            ally.getContainer().position.z = 400 * (i + 1)
            ally.getContainer().position.x = 350 * (i + 1)
            scene.add(ally.getContainer())
            allyModel.init()
        })
        alliesModels.push(allyModel)
    }


    let raycaster = new THREE.Raycaster()
    let mouseVector = new THREE.Vector2()
    let clickedVect = new THREE.Vector3(0, 0, 0)
    let directionVect = new THREE.Vector3(0, 0, 0)

    $(document).mousedown((event) => {
        if (player != null) {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera(mouseVector, camera)
            let intersects = raycaster.intersectObjects(scene.children, true)
            if (intersects.length > 0) {
                model.walk()
                clickedVect = intersects[0].point
                clickedVect.y = 0
                console.log("clickedVect")
                console.log(clickedVect)
                directionVect = clickedVect.clone().sub(player.getContainer().position).normalize()
                directionVect.y = 0
                console.log("directionVect")
                console.log(directionVect)


                let angle = Math.atan2(player.getContainer().position.clone().x - clickedVect.x, player.getContainer().position.clone().z - clickedVect.z) + Math.PI
                console.log(angle)

                player.getMesh().rotation.y = angle
                player.getAxes().rotation.y = angle
            }
        }
    })

    function render() {
        let delta = clock.getDelta()
        model.updateModel(delta)
        alliesModels.forEach(allyModel => {
            allyModel.updateModel(delta)
        })

        if (player != null) {
            camera.position.x = player.getContainer().position.x
            camera.position.z = player.getContainer().position.z + 900
            camera.position.y = player.getContainer().position.y + 1100

            let playerVector = player.getContainer().position.clone()
            playerVector.y = 0
            //console.log(playerVector.distanceTo(clickedVect))

            if (playerVector.distanceTo(clickedVect) > 6) {
                player.getContainer().translateOnAxis(directionVect, 5)
                allies.forEach(ally => {
                    ally.getMesh().lookAt(player.getContainer().position)
                })
            }
            else if (playerVector.distanceTo(clickedVect) > 0.2) {
                player.getContainer().translateOnAxis(directionVect, playerVector.distanceTo(clickedVect))
                allies.forEach(ally => {
                    ally.getMesh().lookAt(player.getContainer().position)
                })
                model.stop()
            }

            for (let i = 0; i < allies.length; i++) {
                let ally1 = null
                let ally2 = allies[i].getContainer()
                if (i == 0) ally1 = player.getContainer()
                else ally1 = allies[i - 1].getContainer()

                if (ally1.position.distanceTo(ally2.position) > 156) {
                    alliesModels[i].walk()
                    ally2.translateOnAxis(ally1.position.clone().sub(ally2.position).normalize(), 5)
                }
                else if (ally1.position.distanceTo(ally2.position) > 151.1) {
                    alliesModels[i].walk()
                    ally2.translateOnAxis(ally1.position.clone().sub(ally2.position).normalize(), ally1.position.distanceTo(ally2.position) - 151)
                }
                else if (ally1.position.distanceTo(ally2.position) > 150.1) {
                    console.log(ally1.position.distanceTo(ally2.position))
                    console.log(ally1.position.distanceTo(ally2.position) - 150)
                    ally2.translateOnAxis(ally1.position.clone().sub(ally2.position).normalize(), ally1.position.distanceTo(ally2.position) - 150)
                    alliesModels[i].stop()
                }
            }
        }
        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }
    render()
})