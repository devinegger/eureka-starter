---
layout: layouts/service.hbs
pagination:
  data: services
  size: 1
  alias: service
permalink: "/services/{{ service.slug }}/"
eleventyComputed:
  title: "{{ service.title }}"
  description: "{{ service.summary }}"
hasContactForm: true
---
