const qs = (s) => document.querySelector(s);
const qsa = (s) => [...document.querySelectorAll(s)];

// Scroll reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
qsa('.reveal').forEach(el => observer.observe(el));

// Stat counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: .6 });
qsa('.counter[data-target]').forEach(el => counterObserver.observe(el));

// Terminal easter egg
const terminalModal = qs('#terminalModal');
const terminalBody = qs('#terminalBody');
const terminalLines = [
  ['Scanning teaching performance...', ''],
  ['Checking for drongos...', '[████████████] 100%'],
  ['Analysing humour...', '[████████████] 100%'],
  ['Counting times Ms. Saki made her students laugh...', 'ERROR: integer overflow'],
  ['Calculating class appreciation...', '∞'],
  ['', ''],
  ['RESULT:', 'WORLD_CLASS_TEACHER ✓']
];

function typeTerminal() {
  terminalBody.innerHTML = '<p><span>student@school</span>:~$ <b>./MsSakiIsTheBestSoftwareTeacherEver.exe --analyse</b></p>';
  let i = 0;
  const next = () => {
    if (i >= terminalLines.length) return;
    const [left, right] = terminalLines[i++];
    const p = document.createElement('p');
    if (left === 'RESULT:') p.className = 'term-success';
    p.textContent = `${left}${right ? '  ' + right : ''}`;
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    setTimeout(next, i > 4 ? 240 : 420);
  };
  setTimeout(next, 350);
}

qs('#openTerminal').addEventListener('click', () => {
  terminalModal.classList.add('show');
  terminalModal.setAttribute('aria-hidden','false');
  typeTerminal();
});
qs('#closeTerminal').addEventListener('click', () => terminalModal.classList.remove('show'));
terminalModal.addEventListener('click', (e) => { if (e.target === terminalModal) terminalModal.classList.remove('show'); });

// Fake build sequence
const overlay = qs('#buildOverlay');
const bar = qs('#progressBar');
const label = qs('#progressLabel');
const buildText = qs('#buildText');
const buildTitle = qs('#buildTitle');
const messages = [
  [12, 'Loading years of fun...'],
  [28, 'Resolving dependency: humour...'],
  [47, 'Removing 73 unnecessary console.log() calls...'],
  [66, 'Compiling every lesson that finally made sense...'],
  [84, 'Linking memories, projects and terrible variable names...'],
  [100, 'Build succeeded. No errors. Somehow.']
];

function runBuild() {
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
  buildTitle.textContent = 'Compiling gratitude...';
  let value = 0, mi = 0;
  bar.style.width = '0%'; label.textContent = '0%';
  const timer = setInterval(() => {
    value += Math.ceil(Math.random()*4);
    if (value > 100) value = 100;
    bar.style.width = value + '%'; label.textContent = value + '%';
    if (mi < messages.length && value >= messages[mi][0]) buildText.textContent = messages[mi++][1];
    if (value >= 100) {
      clearInterval(timer);
      buildTitle.textContent = '✓ Appreciation compiled';
      setTimeout(() => {
        overlay.classList.remove('show');
        qs('#message').scrollIntoView({behavior:'smooth'});
        celebrate();
      }, 900);
    }
  }, 75);
}
qs('#runBuild').addEventListener('click', runBuild);
overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('show'); });

// Confetti, deliberately lightweight / dependency-free
const canvas = qs('#confetti');
const ctx = canvas.getContext('2d');
let pieces = [], frame;
function resize(){canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener('resize',resize); resize();
function celebrate(){
  cancelAnimationFrame(frame);
  const colors=['#61e7ff','#8dffbb','#a98bff','#ffbd70','#eef3ff'];
  pieces = Array.from({length:100},()=>({x:innerWidth/2+(Math.random()-.5)*100,y:innerHeight*.62,vx:(Math.random()-.5)*13,vy:-6-Math.random()*10,g:.18+Math.random()*.08,r:3+Math.random()*5,a:Math.random()*Math.PI,c:colors[Math.floor(Math.random()*colors.length)],life:130+Math.random()*60}));
  function draw(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.a+=.08;p.life--;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);ctx.restore()});
    pieces=pieces.filter(p=>p.life>0&&p.y<innerHeight+30);
    if(pieces.length) frame=requestAnimationFrame(draw); else ctx.clearRect(0,0,innerWidth,innerHeight);
  }
  draw();
}

const toast = qs('#toast');
qs('#deployThanks').addEventListener('click', () => {
  celebrate();
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2200);
  qs('#deployThanks').textContent = '✓ Thank-you deployed';
});

document.addEventListener('keydown',(e)=>{if(e.key==='Escape'){terminalModal.classList.remove('show');overlay.classList.remove('show')}});
