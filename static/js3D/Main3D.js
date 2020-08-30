let level
let ui
let model
let sphere
let player = null
let allWalls = []
let raycaster = new THREE.Raycaster()
let mouseVector = new THREE.Vector2()
let raycaster2 = new THREE.Raycaster()
let mouseVector2 = new THREE.Vector2()
let collisionRaycaster = new THREE.Raycaster()
let clickedVect = new THREE.Vector3(0, 0, 0)
let directionVect = new THREE.Vector3(0, 0, 0)
let playerVector = new THREE.Vector3(0, 0, 0)

$(document).ready(() => {
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.gammaOutput = true
    renderer.shadowMapEnabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 0.4, 3000)
    let axes = new THREE.AxesHelper(1000)
    let clock = new THREE.Clock()

    renderer.setClearColor(0x000000)
    renderer.setSize($(window).width(), $(window).height())
    $("#root").append(renderer.domElement)

    camera.position.set(-1, 600, 0)
    camera.lookAt(scene.position)

    //let orbitControl = new THREE.OrbitControls(camera, renderer.domElement)

    level = new Level3D(scene)
    ui = new Ui3D()
    model = new Model()

    loadModel()
    moveOnClick()
    markAlly()
    addCollisionSphere()

    render()

    function render() {
        let delta = clock.getDelta()
        model.updateModel(delta)

        level.alliesModels.forEach(allyModel => {
            allyModel.updateModel(delta)
        })
        level.allAllies.forEach(ally => {
            ally.ring.update()
        })

        if (player != null) {
            playerVector = player.getContainer().position.clone()
            playerVector.y = 0

            cameraFollow()
            collisionCheck()
            playerMovement(delta)
            alliesMovement(delta)
        }
        requestAnimationFrame(render)
        renderer.render(scene, camera)
    }

    function cameraFollow() {
        camera.position.x = player.getContainer().position.x
        camera.position.z = player.getContainer().position.z + 600
        camera.position.y = player.getContainer().position.y + 800
    }

    function collisionCheck() {
        collisionRaycaster.ray = new THREE.Ray(player.getContainer().position.clone().add(new THREE.Vector3(0, 100, 0)), directionVect)
        let collisionIntersects = collisionRaycaster.intersectObjects(allWalls, true);
        //console.log(collisionIntersects)
        if (collisionIntersects[0]) {
            sphere.position.set(collisionIntersects[0].point.x, collisionIntersects[0].point.y, collisionIntersects[0].point.z)
            if (collisionIntersects[0].distance < 40 && playerVector.distanceTo(clickedVect) > 0.2) {
                console.log("STOP!")
                clickedVect = playerVector
                model.stop()
            }
        }
    }

    function addCollisionSphere() {
        let geometry = new THREE.SphereGeometry(6, 32, 32)
        let material = new THREE.MeshBasicMaterial({ color: 0xcccccc })
        sphere = new THREE.Mesh(geometry, material)
        sphere.name = "sphere"
        sphere.position.set(0, -10000, 0)
        scene.add(sphere)
    }

    function playerMovement(delta) {
        if (playerVector.distanceTo(clickedVect) > 1.2 * Settings.velocity * delta) {
            player.getContainer().translateOnAxis(directionVect, Settings.velocity * delta)
            level.allies.forEach(ally => {
                ally.getMesh().lookAt(player.getContainer().position)
            })
        }
        else if (playerVector.distanceTo(clickedVect) > 0.2) {
            player.getContainer().translateOnAxis(directionVect, playerVector.distanceTo(clickedVect))
            model.stop()
            level.allies.forEach(ally => {
                ally.getMesh().lookAt(player.getContainer().position)
            })
        }
    }

    function alliesMovement(delta) {
        for (let i = 0; i < level.allies.length; i++) {
            let ally1 = null
            let ally2 = level.allies[i].getContainer()
            if (i == 0) ally1 = player.getContainer()
            else ally1 = level.allies[i - 1].getContainer()

            if (ally1.position.distanceTo(ally2.position) > 150 + 1.2 * Settings.velocity * delta) {
                level.alliesModels[i].walk()
                ally2.translateOnAxis(ally1.position.clone().sub(ally2.position).normalize(), Settings.velocity * delta)
            }
            else if (ally1.position.distanceTo(ally2.position) > 151.2) {
                level.alliesModels[i].walk()
                ally2.translateOnAxis(ally1.position.clone().sub(ally2.position).normalize(), ally1.position.distanceTo(ally2.position) - 151)
            }
            else level.alliesModels[i].stop()
        }
    }

    function loadModel() {
        model.loadModel('/models/model1/scene.gltf', object => {
            console.log("Model załadowany")
            player = new Player(object)
            scene.add(player.getContainer())
            camera.position.x = player.getContainer().position.x
            camera.position.z = player.getContainer().position.z + 600
            camera.position.y = player.getContainer().position.y + 800
            camera.lookAt(player.getContainer().position)
            model.init()
        })
    }

    function moveOnClick() {
        $(document).mousedown((event) => {
            if (player != null) {
                mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
                mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
                raycaster.setFromCamera(mouseVector, camera)
                let intersects = raycaster.intersectObjects(scene.children, true)
                if (intersects.length > 0) {
                    if (intersects[0].object.name == "sphere") return
                    let name = intersects[0].object.parent.parent.name
                    if (name.substring(0, 4) == "ally") {
                        let id = parseInt(name.substring(4, name.length))
                        let removeAlly = false
                        level.allies.forEach((ally, index) => {
                            if (ally.getMesh().name == name) {
                                level.allies.splice(index, 1)
                                level.alliesModels.splice(index, 1)
                                removeAlly = true
                                return
                            }
                        })
                        if (!removeAlly) {
                            level.allies.push(level.allAllies[id])
                            level.alliesModels.push(level.allAlliesModels[id])
                        }
                    }
                    else {
                        model.walk()
                        clickedVect = intersects[0].point
                        clickedVect.y = 0
                        directionVect = clickedVect.clone().sub(player.getContainer().position).normalize()
                        directionVect.y = 0
                        let angle = Math.atan2(player.getContainer().position.clone().x - clickedVect.x, player.getContainer().position.clone().z - clickedVect.z) + Math.PI
                        player.getMesh().rotation.y = angle
                        player.getAxes().rotation.y = angle
                    }
                }
            }
        })
    }

    function markAlly() {
        $(document).mousemove((event) => {
            mouseVector2.x = (event.clientX / $(window).width()) * 2 - 1
            mouseVector2.y = -(event.clientY / $(window).height()) * 2 + 1
            raycaster2.setFromCamera(mouseVector2, camera)
            let intersects2 = raycaster2.intersectObjects(scene.children, true)
            if (intersects2.length > 0) {
                if (intersects2[0].object.name == "sphere") return
                let name = intersects2[0].object.parent.parent.name
                if (name.substring(0, 4) == "ally") {
                    level.allAllies[parseInt(name.substring(4, name.length))].ring.setVisible()
                }
                else {
                    level.allAllies.forEach(ally => {
                        ally.ring.setNotVisible()
                    })
                }
            }
        })
    }
})