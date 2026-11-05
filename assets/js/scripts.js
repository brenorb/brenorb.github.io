// Site behaviour without jQuery. Loaded with `defer` from _includes/head.html.
(function() {
  "use strict";

  var root = document.documentElement;

  // ---------------------------------------------------------------------------
  // Slide-in navigation menu (vanilla port of jquery.dlmenu by Codrops, MIT).
  // ---------------------------------------------------------------------------
  function initMenu(nav) {
    var trigger = nav.querySelector(".dl-trigger");
    var menu = nav.querySelector("ul.dl-menu");
    if (!trigger || !menu) {
      return;
    }

    var classIn = "dl-animate-in";
    var classOut = "dl-animate-out";
    var isOpen = false;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    Array.prototype.forEach.call(menu.querySelectorAll("ul.dl-submenu"), function(submenu) {
      var back = document.createElement("li");
      back.className = "dl-back";
      back.innerHTML = '<a href="#">back</a>';
      submenu.insertBefore(back, submenu.firstChild);
    });

    function afterAnimation(el, fn) {
      if (reduceMotion || typeof window.AnimationEvent === "undefined") {
        fn();
        return;
      }
      var done = false;
      var finish = function() {
        if (done) {
          return;
        }
        done = true;
        el.removeEventListener("animationend", finish);
        fn();
      };
      el.addEventListener("animationend", finish);
      // Safety net in case the animation never runs (e.g. hidden tab).
      setTimeout(finish, 600);
    }

    function resetMenu() {
      menu.classList.remove("dl-subview");
      Array.prototype.forEach.call(menu.querySelectorAll("li"), function(li) {
        li.classList.remove("dl-subview", "dl-subviewopen");
      });
    }

    function openMenu() {
      menu.classList.add("dl-menuopen", "dl-menu-toggle");
      menu.addEventListener("transitionend", function onEnd() {
        menu.removeEventListener("transitionend", onEnd);
        menu.classList.remove("dl-menu-toggle");
      });
      trigger.classList.add("dl-active");
      trigger.setAttribute("aria-expanded", "true");
      isOpen = true;
    }

    function closeMenu() {
      menu.classList.remove("dl-menuopen");
      menu.classList.add("dl-menu-toggle");
      trigger.classList.remove("dl-active");
      trigger.setAttribute("aria-expanded", "false");
      isOpen = false;
      setTimeout(resetMenu, reduceMotion ? 0 : 300);
    }

    function closestAncestor(el, className) {
      var node = el.parentElement;
      while (node && node !== nav) {
        if (node.classList.contains(className)) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    function openSubmenu(item, submenu) {
      var flyin = submenu.cloneNode(true);
      flyin.style.opacity = "0";
      menu.parentNode.insertBefore(flyin, menu.nextSibling);
      setTimeout(function() {
        flyin.classList.add(classIn);
        menu.classList.add(classOut);
        afterAnimation(menu, function() {
          menu.classList.remove(classOut);
          menu.classList.add("dl-subview");
          item.classList.add("dl-subviewopen");
          var parentOpen = closestAncestor(item, "dl-subviewopen");
          if (parentOpen) {
            parentOpen.classList.remove("dl-subviewopen");
            parentOpen.classList.add("dl-subview");
          }
          flyin.remove();
        });
      });
    }

    function closeSubmenu(backItem) {
      var submenu = backItem.closest("ul.dl-submenu");
      var item = submenu.parentElement;
      var flyin = submenu.cloneNode(true);
      menu.parentNode.insertBefore(flyin, menu.nextSibling);
      setTimeout(function() {
        flyin.classList.add(classOut);
        menu.classList.add(classIn);
        afterAnimation(menu, function() {
          menu.classList.remove(classIn);
          flyin.remove();
        });
        item.classList.remove("dl-subviewopen");
        var subview = closestAncestor(backItem, "dl-subview");
        if (subview) {
          if (subview.tagName === "LI") {
            subview.classList.add("dl-subviewopen");
          }
          subview.classList.remove("dl-subview");
        }
      });
    }

    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.addEventListener("click", function(event) {
      var li = event.target.closest("li");
      if (!li || !menu.contains(li)) {
        return;
      }
      event.stopPropagation();

      if (li.classList.contains("dl-back")) {
        event.preventDefault();
        closeSubmenu(li);
        return;
      }

      var submenu = null;
      for (var i = 0; i < li.children.length; i += 1) {
        if (li.children[i].matches("ul.dl-submenu")) {
          submenu = li.children[i];
        }
      }
      if (submenu && !submenu.contains(event.target)) {
        event.preventDefault();
        openSubmenu(li, submenu);
      }
    });

    document.body.addEventListener("click", function() {
      if (isOpen) {
        closeMenu();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // YouTube embeds are rendered as lightweight placeholders (see
  // _plugins/lite_youtube.rb). The real player loads on click.
  // ---------------------------------------------------------------------------
  function youTubeEmbedUrl(base, seconds) {
    var url;
    try {
      url = new URL(base, window.location.href);
    } catch (error) {
      return null;
    }
    url.searchParams.set("autoplay", "1");
    if (typeof seconds === "number") {
      url.searchParams.delete("t");
      url.searchParams.set("start", String(seconds));
    }
    return url.toString();
  }

  function activateYouTube(facade, seconds) {
    var src = youTubeEmbedUrl(facade.getAttribute("data-embed-src"), seconds);
    if (!src) {
      return null;
    }
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = facade.getAttribute("data-title") || "YouTube video player";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allowfullscreen", "");
    facade.innerHTML = "";
    facade.appendChild(iframe);
    facade.classList.add("is-playing");
    facade.removeAttribute("data-lite-youtube");
    iframe.focus();
    return iframe;
  }

  function wireYouTubeFacades() {
    document.addEventListener("click", function(event) {
      var link = event.target.closest("[data-lite-youtube] a");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (typeof event.button === "number" && event.button !== 0) {
        return;
      }
      var facade = link.closest("[data-lite-youtube]");
      if (activateYouTube(facade)) {
        event.preventDefault();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Media chapters: clicking a timestamp seeks the media above it.
  // ---------------------------------------------------------------------------
  var MEDIA_SELECTOR = ".content iframe, .content video, .content [data-lite-youtube], .content .video-embed";

  function isYouTubeEmbed(src) {
    return /youtube\.com\/embed|youtube-nocookie\.com\/embed/i.test(src || "");
  }

  function findMediaForChapterSection(section) {
    var matchingMedia = null;
    Array.prototype.forEach.call(document.querySelectorAll(MEDIA_SELECTOR), function(node) {
      if (node.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) {
        if (!matchingMedia || !node.contains(matchingMedia)) {
          matchingMedia = node;
        }
      }
    });
    if (matchingMedia && matchingMedia.classList.contains("video-embed")) {
      matchingMedia = matchingMedia.querySelector("iframe") || matchingMedia;
    }
    return matchingMedia;
  }

  function seekEmbeddedVideo(video, seconds) {
    var seekTo = function() {
      try {
        video.currentTime = seconds;
      } catch (error) {}
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function() {});
      }
    };

    try {
      video.currentTime = seconds;
    } catch (error) {}

    if (video.readyState >= 1) {
      seekTo();
      return true;
    }

    video.preload = "metadata";
    video.addEventListener("loadedmetadata", seekTo, { once: true });
    video.load();
    return true;
  }

  function seekMedia(media, seconds) {
    if (media.hasAttribute("data-lite-youtube")) {
      return Boolean(activateYouTube(media, seconds));
    }
    if (media.tagName === "VIDEO") {
      return seekEmbeddedVideo(media, seconds);
    }
    if (media.tagName === "IFRAME" && isYouTubeEmbed(media.getAttribute("src"))) {
      var nextSrc = youTubeEmbedUrl(media.getAttribute("src"), seconds);
      if (!nextSrc) {
        return false;
      }
      media.setAttribute("src", nextSrc);
      return true;
    }
    return false;
  }

  function wireMediaChapterSeeking() {
    document.addEventListener("click", function(event) {
      var link = event.target.closest(".media-chapters__stamp");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (typeof event.button === "number" && event.button !== 0) {
        return;
      }

      var section = link.closest(".media-chapters");
      var seconds = Number(link.getAttribute("data-start-seconds"));
      if (!section || !Number.isFinite(seconds)) {
        return;
      }

      var media = findMediaForChapterSection(section);
      if (!media || !seekMedia(media, seconds)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      var anchor = media.closest(".video-embed") || media;
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }, true);
  }

  function firstMediaAnchor() {
    var firstMedia = document.querySelector(MEDIA_SELECTOR);
    return firstMedia ? (firstMedia.closest(".video-embed") || firstMedia) : null;
  }

  function ensureMediaPlayerAnchor() {
    var anchor = firstMediaAnchor();
    if (anchor && !anchor.id) {
      anchor.id = "media-player";
    }
  }

  function addTranscriptJumpLink() {
    var transcriptAnchor = document.querySelector("[data-transcript-anchor]");
    var mediaAnchor = firstMediaAnchor();
    if (!transcriptAnchor || !mediaAnchor || document.querySelector(".transcript-jump")) {
      return;
    }
    if (transcriptAnchor.getBoundingClientRect().top <= window.innerHeight * 1.1) {
      return;
    }
    var note = document.createElement("p");
    note.className = "transcript-jump";
    note.innerHTML = '<a href="#transcricao">Transcription (experimental) below.</a>';
    mediaAnchor.insertAdjacentElement("afterend", note);
  }

  // ---------------------------------------------------------------------------
  // Archive lists: reveal items as they scroll into view (replaces WOW.js).
  // ---------------------------------------------------------------------------
  function initReveal() {
    var items = document.querySelectorAll(".wow");
    if (!items.length || !("IntersectionObserver" in window)) {
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          return;
        }
        var el = entry.target;
        observer.unobserve(el);
        var duration = el.getAttribute("data-wow-duration");
        if (duration) {
          el.style.animationDuration = duration;
        }
        el.style.visibility = "visible";
        el.classList.add("animated");
      });
    });
    var viewportBottom = window.innerHeight;
    Array.prototype.forEach.call(items, function(el) {
      // Items already on screen show immediately; the rest animate in later.
      if (el.getBoundingClientRect().top > viewportBottom) {
        el.style.visibility = "hidden";
        observer.observe(el);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Disqus: only load the embed when the comment thread gets close to view.
  // ---------------------------------------------------------------------------
  function initDisqus() {
    var thread = document.getElementById("disqus_thread");
    var shortname = thread && thread.getAttribute("data-disqus-shortname");
    if (!shortname) {
      return;
    }
    var load = function() {
      var script = document.createElement("script");
      script.async = true;
      script.src = "https://" + shortname + ".disqus.com/embed.js";
      script.setAttribute("data-timestamp", String(Date.now()));
      document.head.appendChild(script);
    };
    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      if (entries.some(function(entry) { return entry.isIntersecting; })) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(thread);
  }

  // ---------------------------------------------------------------------------
  // Page transition: fade out when following a .zoombtn link.
  // ---------------------------------------------------------------------------
  function swapFade(from, to) {
    Array.prototype.forEach.call(document.querySelectorAll(".container, .wrapper"), function(el) {
      if (el.classList.contains(from)) {
        el.classList.remove(from);
        el.classList.add(to);
      }
    });
  }

  function initZoomButtons() {
    document.addEventListener("click", function(event) {
      if (event.target.closest(".zoombtn")) {
        swapFade("fadeIn", "fadeOut");
      }
    });
    // Restore the content when coming back through the back/forward cache.
    window.addEventListener("pageshow", function() {
      swapFade("fadeOut", "fadeIn");
    });
  }

  var nav = document.getElementById("dl-menu");
  if (nav) {
    initMenu(nav);
  }
  wireYouTubeFacades();
  wireMediaChapterSeeking();
  ensureMediaPlayerAnchor();
  initReveal();
  initDisqus();
  initZoomButtons();

  // Decorative third-party images (remote feature backgrounds and YouTube
  // thumbnails without a local copy) load only after the page itself has.
  function loadDeferredImages() {
    Array.prototype.forEach.call(document.querySelectorAll(".feature"), function(el) {
      el.classList.add("feature-loaded");
    });
    Array.prototype.forEach.call(document.querySelectorAll("img[data-deferred-src]"), function(img) {
      img.src = img.getAttribute("data-deferred-src");
      img.removeAttribute("data-deferred-src");
    });
  }

  function afterLoad() {
    addTranscriptJumpLink();
    setTimeout(loadDeferredImages, 0);
  }

  if (document.readyState === "complete") {
    afterLoad();
  } else {
    window.addEventListener("load", afterLoad);
  }

  root.classList.add("js-ready");
})();
