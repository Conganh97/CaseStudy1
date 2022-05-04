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
        this.rotation = 0
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