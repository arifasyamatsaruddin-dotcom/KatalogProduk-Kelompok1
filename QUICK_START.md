# 🚀 Sneaker Labs - Quick Start Guide

Welcome to your new professional sneaker e-commerce platform!

---

## ⚡ Get Started in 30 Seconds

### 1. **Open the Website**
```
Simply open index.html in your web browser
No installation required!
```

### 2. **You'll See**
- ✨ Sneaker Labs logo and navigation
- 🏪 Featured products section
- 🎯 Hero image of featured sneaker
- 💌 Newsletter subscription

### 3. **Try These Actions**

**Browse Products:**
- Click "Katalog" to see all 12 sneakers
- Hover over products to see zoom effect

**Search:**
- Use search bar at top
- Type product name (e.g., "Runner")
- Press Enter

**Filter Products:**
- Select category (Running, Casual, Basketball, etc.)
- Choose size (6-13)
- Pick color (Black, White, Gray)
- Adjust price range

**Add to Wishlist:**
- Click ❤️ heart icon on any product
- See counter update in header
- Click wishlist button to view

**Shopping:**
- Click "Tambah ke Keranjang" button
- Cart counter updates
- Click cart 🛒 icon for preview

---

## 🛍️ Full Shopping Flow

### Step 1: Browse
```
Home → Katalog → View All Products
```

### Step 2: Find Products
```
Use filters or search to find what you want
```

### Step 3: Add to Cart
```
Click product → "Tambah ke Keranjang"
Or click heart to save for later
```

### Step 4: Review Cart
```
Click cart icon → "Lihat Keranjang"
```

### Step 5: Checkout
```
Select shipping
Apply promo code (optional)
See total price
Ready to checkout!
```

---

## 💡 Pro Tips

### Search Tricks
- Type part of product name
- Search by category type
- Case-insensitive (typing "RUNNER" or "runner" works)

### Filtering Tips
- Use multiple filters together
- Price slider adjusts in real-time
- Reset all filters with "Reset" link

### Promo Codes
- `LABS10`: 10% off
- `LABS20`: 20% off
- `SNEAKER`: 15% off
- `WELCOME`: 25% off

### Mobile Tips
- Tap hamburger ☰ menu for navigation
- Touch-optimized buttons
- All features work on mobile

---

## 📱 Features Overview

### 🔍 Search & Discover
- Real-time product search
- Advanced filtering system
- Sort by price/popularity/newest
- Multiple category selection

### 👜 Shopping Cart
- Add/remove items
- Adjust quantities
- Select sizes and colors
- View running total
- Apply discount codes

### ❤️ Wishlist
- Save favorite products
- View all saved items
- Quick add to cart
- Persistent storage

### 📱 Responsive Design
- Works on desktop, tablet, mobile
- Touch-friendly controls
- Optimized layouts per device

### 🎨 Modern Design
- Monochromatic tech-wear aesthetic
- Smooth animations
- Professional layout
- Clean typography

---

## 🛒 Product Catalog (12 Sneakers)

| Name | Category | Price | Badge |
|------|----------|-------|-------|
| Ultra Runner X1 | Running | $189 | NEW |
| Street Lab Pro | Casual | $145 | - |
| Apex Performance | Basketball | $199 | SALE |
| Future Flow | Futuristic | $225 | NEW |
| Classic Lab Limited | Casual | $179 | BESTSELLER |
| Trail Blazer Elite | Outdoor | $229 | SALE |
| Monochrome Zero | Casual | $135 | - |
| Midnight Edition | Casual | $155 | - |
| City Runner | Running | $165 | - |
| Grid Max | Basketball | $219 | NEW |
| Echo Lab Retro | Casual | $175 | SALE |
| Prototype X | Futuristic | $299 | BESTSELLER |

All products have:
- ⭐ Customer ratings (4-5 stars)
- 📝 Customer reviews
- 🎨 Multiple color options
- 👞 Multiple size options
- 📸 High-quality images

---

## ⚙️ Technical Details

### How It Works
- Pure HTML, CSS, JavaScript
- No backend server needed
- All data stored in browser
- All images from CDN (Unsplash)

### What's Stored Locally
- 🛒 Shopping cart items
- ❤️ Wishlist items
- 🔍 Last search query

### Browser Compatibility
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

---

## 🎯 Common Tasks

### How to Find a Running Shoe
1. Go to "Katalog"
2. Check "Running" category
3. See both options: Ultra Runner X1 and City Runner
4. Click to view details

### How to Apply Discount
1. Go to cart page
2. Find promo code input
3. Enter code (e.g., LABS20)
4. See discount apply to total

### How to Save Favorites
1. Click ❤️ heart on product
2. Heart becomes red/filled
3. Click 💕 wishlist button to view
4. Move items to cart from wishlist

### How to Sort by Price
1. In catalog, use "Sort" dropdown
2. Select "Harga: Terendah" or "Harga: Tertinggi"
3. Products reorganize automatically

---

## 🎨 Customization Guide

### Change Colors
Edit `styles.css` - look for `:root` section:
```css
:root {
    --primary-color: #000;      /* Change black */
    --secondary-color: #fff;    /* Change white */
    --accent-color: #1a1a1a;    /* Change gray */
}
```

### Change Brand Name
Search and replace "SNEAKER LABS" with your brand name in all HTML files.

### Add New Product
Edit `products.js` and add to the array:
```javascript
{
    id: 13,
    name: "New Sneaker",
    category: "running",
    price: 199.99,
    image: "image-url",
    // ... other properties
}
```

### Add New Promo Code
Edit `products.js`:
```javascript
const promoCodes = {
    "MYCODE": 0.15,  // 15% discount
};
```

---

## ❓ FAQs

**Q: Do I need to install anything?**
A: No! Just open `index.html` in your browser.

**Q: Where are my cart items saved?**
A: In your browser's localStorage. They persist until cleared.

**Q: Can I use this without internet?**
A: Yes, but product images won't load (they're from Unsplash CDN).

**Q: How do I deploy this?**
A: Upload all files to any web hosting. No backend required.

**Q: Can I add more products?**
A: Yes! Edit `products.js` and add to the products array.

**Q: Do I need a payment system?**
A: Currently it's a catalog/cart demo. Add payment system when ready.

---

## 📞 Troubleshooting

### Images Not Loading
- Check internet connection
- Clear browser cache
- Ensure image URLs are valid

### Cart Items Disappearing
- Check if localStorage is enabled
- Don't clear browser data
- Use private/incognito mode carefully

### Search Not Working
- Use exact product name matches
- Check spelling
- Try search in catalog page

### Mobile Menu Not Opening
- Try refreshing page
- Check device viewport
- Use latest browser version

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ Modern CSS (Grid, Flexbox)
- ✅ Responsive Design
- ✅ JavaScript DOM manipulation
- ✅ localStorage API
- ✅ Event delegation
- ✅ Product filtering
- ✅ Shopping cart logic
- ✅ UX/UI best practices

---

## 🚀 Next Steps

### To Customize
1. Change colors in `styles.css`
2. Update brand name in HTML files
3. Add your own products
4. Deploy to web hosting

### To Add Features
1. Payment gateway (Stripe, PayPal)
2. User accounts & login
3. Order history
4. Product reviews
5. Email notifications

### To Deploy
1. Upload files to hosting
2. Set `index.html` as default
3. Test all pages
4. Launch! 🎉

---

## 📊 File Guide

```
index.html           → Homepage
catalog.html         → Product listing & filtering
cart.html            → Shopping cart

styles.css           → All styling (1000+ lines)
script.js            → Core JavaScript
catalog.js           → Catalog functionality
cart.js              → Cart calculations
products.js          → Product database

README.md                  → Full documentation
ENHANCEMENT_SUMMARY.md     → What's new
QUICK_START.md            → This guide
```

---

## 💬 Support

For issues:
1. Check README.md for detailed docs
2. Review console for error messages
3. Test in different browsers
4. Clear cache and try again

---

## 🎉 You're All Set!

Your professional Sneaker Labs e-commerce platform is ready to go!

### Quick Actions
1. Open `index.html` → Browse products
2. Try filters and search
3. Add items to cart
4. Check mobile view
5. Customize as needed

**Enjoy your new sneaker shop!** 👟

---

**Sneaker Labs** - Experimental Platform for Premium Tech-Wear  
Built with ❤️ for modern e-commerce

[📖 Full Docs](README.md) | [✨ Enhancements](ENHANCEMENT_SUMMARY.md)
