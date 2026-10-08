import{test}from'node:test';import assert from'node:assert/strict';import{Cloth}from'../src/cloth.mjs';
test('rest stable finite and floor constrained',()=>{let c=new Cloth(16,10);for(let i=0;i<240;i++)c.step();assert.ok(c.p.every(Number.isFinite));for(let i=2;i<c.p.length;i+=3)assert.ok(c.p[i]>=2);});
test('lift and release settles',()=>{let c=new Cloth(16,10);c.hold(0,-180,-150,150);for(let i=0;i<180;i++)c.step();assert.equal(c.p[2],150);c.release();for(let i=0;i<480;i++)c.step();assert.ok(Math.max(...Array.from(c.p).filter((_,i)=>i%3===2))<8);});
test('translation reset',()=>{let c=new Cloth();c.translate(20,30);assert.equal(c.p[0],-330);c.reset();assert.equal(c.p[0],-350);assert.equal(c.grab,null);});

test('fast grab moves continuously instead of teleporting through layers',()=>{const c=new Cloth(16,10);const before=c.p.slice(0,3);c.hold(0,250,200,250);c.step();assert.ok(Math.hypot(...Array.from(c.p.slice(0,3),(v,i)=>v-before[i]))<=c.thickness*.65+.001);});
test('nonadjacent overlapping triangle separates a cloth particle',()=>{const c=new Cloth(10,8);const tri=c.triangles[0],v=c.n-1;for(let d=0;d<3;d++)c.p[v*3+d]=tri.reduce((sum,i)=>sum+c.p[i*3+d],0)/3;c.p[v*3+2]+=1;c.old.set(c.p);assert.ok(c.collide()>0);assert.ok(c.p[v*3+2]>3);assert.ok(c.p.every(Number.isFinite));});
