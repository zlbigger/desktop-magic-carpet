import * as THREE from '../node_modules/three/build/three.module.js';
import{Cloth}from'./cloth.mjs';import{rugTexture}from'./rug-texture.mjs';
const api=window.rugDesktop;let W=innerWidth,H=innerHeight,cloth=new Cloth(44,30,Math.min(W*.65,760),Math.min(W*.65,760)*.66),renderer;
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch(e){let el=document.getElementById('error');el.style.display='block';el.textContent='此设备无法启动 WebGL。请从托盘菜单退出，并检查显卡驱动。';api?.hit(true);throw e;}
renderer.setSize(W,H);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.body.append(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-W/2,W/2,H/2,-H/2,.1,3000);camera.position.set(0,0,1500);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff4df,0x39444e,2.2));let light=new THREE.DirectionalLight(0xfff4df,3.2);light.position.set(-400,500,900);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-1500,right:1500,top:1500,bottom:-1500,near:1,far:3000});light.shadow.bias=-.00015;light.shadow.normalBias=.3;light.shadow.radius=4;scene.add(light);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(5000,5000),new THREE.ShadowMaterial({opacity:.28}));floor.receiveShadow=true;scene.add(floor);
let tex=new THREE.CanvasTexture(rugTexture());tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(cloth.p,3));const uv=[],indices=[];for(let y=0;y<=cloth.ny;y++)for(let x=0;x<=cloth.nx;x++)uv.push(x/cloth.nx,y/cloth.ny);for(let y=0;y<cloth.ny;y++)for(let x=0;x<cloth.nx;x++){let a=y*(cloth.nx+1)+x,b=a+1,c=a+cloth.nx+1,d=c+1;indices.push(a,b,c,b,d,c);}geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
const rug=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:tex,roughness:1,metalness:0,side:THREE.DoubleSide}));rug.castShadow=true;rug.receiveShadow=true;scene.add(rug);
let pointer=new THREE.Vector2(),ray=new THREE.Raycaster(),drag=false,moving=false,last={x:0,y:0},lift=95,paused=false,acc=0,prev=performance.now(),hitLast=false;
function xy(e){return{x:e.clientX-W/2,y:H/2-e.clientY};}
function hit(e){pointer.set(e.clientX/W*2-1,1-e.clientY/H*2);ray.setFromCamera(pointer,camera);return ray.intersectObject(rug)[0];}
function hover(e){let h=drag||!!hit(e);if(h!==hitLast){hitLast=h;api?.hit(h);}renderer.domElement.style.cursor=h?(drag?'grabbing':'grab'):'default';}
window.addEventListener('pointerdown',e=>{if(e.button!==0)return;let h=hit(e);if(!h)return;drag=true;moving=e.shiftKey;last=xy(e);if(!moving){let f=h.face,ids=[f.a,f.b,f.c];let idx=ids.sort((a,b)=>new THREE.Vector3().fromArray(cloth.p,a*3).distanceTo(h.point)-new THREE.Vector3().fromArray(cloth.p,b*3).distanceTo(h.point))[0];cloth.hold(idx,last.x,last.y,lift);}renderer.domElement.setPointerCapture(e.pointerId);api?.hit(true);});
window.addEventListener('pointermove',e=>{let q=xy(e);if(drag){if(moving)cloth.translate(q.x-last.x,q.y-last.y);else cloth.hold(cloth.grab.i,q.x,q.y,lift);last=q;}hover(e);});
function release(){drag=false;cloth.release();api?.dragging(false);}
window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);window.addEventListener('blur',release);
window.addEventListener('wheel',e=>{if(drag){lift=THREE.MathUtils.clamp(lift-e.deltaY*.2,15,350);if(cloth.grab)cloth.grab.z=lift;e.preventDefault();}},{passive:false});
window.addEventListener('dblclick',e=>{if(hit(e))cloth.reset();});window.addEventListener('contextmenu',e=>{e.preventDefault();api?.menu();});
api?.onCommand(cmd=>{if(cmd==='reset'){release();cloth.reset();}if(cmd==='pause')paused=!paused;if(cmd==='release')release();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){release();api?.hit(false);}if(e.key.toLowerCase()==='r')cloth.reset();});
window.addEventListener('resize',()=>{W=innerWidth;H=innerHeight;renderer.setSize(W,H);Object.assign(camera,{left:-W/2,right:W/2,top:H/2,bottom:-H/2});camera.updateProjectionMatrix();});
function tick(now){requestAnimationFrame(tick);acc+=Math.min((now-prev)/1000,.05);prev=now;while(acc>=1/60){if(!paused)cloth.step(1/60);acc-=1/60;}geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();renderer.render(scene,camera);}requestAnimationFrame(tick);
