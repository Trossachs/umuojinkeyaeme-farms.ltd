const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

const header=$("#siteHeader");
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",window.scrollY>30),{passive:true});

const menu=$("#mobileMenu");
$("#menuBtn").addEventListener("click",()=>{menu.classList.add("open");menu.setAttribute("aria-hidden","false")});
$("#menuClose").addEventListener("click",()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true")});
$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");menu.setAttribute("aria-hidden","true")}));

// Hero slider: manual desktop/mobile controls + dots + swipe + autoplay.
const slides=$$(".hero-slide"), dots=$$("#heroDots button"), count=$("#heroCount");
let heroIndex=0, heroTimer;
function showHero(i, restart=true){
  heroIndex=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle("is-active",n===heroIndex));
  dots.forEach((d,n)=>d.classList.toggle("active",n===heroIndex));
  count.textContent=`${String(heroIndex+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
  if(restart) restartHero();
}
function restartHero(){clearInterval(heroTimer);heroTimer=setInterval(()=>showHero(heroIndex+1,false),6500)}
$("#heroPrev").addEventListener("click",()=>showHero(heroIndex-1));
$("#heroNext").addEventListener("click",()=>showHero(heroIndex+1));
dots.forEach((d,i)=>d.addEventListener("click",()=>showHero(i)));
restartHero();

let touchX=0;
$(".hero").addEventListener("touchstart",e=>touchX=e.touches[0].clientX,{passive:true});
$(".hero").addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)showHero(heroIndex+(dx<0?1:-1))},{passive:true});

// Smooth scroll reveals.
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");revealObserver.unobserve(e.target)}});
},{threshold:.08,rootMargin:"0px 0px -45px"});
$$(".reveal").forEach(el=>revealObserver.observe(el));

// Animated counters.
const counterObserver=new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,target=Number(el.dataset.count),start=performance.now(),duration=1400;
  const tick=now=>{const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3);el.textContent=Math.round(target*ease).toLocaleString();if(p<1)requestAnimationFrame(tick)};
  requestAnimationFrame(tick);counterObserver.unobserve(el);
 });
},{threshold:.6});
$$("[data-count]").forEach(el=>counterObserver.observe(el));

// Reviews: six local avatars, animated track, responsive controls + swipe.
const reviews=[
["Amaka N.","Retail customer","The eggs arrive fresh and well presented every time.","assets/avatar-01.svg"],
["Chinedu O.","Restaurant buyer","Reliable supply and straightforward communication.","assets/avatar-02.svg"],
["Ngozi E.","Family customer","A farm that clearly pays attention to consistency.","assets/avatar-03.svg"],
["Emeka P.","Business customer","Their service makes recurring orders simple.","assets/avatar-04.svg"],
["Ifeoma A.","Retail customer","Fresh product and a professional ordering experience.","assets/avatar-05.svg"],
["Kelechi U.","Restaurant buyer","Good packaging, good freshness, dependable delivery conversations.","assets/avatar-06.svg"]
];
const track=$("#reviewsTrack");
track.innerHTML=reviews.map(r=>`<article class="review"><div class="review-top"><img src="${r[3]}" alt="${r[0]}"><div><div class="review-name">${r[0]}</div><div class="review-role">${r[1]}</div></div></div><p>“${r[2]}”</p></article>`).join("");
let reviewIndex=0;
function reviewStep(){
  const cards=$$(".review"),visible=window.innerWidth>1000?3:window.innerWidth>700?2:1,max=Math.max(0,cards.length-visible);
  reviewIndex=Math.max(0,Math.min(reviewIndex,max));
  track.style.transform=`translate3d(-${reviewIndex*(100/visible)}%,0,0)`;
}
$("#reviewPrev").addEventListener("click",()=>{reviewIndex--;reviewStep()});
$("#reviewNext").addEventListener("click",()=>{reviewIndex++;reviewStep()});
let reviewTouchX=0;
$(".reviews-viewport").addEventListener("touchstart",e=>reviewTouchX=e.touches[0].clientX,{passive:true});
$(".reviews-viewport").addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-reviewTouchX;if(Math.abs(dx)>45){reviewIndex+=dx<0?1:-1;reviewStep()}},{passive:true});
window.addEventListener("resize",reviewStep);
reviewStep();

// Gallery lightbox with previous/next navigation, click/tap and keyboard.
const items=$$(".gallery-item"),lb=$("#lightbox"),lbImg=$("#lightboxImg"),lbCap=$("#lightboxCaption");
let lightIndex=0;
function openLight(i){lightIndex=(i+items.length)%items.length;const item=items[lightIndex];lbImg.src=item.dataset.lightbox;lbImg.alt=item.querySelector("img").alt;lbCap.textContent=item.dataset.caption;lb.classList.add("open");lb.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeLight(){lb.classList.remove("open");lb.setAttribute("aria-hidden","true");document.body.style.overflow=""}
items.forEach((it,i)=>it.addEventListener("click",()=>openLight(i)));
$("#lightboxClose").addEventListener("click",closeLight);
$("#lbPrev").addEventListener("click",()=>openLight(lightIndex-1));
$("#lbNext").addEventListener("click",()=>openLight(lightIndex+1));
lb.addEventListener("click",e=>{if(e.target===lb)closeLight()});
document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")closeLight();if(e.key==="ArrowLeft")openLight(lightIndex-1);if(e.key==="ArrowRight")openLight(lightIndex+1)});

// Product enquiry opens WhatsApp with the selected egg product.
$$(".product-link").forEach(btn=>btn.addEventListener("click",()=>{
 const msg=encodeURIComponent(`Hello Umuejimkeyaeme, I would like to enquire about ${btn.dataset.product}.`);
 window.open(`https://wa.me/2348000000000?text=${msg}`,"_blank","noopener");
}));
