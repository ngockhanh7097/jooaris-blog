// JOOARIS BLOG FEED
const feedUrl = "https://blog.jooaris.com/feeds/posts/default?alt=json";

async function loadBlogPosts() {
  const container = document.getElementById("blog-posts");
  container.innerHTML = "<p style='text-align:center'>Loading articles...</p>";

  try {
    const res = await fetch(feedUrl);
    const data = await res.json();
    const entries = data.feed.entry || [];

    if (!entries.length) {
      container.innerHTML = "<p style='text-align:center'>No articles found.</p>";
      return;
    }

    const html = entries.slice(0, 9).map(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === "alternate").href;
      const published = new Date(entry.published.$t).toLocaleDateString("vi-VN");
      const summary = entry.summary ? entry.summary.$t.replace(/<[^>]*>/g, "").slice(0, 100) + "..." : "";
      const image = entry.media$thumbnail
        ? entry.media$thumbnail.url.replace("s72-c", "s400")
        : "https://via.placeholder.com/400x250/000000/ffffff?text=JOOARIS+Journal";

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

    container.innerHTML = html;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;text-align:center'>Failed to load articles.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);
