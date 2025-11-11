const avatar = document.getElementById("avatar")
const username = document.getElementById("username")
const email = document.getElementById("email")
const age = document.getElementById("age")
const gender = document.getElementById("gender")

async function getElementFromFile() {
    const res = await fetch("/public/main/index.html")
    const text = await res.text()

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html")

    const idP = doc.getElementById("idP")
}

async function loadUser(){
    const userId = getElementFromFile()
    const res = await fetch(`/public/user/${userId}`)
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