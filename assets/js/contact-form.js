// Send the contact form without leaving the page, so a failed send keeps the
// visitor's message and explains what to do next. Without JavaScript the form
// still posts normally.
(function() {
  var form = document.querySelector("[data-contact-form]");
  if (!form || !window.fetch || !window.FormData) {
    return;
  }

  var status = form.querySelector("[data-contact-status]");
  var button = form.querySelector("[type=submit]");
  var buttonLabel = button ? button.textContent : "";
  var nextUrl = (form.querySelector("input[name=_next]") || {}).value || "/contact-success/";

  var messages = {
    invalid: "Your message wasn't sent. Check that your email address is correct, then try again.",
    busy: "Your message wasn't sent because too many messages came from this connection recently. Wait a few minutes, then try again.",
    server: "Your message wasn't sent because of a problem on the site's side. Try again in a few minutes.",
    offline: "Your message wasn't sent. Check your internet connection and try again."
  };

  function showError(kind) {
    var fallback = status.getAttribute("data-fallback") || "";
    status.innerHTML = "";
    status.appendChild(document.createTextNode(messages[kind] + " "));
    if (fallback) {
      var extra = document.createElement("span");
      extra.innerHTML = fallback;
      status.appendChild(extra);
    }
    status.hidden = false;
    status.focus();
  }

  function setSending(sending) {
    if (!button) {
      return;
    }
    button.disabled = sending;
    button.textContent = sending ? "Sending…" : buttonLabel;
  }

  form.addEventListener("submit", function(event) {
    if (typeof form.checkValidity === "function" && !form.checkValidity()) {
      return;
    }
    event.preventDefault();
    status.hidden = true;
    setSending(true);

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function(response) {
      if (response.ok) {
        window.location.assign(nextUrl);
        return;
      }
      setSending(false);
      if (response.status === 429) {
        showError("busy");
      } else if (response.status >= 400 && response.status < 500 && response.status !== 403 && response.status !== 404) {
        showError("invalid");
      } else {
        showError("server");
      }
    }).catch(function() {
      setSending(false);
      showError("offline");
    });
  });
})();
