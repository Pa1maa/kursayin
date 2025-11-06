export const ButtonManager = (()=>{
    const buts = new Map()

    return {
        addButton: (name, but)=>{
            buts.set(name, but)
        },

        disableButton: (name)=>{
            const but = buts.get(name)
            if(but.classList.contains("active")){
                but.classList.remove("active")
            }
        }
    }
})()