class Ui3D {
    constructor() { }
    lightControl() {
        console.log("ASASA")
        console.log(level.lights)
        console.log(level.lights.length)
        let intensityRange = $('<input id="intensity" min="0" max="15" step="0.01" type="range">')
        let distanceRange = $('<input id="distance" min="1" max="1500" type="range">')
        let positionRange = $('<input id="position" min="1" max="1000" type="range">')
        $("#root").append(intensityRange)
        $("#root").append(distanceRange)
        $("#root").append(positionRange)
        intensityRange.on('input', () => {
            level.lights.forEach(element => {
                element.updateIntensity(intensityRange.val())
            })
        })
        distanceRange.on('input', () => {
            level.lights.forEach(element => {
                element.updateDistance(distanceRange.val())
            })
        })
        positionRange.on('input', () => {
            level.lights.forEach(element => {
                element.updatePosition(positionRange.val())
            })
        })
    }
}