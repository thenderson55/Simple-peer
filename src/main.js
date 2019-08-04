console.log('he bob')
const Peer = require('simple-peer')
const socket = io()
const video = document.querySelector('video')
const client = {}

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    socket.emit('NewClient')
    video.srcObject = stream
    video.play()

    function initPeer(type){
      let peer = new Peer({ initiator:(type == 'init') ? true : false, stream: stream, trickle: false})
      peer.on('stream', function(stream){
        createVideo(stream)
      })
      peer.on('close', function(){
        document.getElementById("peerVideo").remove()
        peer.destroy()
      })
      return peer
    }

    function makePeer(){
      client.gotAnswer = false
      let peer = initPeer('init')
      peer.on('signal', function(){
        if(!client.gotAnswer){
          socket.emit('Offer', data)
        }
      })
      client.peer = peer
    }

    function frontAnswer(){
      let peer = initPeer('notInit')
      peer.on('signal', data => {
        socket.emit('Answer', data)
      })
      peer.signal(offer)
    }

    function signalAnswer(answer){
      client.gotAnswer = true
      let peer = client.peer
      peer.signal(answer)
    }

    function createVideo(stream){
      let video = document.createElement('video')
      video.id = 'peerVideo'
      video.srcObject = stream
      video.class = 'embed-responsive-item'
      document.querySelector('#peerDiv').appendChild(video)
      video.play()
    }

    function sessionActive(){
      document.write('Session active, please come back later')
    }

    socket.on('BackOffer', frontAnswer)
    socket.on('BackAnswer', signalAnswer)
    socket.on('SessionActive', sessionActive)
    socket.on('CreatePeer', makePeer)

  })
  .catch(err => document.write(err))




// var p = new Peer({ initiator: location.hash === '#1', trickle: false})

// p.on('error', err => console.log('error', err))

// p.on('signal', data => {
//   console.log('SIGNAL', JSON.stringify(data))
//   document.querySelector('#outgoing').textContent = JSON.stringify(data)
// })

// document.querySelector('form').addEventListener('submit', ev => {
//   ev.preventDefault()
//   p.signal(JSON.parse(document.querySelector('#incoming').value))
// })

// p.on('connect', () => {
//   console.log('CONNECT')
//   p.send('whatever' + Math.random())
// })

// p.on('data', data => {
//   console.log('data: ' + data)
// })