const commentsUI = document.getElementById("comments")
const userComP = document.getElementById("userComP")
const comUsername = document.getElementById("comUsername")
const comAvatar = document.getElementById("comAvatar")
const idP = document.getElementById("idP")
let user = null

L.Control.ShowMyPublicMarkers = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._mypublished = L.DomUtil.create("a", "control-button", container)
        this._mypublished.href = "#"
        this._mypublished.title = "Show published markers"
        this._mypublished.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                                        </svg>`

        this._markerArr = []
        this._active = false
        this._addDomEvents()
        return container
    }

    async activate(){
        if(this._active) return

        this._mypublished.classList.add("active")
        this._active = true
        await this._addMarkers()
    }

    deactivate(){
        if(!this._active) return

        this._mypublished.classList.remove("active")
        this._active = false
        this._removeMarkers()
    }

    async toggle(){
        this._active ? this.deactivate() : await this.activate()
    }

    _addDomEvents(){
        L.DomEvent.on(this._mypublished, "click", async (e)=>{
            L.DomEvent.stop(e)
            await this.toggle()
        })
    }

    async _addMarkers(){
        let markers = []

        if(await this._authenticated()){
            const res = await fetch("/public/mymarker", { credentials: "include" })
            const data = await res.json()
            markers = data.markers || []

            for(let i = 0; i < markers.length; i++){
                const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(this._map)
                marker.bindPopup(markers[i].name, { autoClose: false, closeOnClick: false }).openPopup()
                marker._id = markers[i]._id
                this._markerArr.push(marker)

                marker.on("click", async ()=>{
                    const res = await fetch("/public/getuser")
                    const data = await res.json()
                    if(data.success){
                        user = data.user
                    }
                    else{
                        console.log(data.message)
                    }

                    this._map.setView([markers[i].lat, markers[i].lng])
                    commentsUI.style.display = "block"
                    userComP.innerText = markers[i].comment
                    comAvatar.src = user.avatarPath
                    comUsername.innerHTML = `${user.username}`
                    idP.innerText = user._id
                })
            }
        }
        else{
            alert("Please Login or Signup to continue")
            this.deactivate()
        }
    }

    _removeMarkers(){
        for(let i = 0; i < this._markerArr.length; i++){
            this._markerArr[i].remove()
        }
        this._markerArr = []

        if(commentsUI.style.display === "block"){
            commentsUI.style.display = "none"
        }
    }

    async _authenticated(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.success
    }
}