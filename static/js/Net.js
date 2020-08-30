class Net {
    constructor() {

    }
    saveData(size, data) {
        $.ajax({
            url: "/save",
            data: { size: size, level: JSON.stringify(data) },
            type: "POST",
            success: data => {
                console.log("XD")
            },
            error: (xhr, status, error) => {
                console.log(xhr);
            },
        })
    }
    getData() {
        $.ajax({
            url: "/get",
            type: "POST",
            success: data => {
                if (data.length > 0) ui.loadFromServer(data)
            },
            error: (xhr, status, error) => {
                console.log(xhr)
            },
        })
    }
    saveLevelData() {
        $.ajax({
            url: "/saveLevelData",
            type: "POST",
            success: () => {
                location.href = "/game"
            },
            error: (xhr, status, error) => {
                console.log(xhr)
            },
        })
    }
}