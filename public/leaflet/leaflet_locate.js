import { ButtonManager } from "../buttonManager.js"

export function addLocate(map){
    const Locate = L.Control.extend({
        options: {
            position: "topright"
        },

        onAdd: function(map){
            const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
            const loc = L.DomUtil.create("a", "control-button", container)

            container.style.marginTop = "0"
            loc.href = "#"
            loc.title = "Your current location"
            loc.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-cursor-fill" viewBox="0 0 16 16">
                                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
                            </svg>`

            ButtonManager.addButton("locateUser", loc)

            let locating = false
            let marker = null

            L.DomEvent.on(loc, "click", L.DomEvent.stopPropagation).on(loc, "click", L.DomEvent.preventDefault).on(loc, "click", ()=>{
                if(!navigator.geolocation){
                    alert("Geolocation is not supported by your browser")
                    return
                }

                if(!loc.classList.contains("active")){
                    loc.classList.add("active")
                    navigator.geolocation.getCurrentPosition(
                        (pos)=>{
                            const lat = pos.coords.latitude
                            const lng = pos.coords.longitude
                            map.setView([lat, lng], 15)
                            marker = L.marker([lat, lng]).addTo(map).bindPopup("You are here!").openPopup()
                        },
                        (err)=>{
                            alert("Unable to retrieve your location.")
                            console.error(err)
                            loc.classList.remove("active")
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    )
                }
                else{
                    loc.classList.remove("active")
                    marker.remove()
                    marker = null
                }
            })

            return container
        }
    })

    map.addControl(new Locate)
}