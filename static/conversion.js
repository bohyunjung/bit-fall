function convert(original, nNozzles){
  original.loadPixels();
  
  nRow = Math.floor(H * (nNozzles/W));
  jump = W / nNozzles;
  data = [];

  for (let y = 0; y < nRow; y++) {
    row = [];
    for (let x = 0; x < nNozzles; x++) {
      row.push(original.pixels[Math.floor(x*jump)*4 + Math.floor(y*jump)*W*4]<1?0:1);
    }
    data.push(row);
  }
  return data;
}