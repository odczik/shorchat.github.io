const mainPage = document.getElementById("main-page")
const formLogin = document.getElementById("form-login")
const formRegister = document.getElementById("form-register")

const showLoginBtn = document.getElementById("showLogin-btn")
const showRegisterBtn = document.getElementById("showRegister-btn")

showLoginBtn.addEventListener("click", e => {
    e.preventDefault()
    mainPage.style.display = "none"
    formRegister.style.display = "none"
    formLogin.style.display = "block"
    document.title = "ShorChat • Login"
})
showRegisterBtn.addEventListener("click", e => {
    e.preventDefault()
    mainPage.style.display = "none"
    formRegister.style.display = "block"
    formLogin.style.display = "none"
    document.title = "ShorChat • Register"
})