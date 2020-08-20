const socket = io("https://shorchatserver.herokuapp.com")
const messageContainer = document.getElementById("message-container")
const messageForm = document.getElementById("send-container")
const messageInput = document.getElementById("message-input")
const sendButton = document.getElementById("send-button")
const imageButton = document.getElementById("image-button")

const usernameInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")
const loginButton = document.getElementById("loginButton")

const chatInterface = document.getElementById("send-container")
const chatInterface1 = document.getElementById("message-container")
const loginInterface = document.getElementById("login")

const usersContainer = document.getElementById("users-container")
const usersOnlineNum = document.getElementById("usersOnlineNum")

let name
let token
let userId

let userCount

let unreadedMsg = 0

const userButton = document.getElementById("users-button")

socket.on("chat-message", data => {
    appendMessage(`${data.name}: ${data.message}`)
    isFocused()
})
socket.on("chat-image", data => {
    appendImage(data)
    isFocused()
})

function isFocused() {
    if (document.hasFocus()) {
        return
    } else {
        if(!name || name === undefined || name === null) return
        const msgSound = new Audio("../newMsgSound.wav")
        msgSound.volume = "0.3"
        msgSound.play()
    }
}

socket.on("user-connected", data => {
    if(!data.name || data.name === undefined || data.name === null) return
    updateUsers(data.usersOnline)
    //appendMessage(`${data.name} Connected`)
})

function updateUsers(users){
    document.querySelectorAll('.usersOnlineList').forEach(function(a) {
        a.remove()
    })
    usersOnlineNum.innerText = users.length
    users.forEach(user => {
        let userElement = document.createElement("div")
        userElement.innerText = user
        userElement.classList.add("usersOnlineList")
        usersContainer.appendChild(userElement)
    });
}

socket.on("user-disconnected", data => {
    if(!data.name || data.name === undefined || data.name === null) return
    //appendMessage(`${data.name} Disconnected`)
})
window.addEventListener("load", () => {
    setInterval(function(){
        socket.emit("show-users")
    }, 100)
})

window.addEventListener("keydown", () => {
    messageInput.focus()
})

sendButton.addEventListener("click", e => {
    e.preventDefault()
    let message = removeTags(messageInput.value)
    const args = message.split(/ +/)
    if(!message || message === undefined || message === null || !args) return alert("You cant send blank message!")
    if(!name || name === undefined || name === null) return location.reload()
    // chat commands
    if(message.startsWith("/")){
        commands(message)
        messageInput.value = ""
        return
    }
    let finalMsg = ""
    args.forEach(arg => {
        if(arg.startsWith("https://") || arg.startsWith("http://")){
            finalMsg = `${finalMsg} <a href="${arg}">${arg}</a>`
        } else {
            finalMsg = `${finalMsg} ${arg}`
        }
    })
    let data = {
        message: finalMsg,
        token: token
    }
    appendMessage(`${name}: ${finalMsg}`)
    socket.emit("send-chat-message", data)
    messageInput.value = ""
    socket.emit("update-users-online", name)
})
function removeTags(str)
{
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}

function commands(message){
    const args = message.split(/ +/)
    if(message.startsWith("/kick")){
        if(!args[1]) return
        let data = {
            name: name,
            toKick: args[1]
        }
        socket.emit("kick-user", data)
    } else if(message.startsWith("/server")){
        if(!args[1]) return
        let message1 = message.split("8")
        let data = {
            name: name,
            message: message1
        }
        socket.emit("server-message", data)
    } else {
        alert("This command doesnt exist!")
    }
}
socket.on("kick-user-name", data => {
    if(!data.toKick === name) return
    location.reload()
})

imageButton.addEventListener("click", e => {
    e.preventDefault()

    const image = messageInput.value
    const args = image.split(/ +/)
    if(!image || image === undefined || image === null || !args) return alert("You cant send blank message!")
    if(!name || name === undefined || name === null) return location.reload()
    let data = {
        name: name,
        image: image
    }
    appendImage(data)
    socket.emit("send-chat-image", data)
    messageInput.value = ""
    socket.emit("update-users-online", name)
})

function appendMessage(message) {
    const messageElement = document.createElement("div")
    messageElement.innerHTML = message
    messageContainer.append(messageElement)
    messageContainer.scrollTop = messageContainer.scrollHeight
}
function appendImage(data) {
    const messageElement = document.createElement("div")
    messageElement.innerHTML = data.name + ": "
    messageContainer.append(messageElement)

    const messageElement2 = document.createElement("a")
    messageElement2.innerHTML = data.image
    messageElement2.href = data.image
    messageElement.append(messageElement2)

    const messageElement1 = document.createElement("img")
    messageElement1.src = data.image
    if(data.image.height > "100" || data.image.width > "200"){
        let imgHeight = messageElement1.height / 2
        let imgWidth = messageElement1.width / 2
        messageElement1.height = imgHeight
        messageElement1.width = imgWidth
    }
    messageElement.append(messageElement1)
    messageContainer.scrollTop = messageContainer.scrollHeight
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

socket.on("success", data => {
    document.title = "ShorChat"
    //appendMessage(nameToLogin + " joined")
    updateUsers(data.usersOnline)
    socket.emit("new-user", data.name)
    name = data.name
    token = data.token
    //currentUser.innerHTML = data.name + "<b> offline</b>"
    loginInterface.style.display = "none"
    chatInterface.style.display = "block"
    chatInterface1.style.display = "block"
    usersContainer.style.display = "block"
    socket.emit("update-users-online", data.name)
})

socket.on("confirm-email", data => {
    const tokenInput = document.getElementById("tokenInputRegister")
    const tokenButton = document.getElementById("tokenRegisterButton")
    usernameInputRegister.style.display = "none"
    passwordInputRegister.style.display = "none"
    emailInputRegister.style.display = "none"
    registerButton.style.display = "none"
    tokenInput.style.display = "block"
    tokenButton.style.display = "block"
    let enteredToken
    alert("Your confirmation token has been sent to: " + data.email)
    tokenButton.addEventListener("click", e => {
        e.preventDefault()
        enteredToken = tokenInput.value
        if(enteredToken === data.confToken){
            socket.emit("email-confirmed", data)
        } else {
            alert("Token is not valid.")
        }
    })
})

socket.on("failed", () => {
    alert("Login Failed")
})

socket.on("somethingWentWrong", () => {
    alert("Something Went Wrong.. Please Try Again Later!")
})

socket.on("userNameExists", () => {
    alert("User With This Name Already Exists!")
})

socket.on("emailExists", () => {
    alert("User With This Email Already Exists!")
})

socket.on("successfully-registered", () => {
    alert("Successfully registered! You can now login.")
    location.reload()
})

socket.on("alert", msg => {
    alert(msg)
})

userButton.addEventListener("click", e => {
    e.preventDefault()
})

socket.on("users", users => {
    updateUsers(users)
})