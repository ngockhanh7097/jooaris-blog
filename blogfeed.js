// Blog Feed Loader for JOOARIS Blog
// ---------------------------------

const blogURL = "https://blog.jooaris.com/feeds/posts/default?alt=json";

// Dùng API trung gian để tránh lỗi CORS
const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(blogURL)}`;

fetch(proxyURL)
  .then(response => response.json())
  .then(data => {
    const feed = JSON.parse(data.contents);
    const posts = feed.feed.entry || [];
    displayPosts(posts);
  })
  .catch(err => {
    console.error("Lỗi tải bài viết:", err);
    document.getElementById("articles").innerHTML = "<p>Không thể tải bài viết.</p>";
  });

function displayPosts(posts) {
  const container = document.getElementById("articles");
  container.innerHTML = "";

  posts.forEach(post => {
    const title = post.title.$t;
    const link = post.link.find(l => l.rel === "alternate").href;
    const content = post.content?.$t || post.summary?.$t || "";
    const thumbnailMatch = content.match(/<img.*?src="(.*?)"/);
    const thumbnail = thumbnailMatch ? thumbnailMatch[1] : "assets/thumbnail-default.jpg";

    const postEl = document.createElement("article");
    postEl.classList.add("post");

    postEl.innerHTML = `
      <a href="${link}" target="_blank" class="thumb">
        <img src="${thumbnail}" alt="${title}" loading="lazy">
      </a>
      <div class="text">
        <h3><a href="${link}" target="_blank">${title}</a></h3>
      </div>
    `;
    container.appendChild(postEl);
  });
}
