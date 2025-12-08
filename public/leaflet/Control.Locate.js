L.Control.Locate = class extends L.Control{
    onAdd(map){
        this._map = map
        const container = L.DomUtil.create("div", "leaflet-control leaflet-container");
        this._link = L.DomUtil.create("a", "control-button", container);
        this._link.href = "#"
        this._link.title = "Find your current location"
        this._link.innerHTML = `<img src="/assets/default-icons/locate.svg">`

        container.style.marginTop = "0"
        this._active = false
        this._marker = null
        this._circle = null

        this._addDomEvents()
        return container
    }

    activate(){
        if(this._active) return

        this._link.classList.add("active")
        document.getElementById("shareMenu").style.display = "none"
        this._locate()
        this._active = true
        this._link.innerHTML = `<img src="/assets/active-icons/locate.svg">`
    }

    deactivate(){
        if(!this._active) return

        this._link.classList.remove("active")
        this._active = false
        this._link.innerHTML = `<img src="/assets/default-icons/locate.svg">`
        this._marker.remove()
        this._marker = null
        this._circle.remove()
        this._circle = null
    }

    toggle(){
        this._active ? this.deactivate() : this.activate()
    }

    reset(){
        this.deactivate()
    }

    _addDomEvents(){
        L.DomEvent.on(this._link, "click", (e)=>{
            L.DomEvent.stop(e)
            this.toggle()
        })
    }

    _locate(){
        navigator.geolocation.getCurrentPosition(
            (pos)=>{
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude
                const acc = Math.round(pos.coords.accuracy)
                this._map.setView([lat, lng], 15)
                this._marker = L.marker([lat, lng]).addTo(this._map).bindPopup(`You are within ${acc} meters of this point!`).openPopup()
                this._circle = L.circle([lat, lng], { radius: acc, color: "#8c9cff", opacity: 0.3, stroke: false }).addTo(this._map)
            },
            (err)=>{
                alert("Unable to retrieve your location.")
                console.error(err)
                this.deactivate()
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }
}