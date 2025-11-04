export function addZoom(map){
    const Zoom = L.Control.extend({
        options: {
            position: "topright"
        },

        onAdd: function(map){
            const container = L.DomUtil.create("div", "leaflet-control leaflet-container")

            const zoomIn = L.DomUtil.create("a", "control-button", container)
            const zoomOut = L.DomUtil.create("a", "control-button", container)

            zoomIn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" stroke="#ccc" stroke-width="2.5" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>`
            zoomIn.title = "Zoom in"
            zoomIn.href = "#"

            zoomOut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" stroke="#ccc" stroke-width="2.5" class="bi bi-dash-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                                </svg>`
            zoomOut.title = "Zoom out"
            zoomOut.href = "#"

            L.DomEvent.disableClickPropagation(container)
            L.DomEvent.disableScrollPropagation(container)
            
            zoomIn.onclick = function(e){
                e.preventDefault()
                map.zoomIn()
            }

            zoomOut.onclick = function(e){
                e.preventDefault()
                map.zoomOut()
            }

            return container
        }
    })

    map.addControl(new Zoom)
}