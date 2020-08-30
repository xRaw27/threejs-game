class Ui {
    constructor() {
        this.hexes = []
        this.data = []
        this.size = 0
        this.lastClickedId = -1
        this.select()
        this.clicks()
    }
    clicks() {
        $('#save').click(() => {
            net.saveData(this.size, this.data)
        })
        $('#get').click(() => {
            net.getData()
        })
        $('#createLevel').click(() => {
            net.saveData(this.size, this.data)
            net.saveLevelData(this.selected)
        })
        $('#hexType > button').each((i, button) => {
            console.log(button)
            $(button).click(() => {
                console.log(this.lastClickedId)
                if (this.lastClickedId != -1) {
                    this.hexes[this.lastClickedId].type = button.id
                    this.hexType(this.lastClickedId, button.id)
                    this.updateData(this.hexes[this.lastClickedId])
                }
            })

        })
    }
    hexType(id, type) {
        this.lastClickedId = id
        $('#hexType > button').each((i, button) => { $(button).css("color", "black") })
        $('#' + type).css("color", "red")
    }
    select() {
        $("#select").change(() => {
            this.data = []
            this.size = parseInt($('#select').val())
            this.hexes = []
            this.updateData()
            this.createHexes()
        })
    }
    loadFromServer(data) {
        this.loadHexes(data[data.length - 1])
        let loadedFromServer = $("#loadedFromServer")
        let select = $("<select>")
        loadedFromServer.empty()
        loadedFromServer.text("Załadowano z serwera: ")
        loadedFromServer.append(select)
        data.forEach((level, index) => {
            if (index != data.length - 1) select.append($("<option value=" + index + "> Level " + (index + 1) + " ( size: " + level.size + ")</option>"))
            else select.append($("<option selected value=" + index + "> Level " + (index + 1) + " ( size: " + level.size + ")</option>"))
        })
        select.change(() => {
            if (select.val() != null) this.loadHexes(data[select.val()])
        })
    }
    loadHexes(data) {
        this.data = data.level
        this.size = data.size
        this.hexes = []
        this.createHexes()
        this.data.forEach(hex => {
            this.hexes[hex.id].updateHex(hex.dirOut, hex.dirIn, hex.type)
        })
        this.updateData()
    }
    createHexes() {
        $('#hexType > button').each((i, button) => { $(button).css("color", "black") })
        $('#main').empty()
        this.lastClickedId = -1
        let id = 0
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let hex = new Hex(x, y, id)
                this.hexes.push(hex)
                id++
                if (x % 2) {
                    $('#main').append(hex.getImage().css({ "left": 120 * x + "px", "top": 140 * y + 70 + "px" }))
                }
                else {
                    $('#main').append(hex.getImage().css({ "left": 120 * x + "px", "top": 140 * y + "px" }))
                }
            }
        }
    }
    addData(hex) {
        this.data.push(hex)
        this.updateData()
    }
    updateData(newData = false) {
        if (newData) {
            let updated = false
            this.data.forEach((hex, i) => {
                if (hex.id == newData.id) {
                    console.log("essa")
                    this.data[i] = {
                        id: newData.id, x: newData.x, z: newData.z, dirOut: newData.dirOut, dirIn: newData.dirIn, type: newData.type
                    }
                    updated = true
                }
            })
            if (!updated) {
                this.data.push({
                    id: newData.id, x: newData.x, z: newData.z, dirOut: newData.dirOut, dirIn: newData.dirIn, type: newData.type
                })
            }
        }
        $('#data').text(JSON.stringify(this.data, null, 5))
    }
}