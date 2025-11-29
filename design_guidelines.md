# Design Guidelines: Hotel Content Automation Mobile App

## Design Approach

**Selected Approach:** Hybrid - Travel App Reference + Material Design System

**Rationale:** This is a simple content consumption app displaying automated hotel content. We'll draw inspiration from Airbnb/Booking.com for visual hierarchy and card layouts, while using Material Design principles for mobile-native components and interaction patterns.

**Key Principles:**
- Content-first: Hotel images and descriptions are the hero
- Effortless consumption: Zero cognitive load, pure browsing
- Trust and quality: Professional presentation builds credibility
- Mobile-optimized: Touch-friendly, thumb-zone aware

---

## Core Design Elements

### A. Typography

**Font Families:**
- Primary: Inter (headings, UI elements)
- Secondary: System font stack (body text, descriptions)

**Type Scale:**
- Hotel Title: text-2xl font-bold (24px)
- Section Headers: text-lg font-semibold (18px) 
- Body/Description: text-base font-normal (16px)
- Metadata (price, rating, location): text-sm font-medium (14px)
- Labels/Tags: text-xs font-semibold uppercase tracking-wide (12px)

### B. Layout System

**Spacing Primitives:** We use Tailwind units of **4, 6, and 8** for consistency
- Card padding: p-6
- Section spacing: space-y-4
- Container margins: mx-4, my-6
- Component gaps: gap-4

**Screen Structure:**
- Safe area padding: pt-12 pb-8 (accounting for notch/home indicator)
- Horizontal margins: px-4
- Maximum content width: Full width on mobile (no max-w constraints)

### C. Component Library

**1. Hotel Card (Primary Component)**
- Full-width image at top (aspect-ratio-4/3)
- Rounded corners on card: rounded-2xl
- Shadow: shadow-lg for depth
- Content padding: p-6
- Image should fill viewport width with subtle rounded top corners

**2. Content Sections**
- Title section: Hotel name + location pin icon
- Price + Rating section: Flex row with space-between, items-center
- Star rating: Visual star icons (filled/half/empty)
- Features list: Vertical stack with checkmark icons, gap-4
- Description: max-w-prose for readability

**3. Metadata Display**
- Price tag: Large, prominent, bold font with currency
- Rating badge: Pill-shaped, includes numeric score + stars
- Location: Icon + text combination, subtle emphasis

**4. Icon System**
- Use Material Icons via CDN for consistency
- Icon sizes: 20px for inline elements, 24px for standalone
- Feature icons: Consistent size (20px), aligned left with text

**5. Auto-refresh Indicator**
- Subtle timestamp at top: "Updated 2 hours ago"
- Small, unobtrusive, text-xs opacity-60
- No loading spinners or skeleton screens needed

### D. Images

**Hero Image Requirements:**
- Large hotel image at top of card (16:9 or 4:3 aspect ratio)
- High quality, professionally shot hotel photos
- Cover fit with object-cover for consistency
- Rounded top corners (rounded-t-2xl)

**Image Placement:**
- Primary: Hotel exterior/main view at card top
- Secondary: Gallery thumbnails below main image (optional enhancement)
- Ensure images load gracefully with aspect ratio containers

**Image Sources:**
- Scraped hotel thumbnail URLs
- Fallback placeholder for missing images

---

## Mobile App Specifications

**Single Screen Layout:**

1. **Status Bar Area** (pt-12)
   - Update timestamp
   - Small "Auto-updated" badge

2. **Hotel Card Container** (scrollable)
   - Large hotel image (full-width, rounded-t-2xl)
   - Hotel title overlay on image bottom (gradient backdrop)
   - Content card below image:
     - Hotel name + location
     - Price + rating row
     - Features list (icon + text pairs)
     - Description text
     - Keunggulan lokasi section
     - Rekomendasi section

3. **Scroll Behavior**
   - Smooth native scrolling
   - Image scales slightly on over-scroll (iOS behavior)
   - No pull-to-refresh needed (auto-updates)

**Touch Targets:**
- Minimum 44x44pt for any interactive elements (though this app has none)
- Comfortable spacing between text blocks for easy reading

---

## Animation & Interaction

**Minimal Animations:**
- Subtle fade-in when content updates (300ms ease)
- No scroll-triggered animations
- No loading spinners (content just appears)
- System default scroll physics

---

## Accessibility

- Maintain high contrast ratios (4.5:1 minimum for text)
- Semantic HTML/native components in React Native
- Image alt text for hotel photos
- Readable font sizes (minimum 16px for body)
- Sufficient line height: leading-relaxed (1.625)

---

## Implementation Notes

**Layout Composition:**
- Use SafeAreaView for iOS notch handling
- ScrollView for main content container
- Card-based composition for modularity
- Flex layouts for price/rating rows

**Responsive Behavior:**
- Design for mobile-first (320px to 428px widths)
- Scales naturally on tablets without breakpoints
- Image aspect ratios maintain on all devices

**Content Strategy:**
- Single hotel featured per update cycle
- All content visible without interaction
- No navigation, tabs, or menus needed
- Pure consumption experience

This design creates a polished, professional hotel showcase that feels native to mobile while emphasizing the automated content generation. The simplicity is intentional - letting the AI-generated content and hotel imagery speak for themselves.