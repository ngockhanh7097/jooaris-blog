// JOOARIS BLOG FEED DISPLAY
const feedUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://jooarisblog.blogspot.com/feeds/posts/default";


async function loadBlogPosts() {
  const container = document.getElementById("blog-posts");
  container.innerHTML = "<p>Loading articles...</p>";

  try {
    const res = await fetch(feedUrl);
    const data = await res.json();

    const entries = data.feed.entry || [];
    if (!entries.length) {
      container.innerHTML = "<p>No articles found.</p>";
      return;
    }

    // Hiển thị bài viết theo dạng lưới hiện đại
    const postsHtml = entries.slice(0, 6).map(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === "alternate").href;
      const published = new Date(entry.published.$t).toLocaleDateString("vi-VN");
      const summary = entry.summary ? entry.summary.$t.replace(/<[^>]*>/g, "").slice(0, 100) + "..." : "";
      const image = entry.media$thumbnail
        ? entry.media$thumbnail.url.replace("s72-c", "s400")
        : "https://via.placeholder.com/400x250?text=Jooaris+Blog";

      return `
        <div class="post-card">
          <a href="${link}" target="_blank" class="post-img">
            <img src="${image}" alt="${title}" />
          </a>
          <div class="post-content">
            <h3 class="post-title"><a href="${link}" target="_blank">${title}</a></h3>
            <p class="post-date">${published}</p>
            <p class="post-summary">${summary}</p>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `<div class="posts-grid">${postsHtml}</div>`;

  } catch (error) {
    console.error("Error loading posts:", error);
    container.innerHTML = "<p style='color:red;'>Failed to load articles.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);

