// blogfeed.js — lấy bài từ Blogger JSON feed
(function(){
const feedUrl = 'https://blog.jooaris.com/feeds/posts/default?alt=json&max-results=20';
const container = document.getElementById('blog-grid');
const errEl = document.getElementById('blog-error');
const maxShow = 9;


function extractThumbnail(content){
if(!content) return null;
const m = content.match(/<img[^>]+src=\"([^\">]+)\"/i);
return m ? m[1] : null;
}


fetch(feedUrl).then(r=>r.json()).then(data=>{
const entries = (data.feed && data.feed.entry) || [];
if(!entries.length) throw new Error('No posts');
container.innerHTML = '';
entries.slice(0, maxShow).forEach(e=>{
const title = e.title.$t;
const linkObj = e.link.find(l=>l.rel==='alternate') || e.link[0];
const url = linkObj.href;
const published = e.published ? new Date(e.published.$t).toLocaleDateString('vi-VN') : '';
const content = (e.content && e.content.$t) || (e.summary && e.summary.$t) || '';
const snippet = content.replace(/<[^>]+>/g,'').trim().slice(0,140) + '...';
const thumb = (e.media$thumbnail && e.media$thumbnail.url) || extractThumbnail(content) || 'assets/thumbnail-default.jpg';


const card = document.createElement('article');
card.className = 'card fade-in';
card.innerHTML = `
<a class="card-link" href="${url}" target="_blank" rel="noopener">
<img class="thumb" src="${thumb}" alt="${title}">
<div class="meta">
<h3>${title}</h3>
<p>${snippet}</p>
<span class="date">${published}</span>
<div><span class="read-more">Đọc thêm →</span></div>
</div>
</a>
`;
container.appendChild(card);
});
}).catch(err=>{
console.error('Fetch blog feed error', err);
if(errEl) errEl.style.display = 'block';
});
})();