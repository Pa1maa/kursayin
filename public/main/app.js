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
            toggleReplies.innerHTML = `<img src="../assets/svg/chevronDown.svg">`
        }
        else{
            replyDiv.style.display = "flex"
            toggleReplies.innerHTML = `<img src="../assets/svg/chevronUp.svg">`
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
            likeBut.innerHTML = `<img src="../assets/svg/like.svg" alt="like">`
        }
        else{
            likeBut.classList.add("clicked")
            likeBut.innerHTML = `<img src="../assets/svg/likeFill.svg" alt="like">`

            if(disBut.classList.contains("clicked")){
                disBut.classList.remove("clicked")
                disBut.innerHTML = `<img src="../assets/svg/dislike.svg" alt="like">`
            }
        }
    })

    disBut.addEventListener("click", async ()=>{
        await dislike(likeP, disP)

        if(disBut.classList.contains("clicked")){
            disBut.classList.remove("clicked")
            disBut.innerHTML = `<img src="../assets/svg/dislike.svg" alt="like">`
        }
        else{
            disBut.classList.add("clicked")
            disBut.innerHTML = `<img src="../assets/svg/dislikeFill.svg" alt="like">`

            if(likeBut.classList.contains("clicked")){
                likeBut.classList.remove("clicked")
                likeBut.innerHTML = `<img src="../assets/svg/like.svg" alt="like">`
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
            if(userdata.user.avatarPath){
                userImg.src = userdata.user.avatarPath
            }
            else{
                userImg.src = "assets/sbcf-default-avatar.png"
            }
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
            deleteReply.innerHTML = `<img src="../assets/svg/trash.svg">`
            deleteDiv.appendChild(deleteReply)
        }
    })
})

function storeVar(element){
    localStorage.setItem("username", element.innerText)
}

const map = L.map("map", { zoomControl: false })

navigator.geolocation.getCurrentPosition(
    (pos)=>{
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        map.setView([lat, lng], 15)
    },
    ()=>{
        map.setView([51.5007, 0.1245])
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
)

const tilesArr = [
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png",
    "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=ssJc9GV2uuuoBuiMJ6Fo",
    'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
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
        likeBut.innerHTML = `<img src="../assets/svg/likeFill.svg" alt="like">`
    }
    else{
        likeBut.classList.remove("clicked")
        likeBut.innerHTML = `<img src="../assets/svg/like.svg" alt="like">`
    }

    if(await isDisliked()){
        disBut.classList.add("clicked")
        disBut.innerHTML = `<img src="../assets/svg/dislikeFill.svg" alt="like">`
    }
    else{
        disBut.classList.remove("clicked")
        disBut.innerHTML = `<img src="../assets/svg/dislike.svg" alt="like">`
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