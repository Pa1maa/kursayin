import { ButtonManager } from "../buttonManager.js"

export function addMarkers(map){
    const Markers = L.Control.extend({
        options: {
            position: "topright"
        },

        onAdd: function(map){
            const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
            const but = L.DomUtil.create("a", "control-button", container)
            const save = L.DomUtil.create("a", "control-button", container)

            but.href = "#"
            but.title = "Add a marker"
            but.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                            </svg>`

            save.href = "#"
            save.title = "Save marker"
            save.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-floppy-fill" viewBox="0 0 16 16">
                                <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
                                <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
                            </svg>`

            let marker = null

            async function isAuthenticated(){
                const res = await fetch("/auth/me")
                const data = await res.json()
                return data.success
            }

            ButtonManager.addButton("addUserMarker", but)
            
            function onMapClick(e){
                if(marker){
                    marker.remove()
                }

                marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
                marker.bindPopup("Lat: " + e.latlng.lat.toFixed(3) + ", Lng: " + e.latlng.lng.toFixed(3)).openPopup()

                marker.on("click", ()=>{
                    marker.remove()
                    marker = null
                })
            }

            L.DomEvent.on(but, "click", L.DomEvent.stopPropagation).on(but, "click", L.DomEvent.preventDefault).on(but, "click", ()=>{
                if(!but.classList.contains("active")){
                    but.classList.add("active")

                    ButtonManager.disableButton("showUserMarker")

                    map.on("click", onMapClick)
                }
                else{
                    but.classList.remove("active")
                    map.off("click", onMapClick)
                    if(marker){
                        marker.remove()
                        marker = null
                    }
                }
            })

            L.DomEvent.on(save, "click", L.DomEvent.stopPropagation).on(save, "click", L.DomEvent.preventDefault).on(save, "click", async ()=>{
                if(!marker){
                    alert("place a marker first!")
                    return
                }

                const lat = marker.getLatLng().lat
                const lng = marker.getLatLng().lng
                let name = prompt("Enter location's name: ")
                if(!name) name = "Marked location"

                if(await isAuthenticated()){
                    const res = await fetch("/mark/marker", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ lat: lat, lng: lng, name })
                    })

                    const data = await res.json()
                    if(data.success){
                        alert("Marker saved successfully")
                    }
                }
                else{
                    let markers = JSON.parse(localStorage.getItem("markers") || "[]")

                    markers.push({
                        lat: lat,
                        lng: lng,
                        name: name
                    })

                    localStorage.setItem("markers", JSON.stringify(markers))
                }

                marker.remove()
            })

            return container
        }
    })

    map.addControl(new Markers)
}