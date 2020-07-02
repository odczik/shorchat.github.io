const usernameInputRegister = document.getElementById("usernameInputRegister")
const passwordInputRegister = document.getElementById("passwordInputRegister")
const emailInputRegister = document.getElementById("emailInputRegister")

const registerButton = document.getElementById("registerButton")


registerButton.addEventListener("click", e => {
    e.preventDefault()

    let username = usernameInputRegister.value
    let pass = passwordInputRegister.value
    let email = emailInputRegister.value

    if(!username) return alert("Username is not valid")
    if(!email) return alert("Email is not valid")
    if(!pass) return alert("Password is not valid")

    let data = {
        name: username,
        email: email,
        pass: pass
    }

    socket.emit("register", data)

    usernameInputRegister.value = ""
    emailInputRegister.value = ""
    passwordInputRegister.value = ""
})