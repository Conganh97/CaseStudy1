const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')
const scoreEl = document.getElementById('scoreEl')
canvas.width = innerWidth-100
canvas.height = innerHeight-100


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
addEventListener('keydown',musisPlay)
function musisPlay(){
    document.getElementById('start').play()
    removeEventListener('keydown', musisPlay)
}

let lastKey = ''
let score = 0

// tạo map từ mảng
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
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


animate()

player.draw()
