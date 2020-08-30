class Hex {
    constructor(x, z, id) {
        this.x = x
        this.z = z
        this.id = id
        this.dirOut = 0
        this.dirIn = 0
        this.type = "wall"
        this.active = false
    }
    updateHex(dirOut, dirIn, type) {
        this.active = true
        this.dirOut = dirOut
        this.dirIn = dirIn
        this.type = type
        this.arrow.append($('<img src="/images/arrow.png">'))
        this.arrow.append($('<p>' + this.dirOut + '</p>'))
        this.arrow.css("transform", "rotate(" + 60 * this.dirOut + "deg)")
    }
    getImage() {
        //let img = $('<div class="hex" style="left:' + this.x + 'px; top: ' + this.z + 'px">')
        let img = $('<div class="hex">')
        this.arrow = $('<div class="arrow"></div>')
        img.append(this.arrow)
        img.click(() => {
            if (this.active) this.dirOut++
            else this.active = true
            if (this.dirOut == 6) this.dirOut = 0
            this.arrow.empty()
            this.arrow.append($('<img src="/images/arrow.png">'))
            this.arrow.append($('<p>' + this.dirOut + '</p>'))
            this.arrow.css("transform", "rotate(" + 60 * this.dirOut + "deg)")
            if (this.dirOut < 3) this.dirIn = this.dirOut + 3
            else this.dirIn = this.dirOut - 3
            //ui.lastClickedId = this.id
            ui.hexType(this.id, this.type)
            ui.updateData(this)
        })
        return img
    }
}