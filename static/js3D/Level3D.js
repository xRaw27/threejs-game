class Level3D {
    constructor(scene) {
        this.scene = scene
        this.lights = []
        this.allAllies = []
        this.allAlliesModels = []
        this.allies = []
        this.alliesModels = []
        this.getData()
    }
    getData() {
        $.ajax({
            url: "/getLevelData",
            type: "POST",
            success: data => {
                console.log(data)
                this.levelData = data.level
                this.createLevel()
            },
            error: (xhr, status, error) => {
                console.log(xhr)
            },
        })
    }
    createLevel() {
        this.levelData.forEach((hexData, i) => {
            let dirIn = -1
            if (i > 0) dirIn = this.levelData[i - 1].dirIn
            let hex3d = new Hex3D(hexData.dirOut, dirIn)
            if (hexData.x % 2) {
                hex3d.position.x = hexData.x * Settings.radius * Math.sqrt(3)
                hex3d.position.z = hexData.z * Settings.radius * 2 + Settings.radius
            }
            else {
                hex3d.position.x = hexData.x * Settings.radius * Math.sqrt(3)
                hex3d.position.z = hexData.z * Settings.radius * 2
            }
            hex3d.rotation.y = Math.PI / 2
            hex3d.position.y = Settings.height / 2
            switch (this.levelData[i].type) {
                case "light":
                    let light = new Light(Settings.lightColor, 15, 550, 300)
                    this.lights.push(light)
                    hex3d.add(light.create())
                    break
                case "treasure":
                    let item = new Item()
                    hex3d.add(item.create())
                    break
                case "ally":
                    let allyModel = new Model()
                    allyModel.loadModel('/models/model1/scene.gltf', object => {
                        console.log("Model Ally załadowany")
                        let ally = new Ally(object)
                        //ally.getContainer().lookAt(player.getContainer().position)
                        //ally.getContainer().position.z = 400 * (i + 1)
                        //ally.getContainer().position.x = 350 * (i + 1)
                        this.scene.add(ally.getContainer())
                        ally.getContainer().position.x = hex3d.position.x
                        ally.getContainer().position.z = hex3d.position.z
                        ally.getMesh().name = "ally" + this.allAllies.length
                        allyModel.init()
                        this.allAlliesModels.push(allyModel)
                        this.allAllies.push(ally)
                    })
                    break
            }
            this.scene.add(hex3d)
        })
        ui.lightControl()
    }
}