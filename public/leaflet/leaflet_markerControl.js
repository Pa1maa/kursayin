import { ButtonManager } from "../buttonManager.js"

export function addMarkerControls(map){
    const MarkerControls = L.Control.extend({
        options: {
            position: "topright"
        },

        onAdd: function(map){
            const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
            const published = L.DomUtil.create("a", "control-button", container)
            const myPublished = L.DomUtil.create("a", "control-button", container)
            const show = L.DomUtil.create("a", "control-button", container)
            const del = L.DomUtil.create("a", "control-button", container)

            show.href = "#"
            show.title = "Show your saved markers"
            show.name = "showButton"
            show.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-map-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.598-.49L10.5.99 5.598.01a.5.5 0 0 0-.196 0l-5 1A.5.5 0 0 0 0 1.5v14a.5.5 0 0 0 .598.49l4.902-.98 4.902.98a.5.5 0 0 0 .196 0l5-1A.5.5 0 0 0 16 14.5zM5 14.09V1.11l.5-.1.5.1v12.98l-.402-.08a.5.5 0 0 0-.196 0zm5 .8V1.91l.402.08a.5.5 0 0 0 .196 0L11 1.91v12.98l-.5.1z"/>
                            </svg>`

            published.href = "#"
            published.title = "Show published markers"
            published.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-pin-map-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z"/>
                                        <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                                    </svg>`

            del.href = "#"
            del.title = "Delete one marker"
            del.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                            </svg>`

            myPublished.href = "#"
            myPublished.title = "Show my published markers"
            myPublished.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                                    </svg>`

            async function isAuthenticated(){
                const res = await fetch("/auth/me")
                const data = await res.json()
                return data.success
            }

            ButtonManager.addButton("showUserMarker", show)
            ButtonManager.addButton("delUserMarker", del)
            ButtonManager.addButton("showPublicMarker", published)

            let allMarkerArr = []
            const commentsUI = document.getElementById("comments")
            const closeUI = document.getElementById("closeUI")
            const userComP = document.getElementById("userComP")
            const comUsername = document.getElementById("comUsername")
            const comAvatar = document.getElementById("comAvatar")
            const idP = document.getElementById("idP")
            let user = null

            closeUI.addEventListener("click", (markers)=>{
                commentsUI.style.display = "none"
            })

            L.DomEvent.on(show, "click", L.DomEvent.stopPropagation).on(show, "click", L.DomEvent.preventDefault).on(show, "click", async ()=>{
                if(!show.classList.contains("active")){
                    show.classList.add("active")

                    ButtonManager.disableButton("addUserMarker")
                    ButtonManager.disableButton("showPublicMarker")

                    let markers = []

                    if(await isAuthenticated()){
                        const res = await fetch("/mark/markers", { credentials: "include" })
                        const data = await res.json()
                        markers = data.markers || []
                    }
                    else{
                        markers = JSON.parse(localStorage.getItem("markers") || "[]")
                    }

                    for(let i = 0; i < markers.length; i++){
                        const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(map)
                        marker.bindPopup(markers[i].name, { autoClose: false }).openPopup()
                        marker._id = markers[i]._id
                        allMarkerArr.push(marker)
                    }
                }
                else{
                    show.classList.remove("active")
                    for(let i = 0; i < allMarkerArr.length; i++){
                        allMarkerArr[i].remove()
                    }
                    allMarkerArr = []

                    if(del.classList.contains("active")){
                        del.classList.remove("active")
                    }
                }
            })

            L.DomEvent.on(myPublished, "click", L.DomEvent.stopPropagation).on(myPublished, "click", L.DomEvent.preventDefault).on(myPublished, "click", async ()=>{
                if(!myPublished.classList.contains("active")){
                    myPublished.classList.add("active")

                    let markers

                    if(await isAuthenticated()){
                        const res = await fetch("/public/mymarker")
                        const data = await res.json()
                        markers = data.markers || []

                        for(let i = 0; i < markers.length; i++){
                            const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(map)
                            marker.bindPopup(markers[i].name, { autoClose: false, closeOnClick: false }).openPopup()
                            marker._id = markers[i]._id
                            allMarkerArr.push(marker)

                            marker.on("click", async ()=>{
                                const res = await fetch("/public/getuser")
                                const data = await res.json()
                                if(data.success){
                                    user = data.user
                                }
                                else{
                                    console.log(data.message)
                                }

                                map.setView([markers[i].lat, markers[i].lng])
                                commentsUI.style.display = "block"
                                userComP.innerText = markers[i].comment
                                comUsername.innerText = user.username
                            })
                        }
                    }
                    else{
                        alert("Please Login or Signup to continue")
                        myPublished.classList.remove("active")
                        for(let i = 0; i < allMarkerArr.length; i++){
                            allMarkerArr[i].remove()
                        }
                        allMarkerArr = []

                        if(commentsUI.style.display === "block"){
                            commentsUI.style.display = "none"
                        }
                    }
                }
                else{
                    myPublished.classList.remove("active")
                }
            })

            L.DomEvent.on(published, "click", L.DomEvent.stopPropagation).on(published, "click", L.DomEvent.preventDefault).on(published, "click", async ()=>{
                ButtonManager.disableButton("showUserMarker")
                ButtonManager.disableButton("addUserMarker")
                ButtonManager.disableButton("delUserMarker")

                let markers = []

                if(!published.classList.contains("active")){
                    published.classList.add("active")

                    const res = await fetch("/public/markers", { credentials: "include" })
                    const data = await res.json()
                    markers = data.markers || []

                    for(let i = 0; i < markers.length; i++){
                        const marker = L.marker([markers[i].lat, markers[i].lng]).addTo(map)
                        marker.bindPopup(markers[i].name, { autoClose: false, closeOnClick: false }).openPopup()
                        marker._id = markers[i]._id
                        allMarkerArr.push(marker)

                        marker.on("click", async ()=>{
                            const res = await fetch("/public/getuser")
                            const data = await res.json()
                            if(data.success){
                                user = data.user
                            }
                            else{
                                console.log(data.message)
                            }

                            map.setView([markers[i].lat, markers[i].lng])
                            commentsUI.style.display = "block"
                            userComP.innerText = markers[i].comment
                            comAvatar.src = user.avatarPath
                            comUsername.innerHTML += `${user.username}`
                            idP.innerText = user._id
                        })
                    }
                }
                else{
                    published.classList.remove("active")
                    for(let i = 0; i < allMarkerArr.length; i++){
                        allMarkerArr[i].remove()
                    }
                    allMarkerArr = []

                    if(commentsUI.style.display === "block"){
                        commentsUI.style.display = "none"
                    }
                }
            })

            L.DomEvent.on(del, "click", L.DomEvent.stopPropagation).on(del, "click", L.DomEvent.preventDefault).on(del, "click", async ()=>{
                let markers = []

                if(await isAuthenticated()){
                    const res = await fetch("/mark/markers", { credentials: "include" })
                    const data = await res.json()
                    markers = data.markers || []
                }
                else{
                    markers = JSON.parse(localStorage.getItem("markers") || "[]")
                }

                if(!del.classList.contains("active") && show.classList.contains("active")){
                    del.classList.add("active")
                    for(let i = 0; i < allMarkerArr.length; i++){
                        const marker = allMarkerArr[i]
                        const latlng = marker.getLatLng()

                        marker.on("click", async function onDelete(){
                            marker.remove()

                            if(await isAuthenticated()){
                                await fetch(`/mark/markers/${marker._id}`, {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" }
                                })
                            }
                            else{
                                for(j = 0; j < markers.length; j++){
                                    if(latlng.lat === markers[j].lat && latlng.lng === markers[j].lng){
                                        markers.splice(j, 1)
                                        break
                                    }
                                }
                                localStorage.setItem("markers", JSON.stringify(markers))
                            }
                            allMarkerArr.splice(i, 1)

                            marker.off("click", onDelete)
                        })
                    }
                }
                // else if(!del.classList.contains("active") && published.classList.contains("active")){

                // }
                else{
                    del.classList.remove("active")
                    for (let i = 0; i < allMarkerArr.length; i++) {
                        allMarkerArr[i].off("click")
                    }
                }
            })

            return container
        }
    })

    map.addControl(new MarkerControls)
}