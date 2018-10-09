function pixelize(pg, message, nColumn){
    let TEXTSIZE = 280
    let TEXTOFFSET_Y = 220
    let TEXTOFFSET_X = -20

    pg.clear();

    pg.textSize(TEXTSIZE);
    
    pg.smooth();
    pg.background(255);
    pg.fill(0);
    pg.textFont(font);
    pg.textAlign(CENTER);

    pg.text(message, W/2+TEXTOFFSET_X, TEXTOFFSET_Y);
    pg.loadPixels();

    out = []
    nRow = Math.floor(H * (nColumn/width));
    jump = Math.floor(W / nColumn);
    for (let i = 0; i < nRow; i++) {
        let row = [];
        for (let j = 0; j < nColumn; j++) {
            row.push(pg.pixels[(i*W+j)*jump*4 +1]<1?1:0);
        }
        out.push(row);
    }
    return out;
}
