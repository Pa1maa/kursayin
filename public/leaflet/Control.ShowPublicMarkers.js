const commentsUI = document.getElementById("comments")
const userComP = document.getElementById("userComP")
const comUsername = document.getElementById("comUsername")
const comAvatar = document.getElementById("comAvatar")
const idP = document.getElementById("idP")
let user = null

L.Control.ShowPublicMarkers = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._published = L.DomUtil.create("a", "control-button", container)
        this._published.href = "#"
        this._published.title = "Show published markers"
        this._published.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-pin-map-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z"/>
                                        <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                                    </svg>`

        container.style.marginTop = "0px"

        this._markerArr = []
        this._active = false
        this._others = []

        this._addDomEvents()
        return container
    }

    async activate(){
        if(this._active) return

        this._deactivateOthers()
        this._published.classList.add("active")
        this._active = true
        await this._addMarkers()
    }

    deactivate(){
        if(!this._active) return

        this._published.classList.remove("active")
        this._active = false
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
        L.DomEvent.on(this._published, "click", async (e)=>{
            L.DomEvent.stop(e)
            await this.toggle()
        })
    }

    async _addMarkers(){
        let markers = []

        const res = await fetch("/public/markers", { credentials: "include" })
        const data = await res.json()
        markers = data.markers || []

        for(let i = 0; i < markers.length; i++){
            const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(this._map)
            marker.bindPopup(markers[i].name, { autoClose: false, closeOnClick: false }).openPopup()
            marker._id = markers[i]._id
            this._markerArr.push(marker)

            marker.off("click")
            marker.on("click", async ()=>{
                marker.openPopup()
                const res = await fetch(`/users/getuser?id=${marker._id}`)
                const data = await res.json()
                if(data.success){
                    user = data.user
                }
                else{
                    console.log(data.message)
                }

                localStorage.setItem("markerId", marker._id)
                this._map.setView([markers[i].lat, markers[i].lng])
                commentsUI.style.display = "block"
                userComP.innerText = markers[i].comment
                comUsername.innerHTML = user.username
                if(user.avatarPath){
                    comAvatar.src = user.avatarPath
                }
                else{
                    comAvatar.src = "../assets/sbcf-default-avatar.png"
                }

                const resReply = await fetch(`/reply/replys?${marker._id}`)
                const dataReply = await resReply.json()
                const replys = dataReply.replys

                for(let i = 0; i < replys.length; i++){
                    const div = document.createElement("div")
                    div.classList.add("replys")
                    overlay.appendChild(div)
                    const userDetails = document.createElement("div")
                    userDetails.id = "user"
                    div.appendChild(userDetails)
                    const userImg = document.createElement("img")
                    userImg.alt = "Avatar"
                    userImg.src = replys[i].userId.avatarPath
                    // userImg.id = "comAvatar"
                    userDetails.appendChild(userImg)
                    const username = document.createElement("a")
                    // username.id = "comUsername"
                    username.href = "/user"
                    username.innerText = replys[i].userId.username
                    userDetails.appendChild(username)
                    const userReply = document.createElement("div")
                    userReply.id = "userCom"
                    userReply.style.color = "#ccc"
                    userReply.style.fontSize = "18px"
                    div.appendChild(userReply)
                    const replyP = document.createElement("p")
                    replyP.id = "userComP"
                    replyP = replys[i].reply
                    userReply.appendChild(replyP)
                }
            })
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
}