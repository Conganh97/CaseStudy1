const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')
const scoreEl = document.getElementById('scoreEl')
canvas.width = innerWidth-100
canvas.height = innerHeight-100

// tạo lớp ranh giới
class Boundary {
    static width = 40
    static height = 40
width
height
    x
    y
    image
    constructor(x,y,image) {
        this.x = x
        this.y = y
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw(){
    // c.fillStyle = 'blue'
    //     c.fillRect(this.x,this.y,this.width,this.height)
        c.drawImage(this.image,this.x,this.y)
    }
}
// tạo lớp nhân vật
class Player {
    x
    y
    velx
    vely
    radius
    radians
    openRate
    rotation = 0
    constructor(x,y,velx,vely) {
        this.x = x
        this.y = y
        this.velx = velx
        this.vely = vely
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation
    }
    draw(){
        c.save()
        c.translate(this.x, this.y)
        c.rotate(this.rotation)
        c.translate(-this.x, -this.y)
        c.beginPath()
        c.arc(this.x,this.y,this.radius,this.radians,Math.PI * 2 - this.radians)
        c.lineTo(this.x,this.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.x += this.velx
        this.y += this.vely
        if (this.radians < 0 || this.radians > 0.75) this.openRate = - this.openRate
        this.radians += this.openRate
    }
}
//tạo lớp ghost
class Ghost {
    static speed = 2
    x
    y
    velx
    vely
    radius
    color
    preCollisions
    scared
    constructor(x,y,velx,vely,color = 'red') {
        this.x = x
        this.y = y
        this.velx = velx
        this.vely = vely
        this.radius = 15
        this.color = color
        this.preCollisions = []
        this.speed = 2
        this.scared = false
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.x += this.velx
        this.y += this.vely
    }
}
//tạo lớp viên ăn điểm
class Pellet {
    x
    y
    radius
    constructor(x,y) {
        this.x = x
        this.y = y
        this.radius = 4
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}
// tạo lớp power up
class PowerUp {
    x
    y
    radius
    constructor(x,y) {
        this.x = x
        this.y = y
        this.radius = 8
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}
const pellets = []
const powerUps = []
const boundaries = []
const ghosts =[new Ghost(Boundary.width*6 + Boundary.width/2,Boundary.height + Boundary.height/2,Ghost.speed,0),
               new Ghost(Boundary.width*6 + Boundary.width/2,Boundary.height*3 + Boundary.height/2,Ghost.speed,0,color='pink')]
const player = new Player(Boundary.width + Boundary.width/2,Boundary.height + Boundary.height/2,0,0 )
const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    }
}

let lastKey = ''
let score = 0

// tạo map từ mảng
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

// tạo hàm vẽ map
function createImage(scr){
    const image = new Image ()
    image.src = scr
    return image
}

// vẽ map
map.forEach ((row,i) =>{
    row.forEach((symbol,j) =>{
        switch (symbol) {
            case '-':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeHorizontal.png')))
                break
            case '|':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeVertical.png')))
                break
            case '1':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeCorner1.png')))
                break
            case '2':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeCorner2.png')))
                break
            case '3':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeCorner3.png')))
                break
            case '4':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeCorner4.png')))
                break
            case 'b':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/block.png')))
                break
            case '[':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/capLeft.png')))
                break
            case ']':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/capRight.png')))
                break
            case '_':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/capBottom.png')))
                break
            case '^':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/capTop.png')))
                break
            case '+':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeCross.png')))
                break
            case '5':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeConnectorTop.png')))
                break
            case '6':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeConnectorRight.png')))
                break
            case '7':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeConnectorBottom.png')))
                break
            case '8':
                boundaries.push(new Boundary(Boundary.width*j,Boundary.height*i,createImage('./img/pipeConnectorLeft.png')))
                break
            case '.':
                pellets.push(new Pellet (j * Boundary.width + Boundary.width / 2,i * Boundary.height + Boundary.height / 2))
                break
            case 'p':
                powerUps.push(new PowerUp(j * Boundary.width + Boundary.width / 2,i * Boundary.height + Boundary.height / 2))
                break
        }
    })
})
// hàm kiểm tra điều kiện nv và ranh giới
function circleCollidesWithRectangle(circle,rectangle){
    const padding = Boundary.width / 2 - circle.radius - 1
    return (circle.y - circle.radius + circle.vely) <= (rectangle.y + rectangle.height + padding) &&
        (circle.x + circle.radius + circle.velx) >= (rectangle.x - padding) &&
        (circle.y + circle.radius + circle.vely) >= (rectangle.y - padding) &&
        (circle.x - circle.radius + circle.velx) <= (rectangle.x + rectangle.width + padding)
}
// hàm trò chơi
let animationId
function animate () {
    animationId = requestAnimationFrame(animate)
    console.log(animationId)
    c.clearRect(0, 0, canvas.width, canvas.height)
    // player di chuyển
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({...player, velx: 0, vely: -5}, boundary)) {
                player.vely = 0
                break
            } else {
                player.vely = -5
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({...player, velx: -5, vely: 0}, boundary)) {
                player.velx = 0
                break
            } else {
                player.velx = -5
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({...player, velx: 0, vely: 5}, boundary)) {
                player.vely = 0
                break
            } else {
                player.vely = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({...player, velx: 5, vely: 0}, boundary)) {
                player.velx = 0
                break
            } else {
                player.velx = 5
            }
        }
    }
// ghost vs player
    for (let i = ghosts.length-1; 0 <= i ; i--) {
        const ghost = ghosts[i]
        let check = Math.hypot((player.x - ghost.x), (player.y - ghost.y));
        if ((check - player.radius - ghost.radius) < 1 ) {
            if (ghost.scared ) {
                ghosts.splice(i,1)
                score += 100
                scoreEl.innerHTML = score
            } else {
            cancelAnimationFrame(animationId)
            alert('You lose')
            }
        }
    }
// check win
    if (pellets.length === 0 ){
        alert('You win')
    cancelAnimationFrame(animationId)}
// vẽ power up và ăn
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()
        let check = Math.hypot((player.x - powerUp.x), (player.y - powerUp.y));
        if ((check - player.radius - powerUp.radius) < 1) {
            powerUps.splice(i, 1)
            score += 50
            scoreEl.innerHTML = score

            // làm ghost hoảng sợ
            ghosts.forEach((ghost) =>{
                ghost.scared = true
                setTimeout(() =>{
                    ghost.scared = false
                }, 5000)
            })
        }
    }

// vẽ điểm và ăn điểm
    for (let i = pellets.length - 1; 0 <=    i; i--) {
        const pellet = pellets[i]
        pellet.draw()
        let check = Math.hypot((player.x - pellet.x), (player.y - pellet.y));
        if ((check - player.radius - pellet.radius) < 1) {
            pellets.splice(i, 1)
            score += 10
            scoreEl.innerHTML = score
        }
    }

// player va chạm với ranh giới
    boundaries.forEach((boundary) => {boundary.draw()
    if (circleCollidesWithRectangle(player,boundary)){
        player.vely = 0
        player.velx = 0}
    })
    player.update()
// ghost di chuyển random
    ghosts.forEach(ghost =>{
         ghost.update()
        const collisions = []
        boundaries.forEach(boundary => {
            if (!collisions.includes('right') && circleCollidesWithRectangle({...ghost, velx: ghost.speed, vely: 0}, boundary)){
                collisions.push('right')
            }
            if (!collisions.includes('left') && circleCollidesWithRectangle({...ghost, velx: -ghost.speed, vely: 0}, boundary)){
                collisions.push('left')
            }
            if (!collisions.includes('up') && circleCollidesWithRectangle({...ghost, velx: 0, vely: -ghost.speed}, boundary)){
                collisions.push('up')
            }
            if (!collisions.includes('down') && circleCollidesWithRectangle({...ghost, velx: 0, vely: ghost.speed}, boundary)){
                collisions.push('down')
            }
        })
        if (collisions.length > ghost.preCollisions.length)
        ghost.preCollisions = collisions
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.preCollisions)){
            console.log(collisions)
            console.log(ghost.preCollisions)
            if (ghost.velx > 0) ghost.preCollisions.push('right')
            else if (ghost.velx < 0) ghost.preCollisions.push('left')
            else if (ghost.vely > 0) ghost.preCollisions.push('down')
            else if (ghost.vely < 0) ghost.preCollisions.push('up')
            const pathways = ghost.preCollisions.filter(collision => {
                return !collisions.includes(collision)
            })
            console.log({pathways})
            const direction = pathways [Math.floor(Math.random() * pathways.length)]
            console.log({direction})
            switch (direction){
                case 'down':
                    ghost.vely = ghost.speed
                    ghost.velx = 0
                    break
                case 'up':
                    ghost.vely = -ghost.speed
                    ghost.velx = 0
                    break
                case 'right':
                    ghost.vely = 0
                    ghost.velx = ghost.speed
                    break
                case 'left':
                    ghost.vely = 0
                    ghost.velx = -ghost.speed
                    break
            }
            ghost.preCollisions = []
        }
    })
    if (player.velx > 0) player.rotation = 0
    else if (player.velx < 0) player.rotation = Math.PI
    else if (player.vely > 0) player.rotation = Math.PI / 2
    else if (player.vely < 0) player.rotation = Math.PI * 1.5
}
animate()
//Hàm sử lý sự kiện key down
addEventListener('keydown',({key})=>{
    switch (key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})
// hàm xử lý sự kiện key up
addEventListener('keyup',({key})=>{
    switch (key){
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
player.draw()