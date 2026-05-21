---
layout: page
title: Contact
permalink: /contact/
comments: false
---

If you want to get in touch, send a message through the form below or reach out on one of the social channels.

<div class="contact-grid">
  <section class="contact-card">
    <h2>Elsewhere</h2>
    <p class="contact-info">
      <strong>X</strong><br>
      <a href="https://x.com/{{ site.twitter }}">@{{ site.twitter }}</a>
    </p>
    <p class="contact-info">
      <strong>LinkedIn</strong><br>
      <a href="https://linkedin.com/in/{{ site.linkedin }}">@{{ site.linkedin }}</a>
    </p>
    <p class="contact-info">
      <strong>GitHub</strong><br>
      <a href="https://github.com/{{ site.github-url }}">@{{ site.github-url }}</a>
    </p>
  </section>

  <section class="contact-card">
    <h2>Send a message</h2>
    <form class="contact-form" method="post" action="https://formspree.io/f/mzbnldqd">
      <label for="email_address">Email</label>
      <input id="email_address" type="email" name="email" autocomplete="email" required>

      <label for="name">Name</label>
      <input id="name" type="text" name="name" autocomplete="name" required>

      <label for="message">Message</label>
      <textarea id="message" name="message" autocomplete="off" required></textarea>

      <input type="hidden" name="_subject" value="Message from brenorb.com">
      <input type="hidden" name="_next" value="{{ site.url }}/contact-success/">
      <input type="text" name="_gotcha" class="contact-honeypot" tabindex="-1" autocomplete="off">

      <button type="submit" class="btn btn-info">Send Message</button>
    </form>
  </section>
</div>
