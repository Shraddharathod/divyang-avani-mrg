# 🌸 Avani & Divyang | Royal Hindu Gujarati Wedding Landing Page

A luxurious, interactive digital wedding invitation created for **Avani Makwana & Divyang Rathod** celebrating their wedding on **17th January 2027**.

Designed meticulously following the video reference with interactive 3D card animations, gold envelope unsealing, scratch-off date reveal, shehnai background melody, and full bilingual support in English and Gujarati.

---

## 🌟 Key Features

1. **3D Envelope Unsealing & Wax Seal Animation**
   - Royal burgundy and metallic gold envelope with stardust background.
   - Wax seal embossed with the **AD Monogram Logo**.
   - "Tap to Reveal" animation opens the envelope flap in 3D, glides the card upwards, and begins playing the wedding shehnai melody.

2. **Luxury AD Monogram Crest**
   - Custom-crafted vector SVG monogram featuring intertwined initials **A & D**, royal crown, auspicious coconut kalash, and floral wreath.
   - Displays "Avani & Divyang" in elegant script and "Avani Makwana with Divyang Rathod".

3. **Interactive "Reveal the Date" Scratch Card**
   - 3 Metallic Gold Foil Hearts:
     - **Heart 1:** Day (17 / ૧૭)
     - **Heart 2:** Month (Jan / જાન્યુ.)
     - **Heart 3:** Year (2027 / ૨૦૨૭)
   - Real-time scratch effect using HTML5 Canvas (`destination-out`) tracking cursor and touch swipes.
   - Automatic confetti and rose petal cannon explosion upon revelation.
   - Live Countdown Timer dynamically counting down Days, Hours, Minutes, and Seconds until January 17, 2027.
   - One-click "Add to Google Calendar" and "Download Apple / iCal (.ics)".

4. **Celebration Itinerary (5+ Sacred Ceremonies)**
   - 3D interactive carousel with smooth horizontal glide and arrow controls:
     1. **Mandap Ropan (માંડવ રોપણ):** 16th Jan 2027, 8:00 AM Morning
     2. **Haldi Ceremony (પીઠી રસમ):** 16th Jan 2027, 10:00 AM Morning
     3. **Gotido & Mameru (ગોતિડો ઉત્સવ):** 16th Jan 2027, 5:00 PM Evening
     4. **Preeti Bhojan (શુભ ભોજન / ડિનર):** 16th Jan 2027, 7:30 PM Evening
     5. **Dandiya Raas Night (દાંડિયા નાઈટ):** 16th Jan 2027, 11:00 PM
     6. **The Wedding Day (શુભ લગ્ન સમારંભ):** 17th Jan 2027 at Junagadh (Hast Melap, 4 Mangal Fera, Lunch at 12:30 PM, and Farewell Vidai at 4:00 PM).

5. **Groom Side vs Bride Side Location Filtering**
   - Instant toggle between **🤵 Groom's Side (Divyang Rathod)** and **👰 Bride's Side (Avani Makwana)**:
     - **Groom's Side:** 16th Jan events at Satapar Village, Jamjodhpur (360531); 17th Jan at Junagadh (362001).
     - **Bride's Side:** 16th & 17th Jan events at Junagadh (362001).
   - Direct Google Maps navigation links for both Satapar and Junagadh venues.

6. **"Our Beautiful Moments" Photo Gallery**
   - Showcases all 5 uploaded photos of Avani & Divyang:
     - Couple portrait, candid staircase gaze, festive yellow silk haldi attire, ocean shoreline view, and close-up of intertwined hands & rings.
     - Click to zoom in full-screen Lightbox with captions.

7. **Bilingual Separation (2 Dedicated Landing Pages)**
   - `index.html`: Complete English experience with Gujarati cultural elegance.
   - `gujarati.html`: Pure Gujarati script, traditional shlokas, auspicious lagna geet tahuko, and Gujarati fonts (`Noto Serif Gujarati` & `Noto Sans Gujarati`).
   - Seamless top header language switcher on both pages.

8. **RSVP & Blessings Guestbook with WhatsApp Link**
   - Form pre-fills a beautifully formatted WhatsApp message and opens WhatsApp with one click.
   - Saves blessings to a live on-page guestbook wall.

9. **Audio & Theme Controls**
   - Floating audio wave button with pause/play.
   - Day / Night theme switcher (Royal Ivory & Gold vs Midnight Starlight & Velvet).

---

## 📁 File Structure

```
wedding-invitation/
├── index.html            # Full English Wedding Landing Page
├── gujarati.html         # Full Gujarati Wedding Landing Page
├── README.md             # Documentation
├── css/
│   ├── style.css         # Main luxury styles, responsive design, dark/light theme
│   ├── envelope.css      # 3D envelope opening and wax seal animations
│   └── scratch.css       # Interactive canvas scratch card & countdown
├── js/
│   ├── main.js           # Theme toggle, audio controls, side filter, lightbox, RSVP
│   ├── envelope.js       # Envelope trigger and animation orchestration
│   ├── scratch.js        # Canvas scratch engine, countdown timer, calendar export
│   └── confetti.js       # Golden & rose petal confetti cannon
└── assets/
    ├── audio/
    │   └── wedding_music.m4a  # Extracted authentic wedding background music
    └── images/
        ├── ad-logo.svg        # Luxury Royal AD Monogram Logo
        ├── ganesha.svg        # Auspicious Shree Ganesha SVG Emblem
        ├── mandap.svg         # Mandap Ropan Ceremony Icon
        ├── haldi.svg          # Haldi Ceremony Icon
        ├── gotido.svg         # Gotido / Decorated Garbo Icon
        ├── dinner.svg         # Preeti Bhojan Feast Icon
        ├── dandiya.svg        # Dandiya Sticks Icon
        ├── wedding.svg        # Sacred Fire & Hast Melap Icon
        ├── vidai.svg          # Royal Doli / Palki Icon
        ├── couple-1.jpg       # Avani & Divyang Portrait
        ├── couple-2.jpg       # Staircase Candid
        ├── couple-3.jpg       # Festive Yellow Silk Attire
        ├── couple-4.jpg       # Beach Shoreline
        └── couple-5.jpg       # Hands & Rings Close-up
```

---

## 🚀 How to View Locally

Simply open either file in any web browser:
- **English Landing Page:** `index.html`
- **Gujarati Landing Page:** `gujarati.html`

Double click the `.html` file or drag it into Chrome, Safari, Edge, or Firefox!
