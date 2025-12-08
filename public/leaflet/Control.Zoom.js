// export function addZoom(map){
//     const Zoom = L.Control.extend({
//         options: {
//             position: "topright"
//         },

//         onAdd: function(map){
//             const container = L.DomUtil.create("div", "leaflet-control leaflet-container")

//             const zoomIn = L.DomUtil.create("a", "control-button", container)
//             const zoomOut = L.DomUtil.create("a", "control-button", container)

//             container.style.marginTop = "25px"

//             zoomIn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" stroke="#ccc" stroke-width="2.5" class="bi bi-plus-lg" viewBox="0 0 16 16">
//                                     <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
//                                 </svg>`
//             zoomIn.title = "Zoom in"
//             zoomIn.href = "#"

//             zoomOut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" stroke="#ccc" stroke-width="2.5" class="bi bi-dash-lg" viewBox="0 0 16 16">
//                                     <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
//                                 </svg>`
//             zoomOut.title = "Zoom out"
//             zoomOut.href = "#"

//             L.DomEvent.disableClickPropagation(container)
//             L.DomEvent.disableScrollPropagation(container)
            
//             zoomIn.onclick = function(e){
//                 e.preventDefault()
//                 map.zoomIn()
//             }

//             zoomOut.onclick = function(e){
//                 e.preventDefault()
//                 map.zoomOut()
//             }

//             return container
//         }
//     })

//     map.addControl(new Zoom)
// }

L.Control.Zoom = class extends L.Control{
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container")
        this._zoomIn = L.DomUtil.create("a", "control-button", container)
        this._zoomOut = L.DomUtil.create("a", "control-button", container)

        this._zoomIn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" stroke="#ccc" stroke-width="2.5" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>`
        this._zoomIn.title = "Zoom in"
        this._zoomIn.href = "#"

        this._zoomOut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" stroke="#ccc" stroke-width="2.5" class="bi bi-dash-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                            </svg>`
        this._zoomOut.title = "Zoom out"
        this._zoomOut.href = "#"

        container.style.marginTop = "25px"
        this._addDomEvents()
        return container
    }

    _addDomEvents(){
        L.DomEvent.on(this._zoomIn, "click", (e)=>{
            L.DomEvent.stop(e)
            this._map.zoomIn()
        })

        L.DomEvent.on(this._zoomOut, "click", (e)=>{
            L.DomEvent.stop(e)
            this._map.zoomOut()
        })
    }
}