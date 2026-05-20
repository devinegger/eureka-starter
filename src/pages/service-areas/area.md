---
layout: layouts/area.hbs
pagination:
  data: serviceAreas.items
  size: 1
  alias: area
permalink: "/service-areas/{{ area.slug }}/"
eleventyComputed:
  title: "Digital marketing in {{ area.city }}, {{ area.state }}"
  description: "{{ area.tagline }}. Eureka helps trades businesses in {{ area.city }} book more jobs through fast websites, local SEO, and ROI-first paid ads."
hasContactForm: true
hasPagespeedWidget: true
widget: pagespeed-checker
widgetEyebrow: "Free site audit"
widgetTitle: "How fast is your site, really?"
widgetLede: "Drop your URL — we'll run a live PageSpeed check and tell you what's costing you jobs in your metro."
widgetMeta: "Live · powered by Google PSI"
---
