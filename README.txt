GHOSTS, DRAWN · ผีเหนือ ผีไทย

21 Lanna and Thai ghosts as animated SVG cartoons, Thai and English on one page (ไทย | EN).
Live: https://nanobotco.github.io/ghosts-drawn/ · https://motdang.net/sites/ghosts-drawn/

Words:   tools/build.py (every line, Thai and English; OUT = the night clock's hours)
Pictures: tools/art.js (one function per ghost) · tools/hero.js (the night over a Lanna house)
Toys, language, filters: tools/page.js · styles: tools/page.css · sources: tools/sources.json
Build:   python3 tools/build.py            -> docs/index.html (one file, nothing else to load)
         python3 tools/build.py --motdang  -> mot-dang assets/sites + docs/sites, card.json
Test hooks: ?h=<hour> fixes the clock · ?lang=th|en · ?card renders the 1200x630 share card
Card:    headless Chrome 1200x630 on ?card&lang=en -> docs/card.jpg
Deploy:  GitHub: ~/.claude/bin/pr-push . "<title>"
         motdang: from mot-dang, python3 publish/deploy.py --files sites/ghosts-drawn/index.html sites/ghosts-drawn/card.jpg sites/ghosts-drawn/card.json --yes

Text CC BY 4.0. Code MIT.
