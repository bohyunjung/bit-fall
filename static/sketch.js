let ps;

function preload() {
    font = loadFont('static/assets/NNC-Bold.ttf');
}

function setup() {
    W = 1440
    H = 610
    createCanvas(W, H);
    ps = new ParticleSystem();
    pixelData = [];
    pending = false;
    blendMode(ADD);
    pg = createGraphics(W, H);
}

function draw() {
    clear();
    background(0);
    
    if (pixelData.length > 0){
        row = pixelData.pop()
        for (let i in row) if (row[i]) {
            dot = ps.dots[i]
            ps.addParticle(dot[0], dot[1]);
        }
    } else if (!pending) {
        httpGet('./fetch', function(response) {
            setTimeout(function(){
                pixelData = pixelize(pg, response, 130);
                pending = false;
            }, 600);
        });
        pending = true;
    }
    
    let down = createVector(0, 0.8);
    ps.applyForce(down);
    
    ps.update();
}
