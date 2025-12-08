L.Control.ShowMarkers = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._show = L.DomUtil.create("a", "control-button", container)
        this._show.href = "#"
        this._show.title = "Show saved markers"
        this._show.innerHTML = `<img src="/assets/default-icons/show.svg">`

        container.style.marginTop = "15px"
        this._markerArr = []
        this._active = false
        this._others = []

        this._addDomEvents()
        return container
    }

    async activate(){
        if (this._active) return

        this._deactivateOthers()
        this._show.classList.add("active")
        document.getElementById("shareMenu").style.display = "none"
        this._active = true
        this._show.innerHTML = `<img src="/assets/active-icons/show.svg">`
        await this._addMarkers()
        await this._deleteMarkers()
    }

    deactivate(){
        if(!this._active) return

        this._show.classList.remove("active")
        this._active = false
        this._show.innerHTML = `<img src="/assets/default-icons/show.svg">`
        this._removeMarkers()
    }

    reset(){
        this.deactivate()
    }

    async toggle(){
        this._active ? this.deactivate() : await this.activate()
    }

    _deactivateOthers(){
        if(Array.isArray(this._others)){
            for(let i = 0; i < this._others.length; i++){
                this._others[i].reset()
            }
        }
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

            marker.off("click")
            marker.on("click", ()=>{
                marker.openPopup()
            })
        }
    }

    _removeMarkers(){
        for(let i = 0; i < this._markerArr.length; i++){
            this._markerArr[i].remove()
        }
        this._markerArr = []
    }

    async _deleteMarkers(){
        if(this._active){
            let markers = []
            for(let i = 0; i < this._markerArr.length; i++){
                const latlng = this._markerArr[i].getLatLng()

                this._markerArr[i].on("dblclick", async ()=>{
                    if(!confirm("Are you sure?")) return

                    this._markerArr[i].remove()

                    if(await this._authenticated()){
                        await fetch(`/mark/markers/${this._markerArr[i]._id}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })
                    }
                    else{
                        markers = JSON.parse(localStorage.getItem("markers") || "[]")   
                        for(let j = 0; j < markers.length; j++){
                            if(latlng.lat === markers[j].lat && latlng.lng === markers[j].lng){
                                markers.splice(j, 1)
                                break
                            }
                        }
                        localStorage.setItem("markers", JSON.stringify(markers))
                    }

                    this._markerArr.splice(i, 1)
                })
            }
        }
    }

    async _authenticated(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.success
    }
}