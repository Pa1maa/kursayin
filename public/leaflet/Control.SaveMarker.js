import "./Control.Marker.js"

L.Control.SaveMarker = class extends L.Control {
    constructor(markerControl){
        super()
        this.markerControl = markerControl
    }

    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._save = L.DomUtil.create("a", "control-button", container)
        this._save.href = "#"
        this._save.title = "Save marker"
        this._save.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-floppy-fill" viewBox="0 0 16 16">
                                    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
                                    <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
                                </svg>`

        this._addDomevents()
        return container
    }

    _addDomevents(){
        L.DomEvent.on(this._save, "click", async (e)=>{
            L.DomEvent.stop(e)
            await this._clicked()
        })
    }

    async _clicked(){
        if(!this.markerControl._marker){
            alert("Place a marker first!")
            return
        }

        const lat = this.markerControl._marker.getLatLng().lat
        const lng = this.markerControl._marker.getLatLng().lng
        let name = prompt("Enter location's name: ")
        if(!name) name = "Marked location"

        if(await this._authenticated()){
            const res = await fetch("/mark/marker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ lat: lat, lng: lng, name })
            })

            const data = await res.json()
            if(data.success){
                alert("Marker saved successfully")
            }
        }
        else{
            let markers = JSON.parse(localStorage.getItem("markers") || "[]")

            markers.push({
                lat: lat,
                lng: lng,
                name: name
            })

            localStorage.setItem("markers", JSON.stringify(markers))
        }

        this.markerControl._marker.remove()
        this.markerControl._marker = null
    }

    async _authenticated(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.success
    }
}