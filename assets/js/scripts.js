// dl-menu options
$(function() {
  $( '#dl-menu' ).dlmenu({
    animationClasses : { classin : 'dl-animate-in', classout : 'dl-animate-out' }
  });
});
// Need this to show animation when go back in browser
window.onunload = function() {};

// Add lightbox class to all image links
$("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

function normalizeResponsiveVideoEmbeds() {
  $(".content iframe").each(function() {
    var src = this.getAttribute("src") || "";
    var widthAttr = (this.getAttribute("width") || "").trim();
    if (widthAttr.indexOf("%") === -1) {
      return;
    }

    if (!/youtube\.com\/embed|youtube-nocookie\.com\/embed|player\.vimeo\.com\/video/i.test(src)) {
      return;
    }

    this.setAttribute("width", "560");
    this.setAttribute("height", "315");
    this.style.width = "100%";
    this.style.maxWidth = "100%";
  });
}

function isYouTubeEmbed(src) {
  return /youtube\.com\/embed|youtube-nocookie\.com\/embed/i.test(src || "");
}

function findMediaForChapterSection(section) {
  var mediaNodes = Array.prototype.slice.call(
    document.querySelectorAll(".content iframe, .content video")
  );
  var matchingMedia = null;

  mediaNodes.forEach(function(node) {
    var relation = node.compareDocumentPosition(section);
    if (relation & Node.DOCUMENT_POSITION_FOLLOWING) {
      matchingMedia = node;
    }
  });

  return matchingMedia;
}

function buildYouTubeChapterEmbedUrl(src, seconds) {
  var url;
  try {
    url = new URL(src, window.location.href);
  } catch (error) {
    return null;
  }

  url.searchParams.delete("t");
  url.searchParams.set("start", String(seconds));
  url.searchParams.set("autoplay", "1");
  return url.toString();
}

function seekEmbeddedYouTube(iframe, seconds) {
  var src = iframe.getAttribute("src") || "";
  var nextSrc = buildYouTubeChapterEmbedUrl(src, seconds);
  if (!nextSrc) {
    return false;
  }

  iframe.setAttribute("src", nextSrc);
  return true;
}

function seekEmbeddedVideo(video, seconds) {
  if (!video) {
    return false;
  }

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

function ensureMediaPlayerAnchor() {
  var firstMedia = document.querySelector(".content iframe, .content video");
  if (!firstMedia) {
    return;
  }

  var mediaAnchor = firstMedia.closest(".fluid-width-video-wrapper") || firstMedia;
  if (!mediaAnchor.id) {
    mediaAnchor.id = "media-player";
  }
}

function wireMediaChapterSeeking() {
  if (document.documentElement.dataset.mediaChapterSeekingBound === "1") {
    return;
  }

  document.documentElement.dataset.mediaChapterSeekingBound = "1";

  document.addEventListener("click", function(event) {
    var link = event.target.closest(".media-chapters__stamp");
    if (!link) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
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
    if (!media) {
      return;
    }

    var handled = false;
    if (media.tagName === "VIDEO") {
      handled = seekEmbeddedVideo(media, seconds);
    } else if (media.tagName === "IFRAME" && isYouTubeEmbed(media.getAttribute("src") || "")) {
      handled = seekEmbeddedYouTube(media, seconds);
    }

    if (!handled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
    media.scrollIntoView({ behavior: "smooth", block: "center" });
  }, true);
}

// FitVids options
$(function() {
  normalizeResponsiveVideoEmbeds();
  $(".content").fitVids();
});

ensureMediaPlayerAnchor();
wireMediaChapterSeeking();

// All others
$(document).ready(function() {
    // zoom in/zoom out animations
    if ($(".container").hasClass('fadeOut')) {
        $(".container").removeClass("fadeOut").addClass("fadeIn");
    }
    if ($(".wrapper").hasClass('fadeOut')) {
        $(".wrapper").removeClass("fadeOut").addClass("fadeIn");
    }
    $(".zoombtn").click(function() {
        $(".container").removeClass("fadeIn").addClass("fadeOut");
        $(".wrapper").removeClass("fadeIn").addClass("fadeOut");
    });
    // go up button
    $.goup({
        trigger: 500,
        bottomOffset: 10,
        locationOffset: 20,
        containerRadius: 0,
        containerColor: '#fff',
        arrowColor: '#000',
        goupSpeed: 'normal'
    });
	$('.image-popup').magnificPopup({
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 300, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open. 
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-fade'
  });
});

window.addEventListener("load", function() {
  ensureMediaPlayerAnchor();

  var transcriptAnchor = document.querySelector("[data-transcript-anchor]");
  var firstMedia = document.querySelector(".content iframe, .content video");
  if (!transcriptAnchor || !firstMedia || document.querySelector(".transcript-jump")) {
    return;
  }

  var transcriptTop = transcriptAnchor.getBoundingClientRect().top;
  if (transcriptTop <= window.innerHeight * 1.1) {
    return;
  }

  var mediaAnchor = firstMedia.closest(".fluid-width-video-wrapper") || firstMedia;
  var note = document.createElement("p");
  note.className = "transcript-jump";
  note.innerHTML = '<a href="#transcricao">Transcription (experimental) below.</a>';
  mediaAnchor.insertAdjacentElement("afterend", note);
});
