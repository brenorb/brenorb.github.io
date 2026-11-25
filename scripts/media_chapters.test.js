const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

function playerContext(tagName, readyState = 1, spotify = false) {
  const handlers = {};
  const attributes = { src: spotify ? "https://open.spotify.com/embed/episode/example" : "https://www.youtube.com/embed/example" };
  const container = {
    id: "", clientWidth: 800,
    getAttribute: () => "example",
    querySelector: () => ({})
  };
  const player = {
    tagName, readyState, id: "", currentTime: 0, plays: 0, loads: 0, scrolls: 0,
    closest: (selector) => {
      // FitVids can insert a nearer wrapper; the Spotify container owns the controller and anchor.
      if (spotify && selector.includes(".fluid-width-video-wrapper")) return { id: "" };
      return spotify && selector.includes("data-spotify-episode") ? container : null;
    },
    compareDocumentPosition: () => 4,
    getAttribute: (name) => attributes[name],
    setAttribute: (name, value) => { attributes[name] = value; },
    addEventListener: (name, handler) => { handlers[name] = handler; },
    play() { this.plays += 1; return Promise.resolve(); },
    load() { this.loads += 1; },
    scrollIntoView() { this.scrolls += 1; }
  };
  const document = {
    documentElement: { dataset: {} },
    querySelector(selector) { return selector.includes(tagName.toLowerCase()) ? player : null; },
    querySelectorAll(selector) {
      if (selector === ".content [data-spotify-episode]") return spotify ? [container] : [];
      return selector.includes(tagName.toLowerCase()) ? [player] : [];
    },
    addEventListener(name, handler) { handlers[name] = handler; }
  };
  const context = vm.createContext({
    document, Node: { DOCUMENT_POSITION_FOLLOWING: 4 }, URL,
    window: { location: { href: "https://example.com/media/episode/" }, addEventListener() {} },
    $: () => ({ addClass() {}, ready() {} })
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../assets/js/scripts.js"), "utf8"), context);
  return { player, handlers, attributes, container, window: context.window };
}

function clickChapter(handlers, seconds) {
  let prevented = false;
  const section = {};
  const link = { closest: () => section, getAttribute: () => String(seconds) };
  handlers.click({
    button: 0,
    target: { closest: () => link },
    preventDefault() { prevented = true; },
    stopPropagation() {}, stopImmediatePropagation() {}
  });
  assert.ok(prevented, "chapter click should seek locally instead of navigating away");
}

for (const tagName of ["AUDIO", "VIDEO"]) {
  test(`${tagName} chapter links seek and play the existing player`, () => {
    const { player, handlers } = playerContext(tagName);
    assert.equal(player.id, "media-player");
    clickChapter(handlers, 120);
    assert.equal(player.currentTime, 120);
    assert.equal(player.plays, 1);
    assert.equal(player.scrolls, 1);
  });
}

test("audio chapters load metadata and seek when it becomes available", () => {
  const { player, handlers } = playerContext("AUDIO", 0);
  clickChapter(handlers, 300);
  assert.equal(player.preload, "metadata");
  assert.equal(player.loads, 1);
  assert.equal(player.plays, 0);
  player.readyState = 1;
  handlers.loadedmetadata();
  assert.equal(player.currentTime, 300);
  assert.equal(player.plays, 1);
});

test("YouTube chapters preserve the video and set the requested start time", () => {
  const { attributes, handlers } = playerContext("IFRAME");
  clickChapter(handlers, 90);
  const url = new URL(attributes.src);
  assert.equal(url.pathname, "/embed/example");
  assert.equal(url.searchParams.get("start"), "90");
  assert.equal(url.searchParams.get("autoplay"), "1");
});

for (const earlyClick of [false, true]) {
  test(`Spotify chapters use the official controller${earlyClick ? " after a click before API readiness" : ""}`, () => {
    const { container, handlers, window } = playerContext("IFRAME", 1, true);
    const controller = {
      seeks: [], plays: 0,
      addListener(name, handler) { this[name] = handler; },
      seek(seconds) { this.seeks.push(seconds); },
      play() { this.plays += 1; }
    };
    assert.equal(container.id, "media-player");
    if (earlyClick) clickChapter(handlers, 300);
    window.onSpotifyIframeApiReady({
      createController(element, options, callback) {
        assert.equal(options.uri, "spotify:episode:example");
        callback(controller);
      }
    });
    controller.ready();
    if (!earlyClick) clickChapter(handlers, 300);
    assert.deepEqual(controller.seeks, [300]);
    assert.equal(controller.plays, 1);
    assert.equal(container.spotifyPendingSeek, undefined);
  });
}
