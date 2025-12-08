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
        this._save.innerHTML = `<img src="/assets/default-icons/save.svg">`

        container.style.marginTop = "0px"

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