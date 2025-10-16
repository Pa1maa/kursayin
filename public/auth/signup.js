document.getElementById("signupForm").addEventListener("submit", async (e)=>{
    e.preventDefault()
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })

    const data = await res.json()
    alert(data.message)
    if(data.success) window.location.href = "login.html"
})