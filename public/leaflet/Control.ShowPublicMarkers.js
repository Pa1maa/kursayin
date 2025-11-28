const commentsUI = document.getElementById("comments")
const userComP = document.getElementById("userComP")
const comUsername = document.getElementById("comUsername")
const comAvatar = document.getElementById("comAvatar")
const idP = document.getElementById("idP")
const replyDiv = document.getElementById("replyDiv")
let user = null

L.Control.ShowPublicMarkers = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._published = L.DomUtil.create("a", "control-button", container)
        this._published.href = "#"
        this._published.title = "Show published markers"
        this._published.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" viewBox="0 -960 960 960" style="width: 30px; height: 30px;">
                                        <path d="M480-360q56 0 101-27.5t71-72.5q-35-29-79-44.5T480-520q-49 0-93 15.5T308-460q26 45 71 72.5T480-360Zm0-200q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0 374q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
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
        document.getElementById("shareMenu").style.display = "none"
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
                localStorage.setItem("markerId", marker._id)
                await this._addReplies(markers[i])
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

    async _addReplies(marker){
        replyDiv.innerHTML = ""
        const res = await fetch(`/users/getuser?id=${marker._id}`)
        const data = await res.json()
        if(data.success){
            user = data.user
        }
        else{
            console.log(data.message)
        }

        this._map.setView([marker.lat, marker.lng])
        commentsUI.style.display = "block"
        userComP.innerText = marker.comment
        comUsername.innerHTML = user.username
        if(user.avatarPath){
            comAvatar.src = user.avatarPath
        }
        else{
            comAvatar.src = "assets/sbcf-default-avatar.png"
        }

        const me = await fetch("/auth/me")
        const myData = await me.json()
        let userMe = null
        if(myData.success){
            userMe = myData.user
        }

        const resReply = await fetch(`/reply/replys?markerId=${marker._id}`)
        const dataReply = await resReply.json()
        const replys = dataReply.replys

        for(let i = 0; i < replys.length; i++){
            const div = document.createElement("div")
            div.classList.add("replys")
            replyDiv.appendChild(div)
            const userDetails = document.createElement("div")
            userDetails.id = "user"
            div.appendChild(userDetails)
            const userImg = document.createElement("img")
            userImg.alt = "Avatar"
            if(replys[i].userId.avatarPath){
                userImg.src = replys[i].userId.avatarPath
            }
            else{
                userImg.src = "assets/sbcf-default-avatar.png"
            }
            userDetails.appendChild(userImg)
            const username = document.createElement("a")
            username.href = "/user"
            username.innerText = replys[i].userId.username
            username.classList.add("username")
            userDetails.appendChild(username)
            const userReply = document.createElement("div")
            userReply.id = "userCom"
            userReply.style.color = "#ccc"
            userReply.style.fontSize = "18px"
            div.appendChild(userReply)
            const replyP = document.createElement("p")
            replyP.id = "userComP"
            replyP.innerText = replys[i].reply
            userReply.appendChild(replyP)

            if(userMe){
                if(userMe.username === replys[i].userId.username){
                    const deleteDiv = document.createElement("div")
                    deleteDiv.classList.add("deleteDiv")
                    userReply.appendChild(deleteDiv)
                    const deleteReply = document.createElement("a")
                    deleteReply.classList.add("deleteReply")
                    deleteReply.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                            </svg>`
                    deleteDiv.appendChild(deleteReply)

                    deleteReply.addEventListener("click", async ()=>{
                        if(!confirm("Are you sure?")) return

                        await fetch(`/reply/replys/${replys[i]._id}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })
                        div.style.display = "none"
                    })
                }
            }
        }

        const usernames = document.getElementsByClassName("username")
        for(let i = 0; i < usernames.length; i++){
            usernames[i].addEventListener("click", ()=>{
                localStorage.setItem("username", usernames[i].innerText)
            })
        }
    }
}