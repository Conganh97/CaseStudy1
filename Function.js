// tạo hàm vẽ map
function createImage(scr){
    const image = new Image ()
    image.src = scr
    return image
}

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
                document.getElementById('eatghost').play()
                ghosts.splice(i,1)
                score += 100
                scoreEl.innerHTML = score
            } else {
                document.getElementById('lose').play()
                cancelAnimationFrame(animationId)
                alert('You lose')
                location.reload()
            }
        }
    }
// check win
    if (pellets.length === 0 ){
        document.getElementById('win').play()
        alert('You win')
        cancelAnimationFrame(animationId)
    location.reload()}

// vẽ power up và ăn
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()
        let check = Math.hypot((player.x - powerUp.x), (player.y - powerUp.y));
        if ((check - player.radius - powerUp.radius) < 1) {
            document.getElementById('power').play()
            powerUps.splice(i, 1)
            score += 50
            scoreEl.innerHTML = score

            // làm ghost hoảng sợ
            ghosts.forEach((ghost) =>{
                ghost.scared = true
                setTimeout(() =>{
                    ghost.scared = false
                }, 3000)
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
            document.getElementById('eatfruit').play()
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

function musisPlay(){
    document.getElementById('start').play()
    removeEventListener('keydown', musisPlay)
}
