document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("loginForm").addEventListener("submit", async (e)=>{
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const confirm = document.getElementById("confirmPassword").value

        if(confirm === password){
            const res = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()
            document.getElementById("message").textContent = data.message
            if(data.success){
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000);
            }
        }
        else{
            document.getElementById("message").textContent = "Passwords are not the same"
        }
    })
})