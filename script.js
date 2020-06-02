const socket = io("https://alterchatserver.herokuapp.com/socket.io/socket.io.js")
const messageContainer = document.getElementById("message-container")
const messageForm = document.getElementById("send-container")
const messageInput = document.getElementById("message-input")

const usernameInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")
const loginButton = document.getElementById("loginButton")

const chatInterface = document.getElementById("send-container")
const chatInterface1 = document.getElementById("message-container")
const loginInterface = document.getElementById("login")

let name

socket.on("chat-message", data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on("user-connected", name => {
    appendMessage(`${name} Connected`)
})

socket.on("user-disconnected", name => {
    appendMessage(`${name} Disconnected`)
})

messageForm.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`${name}: ${message}`)
    socket.emit("send-chat-message", message)
    messageInput.value = ""
})

function appendMessage(message) {
    const messageElement = document.createElement("div")
    messageElement.innerText = message
    messageContainer.append(messageElement)
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
    let name = nameToLogin
    appendMessage(name + " joined")
    socket.emit("new-user", name)
    loginInterface.style.display = "none"
    chatInterface.style.display = "block"
    chatInterface1.style.display = "block"
})
socket.on("failed", () => {
    alert("Login Failed")
})