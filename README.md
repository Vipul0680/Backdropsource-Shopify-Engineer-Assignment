# Backdropsource Shopify Engineer Assignment

## Candidate
Vipul Kumar

## Preview Link
https://h46hcw1zvyhg0ui8-99485876514.shopifypreview.com/products_preview?preview_key=edc821624ed59a2b9a4daee812142ac1

Password: Test

## Summary
This project includes analysis and implementation improvements for Backdropsource product pages, focusing on UX clarity, configurator flow, SEO, and Core Web Vitals.

## Implemented Improvements (Part 3)
- Created custom OS 2.0 template: `product.backdrop.json`
- Built custom PDP section: `main-product-backdrop.liquid`
- Variant selection UI using button-style radios
- Live variant + price update logic using product JSON
- Metafield-based content rendering (setup time, specifications, shipping notes, includes)
- Metaobject-based FAQ rendering
- Sticky conversion-friendly PDP layout
- Added Product + FAQ JSON-LD structured data
- Optimized media loading (LCP priority + lazy loading)

## Assumptions
- Product variants represent key configuration options such as size and print type.
- FAQs are managed through metaobjects for scalability.

## Limitations
- Real-time mockup generator is not included as it requires an external rendering workflow or custom backend.
- App scripts were not refactored in depth, but conditional loading is recommended for performance.

## Tools Used
- Shopify Dawn Theme (OS 2.0)
- Shopify Metaobjects / Metafields
- Chrome DevTools + Lighthouse
