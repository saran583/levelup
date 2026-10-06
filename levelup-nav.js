/* Levelup shared navigation.
   Fills <nav data-levelup-nav> in every page with the same links and dropdowns, marks the current page,
   and injects its own styles (scoped to .lu-*) so each page keeps its single-file setup. */
(function(){
  'use strict';
  const NAV=[
    {href:'index.html',label:'Home'},
    {label:'Practice',items:[
      {href:'js-lab.html',label:'JS Lab',desc:'JavaScript & React coding questions'},
      {href:'react-lab.html',label:'React Lab',desc:'Hooks, renders, effects'},
      {href:'css-lab.html',label:'CSS Lab',desc:'HTML & CSS challenges'},
    ]},
    {label:'Interview Prep',items:[
      {href:'algorithms.html',label:'Algorithms',desc:'Step-through visualizer'},
      {href:'js-concepts.html',label:'JS Concepts',desc:'Closures, event loop, prototypes'},
      {href:'react-concepts.html',label:'React Concepts',desc:'Rendering, state, effects, hooks'},
      {href:'sql-regex.html',label:'SQL & Regex',desc:'In-browser SQLite & regex tester'},
      {href:'bigo.html',label:'Big-O',desc:'Complexity explorer & cheat sheets'},
    ]},
    {href:'interview.html',label:'Interview'},
    {href:'editor.html',label:'Editor'},
    {href:'flashcards.html',label:'Flashcards'},
    {href:'resume-builder.html',label:'Resume'},
  ];

  const CSS=`
.topbar .nav[data-levelup-nav],.topbar .topnav[data-levelup-nav]{display:flex;align-items:center;gap:2px;min-width:0;margin-left:8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
.topbar [data-levelup-nav]::-webkit-scrollbar{display:none}
.topbar [data-levelup-nav] .lu-link,.topbar [data-levelup-nav] .lu-dd-btn{display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:var(--muted);font:inherit;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap;cursor:pointer}
.topbar [data-levelup-nav] .lu-link:hover,.topbar [data-levelup-nav] .lu-dd-btn:hover,.topbar [data-levelup-nav] .lu-dd.open .lu-dd-btn{background:var(--panel-2);color:var(--text)}
.topbar [data-levelup-nav] .lu-link[aria-current="page"],.topbar [data-levelup-nav] .lu-dd-btn[aria-current="true"]{background:var(--accent-soft);color:var(--accent)}
.topbar [data-levelup-nav] .lu-dd-btn svg{transition:transform .15s}
.topbar [data-levelup-nav] .lu-dd.open .lu-dd-btn svg{transform:rotate(180deg)}
.lu-menu{position:fixed;z-index:1000;min-width:252px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow,0 6px 16px rgba(16,24,40,.12)),0 0 0 1px rgba(16,24,40,.03);display:none}
.lu-menu.open{display:grid;gap:2px}
/* Pages style "nav a" themselves (fixed 32px height, inline-flex); these override so two-line items lay out cleanly */
.topbar [data-levelup-nav] .lu-menu a,.topbar .lu-menu a{display:flex;align-items:center;gap:12px;height:auto;min-height:0;padding:9px 12px;border-radius:9px;color:var(--text);text-decoration:none;font-size:13px;font-weight:600;line-height:1.3;white-space:normal}
.topbar .lu-menu a .lu-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--border);transition:background .15s,transform .15s}
.topbar .lu-menu a .lu-txt{display:grid;gap:2px;min-width:0}
.topbar .lu-menu a small{display:block;color:var(--muted);font-weight:500;font-size:11.5px;line-height:1.3}
.topbar .lu-menu a:hover,.topbar .lu-menu a:focus-visible{background:var(--panel-2);outline:none}
.topbar .lu-menu a:hover .lu-dot{background:var(--accent);transform:scale(1.2)}
.topbar .lu-menu a[aria-current="page"]{background:var(--accent-soft);color:var(--accent)}
.topbar .lu-menu a[aria-current="page"] .lu-dot{background:var(--accent)}
.topbar .lu-menu a[aria-current="page"] small{color:var(--accent);opacity:.85}
`;

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const here=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const chev='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  function build(nav){
    let html='';
    NAV.forEach((n,i)=>{
      if(n.items){
        const active=n.items.some(it=>it.href===here);
        html+=`<div class="lu-dd"><button type="button" class="lu-dd-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="lu-menu-${i}" ${active?'aria-current="true"':''}>${esc(n.label)}${chev}</button>
          <div class="lu-menu" id="lu-menu-${i}" role="menu" aria-label="${esc(n.label)}">${n.items.map(it=>`<a role="menuitem" href="${it.href}" ${it.href===here?'aria-current="page"':''}><span class="lu-dot" aria-hidden="true"></span><span class="lu-txt">${esc(it.label)}${it.desc?`<small>${esc(it.desc)}</small>`:''}</span></a>`).join('')}</div></div>`;
      }else{
        html+=`<a class="lu-link" href="${n.href}" ${n.href===here?'aria-current="page"':''}>${esc(n.label)}</a>`;
      }
    });
    nav.innerHTML=html;
  }

  function place(dd){
    const btn=dd.querySelector('.lu-dd-btn'), menu=dd.querySelector('.lu-menu'), r=btn.getBoundingClientRect();
    menu.style.top=(r.bottom+6)+'px';
    menu.style.left=Math.max(8,Math.min(r.left,window.innerWidth-menu.offsetWidth-8))+'px';
  }
  function open(dd){ closeAll(dd); dd.classList.add('open'); dd.querySelector('.lu-menu').classList.add('open'); dd.querySelector('.lu-dd-btn').setAttribute('aria-expanded','true'); place(dd); }
  function close(dd){ dd.classList.remove('open'); dd.querySelector('.lu-menu').classList.remove('open'); dd.querySelector('.lu-dd-btn').setAttribute('aria-expanded','false'); }
  function closeAll(except){ document.querySelectorAll('.lu-dd.open').forEach(d=>{ if(d!==except) close(d); }); }

  function wire(nav){
    let hoverT;
    nav.querySelectorAll('.lu-dd').forEach(dd=>{
      const btn=dd.querySelector('.lu-dd-btn'), menu=dd.querySelector('.lu-menu');
      // A hover-opened menu stays open on click; only a click-opened menu toggles closed.
      btn.addEventListener('click',e=>{ e.stopPropagation(); if(dd.classList.contains('open')&&dd.dataset.via==='click'){ close(dd); } else { open(dd); dd.dataset.via='click'; } });
      dd.addEventListener('mouseenter',()=>{ clearTimeout(hoverT); if(matchMedia('(hover:hover)').matches&&!dd.classList.contains('open')){ open(dd); dd.dataset.via='hover'; } });
      dd.addEventListener('mouseleave',()=>{ hoverT=setTimeout(()=>close(dd),160); });
      menu.addEventListener('mouseenter',()=>clearTimeout(hoverT));
      menu.addEventListener('mouseleave',()=>{ hoverT=setTimeout(()=>close(dd),160); });
      btn.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'||e.key==='Enter'||e.key===' '){ e.preventDefault(); open(dd); menu.querySelector('a').focus(); } });
      menu.addEventListener('keydown',e=>{
        const links=[...menu.querySelectorAll('a')], i=links.indexOf(document.activeElement);
        if(e.key==='ArrowDown'){ e.preventDefault(); links[(i+1)%links.length].focus(); }
        else if(e.key==='ArrowUp'){ e.preventDefault(); links[(i-1+links.length)%links.length].focus(); }
        else if(e.key==='Escape'||e.key==='Tab'){ close(dd); if(e.key==='Escape'){ e.preventDefault(); btn.focus(); } }
      });
    });
    document.addEventListener('click',()=>closeAll());
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAll(); });
    window.addEventListener('resize',()=>closeAll());
    window.addEventListener('scroll',()=>closeAll(),true);
  }

  function init(){
    const nav=document.querySelector('[data-levelup-nav]'); if(!nav) return;
    const style=document.createElement('style'); style.textContent=CSS; document.head.appendChild(style);
    build(nav); wire(nav);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
