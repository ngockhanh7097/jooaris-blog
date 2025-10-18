const container = document.getElementById("blog-container");
const feedURL = "https://blog.jooaris.com/feeds/posts/default?alt=json";

fetch(feedURL)
  .then(res => res.json())
  .then(data => {
    const posts = data.feed.entry || [];
    container.innerHTML = posts.map(post => {
      const title = post.title.$t;
      const link = post.link.find(l => l.rel === "alternate").href;
      const content = post.content ? post.content.$t : "";
      const imgMatch = content.match(/<img.*?src="(.*?)"/);
      const thumbnail = imgMatch ? imgMatch[1] : "https://via.placeholder.com/600x400?text=Jooaris+Blog";
      const short = content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "...";

      return `
        <a href="${link}" target="_blank" class="blog-card">
          <img src="${thumbnail}" alt="${title}">
          <div class="blog-card-content">
            <h3>${title}</h3>
            <p>${short}</p>
          </div>
        </a>
      `;
    }).join("");
  })
  .catch(err => {
    container.innerHTML = "<p>Lỗi tải dữ liệu. Vui lòng thử lại sau.</p>";
    console.error(err);
  });
