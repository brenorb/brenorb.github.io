// Draft redesign — small, dependency-free enhancements.
(function () {
  "use strict";

  // Theme toggle: remembers the choice; otherwise follows the OS setting.
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    });
  }

  // Lightbox for links that point straight at an image.
  var imageLinks = document.querySelectorAll('.content a[href$=".png"], .content a[href$=".jpg"], .content a[href$=".jpeg"], .content a[href$=".gif"], .content a[href$=".webp"]');
  if (imageLinks.length && window.HTMLDialogElement) {
    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    var big = document.createElement("img");
    big.alt = "";
    dialog.appendChild(big);
    document.body.appendChild(dialog);
    dialog.addEventListener("click", function () { dialog.close(); });
    imageLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        var inner = link.querySelector("img");
        big.src = link.href;
        big.alt = (inner && inner.alt) || "";
        dialog.showModal();
      });
    });
  }

  // Media chapters: clicking a timestamp seeks the embedded player.
  var firstMedia = document.querySelector(".content iframe, .content video");
  if (firstMedia && !firstMedia.id) firstMedia.id = "media-player";

  function mediaBefore(section) {
    var match = null;
    document.querySelectorAll(".content iframe, .content video").forEach(function (node) {
      if (node.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) match = node;
    });
    return match;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest(".media-chapters__stamp");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    var section = link.closest(".media-chapters");
    var seconds = Number(link.getAttribute("data-start-seconds"));
    var media = section && mediaBefore(section);
    if (!media || !Number.isFinite(seconds)) return;

    if (media.tagName === "VIDEO") {
      media.currentTime = seconds;
      var playing = media.play();
      if (playing && playing.catch) playing.catch(function () {});
    } else if (/youtube(-nocookie)?\.com\/embed/i.test(media.src)) {
      var url = new URL(media.src, location.href);
      url.searchParams.delete("t");
      url.searchParams.set("start", String(seconds));
      url.searchParams.set("autoplay", "1");
      media.src = url.toString();
    } else {
      return;
    }
    event.preventDefault();
    media.scrollIntoView({ behavior: "smooth", block: "center" });
  }, true);

  // Point readers to the transcript when it is far below the player.
  var transcript = document.querySelector("[data-transcript-anchor]");
  if (transcript && firstMedia && transcript.getBoundingClientRect().top > window.innerHeight * 1.1) {
    var note = document.createElement("p");
    note.className = "transcript-jump";
    note.innerHTML = '<a href="#transcricao">↓ Transcript (experimental) below</a>';
    firstMedia.insertAdjacentElement("afterend", note);
  }
})();
