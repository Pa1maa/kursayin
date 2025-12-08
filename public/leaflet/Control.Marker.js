L.Control.Marker = class extends L.Control {
    onAdd(map) {
        this._map = map;
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container");
        this._link = L.DomUtil.create("a", "control-button", container);
        this._link.href = "#"
        this._link.title = "Add a marker"
        this._link.innerHTML = `<img src="/assets/default-icons/marker.svg">`

        container.style.marginTop = "15px"
        this._active = false;
        this._marker = null;
        this._others = []

        this._addDomEvents();
        return container;
    }

    activate() {
        if (this._active) return;

        this._deactivateOthers()
        this._link.classList.add("active");
        this._map.on("click", this._onMapClick, this);
        document.getElementById("shareMenu").style.display = "none"
        this._active = true;
        this._link.innerHTML = `<img src="/assets/active-icons/marker.svg">`
    }

    deactivate() {
        if (!this._active) return;

        this._link.classList.remove("active");
        this._map.off("click", this._onMapClick, this);
        this._active = false;
        this._link.innerHTML = `<img src="/assets/default-icons/marker.svg">`
        this._marker?.remove();
    }

    toggle() {
        this._active ? this.deactivate() : this.activate()
    }

    reset() {
        this.deactivate();
    }

    _deactivateOthers(){
        if(Array.isArray(this._others)){
            for(let i = 0; i < this._others.length; i++){
                this._others[i].reset()
            }
        }
    }

    _addDomEvents() {
        L.DomEvent
            .on(this._link, "click", (e) => {
                L.DomEvent.stop(e);
                this.toggle();
            });
    }

    _onMapClick(e) {
        this._marker?.remove();

        this._marker = L.marker([e.latlng.lat, e.latlng.lng])
            this._marker.addTo(this._map)
            .bindPopup("Lat: " + e.latlng.lat.toFixed(3) + ", Lng: " + e.latlng.lng.toFixed(3))
            .openPopup();

        this._marker.on("dblclick", () => {
            this._marker.remove();
            this._marker = null;
        })
    }

}
