const blogContainer = document.getElementById("blog-articles");

fetch("https://blog.jooaris.com/feeds/posts/default?alt=json")
  .then(res => res.json())
  .then(data => {
    const entries = data.feed.entry;
    if (!entries) {
      blogContainer.innerHTML = `<p style="color:white;text-align:center;">No articles found yet.</p>`;
      return;
    }

    let html = "";
    entries.forEach(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === "alternate").href;
      const content = entry.content ? entry.content.$t : "";
      const date = new Date(entry.published.$t).toLocaleDateString();
      const media = entry["media$thumbnail"]
        ? entry["media$thumbnail"].url.replace("s72-c", "s600")
        : "https://via.placeholder.com/600x400?text=JOOARIS";

      const cleanText = content.replace(/<[^>]+>/g, "");
      const snippet = cleanText.length > 120 ? cleanText.substring(0, 120) + "..." : cleanText;

      html += `
        <div class="blog-card">
          <img src="${media}" alt="${title}">
          <div class="blog-card-content">
            <h3>${title}</h3>
            <p class="blog-date">${date}</p>
            <p class="blog-snippet">${snippet}</p>
            <a href="${link}" target="_blank" class="read-more">Read More →</a>
          </div>
        </div>
      `;
    });

    blogContainer.innerHTML = `<div class="blog-grid">${html}</div>`;
  })
  .catch(err => {
    console.error("Error fetching blog feed:", err);
    blogContainer.innerHTML = `<p style="color:white;text-align:center;">Failed to load articles.</p>`;
  });
