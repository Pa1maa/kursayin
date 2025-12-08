const searchBut = document.getElementById("searchBut")
const search = document.getElementById("search")
const searchDiv = document.getElementById("searchDiv")
const cancelSearch = document.getElementById("cancelSearch")

L.Control.Search = class extends L.Control {
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._search = L.DomUtil.create("a", "control-button", container)
        this._search.href = "#"
        this._search.title = "Search for marker"
        this._search.innerHTML = `<img src="/assets/default-icons/search.svg">`

        container.style.marginTop = "15px"
        this._addDomEvents()
        this._active = false
        this._markerArr = []
        this._others = []
        return container
    }

    activate(){
        if(this._active) return

        this._deactivateOthers()
        searchDiv.style.display = "block"
        this._search.classList.add("active")
        this._searchForMarkers()
        document.getElementById("shareMenu").style.display = "none"
        this._active = true
        this._search.innerHTML = `<img src="/assets/active-icons/search.svg">`

        cancelSearch.addEventListener("click", ()=>{
            searchDiv.style.display = "none"
            this.reset()
        })
    }

    deactivate(){
        if(!this._active) return

        searchDiv.style.display = "none"
        this._search.classList.remove("active")
        this._removeMarkers()
        this._active = false
        this._search.innerHTML = `<img src="/assets/default-icons/search.svg">`
    }

    toggle(){
        this._active ? this.deactivate() : this.activate()
    }

    reset(){
        this.deactivate()
    }

    _deactivateOthers(){
        if(Array.isArray(this._others)){
            for(let i = 0; i < this._others.length; i++){
                this._others[i].reset()
            }
        }
    }

    _addDomEvents(){
        L.DomEvent
            .on(this._search, "click", (e)=>{
                L.DomEvent.stop(e)
                this.toggle()
            })
    }

    _searchForMarkers(){
        searchBut.addEventListener("click", async ()=>{
            this._removeMarkers()

            const res = await fetch(`/public/search?name=${search.value}`)
            const data = await res.json()
            if(data.success){
                const markers = data.markers || []

                for(let i = 0; i < markers.length; i++){
                    const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(this._map)
                    marker.bindPopup(markers[i].name, { autoClose: false, closeOnClick: false }).openPopup()
                    this._markerArr.push(marker)

                    marker.off("click")
                    marker.on("click", async ()=>{
                        marker.openPopup()
                        await this._addReplies()
                    })
                }
            }
        })
    }

    _removeMarkers(){
        for(let i = 0; i < this._markerArr.length; i++){
            this._markerArr[i].remove()
        }
        this._markerArr = []
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
            comAvatar.src = "../assets/sbcf-default-avatar.png"
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
}