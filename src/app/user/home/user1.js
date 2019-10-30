// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = window.sessionStorage.authToken
const userId= window.sessionStorage.userId

let chatSocket = () => {

console.log("Chat Socket")
socket.on('verifyUser',(data)=>{
    socket.emit('issue-raised',this.userId)
})
  socket.on(this.userId, (data) => {

    console.log("you received a message"+data)

  });
//   $("#send").on('click', function () {

//     let messageText = $("#messageToSend").val()
//     chatMessage.message = messageText;
//     socket.emit("chat-msg",chatMessage)

//   })
//   socket.on('online-user-list',(data)=>{
//     console.log("Online user list updated.Some users went online or offline")
//     console.log(data)
//   })
//   $("#messageToSend").on('keypress',function(){
//     socket.emit("typing",chatMessage.senderName)
//   })
//   socket.on("typing",(data)=>{
//     console.log(data+" is Typing")
//   })




}// end chat socket function

chatSocket();
