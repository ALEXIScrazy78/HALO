// 3D transform, perspective projection and responsive canvas sizing.
function transform(p){let x=p[0],y=p[1]-.96,z=p[2];let c=Math.cos(orbit),s=Math.sin(orbit),nx=c*x-s*z,nz=s*x+c*z;let ct=Math.cos(tilt),st=Math.sin(tilt),ny=ct*y-st*nz,nzz=st*y+ct*nz;return[nx,ny,nzz]}
function project(q){let depth=6-q[2],scale=Math.min(cw*.27,ch*.27)*3.25/depth;return [cw*.5+q[0]*scale,ch*.53-q[1]*scale,scale]}
function resize(){const b=shell.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);cw=Math.max(1,b.width);ch=Math.max(1,b.height);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}window.addEventListener('resize',resize);resize();let markers=[];
