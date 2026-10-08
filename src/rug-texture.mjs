export function rugTexture(){const c=document.createElement('canvas');c.width=1536;c.height=1024;const g=c.getContext('2d');g.fillStyle='#6b242b';g.fillRect(0,0,1536,1024);const navy='#172c3a',cream='#d8bc8c',gold='#ab8058';
function diamond(x,y,r,color){g.fillStyle=color;g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.closePath();g.fill();}
function flower(x,y,r,color){g.save();g.translate(x,y);g.strokeStyle=color;g.lineWidth=2;for(let a=0;a<8;a++){g.rotate(Math.PI/4);g.beginPath();g.ellipse(0,r*.48,r*.19,r*.43,0,0,Math.PI*2);g.stroke();}diamond(0,0,r*.2,color);g.restore();}
for(let y=115;y<920;y+=52)for(let x=115;x<1420;x+=52){let xx=x+((Math.round(y/52)%2)*26);flower(xx,y,14,gold);diamond(xx+25,y+26,5,cream);}
for(const [m,t,col]of [[8,9,cream],[25,8,navy],[40,70,navy],[115,8,cream],[135,7,gold]]){g.strokeStyle=col;g.lineWidth=t;g.strokeRect(m,m,1536-m*2,1024-m*2);}
for(let x=65;x<1480;x+=52){flower(x,73,23,cream);flower(x,951,23,cream);}for(let y=120;y<920;y+=52){flower(73,y,23,cream);flower(1463,y,23,cream);}
for(let i=0;i<4;i++){g.save();g.translate(i%2?1370:166,i<2?166:858);diamond(0,0,128,cream);diamond(0,0,115,navy);diamond(0,0,94,'#772b32');flower(0,0,64,cream);g.restore();}
g.save();g.translate(768,512);for(const[r,col]of[[340,cream],[322,navy],[292,gold],[274,navy],[244,cream],[226,'#842f39'],[170,navy],[150,cream],[122,'#7e3037']])diamond(0,0,r,col);for(let i=0;i<16;i++){let a=i*Math.PI/8;flower(Math.cos(a)*182,Math.sin(a)*182,22,cream);}flower(0,0,105,cream);diamond(0,0,37,navy);flower(0,0,22,gold);g.restore();
// Fine woven weft; deterministic, no external assets or copied artwork.
for(let y=0;y<1024;y+=3){g.fillStyle=y%2?'#ffffff0b':'#00000016';g.fillRect(0,y,1536,1);}for(let x=0;x<1536;x+=4){g.fillStyle='#00000009';g.fillRect(x,0,1,1024);}return c;}
