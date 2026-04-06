document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".pdp-backdrop");

    sections.forEach((section) => {
        if (section.dataset.initialized) return;
        section.dataset.initialized = "true";

        const productJson = section.querySelector('[id^="ProductJson-"]');
        const variantInput = section.querySelector('[id^="VariantId-"]');
        const priceEl = section.querySelector('[id^="ProductPrice-"]');
        const comparePriceEl = section.querySelector('[id^="ComparePrice-"]');
        const priceBadgeEl = section.querySelector('[id^="PriceBadge-"]');
        const atcBtn = section.querySelector('[id^="AddToCartBtn-"]');
        const stockMsg = section.querySelector('[id^="StockMsg-"]');
        const qtyInput = section.querySelector('[id^="Quantity-"]');
        const qtyMinus = section.querySelector('[id^="QtyMinus-"]');
        const qtyPlus = section.querySelector('[id^="QtyPlus-"]');

        if (!productJson || !variantInput || !priceEl || !atcBtn) return;

        const product = JSON.parse(productJson.textContent);

        // Swiper Initialization
        const thumbSwiper = new Swiper(section.querySelector(".pdp-backdrop__thumbs-swiper"), {
            spaceBetween: 10,
            slidesPerView: 6,
            freeMode: true,
            watchSlidesProgress: true,
            navigation: {
                nextEl: section.querySelector(".pdp-backdrop__thumb-next"),
                prevEl: section.querySelector(".pdp-backdrop__thumb-prev"),
            },
            breakpoints: {
                320: { slidesPerView: 4, spaceBetween: 8 },
                480: { slidesPerView: 5, spaceBetween: 10 },
                1024: { slidesPerView: 6, spaceBetween: 10 }
            }
        });

        const mainSwiper = new Swiper(section.querySelector(".pdp-backdrop__main-swiper"), {
            spaceBetween: 10,
            grabCursor: true,
            thumbs: {
                swiper: thumbSwiper,
            },
        });

        function getSelectedOptions() {
            const selected = [];
            section.querySelectorAll("fieldset.pdp-backdrop__fieldset").forEach((fieldset) => {
                const checked = fieldset.querySelector('input[type="radio"]:checked');
                if (checked) selected.push(checked.value.trim());
            });
            return selected;
        }

        function findMatchingVariant(options) {
            return product.variants.find((variant) => {
                return variant.options.every((opt, index) => {
                    const vOpt = (opt || "").toString().trim().toLowerCase();
                    const sOpt = (options[index] || "").toString().trim().toLowerCase();
                    return vOpt === sOpt;
                });
            });
        }

        if (qtyMinus && qtyPlus && qtyInput) {
            qtyMinus.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const val = parseInt(qtyInput.value) || 1;
                if (val > 1) qtyInput.value = val - 1;
            });
            qtyPlus.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const val = parseInt(qtyInput.value) || 1;
                qtyInput.value = val + 1;
            });
        }

        function formatMoney(cents) {
            return (cents / 100).toLocaleString(undefined, {
                style: "currency",
                currency: product.currency || "USD"
            });
        }

        function updateVariant() {
            const selectedOptions = getSelectedOptions();
            const variant = findMatchingVariant(selectedOptions);

            if (!variant) {
                atcBtn.disabled = true;
                atcBtn.textContent = "Unavailable";
                if (stockMsg) stockMsg.textContent = "";
                return;
            }

            variantInput.value = variant.id;
            priceEl.textContent = formatMoney(variant.price);

            // Update Compare Price and Badge
            if (variant.compare_at_price > variant.price) {
                if (comparePriceEl) {
                    comparePriceEl.textContent = formatMoney(variant.compare_at_price);
                    comparePriceEl.style.display = "block";
                }
                if (priceBadgeEl) {
                    const savingsPercentage = Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100);
                    priceBadgeEl.textContent = `SAVE ${savingsPercentage}%`;
                    priceBadgeEl.style.display = "block";
                }
            } else {
                if (comparePriceEl) comparePriceEl.style.display = "none";
                if (priceBadgeEl) priceBadgeEl.style.display = "none";
            }

            // Update Slider if variant has a featured image
            if (variant.featured_image && mainSwiper) {
                const mediaId = variant.featured_image.id;
                const slideIndex = product.media.findIndex(m => m.id === mediaId);
                if (slideIndex !== -1) {
                    mainSwiper.slideTo(slideIndex);
                }
            }

            // Update Button State and Text
            const paymentBtnContainer = section.querySelector(".shopify-payment-button");

            if (variant.available) {
                atcBtn.disabled = false;
                atcBtn.textContent = "Add to Cart";
                if (stockMsg) stockMsg.textContent = "In Stock";
                if (paymentBtnContainer) paymentBtnContainer.style.display = "block";
            } else {
                atcBtn.disabled = true;
                atcBtn.textContent = "Sold Out";
                if (stockMsg) stockMsg.textContent = "Out of Stock";
                if (paymentBtnContainer) paymentBtnContainer.style.display = "none";
            }
        }

        section.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.addEventListener("change", updateVariant);
        });

        updateVariant();
    });
});