import { getVar } from "../main/app.js"

const avatar = document.getElementById("avatar")
const username = document.getElementById("username")
const email = document.getElementById("email")
const age = document.getElementById("age")
const gender = document.getElementById("gender")

async function loadUser(){
    const res = await fetch(`/public/user/${getVar()}`)
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
}

loadUser