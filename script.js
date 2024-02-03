document.addEventListener('DOMContentLoaded', function () {
    handleState('Men'); // Initial rendering for 'Men'
});

function fetchProducts(gender) {
    return fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
        .then(response => {
            if (!response.ok)
            {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("data fetched");
            renderProducts(data, gender);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function calculateDiscountPercentage(price, compareAtPrice) {
    if (!price || !compareAtPrice)
    {
        return 0; // If price or compareAtPrice is not provided, return 0% discount
    }

    const originalPrice = parseFloat(compareAtPrice);
    const discountedPrice = parseFloat(price);

    if (isNaN(originalPrice) || isNaN(discountedPrice) || originalPrice <= discountedPrice)
    {
        return 0; // If prices are not valid or discounted price is not less than original price, return 0% discount
    }

    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount); // Round the discount percentage to the nearest whole number
}

function renderProducts(data, genderSelect) {
    console.log(data);
    if (data && data.categories)
    {
        const categories = data.categories;
        const gender = genderSelect;
        console.log(gender);
        let filterCategories = categories.filter(cat => cat.category_name.toLowerCase() === gender.toLowerCase());
        console.log("filter", filterCategories.length);
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = ''; // Clear previous products

        filterCategories.forEach(category => {
            category.category_products.forEach(product => {
                console.log(product.title);

                const discountPercentage = calculateDiscountPercentage(product.price, product.compare_at_price);
                // Add badge text to the product image
                const badgeTextHTML = product.badge_text ? `<div class="badge"><p>${product.badge_text}</p></div>` : '';


                productContainer.insertAdjacentHTML('beforeend', `
                    <div class="product-card">
                        <div class="image-container">
                            ${badgeTextHTML}
                            <img src=${product.image} class="product-image">
                        </div>
                        <div class="product-details">
                            <p class="title">${product.title}</p>
                            <p class="vendor">&#x2022; ${product.vendor}</p>
                        </div>
                        <div class="additional-details">
                            <p class="price">Rs ${product.price}.00</p>
                            <p class="compare-at-price"><s>${product.compare_at_price}.00</s></p>
                            <p class="discount">${discountPercentage}% Off</p>
                        </div>
                        <button class="add-to-cart-button" onclick="addToCartHandler()">Add to Cart</button>
                    </div>
                `);
            });
        });
    }
}

function addToCartHandler() {
    // Add your logic for handling the "Add to Cart" button click
    console.log('Product added to cart!');
}


function changeColor(button) {
    document.querySelectorAll('.men, .women, .kid').forEach(btn => {
        btn.classList.remove('clicked');
        removeEmoji(); // Remove existing emoji when changing color
    });

    button.classList.add('clicked');
    if (button.classList.contains('men'))
    {
        // Add emoji to the 'Men' button
        addEmoji(button, '&#x1F468;');
        handleState('Men');
    } else if (button.classList.contains('women'))
    {
        // Add emoji to the 'Women' button
        addEmoji(button, '&#x1F469;');
        handleState('Women');
    } else if (button.classList.contains('kid'))
    {
        // Add emoji to the 'Kid' button
        addEmoji(button, '&#x1F476;');
        handleState('Kids');
    }
}

function addEmoji(button, emoji) {
    // Check if there's already an emoji span
    const emojiSpan = button.querySelector('.emoji');

    if (emojiSpan)
    {
        // If emoji span exists, toggle its visibility
        emojiSpan.style.display = emojiSpan.style.display === 'none' ? 'inline' : 'none';
    } else
    {
        // If no emoji span, create a new one and append it before the text
        const newEmojiSpan = document.createElement('span');
        newEmojiSpan.classList.add('emoji');
        newEmojiSpan.innerHTML = emoji;

        // Insert a space before appending the emoji
        button.insertBefore(document.createTextNode(' '), button.firstChild);

        // Append the emoji before the text
        button.insertBefore(newEmojiSpan, button.firstChild);

    }
}

function removeEmoji() {
    const emojiElements = document.querySelectorAll('.emoji');
    emojiElements.forEach(emoji => emoji.parentNode.removeChild(emoji));
}

const handleState = (gender) => {
    fetchProducts(gender);
}
