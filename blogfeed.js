const feedUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://jooarisblog.blogspot.com/feeds/posts/default";

async function loadBlogPosts() {
  const container = document.getElementById("blog-posts");
  container.innerHTML = "<p>Loading articles...</p>";

  try {
    const res = await fetch(feedUrl);
    const data = await res.json();

    if (!data.items || !data.items.length) {
      container.innerHTML = "<p>No articles found.</p>";
      return;
    }

    const postsHtml = data.items.slice(0, 6).map(entry => {
      const title = entry.title;
      const link = entry.link;
      const published = new Date(entry.pubDate).toLocaleDateString("vi-VN");
      const summary = entry.description.replace(/<[^>]*>/g, "").slice(0, 100) + "...";
      const image = entry.thumbnail || "https://via.placeholder.com/400x250?text=Jooaris+Blog";

      return `
        <div class="blog-card">
          <a href="${link}" target="_blank">
            <img src="${image}" alt="${title}">
          </a>
          <div class="blog-card-content">
            <h3>${title}</h3>
            <p class="blog-date">${published}</p>
            <p class="blog-snippet">${summary}</p>
            <a href="${link}" target="_blank" class="read-more">Đọc thêm</a>
          </div>
        </div>`;
    }).join("");

    container.innerHTML = `<div class="blog-grid">${postsHtml}</div>`;
  } catch (error) {
    console.error("Error loading posts:", error);
    container.innerHTML = "<p style='color:red;'>Failed to load articles.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);
