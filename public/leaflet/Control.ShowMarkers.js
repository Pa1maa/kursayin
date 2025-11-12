L.Control.ShowMarkers = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._show = L.DomUtil.create("a", "control-button", container)
        this._show.href = "#"
        this._show.title = "Show your markers"
        this._show.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-map-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.598-.49L10.5.99 5.598.01a.5.5 0 0 0-.196 0l-5 1A.5.5 0 0 0 0 1.5v14a.5.5 0 0 0 .598.49l4.902-.98 4.902.98a.5.5 0 0 0 .196 0l5-1A.5.5 0 0 0 16 14.5zM5 14.09V1.11l.5-.1.5.1v12.98l-.402-.08a.5.5 0 0 0-.196 0zm5 .8V1.91l.402.08a.5.5 0 0 0 .196 0L11 1.91v12.98l-.5.1z"/>
                                </svg>`

        this._markerArr = []
        this._active = false
        this._addDomEvents()
        return container
    }

    async activate(){
        if (this._active) return

        this._show.classList.add("active")
        this._active = true
        await this._addMarkers()
    }

    deactivate(){
        if(!this._active) return

        this._show.classList.remove("active")
        this._active = false
        this._removeMarkers()
    }

    reset(){
        this.deactivate()
    }

    async toggle(){
        this._active ? this.deactivate() : await this.activate()
    }

    _addDomEvents(){
        L.DomEvent.on(this._show, "click", async(e)=>{
            L.DomEvent.stop(e)
            await this.toggle()
        })
    }

    async _addMarkers(){
        let markers = []

        if(await this._authenticated()){
            const res = await fetch("/mark/markers", { credentials: "include" })
            const data = await res.json()
            markers = data.markers || []
        }
        else{
            markers = JSON.parse(localStorage.getItem("markers") || "[]")
        }

        for(let i = 0; i < markers.length; i++){
            const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(this._map)
            marker.bindPopup(markers[i].name, { autoClose: false }).openPopup()
            marker._id = markers[i]._id
            this._markerArr.push(marker)
        }
    }

    _removeMarkers(){
        for(let i = 0; i < this._markerArr.length; i++){
            this._markerArr[i].remove()
        }
        this._markerArr = []
    }

    async _authenticated(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.success
    }
}