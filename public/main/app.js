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

    backspace.addEventListener("click", ()=>{
        search.value = search.value.slice(0, -1) 
    })

    share.addEventListener("click", ()=>{
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