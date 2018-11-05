let ps;

function preload() {
    font = loadFont('static/assets/NNC-Bold.ttf');
}

function setup() {  
    W = 1440;
    H = 610;    
    H_OFFSET = 60;
    N_NOZZLES = 130;

    pixelDensity(1);
    createCanvas(W, H);
    original = createGraphics(W, H);

    blendMode(ADD);
  
    rowList = [];
    pending=false;
  
    ps = new ParticleSystem();

}

function draw() {
    clear();
    background(0);
    
    if (rowList.length > 0){
        row = rowList.pop()
        for (let i in row) if (row[i]) {
            dot = ps.dots[i]
            ps.addParticle(dot[0], dot[1]);
        }
    } else if (!pending) {
        httpGet('./fetch', function(text) {
            setTimeout(function(){
                rowList = getData(text);
                pending = false;
            }, 600);
        });
        pending = true;
    }
    
    let down = createVector(0, 0.8);
    ps.applyForce(down);
    
    ps.update();
}

function getData(text){
  original.background(0);
  original.smooth();
  
  original.textFont(font);
  original.textSize(250);
  original.textAlign(CENTER);
  original.fill(255);
  original.text(text,W/2,H/2+H_OFFSET);
  
  converted = convert(original, N_NOZZLES);
  return converted;
}
