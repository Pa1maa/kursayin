document.addEventListener("DOMContentLoaded", async ()=>{
    const res = await fetch("/auth/me")
    const data = await res.json()
    if(data.success){
        window.location.href = "/"
        return
    }
    document.getElementById("signupForm").addEventListener("submit", async (e)=>{
        e.preventDefault()
        const username = document.getElementById("username").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const confirm = document.getElementById("confirmPassword").value

        if(confirm === password && password.length >= 8){
            const res = await fetch("/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })

            const data = await res.json()
            document.getElementById("message").textContent = data.message
            if(data.success){
                setTimeout(() => {
                    window.location.href = "/login" 
                }, 1000);
            }
        }
        else{
            if(confirm != password){
                document.getElementById("message").textContent = "Passwords are not the same"
            }
            else if(password.length < 8){
                document.getElementById("message").textContent = "Password has to contain at least 8 characters"
            }
        }
    })
})