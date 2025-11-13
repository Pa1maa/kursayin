const avatar = document.getElementById("avatar")
const username = document.getElementById("username")
const email = document.getElementById("email")
const age = document.getElementById("age")
const gender = document.getElementById("gender")
let name_ = localStorage.getItem("username")

if(!name_) console.warn("No username selected")

async function loadUser(){
    const res = await fetch(`/users/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name_ })
    })
    const data = await res.json()
    if(data.success){
        const user = data.user
        username.value = user.username || ""
        email.value = user.email || ""
        age.value = user.age || null
        gender.value = user.gender || ""

        if(user.avatarPath){
            avatar.src = user.avatarPath
        }
    }
    else{
        alert(data.message)
    }
}

document.addEventListener("DOMContentLoaded", async ()=>{
    await loadUser()
})