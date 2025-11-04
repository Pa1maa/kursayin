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
})

import { addZoom } from "../leaflet/leaflet_zoom.js"
import { addMarkers } from "../leaflet/leaflet_marker.js"
import { addLocate } from "../leaflet/leaflet_locate.js"

const map = L.map("map", { zoomControl: false }).setView([40.1792, 44.4991], 14)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 4,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

addZoom(map)
addLocate(map)
addMarkers(map)