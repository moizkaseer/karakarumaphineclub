# High-Quality Pakistan Mountain Images Guide

## Image Requirements

All images must be:
- **Quality:** Full 4K (3840 × 2160) or HD (1920 × 1080) minimum
- **Format:** JPG or PNG
- **Location:** Northern Pakistan (Gilgit-Baltistan, Hunza Valley, Karakoram Range)
- **No compression artifacts** - maintain high quality

---

## Required Images

### 1. Hero Background (`/public/hero_sky.jpg`)
**Current:** Night sky over Karakoram mountains
**Needed:** **K2 Mountain** (8,611m - Second highest peak in the world)
- Dramatic K2 summit shot
- Clear sky, golden hour or blue hour
- Wide angle showing the full mountain
- 4K resolution preferred

**K2 Characteristics:**
- Pyramid-shaped peak
- Steep, rocky faces
- Often snow-covered
- Visible from Concordia or Broad Peak base camp

---

### 2. Who We Are (`/public/who_we_are.jpg`)
**Current:** Baltoro Glacier • Pakistan
**Needed:** **Lady Finger Peak (Bublimotin)** - 6,000m
- Located in Hunza Valley near Karimabad
- Distinctive spire/finger-like shape
- Best viewed from Duikar (Eagle's Nest)
- Autumn colors or spring green valley background
- 4K resolution

**Lady Finger Characteristics:**
- Sharp, pointed summit (resembles a finger)
- Rocky spire rising above Hunza Valley
- Often photographed with Hunza Valley in foreground
- Dramatic vertical relief

---

### 3. Other Sections - **Passu Cones**
**Locations:** Multiple sections (expeditions, conservation, training, etc.)
**Needed:** **Passu Cathedral / Passu Cones** (Tupopdan - 6,106m)
- Located in Upper Hunza, Gojal Valley
- Distinctive jagged, cathedral-like peaks
- Multiple sharp spires in a row
- Photographed with Passu suspension bridge or glacier
- 4K resolution

**Passu Cones Characteristics:**
- Series of pointed, triangular peaks
- Resembles cathedral spires or shark teeth
- Grayish-brown rocky faces
- Often with glacier in foreground
- Iconic view from Karakoram Highway

---

## Where to Find High-Quality Images

### Free Stock Photo Sites (4K, Commercial Use)

1. **Unsplash** (unsplash.com)
   - Search: "K2 Pakistan", "Hunza Valley", "Passu Cones", "Lady Finger Peak", "Karakoram"
   - Free high-resolution (usually 4K+)
   - No attribution required (but appreciated)
   - Download original size

2. **Pexels** (pexels.com)
   - Search: "Pakistan mountains", "Gilgit-Baltistan", "Karakoram range"
   - Free high-quality images
   - No attribution needed

3. **Pixabay** (pixabay.com)
   - Search: "K2 mountain", "Hunza Pakistan", "Passu glacier"
   - Free 4K images available
   - Simplified Pixabay License

### Paid Stock (Highest Quality Guaranteed)

4. **Shutterstock** (shutterstock.com)
   - Search: "K2 summit Pakistan", "Passu Cathedral", "Lady Finger Peak Hunza"
   - Subscription or pay-per-image
   - Guaranteed 4K+ resolution
   - Extensive collection

5. **Adobe Stock** (stock.adobe.com)
   - Professional Pakistan mountain photography
   - 4K and above
   - Royalty-free licensing

6. **Getty Images** (gettyimages.com)
   - Premium quality, editorial and commercial
   - Highest resolution available
   - More expensive

### Photographer Communities

7. **Flickr** (flickr.com)
   - Search with Creative Commons filters
   - Many Pakistani photographers share 4K+ images
   - Check license (some allow commercial use with attribution)
   - Look for "All Rights Reserved" or "Creative Commons"

8. **500px** (500px.com)
   - Professional photographers
   - Many Pakistan mountain specialists
   - Can purchase licenses directly
   - High-resolution originals

### Pakistan-Specific Resources

9. **Shutterstock Pakistan Collection**
   - Search specifically: "Pakistan mountains"
   - Filter by 4K resolution
   - Sort by relevance

10. **Local Pakistani Photographers** (Instagram/Website)
    - @usamakahn (Usama Kahn Photography)
    - @saadchdhry (Saad Chaudhry)
    - @skardu_diaries
    - @dawndotcom (Dawn.com photo archives)
    - Many offer licensing for commercial use

---

## Specific Search Terms for Best Results

### For K2:
- "K2 mountain summit Pakistan"
- "K2 peak Karakoram"
- "K2 savage mountain"
- "K2 from Concordia"
- "K2 base camp view"

### For Lady Finger Peak:
- "Lady Finger Peak Hunza"
- "Bublimotin peak Pakistan"
- "Ultar Sar Hunza Valley"
- "Hunza Valley peaks"
- "Karimabad mountain view"

### For Passu Cones:
- "Passu Cathedral Pakistan"
- "Passu Cones Hunza"
- "Tupopdan peaks"
- "Passu glacier"
- "Passu suspension bridge mountains"
- "Gojal valley peaks"

---

## Image Optimization Workflow

Once you have high-quality images:

### 1. Download Original Resolution
- Always download the largest available size
- 4K preferred (3840 × 2160)
- Minimum HD (1920 × 1080)

### 2. Resize if Needed
Keep aspect ratio and quality:
```bash
# Using ImageMagick (install via npm/homebrew)
convert hero.jpg -resize 3840x2160^ -gravity center -extent 3840x2160 -quality 90 hero_optimized.jpg
```

Or use online tools:
- **TinyPNG** (tinypng.com) - Smart compression, maintains quality
- **Squoosh** (squoosh.app) - Google's image optimizer
- **Compressor.io** - High-quality compression

### 3. Target File Sizes
- Hero image: 500KB - 1.5MB (loaded first, compress more)
- Section images: 300KB - 800KB each
- Total all images: < 10MB for good performance

### 4. Format Recommendations
- **WebP** - Best compression + quality (modern browsers)
- **JPG** - Universal support, good compression
- **PNG** - For images with transparency only

### 5. Place in `/public` Folder
```
/public
├── hero_sky.jpg → Replace with K2 image
├── who_we_are.jpg → Replace with Lady Finger
├── expeditions.jpg → Passu Cones
├── conservation.jpg → Passu Cones (different angle)
├── training.jpg → Passu Cones or Lady Finger
├── community.jpg → Passu Cones
├── join.jpg → Lady Finger or K2
├── support.jpg → Passu Cones
├── leave_no_trace.jpg → K2 or Passu
└── plan.jpg → Lady Finger or Passu
```

---

## Recommended Free Images (Curated)

### Unsplash Collections:
1. **K2 Pakistan**: https://unsplash.com/s/photos/k2-pakistan
2. **Hunza Valley**: https://unsplash.com/s/photos/hunza-valley
3. **Passu Cones**: https://unsplash.com/s/photos/passu-pakistan
4. **Karakoram**: https://unsplash.com/s/photos/karakoram

### Top Photographers to Follow:
- **Rehan Zahid** (Unsplash)
- **Umer Saeed** (Unsplash)
- **Nauman Shah** (Pexels)

---

## License Verification Checklist

Before using any image, verify:
- [ ] Commercial use allowed ✓
- [ ] No attribution required (or note if required)
- [ ] Resolution is 4K or HD ✓
- [ ] Location matches (Northern Pakistan) ✓
- [ ] Image is sharp and well-composed ✓
- [ ] Colors are vibrant and natural ✓
- [ ] No watermarks ✓

---

## Quick Start: Immediate Action

1. **Go to Unsplash.com**
2. **Search "K2 Pakistan"** - Download best 4K image for hero
3. **Search "Lady Finger Peak Hunza"** - Download for Who We Are section
4. **Search "Passu Cones Pakistan"** - Download 3-5 different angles
5. **Optimize all images** with TinyPNG
6. **Replace files in** `/public` folder
7. **Test on localhost** to verify images load correctly
8. **Deploy to production**

---

## Example Code for Hero Image Update

After downloading K2 image as `k2_hero_4k.jpg`:

```bash
# 1. Optimize
# Upload to tinypng.com and download optimized version

# 2. Rename and move
mv k2_hero_4k_optimized.jpg /public/hero_sky.jpg

# 3. Verify in code (already using this path)
# src/sections/HeroSection.tsx line 150:
# <img src="/hero_sky.jpg" alt="K2 mountain summit" />

# 4. Update alt text for SEO
```

---

## Pro Tips

1. **Seasonal Variety:** Get summer (green valley) and winter (snow-covered) versions
2. **Time of Day:** Golden hour (sunrise/sunset) shots have best lighting
3. **Composition:** Wide shots work better for hero/backgrounds
4. **Consistent Style:** Keep similar color tones across all images
5. **Test on Mobile:** Verify images look good on small screens
6. **Use WebP:** Convert to WebP for 25-30% smaller file sizes with same quality

---

## Need Help?

If you can't find specific images:
1. Try broader search terms first
2. Browse Unsplash "Pakistan" collection
3. Contact photographers directly for licensing
4. Use Pexels search filters (Orientation: Landscape, Size: Large)

**Remember:** No compromise on quality - all images must be 4K or HD!
