---
layout: page
title: Contact
permalink: /contact/
comments: false
---

<div class="contact-shell">
  <p class="contact-lede">If you want to get in touch, send a message here or reach out where the conversation already lives.</p>

  <div class="contact-grid">
    <section class="contact-card contact-card--info">
      <p class="contact-card-label">Elsewhere</p>
      <h2>Public channels</h2>
      <p class="contact-note">Best for quick context, public references, and ongoing work.</p>

      <div class="contact-links">
        <p class="contact-info">
          <strong>Twitter / X</strong>
          <a href="https://x.com/{{ site.twitter }}">@{{ site.twitter }}</a>
        </p>
        <p class="contact-info">
          <strong>LinkedIn</strong>
          <a href="https://linkedin.com/in/{{ site.linkedin }}">@{{ site.linkedin }}</a>
        </p>
        <p class="contact-info">
          <strong>GitHub</strong>
          <a href="https://github.com/{{ site.github-url }}">@{{ site.github-url }}</a>
        </p>
      </div>
    </section>

    <section class="contact-card contact-card--form">
      <p class="contact-card-label">Direct message</p>
      <h2>Send a message</h2>
      <p class="contact-note">Use this for collaborations, speaking invitations, consulting, or anything that needs a private reply.</p>
      <form class="contact-form" method="post" action="https://formspree.io/f/mzbnldqd">
        <label for="email_address">Email</label>
        <input id="email_address" type="email" name="email" autocomplete="email" required>

        <label for="name">Name</label>
        <input id="name" type="text" name="name" autocomplete="name" required>

        <label for="message">Message</label>
        <textarea id="message" name="message" autocomplete="off" required></textarea>

        <input type="hidden" name="_subject" value="Message from brenorb.com">
        <input type="hidden" name="_next" value="{{ '/contact-success/' | relative_url }}">
        <input type="text" name="_gotcha" class="contact-honeypot" tabindex="-1" autocomplete="off">

        <button type="submit" class="btn btn-info contact-submit">Send Message</button>
      </form>
    </section>
  </div>
</div>
