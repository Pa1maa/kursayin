import { addZoom } from "../leaflet/leaflet_zoom.js"
import { addLocate } from "../leaflet/leaflet_locate.js"
import "../leaflet/Control.Marker.js"
import "../leaflet/Control.SaveMarker.js"
import "../leaflet/Control.PublishMarker.js"
import "../leaflet/Control.ShowMarkers.js"
import "../leaflet/Control.ShowPublicMarkers.js"
import "../leaflet/Control.ShowMyPublicMarkers.js"
import "../leaflet/Control.Search.js"

document.addEventListener("DOMContentLoaded", async ()=>{
    const navBut = document.getElementById("nav-but")
    try{
        const res = await fetch("/auth/me")
        const data = await res.json()

        if(data.success){
            navBut.innerHTML += `
                <a href="/me" id="acc-link" class="links">Account</a>
                <a href="#" id="logout-link" class="links">Log out</a>
            `

            document.getElementById("logout-link").addEventListener("click", async (e)=>{
                e.preventDefault()
                const res = await fetch("/auth/logout", { method: "POST", credentials: "include" })
                const data = await res.json()
                
                if(data.success){
                    window.location.reload()
                }
            })
        }
        else{
            throw new Error("Not logged in")
        }
    }
    catch{
        navBut.innerHTML += `
            <a href="/login" class="links">Login</a>
            <a href="/signup" class="links">Sign up</a>
        `
    }
    
    const image = document.getElementById("comAvatar")
    const a = document.getElementById("comUsername")
    const closeUI = document.getElementById("closeUI")
    const commentsUI = document.getElementById("comments")
    const replyBut = document.getElementById("replyA")
    const replyDiv = document.getElementById("replyDiv")
    const toggleReplies = document.getElementById("toggleReplies")
    const layers = document.getElementById("layers")
    const shareMenu = document.getElementById("shareMenu")
    const share = document.getElementById("share")
    const links = document.getElementsByClassName("shareLink")
    const cancel = document.getElementById("cancelBut")
    const search = document.getElementById("search")
    const backspace = document.getElementById("backspace")
    const likeBut = document.getElementById("like")
    const disBut = document.getElementById("dislike")
    const likeP = document.getElementById("likeP")
    const disP = document.getElementById("dislikeP")
    const thumbs = document.getElementById("thumbs")

    toggleReplies.addEventListener("click", ()=>{
        if(replyDiv.style.display !== "none"){
            replyDiv.style.display = "none"
            toggleReplies.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1.5" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                                        </svg>`
        }
        else{
            replyDiv.style.display = "flex"
            toggleReplies.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1.5" class="bi bi-chevron-up" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                                        </svg>`
        }
    })

    const observer = new MutationObserver(async ()=>{
        const display = window.getComputedStyle(commentsUI).display
        if(display === "block" && await authenticated()){
            thumbs.style.display = "flex"
            await setP(likeP, disP, likeBut, disBut)
        }
        else{
            thumbs.style.display = "none"
        }
    })

    observer.observe(commentsUI, { attributes: true, attributeFilter: ["style", "class"] })

    likeBut.addEventListener("click", async ()=>{
        await like(likeP, disP)

        if(likeBut.classList.contains("clicked")){
            likeBut.classList.remove("clicked")
            likeBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                </svg>`
        }
        else{
            likeBut.classList.add("clicked")
            likeBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                </svg>`

            if(disBut.classList.contains("clicked")){
                disBut.classList.remove("clicked")
                disBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                        <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                                    </svg>`
            }
        }
    })

    disBut.addEventListener("click", async ()=>{
        await dislike(likeP, disP)

        if(disBut.classList.contains("clicked")){
            disBut.classList.remove("clicked")
            disBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                    <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                                </svg>`
        }
        else{
            disBut.classList.add("clicked")
            disBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                                    <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591"/>
                                </svg>`

            if(likeBut.classList.contains("clicked")){
                likeBut.classList.remove("clicked")
                likeBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                        <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                    </svg>`
            }
        }
    })

    backspace.addEventListener("click", ()=>{
        search.value = search.value.slice(0, -1) 
    })

    share.addEventListener("click", ()=>{
        disableSearch()
        shareMenu.style.display = "block"
        copyShareLink()
    })

    cancel.addEventListener("click", ()=>{
        shareMenu.style.display = "none"
    })

    for(let i = 0; i < links.length; i++){
        links[i].addEventListener("click", ()=>{
            shareMenu.style.display = "none"
        })
    }

    layers.addEventListener("click", ()=>{
        changeLayer()
    })

    closeUI.addEventListener("click", ()=>{
        commentsUI.style.display = "none"
    })

    image.addEventListener("click", ()=>{
        storeVar(a)
        window.location.href = a.href
    })

    a.addEventListener("click", ()=> storeVar(a))

    replyBut.addEventListener("click", async ()=>{
        const existuser = await fetch("/auth/me")
        const userdata = await existuser.json()
        if(!userdata.success){
            alert("Please Login or Signup to continue")
            return
        }
        let reply = null
        while(!reply){
            reply = prompt("Your reply")
        }
        const markerId = localStorage.getItem("markerId")
        const res = await fetch("/reply/reply",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ markerId: markerId, reply: reply })
        })

        const data = await res.json()
        if(data.success){
            const div = document.createElement("div")
            div.classList.add("replys")
            replyDiv.appendChild(div)
            const userDetails = document.createElement("div")
            userDetails.id = "user"
            div.appendChild(userDetails)
            const userImg = document.createElement("img")
            userImg.alt = "Avatar"
            userImg.src = userdata.user.avatarPath
            userDetails.appendChild(userImg)
            const username = document.createElement("a")
            username.href = "/user"
            username.innerText = userdata.user.username
            username.classList.add("username")
            userDetails.appendChild(username)
            const userReply = document.createElement("div")
            userReply.id = "userCom"
            userReply.style.color = "#ccc"
            userReply.innerText = reply
            userReply.style.fontSize = "18px"
            div.appendChild(userReply)
            const replyP = document.createElement("p")
            replyP.id = "userComP"
            userReply.appendChild(replyP)

            const deleteDiv = document.createElement("div")
            deleteDiv.classList.add("deleteDiv")
            userReply.appendChild(deleteDiv)
            const deleteReply = document.createElement("a")
            deleteReply.classList.add("deleteReply")
            deleteReply.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                    </svg>`
            deleteDiv.appendChild(deleteReply)
        }
    })
})

function storeVar(element){
    localStorage.setItem("username", element.innerText)
}

const map = L.map("map", { zoomControl: false }).setView([40.1792, 44.4991], 14)
const tilesArr = [
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png",
    "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=ssJc9GV2uuuoBuiMJ6Fo",
]

const getInd = parseInt(localStorage.getItem("curTileInd"), 10)
let curTileInd = 0
if(!isNaN(getInd) && getInd >= 0 && getInd < tilesArr.length){
    curTileInd = getInd
}
else{
    curTileInd = 0
}

let layer = L.tileLayer(tilesArr[curTileInd], {
                maxZoom: 19,
                minZoom: 4,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

function changeLayer(){
    curTileInd = (curTileInd + 1) % tilesArr.length
    map.removeLayer(layer)
    layer = L.tileLayer(tilesArr[curTileInd], {
                maxZoom: 19,
                minZoom: 4,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

    localStorage.setItem("curTileInd", curTileInd)
}

function createShareLink(map, curTileInd){
    const center = map.getCenter()
    const zoom = map.getZoom()

    return `${location.origin}${location.pathname}?lat=${center.lat}&lng=${center.lng}&z=${zoom}&tile=${curTileInd}`
}

function loadMapState(map){
    const params = new URLSearchParams(location.search)

    const lat = parseFloat(params.get("lat"))
    const lng = parseFloat(params.get("lng"))
    const zoom = parseInt(params.get("z"))
    const tile = parseInt(params.get("tile"))

    if(!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)){
        map.setView([lat, lng], zoom)
    }

    if(!isNaN(tile) && tilesArr[tile]){
        if(layer) map.removeLayer(layer)

        layer = L.tileLayer(tilesArr[tile], {
            maxZoom: 19,
            minZoom: 4,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)
    }
}
loadMapState(map)

function copyShareLink(){
    const link = createShareLink(map, curTileInd)

    navigator.clipboard.writeText(link)
}

function disableSearch(){
    searchMarkers.deactivate()
}

async function setP(likeP, disP, likeBut, disBut){
    const markerId = localStorage.getItem("markerId")
    const res = await fetch(`/likes/all?id=${markerId}`)
    const data = await res.json()

    if(data.success){
        likeP.innerText = data.likes
        disP.innerText = data.dislikes
    }

    if(await isLiked()){
        likeBut.classList.add("clicked")
        likeBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                            </svg>`
    }
    else{
        likeBut.classList.remove("clicked")
        likeBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                </svg>`
    }

    if(await isDisliked()){
        disBut.classList.add("clicked")
        disBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                                <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591"/>
                            </svg>`
    }
    else{
        disBut.classList.remove("clicked")
        disBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="#ccc" stroke-width="1" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
                            </svg>`
    }
}

async function like(likeP, disP){
    const markerId = localStorage.getItem("markerId")
    const res = await fetch(`/likes/like/${markerId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })

    const data = await res.json()
    if(data.success){
        likeP.innerText = data.likes
        disP.innerText = data.dislikes
    }
}

async function dislike(likeP, disP){
    const markerId = localStorage.getItem("markerId")
    const res = await fetch(`/likes/dislike/${markerId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })

    const data = await res.json()
    if(data.success){
        likeP.innerText = data.likes
        disP.innerText = data.dislikes
    }
}

async function isLiked(){
    const markerId = localStorage.getItem("markerId")
    const res = await fetch(`/likes/liked?id=${markerId}`)
    const data = await res.json()

    if(data.success){
        return data.condition
    }
}

async function isDisliked(){
    const markerId = localStorage.getItem("markerId")
    const res = await fetch(`/likes/disliked?id=${markerId}`)
    const data = await res.json()

    if(data.success){
        return data.condition
    }
}

async function authenticated(){
    const res = await fetch("/auth/me")
    const data = await res.json()
    
    if(data.success){
        return true
    }
    else{
        return false
    }
}

const markerControl = new L.Control.Marker()
const saveMarker = new L.Control.SaveMarker(markerControl)
const publishMarker = new L.Control.PublishMarker(markerControl)
const showMarkers = new L.Control.ShowMarkers()
const showPublicMarker = new L.Control.ShowPublicMarkers()
const showMyPublicMarkers = new L.Control.ShowMyPublicMarkers()
const searchMarkers = new L.Control.Search()

addZoom(map)
addLocate(map)
markerControl.addTo(map)
saveMarker.addTo(map)
publishMarker.addTo(map)
showMarkers.addTo(map)
showPublicMarker.addTo(map)
showMyPublicMarkers.addTo(map)
searchMarkers.addTo(map)

markerControl._others = [showMarkers, showMyPublicMarkers, showPublicMarker, searchMarkers]
showMarkers._others = [markerControl, showMyPublicMarkers, showPublicMarker, searchMarkers]
showPublicMarker._others = [markerControl, showMarkers, showMyPublicMarkers, searchMarkers]
showMyPublicMarkers._others = [markerControl, showMarkers, showPublicMarker, searchMarkers]
searchMarkers._others = [markerControl, showMarkers, showPublicMarker, showMyPublicMarkers]