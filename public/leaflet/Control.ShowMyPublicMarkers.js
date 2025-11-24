const commentsUI = document.getElementById("comments")
const userComP = document.getElementById("userComP")
const comUsername = document.getElementById("comUsername")
const comAvatar = document.getElementById("comAvatar")
const idP = document.getElementById("idP")
const replyDiv = document.getElementById("replyDiv")
let user = null

L.Control.ShowMyPublicMarkers = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._mypublished = L.DomUtil.create("a", "control-button", container)
        this._mypublished.href = "#"
        this._mypublished.title = "Show my published markers"
        this._mypublished.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
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
        this._mypublished.classList.add("active")
        document.getElementById("shareMenu").style.display = "none"
        this._active = true
        await this._addMarkers()
        await this._deleteMarkers()
    }

    deactivate(){
        if(!this._active) return

        this._mypublished.classList.remove("active")
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

                marker.off("click")
                marker.on("click", async ()=>{
                    marker.openPopup()
                    localStorage.setItem("markerId", marker._id)
                    await this._addReplies(markers[i])
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

    async _deleteMarkers(){
        for(const marker of this._markerArr){
            marker.on("dblclick", async ()=>{
                if(!confirm("Are you sure?")) return

                
                if(await this._authenticated()){
                    await fetch(`/public/markers/${marker._id}`, {
                        method: "DELETE",
                        credentials: "include"
                    })
                    this._markerArr = this._markerArr.filter(m => m._id !== marker._id)
                    commentsUI.style.display = "none"
                    replyDiv.innerHTML = ""
                    marker.off("dblclick")
                    marker.off("click")
                    marker.remove()
                    return
                }
                else{
                    alert("Please Login or Signup to continue")
                    return
                }
            })
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

        commentsUI.style.display = "block"
        userComP.innerText = marker.comment
        comAvatar.src = user.avatarPath
        comUsername.innerHTML = user.username

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
            userImg.src = replys[i].userId.avatarPath
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
                            headers: { "Content-Type": "applicaion/json" }
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

    async _authenticated(){
        const res = await fetch("/auth/me")
        const data = await res.json()
        return data.success
    }
}