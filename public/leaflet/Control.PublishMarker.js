import "./Control.Marker.js"

L.Control.PublishMarker = class extends L.Control {
    constructor(markerControl){
        super()
        this.markerControl = markerControl
    }

    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._publish = L.DomUtil.create("a", "control-button", container)
        this._publish.href = "#"
        this._publish.title = "Publish marker"
        this._publish.innerHTML = `<img src="/assets/default-icons/publish.svg">`

        container.style.marginTop = "0px"

        this._addDomEvents()
        return container
    }

    _addDomEvents(){
        L.DomEvent.on(this._publish, "click", async (e)=>{
            L.DomEvent.stop(e)
            await this._clicked()
        })
    }

    async _clicked(){
        if(!this.markerControl._marker){
            alert("Place a marker first!")
            return
        }

        const marker = this.markerControl._marker

        if(await this._authenticated()){
            const lat = marker.getLatLng().lat
            const lng = marker.getLatLng().lng
            let name = prompt("Enter location's name")
            if(!name){
                let user = await this._getMyself()
                if(user.username.at(-1) !== "s"){
                    name = user.username + "'s location"
                }
                else{
                    name = user.username + "' location"
                }
            }
            let comment = null
            while(comment === null || comment.trim() === ""){
                comment = prompt("Your comment about this location: ")

                if(comment === null){
                    alert("Marker will not be saved")
                    return
                }
            }

            const res = await fetch("/public/marker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ lat: lat, lng: lng, name: name, comment: comment })
            })

            const data = await res.json()
            if(data.success){
                alert("Marker published successfully")

                marker.remove()
                this.markerControl._marker = null
            }
        }
        else{
            alert("Login or Signup for publishing markers")
        }
    }

    async _getMyself(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.user
    }

    async _authenticated(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.success
    }
}