// JOOARIS BLOG FEED DISPLAY
const feedUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://blog.jooaris.com/feeds/posts/default";


async function loadBlogPosts() {
  const container = document.getElementById("blog-articles");
  container.innerHTML = "<p>Loading articles...</p>";

  try {
    const res = await fetch(feedUrl);
    const data = await res.json();

    const entries = data.feed.entry || [];
    if (!entries.length) {
      container.innerHTML = "<p>No articles found.</p>";
      return;
    }

    const postsHtml = entries.slice(0, 6).map(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === "alternate").href;
      const published = new Date(entry.published.$t).toLocaleDateString("vi-VN");
      const summary = entry.summary
        ? entry.summary.$t.replace(/<[^>]*>/g, "").slice(0, 100) + "..."
        : "";
      const image = entry.media$thumbnail
        ? entry.media$thumbnail.url.replace("s72-c", "s400")
        : "https://via.placeholder.com/400x250?text=Jooaris+Blog";

      return `
        <div class="blog-card">
          <a href="${link}" target="_blank">
            <img src="${image}" alt="${title}">
          </a>
          <div class="blog-card-content">
            <h3>${title}</h3>
            <p class="blog-date">${published}</p>
            <p class="blog-snippet">${summary}</p>
            <a href="${link}" class="read-more" target="_blank">Read more →</a>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = postsHtml;

  } catch (error) {
    console.error("Error loading posts:", error);
    container.innerHTML = "<p style='color:red;'>Failed to load articles.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);

