const avatar = document.getElementById("avatar")
const avatarFile = document.getElementById("avatarFile")
const saveAvatar = document.getElementById("saveAvatar")
const cancelAvatar = document.getElementById("cancelAvatar")
const username = document.getElementById("username")
const saveUsername = document.getElementById("saveUsername")
const email = document.getElementById("email")
const saveEmail = document.getElementById("saveEmail")
const age = document.getElementById("age")
const saveAge = document.getElementById("saveAge")
const currentPassword = document.getElementById("currentPassword")
const newPassword = document.getElementById("newPassword")
const toggleNewPassword = document.getElementById("toggleNewPassword")
const toggleCurPassword = document.getElementById("toggleCurPassword")
const savePassword = document.getElementById("savePassword")
const gender = document.getElementById("gender")
const saveGender = document.getElementById("saveGender")
const hiddenDiv = document.getElementById("hiddenPassword")
const chevronBut = document.getElementById("chevron")
const deleteAcc = document.getElementById("delacc")

let croppedBlob = null
let curAvatar

chevronBut.addEventListener("click", ()=>{
    if(hiddenDiv.hidden === true){
        hiddenDiv.hidden = false
        chevronBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1.5" class="bi bi-chevron-up" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                                </svg>`
    }
    else{
        hiddenDiv.hidden = true
        chevronBut.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1.5" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                                </svg>`
    }
})

deleteAcc.addEventListener("click", async ()=>{
    if(!confirm("Are you sure?")) return

    const res = await fetch("/api/me")
    if (!res.ok) return alert("Failed to load user data")
    const user = await res.json()

    console.log(user.username)

    const delres = await fetch(`/auth/user?username=${user.username}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    const data = await delres.json()
    if(data.success){
        alert(data.message)
        const res = await fetch("/auth/logout", { method: "POST", credentials: "include" })
        const logout = await res.json()
        
        if(logout.success){
            window.location.href = "/"
        }
    }
})

async function loadUser(){
    const res = await fetch("/api/me")
    if (!res.ok) return alert("Failed to load user data")
    const user = await res.json()

    username.value = user.username || ""
    email.value = user.email || ""
    age.value = user.age || null
    gender.value = user.gender || ""

    if(user.avatarPath){
        curAvatar = avatar.src = user.avatarPath
    }
}

function enableOnChange(input, button){
    input.addEventListener("input", () => {
        button.disabled = false
    })
}

enableOnChange(username, saveUsername)
enableOnChange(email, saveEmail)
enableOnChange(age, saveAge)
enableOnChange(newPassword, savePassword)
enableOnChange(gender, saveGender)

saveUsername.addEventListener("click", async ()=>{
    const res = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value })
    })
    const j = await res.json()
    if(j.ok){
        saveUsername.disabled = true
        alert("Username updated")
    }
    else{
        alert(j.error || "Error")
    }
})

saveEmail.addEventListener("click", async ()=>{
    const res = await fetch("/api/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value })
    })
    const j = await res.json()
    if(j.ok){
        saveEmail.disabled = true
        alert("Email updated")
    }
    else{
        alert(j.error || "Error")
    }
})

age.addEventListener("keydown", (e)=>{
    if ([".", ",", "e", "+", "-"].includes(e.key)) {
        e.preventDefault();
    }
})

saveAge.addEventListener("click", async ()=>{
    const res = await fetch("/api/update-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: age.value })
    })
    const j = await res.json()
    if(j.ok){
        saveAge.disabled = true
        alert("Age updated")
    }
    else{
        alert(j.error || "Error")
    }
})

toggleNewPassword.addEventListener("click", ()=>{
    if(newPassword.type === "password"){
        newPassword.type = "text"
        toggleNewPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                            <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                            <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                        </svg>`
    }
    else{
        newPassword.type = "password"
        toggleNewPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                        </svg>`
    }
})

toggleCurPassword.addEventListener("click", ()=>{
    if(currentPassword.type === "password"){
        currentPassword.type = "text"
        toggleCurPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                            <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                            <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                        </svg>`
    }
    else{
        currentPassword.type = "password"
        toggleCurPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ccc" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                        </svg>`
    }
})

savePassword.addEventListener("click", async ()=>{
    const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPassword.value, newPassword: newPassword.value })
    })
    const j = await res.json()
    if(j.ok){
        savePassword.disabled = true
        currentPassword.value = ""
        newPassword.value = ""
        alert("Password updated")
    }
    else{
        alert(j.error || "Error")
    }
})

saveGender.addEventListener("click", async ()=>{
    const res = await fetch("/api/update-gender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender: gender.value })
    })
    const j = await res.json()
    if(j.ok){
        saveGender.disabled = true
        alert("Gender updated")
    }
    else{
        alert(j.error || "Error")
    }
})

avatarFile.addEventListener("change", async (e)=>{
    const file = e.target.files[0]
    if (!file) return

    const img = new Image()
    img.src = await fileToDataURL(file)
    img.onload = ()=>{
        const size = Math.min(img.width, img.height)
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 256
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256)
        canvas.toBlob((blob)=>{
            croppedBlob = blob
            avatar.src = URL.createObjectURL(blob)
            saveAvatar.disabled = false
            cancelAvatar.disabled = false
        }, "image/png")
    }
})

saveAvatar.addEventListener("click", async ()=>{
    if(!croppedBlob) return

    const fd = new FormData()
    fd.append("avatar", croppedBlob, "avatar.png")
    const res = await fetch("/api/update-avatar", {
        method: "POST",
        body: fd
    })
    const j = await res.json()
    if(j.ok){
        saveAvatar.disabled = true
        if(!cancelAvatar.disabled) cancelAvatar.disabled = true
        alert("Avatar updated")
    }
    else{
        alert(j.error || "Error")
    }
})

cancelAvatar.addEventListener("click", ()=>{
    avatar.src = curAvatar
    cancelAvatar.disabled = true
    croppedBlob = null
    avatarFile.value = ""

    if(!saveAvatar.disabled) saveAvatar.disabled = true
})

function fileToDataURL(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader()
        reader.onload = ()=>{
            resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

loadUser()