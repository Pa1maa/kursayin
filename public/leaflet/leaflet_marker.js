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
            const publish = L.DomUtil.create("a", "control-button", container)

            but.href = "#"
            but.title = "Add a marker"
            but.name = "addMarkButton"
            but.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                            </svg>`

            save.href = "#"
            save.title = "Save marker"
            save.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-floppy-fill" viewBox="0 0 16 16">
                                <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
                                <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
                            </svg>`

            publish.href = "#"
            publish.title = "Publish a marker"
            publish.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-globe2" viewBox="0 0 16 16">
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
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
                    ButtonManager.disableButton("showPublicMarker")
                    ButtonManager.disableButton("delUserMarker")

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

            L.DomEvent.on(publish, "click", L.DomEvent.stopPropagation).on(publish, "click", L.DomEvent.preventDefault).on(publish, "click", async ()=>{
                if(!marker){
                    alert("place a marker first!")
                    return
                }
                
                if(await isAuthenticated()){
                    const lat = marker.getLatLng().lat
                    const lng = marker.getLatLng().lng
                    let name = prompt("Enter location's name")
                    if(!name) name = "Marked location"
                    let comment
                    while(!comment){
                        comment = prompt("Your comment about this location: ")
                    }

                    const res = await fetch("/public/marker", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ lat: lat, lng: lng, name: name, comment: comment })
                    })

                    const data = await res.json()
                    if(data.success){
                        alert("Marker published successfully")

                        marker.remove()
                        marker = null
                    }
                }
                else{
                    alert("Login or Signup for publishing markers")
                }
            })

            return container
        }
    })

    map.addControl(new Markers)
}