import { addZoom } from "../leaflet/leaflet_zoom.js"
import { addLocate } from "../leaflet/leaflet_locate.js"
import "../leaflet/Control.Marker.js"
import "../leaflet/Control.SaveMarker.js"
import "../leaflet/Control.PublishMarker.js"
import "../leaflet/Control.ShowMarkers.js"
import "../leaflet/Control.ShowPublicMarkers.js"
import "../leaflet/Control.ShowMyPublicMarkers.js"

document.addEventListener("DOMContentLoaded", async ()=>{
    const navBut = document.getElementById("nav-but")
    const image = document.getElementById("comAvatar")
    const a = document.getElementById("comUsername")
    const closeUI = document.getElementById("closeUI")
    const commentsUI = document.getElementById("comments")

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

    closeUI.addEventListener("click", ()=>{
        commentsUI.style.display = "none"
    })

    image.addEventListener("click", ()=>{
        storeVar(a)
        window.location.href = a.href
    })

    a.addEventListener("click", ()=> storeVar(a))
})

function storeVar(element){
    localStorage.setItem("username", element.innerText)
}

const map = L.map("map", { zoomControl: false }).setView([40.1792, 44.4991], 14)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 4,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

const markerControl = new L.Control.Marker()
const saveMarker = new L.Control.SaveMarker(markerControl)
const publishMarker = new L.Control.PublishMarker(markerControl)
const showMarkers = new L.Control.ShowMarkers()
const showPublicMarker = new L.Control.ShowPublicMarkers()
const showMyPublicMarkers = new L.Control.ShowMyPublicMarkers()

addZoom(map)
addLocate(map)
markerControl.addTo(map)
saveMarker.addTo(map)
publishMarker.addTo(map)
showPublicMarker.addTo(map)
showMyPublicMarkers.addTo(map)
showMarkers.addTo(map)