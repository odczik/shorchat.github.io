const socket = io("https://alterchatserver.herokuapp.com")
const messageContainer = document.getElementById("message-container")
const messageForm = document.getElementById("send-container")
const messageInput = document.getElementById("message-input")

const usernameInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")
const loginButton = document.getElementById("loginButton")

const chatInterface = document.getElementById("send-container")
const chatInterface1 = document.getElementById("message-container")
const loginInterface = document.getElementById("login")

const usersContainer = document.getElementById("users-container")
const odczik = document.getElementById("odczik")
const pythonprogrammer = document.getElementById("python-programmer")
const Fox = document.getElementById("Fox")
const dominikbubu = document.getElementById("dominikbubu")

let name

const userButton = document.getElementById("users-button")

socket.on("chat-message", data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on("user-connected", name => {
    if(!name || name === undefined || name === null) return
    appendMessage(`${name} Connected`)
    //appendUser(name)
    socket.emit("show-users")
})

socket.on("user-disconnected", name => {
    if(!name || name === undefined || name === null) return
    appendMessage(`${name} Disconnected`)
    //delUser(name)
    socket.emit("show-users")
})

window.addEventListener("unload", () => {
    socket.emit("update-users-offline", name)
})
window.addEventListener("mousemove", () => {
    socket.emit("update-users-online", name)
    socket.emit("show-users")
})

messageForm.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value
    if(!message || message === undefined || message === null) return alert("You cant send blank message!")
    appendMessage(`${name}: ${message}`)
    socket.emit("send-chat-message", message)
    messageInput.value = ""
    socket.emit("update-users-online", nameToLogin)
    socket.emit("show-users")
})

function appendMessage(message) {
    const messageElement = document.createElement("div")
    messageElement.innerText = message
    messageContainer.append(messageElement)
    messageContainer.scrollTop = messageContainer.scrollHeight
}
function appendUser(username) {
    const messageElement = document.createElement("div")
    messageElement.innerText = username
    messageElement.id = username
    usersContainer.append(messageElement)
}
function delUser(username) {
    const messageElement = document.getElementById(username)
    messageElement.remove()
}

loginButton.addEventListener("click", e => {
    e.preventDefault()
    let data = {
        name: usernameInput.value,
        pass: passwordInput.value
    }

    if(!data.name) return alert("Username is not valid")
    if(!data.pass) return alert("Password is not valid")

    socket.emit("login", data)
    usernameInput.value = ""
    passwordInput.value = ""
})

socket.on("success", nameToLogin => {
    appendMessage(nameToLogin + " joined")
    socket.emit("new-user", nameToLogin)
    name = nameToLogin
    //currentUser.innerHTML = nameToLogin + "<b> offline</b>"
    loginInterface.style.display = "none"
    chatInterface.style.display = "block"
    chatInterface1.style.display = "block"
    usersContainer.style.display = "block"
    socket.emit("update-users-online", nameToLogin)
    socket.emit("show-users")
})

socket.on("failed", () => {
    alert("Login Failed")
})

userButton.addEventListener("click", e => {
    e.preventDefault()
    socket.emit("show-users")
})

socket.on("users", data => {
    odczik.innerHTML = "odczik" + ` <b id="odczik1">${data["odczik"]}</b>`
    const odczik1 = document.getElementById("odczik1")
    if(data["odczik"] === "online") { odczik1.style.color = "green" }
    if(data["odczik"] === "offline") { odczik1.style.color = "red" }

    pythonprogrammer.innerHTML = "python programmer" + ` <b id="python-programmer1">${data["python programmer"]}</b>`
    const pythonprogrammer1 = document.getElementById("python-programmer1")
    if(data["python programmer"] === "online") { pythonprogrammer1.style.color = "green" }
    if(data["python programmer"] === "offline") { pythonprogrammer1.style.color = "red" }

    Fox.innerHTML = "Fox" + ` <b id="Fox1">${data["Fox"]}</b>`
    const Fox1 = document.getElementById("Fox1")
    if(data["Fox"] === "online") { Fox1.style.color = "green" }
    if(data["Fox"] === "offline") { Fox1.style.color = "red" }

    dominikbubu.innerHTML = "dominikbubu" + ` <b id="dominikbubu1">${data["dominikbubu"]}</b>`
    const dominikbubu1 = document.getElementById("dominikbubu1")
    if(data["dominikbubu"] === "online") { dominikbubu1.style.color = "green" }
    if(data["dominikbubu"] === "offline") { dominikbubu1.style.color = "red" }
})