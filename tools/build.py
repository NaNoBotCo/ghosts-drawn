#!/usr/bin/env python3
"""Ghosts, Drawn · ผีเหนือ ผีไทย — all words, Thai and English, and the page they make.

    python3 tools/build.py              -> docs/index.html (GitHub Pages)
    python3 tools/build.py --motdang    -> also mot-dang assets/sites/ghosts-drawn + docs/sites/ghosts-drawn
"""
import html, json, pathlib, shutil, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
SLUG = "ghosts-drawn"
SRC = json.loads((HERE / "sources.json").read_text())
E = html.escape

REGION = {
    "lanna": ("ล้านนา", "Lanna"), "central": ("ภาคกลาง", "Central"), "isan": ("อีสาน", "Isan"),
    "south": ("ภาคใต้", "South"), "all": ("ทั่วไทย", "All over"),
}
KIND = {"feed": ("ผีดี ต้องเลี้ยง", "fed"), "off": ("ผีร้าย ต้องกัน", "kept off"), "rite": ("พิธี", "a rite")}
LABEL = {  # th, en
    "eats": ("กิน", "Eats"), "keep": ("กันไว้", "Keep it off"), "feed": ("เลี้ยง", "Feed it"),
    "note": ("นอกเรื่องผี", "Off the folklore"), "odd": ("อีกเรื่อง", "Also"),
}

G = [
 dict(id="krasue", regions=["central", "all"], kind="off", src=["thw-krasue"],
  th=dict(name="กระสือ", alt="ผีลากไส้",
   text="กลางวันเป็นผู้หญิง มักเป็นคนแก่ เก็บตัว ไม่สบตาใคร ตกค่ำหัวลอยออกไปพร้อมตับไตไส้พุงห้อยข้างล่าง เป็นดวงไฟสีแดง แต่ส่วนมากเป็นสีเขียวเรือง ๆ แล้วกลับเข้าร่างตอนใกล้รุ่ง คนโบราณเรียกว่าผีลากไส้",
   eats="ของสด ของคาว ของโสโครก กลิ่นเลือดของคนเพิ่งคลอดลูกเรียกมันมาถึงบ้าน",
   keep="เอาหนามพุทราสะไว้ตามร่องตามรูใต้ถุนเรือน ไส้มันจะติดหนาม",
   odd="กินแล้วมาเช็ดปากกับผ้าที่ตากค้างคืน ผ้าจะเป็นรอยดวง ๆ เอาผ้าผืนนั้นไปต้ม ปากมันจะแสบร้อนจนต้องมาขอร้องให้หยุด",
   toy="สะหนามพุทราใต้ถุน"),
  en=dict(name="Krasue", alt="the ghost that drags its guts",
   text="By day a woman, often an old one, who keeps to herself and won't meet your eye. After dark her head goes out with the liver and guts hanging under it, a red light or, more often, a glowing green one, and comes home near dawn. The old name is phi lak sai, the ghost that drags its guts.",
   eats="Raw, rank and filthy things. The smell of blood at a birth brings her to the house.",
   keep="Jujube thorns pushed into the gaps under the house. The guts snag.",
   odd="She wipes her mouth on washing left out overnight, and it comes up spotted. Boil that cloth and her mouth burns until she comes to the door to ask you to stop.",
   toy="Push thorns under the house")),
 dict(id="krahang", regions=["central"], kind="off", src=["thw-krahang"],
  th=dict(name="กระหัง", alt="คู่ของกระสือ",
   text="ผู้ชายที่เล่นไสยศาสตร์จนอาคมแรงเกินคุม แล้วเข้าตัว บินได้ตอนกลางคืน เอากระด้งฝัดข้าวติดแขนแทนปีก เอาสากตำข้าวผูกขาแทนหาง ออกหากินของโสโครกเหมือนกระสือ"),
  en=dict(name="Krahang", alt="her partner",
   text="A man who played with magic until it grew too strong to hold and turned on him. He flies at night with rice-winnowing trays tied to his arms for wings and a rice pestle tied on for a tail, after the same filthy food as the Krasue.")),
 dict(id="maenak", regions=["central"], kind="off", src=["thw-maenak", "thw-thangklom"],
  th=dict(name="แม่นากพระโขนง", alt="ผีตายทั้งกลมที่คนไทยรู้จักที่สุด",
   text="นางนากตั้งท้องอ่อน ๆ ตอนที่นายมากผัวถูกเรียกไปเป็นทหารที่บางกอก ครบกำหนดคลอด ลูกไม่ยอมกลับหัว นางสิ้นใจไปพร้อมลูกในท้อง พอนายมากกลับถึงบ้านตอนเข้าไต้เข้าไฟ นางก็รออยู่ แล้วรั้งเขาไว้ในบ้านไม่ให้ไปพบใคร จนวันหนึ่งนางตำน้ำพริกแล้วทำมะนาวตกลงร่องพื้นเรือน นายมากเห็นแขนนางยืดยาวลงไปเก็บถึงใต้ถุน",
   keep="นายมากหนีเข้าดงหนาด เพราะผีกลัวใบหนาด สุดท้ายสมเด็จพระพุฒาจารย์ (โต พรหมรังสี) สยบนางได้",
   odd="ศาลแม่นากอยู่ที่วัดมหาบุศย์ สุขุมวิท ๗๗ กรุงเทพฯ เชื่อกันว่าเรื่องเกิดปลายรัชกาลที่ ๓",
   toy="ทำมะนาวตก"),
  en=dict(name="Mae Nak of Phra Khanong", alt="the best-known of the mothers who died whole",
   text="Nak was newly pregnant when her husband Mak was called up to serve in Bangkok. When her time came the baby would not turn, and she died with it still inside her. Mak came home at lamp-lighting, and she was waiting, and she kept him in the house so the neighbours could not tell him. Then, pounding chilli paste, she dropped a lime through a gap in the floor, and he saw her arm reach all the way down under the house to pick it up.",
   keep="Mak hid in a thicket of nat (Blumea), a shrub ghosts fear. In the end the monk Somdet To laid her to rest.",
   odd="Her shrine is at Wat Mahabut, Sukhumvit 77, Bangkok. The story is set late in the reign of Rama III.",
   toy="Drop the lime")),
 dict(id="thangklom", regions=["all", "lanna"], kind="off", src=["thw-thangklom"],
  th=dict(name="ผีตายทั้งกลม", alt="แม่กับลูก",
   text="หญิงที่ตายขณะตั้งท้องหรือตอนคลอด ตายทั้งแม่ทั้งลูก เป็นการตายโหงแบบหนึ่ง นางนากก็เป็นผีตายทั้งกลม ใครเดินผ่านบ้านนั้นตอนค่ำจะได้ยินเสียงกล่อมเด็ก บ้างเห็นเปลผูกอยู่บนคบไม้สูง นางนั่งอยู่ข้างล่าง ยืดแขนขึ้นไปไกวเปล",
   odd="ล้านนาเรียกผีที่ตายเพราะคลอดลูกว่าผีพราย ชาวไทดำเรียกผีปาย ร้อง “ปิ๊ด ปิ๊ด” เหมือนเป็ด ใครป่วยเพราะผีนี้ให้เซ่นด้วยเป็ด",
   toy="ฟังเพลงกล่อม"),
  en=dict(name="Phi tai thang klom", alt="mother and child",
   text="A woman who died pregnant, or in labour, and the child with her: dead whole, both of them. It is one way of dying wrong, and Nak is one. Walk past such a house at night and you hear a lullaby, or see a cradle tied high in a tree and her below it, her arm stretched up to rock it.",
   odd="In Lanna the woman who died in childbirth is phi phrai. The Tai Dam call her phi pai and say she cries “pit, pit” like a duck, so a duck is what you offer if she makes you ill.",
   toy="Hear the lullaby")),
 dict(id="pret", regions=["all", "south"], kind="feed", src=["thw-pret", "thw-sat10"],
  th=dict(name="เปรต", alt="ผีหิว",
   text="สูงเท่าต้นตาล ผมยาว คอยาว ผอมโซ ท้องโต มือเท่าใบลาน แต่ปากเท่ารูเข็ม หิวอยู่ตลอดเวลาเพราะกินอะไรแทบไม่ได้ คนโบราณว่าใครทำร้ายพ่อแม่ ชาติหน้าจะเกิดเป็นเปรต",
   eats="ส่วนบุญที่คนอุทิศให้ เปรตจำพวกที่อยู่ได้ด้วยส่วนบุญ ถ้าไม่มีใครอุทิศให้ก็กินเลือดของตัวเอง แม่น้ำที่คนเห็นใส ๆ เปรตเห็นเป็นเลือด",
   feed="ไม่ต้องกัน ต้องให้ ทำบุญแล้วกรวดน้ำอุทิศส่วนกุศล",
   odd="ทางใต้ว่าเปรตถูกปล่อยจากนรกวันแรม ๑ ค่ำ เดือน ๑๐ กลับวันแรม ๑๕ ค่ำ ลูกหลานตั้งอาหารให้ แล้วแย่งกันชิงเปรต ถือเป็นการทำบุญ",
   toy="กรวดน้ำ"),
  en=dict(name="Pret", alt="the hungry one",
   text="Tall as a sugar palm, with long hair, a long neck, a starved body, a swollen belly, hands the size of palm-leaf pages and a mouth the size of a needle's eye. Always hungry, because almost nothing fits through. The old saying is that whoever hurts their parents comes back as one.",
   eats="Merit others send it. The kind that lives on merit, sent none, eats its own blood. Where a person sees a clear river, a pret sees blood.",
   feed="Not kept off: fed. Make merit and pour water to send it on, kruat nam.",
   odd="In the South they are let out of hell on the first waning day of the tenth month and go back on the fifteenth. Families set food out for them, then scramble for it, ching pret, and that counts as merit.",
   toy="Pour water")),
 dict(id="kongkoi", regions=["isan", "lanna", "all"], kind="off", src=["thw-kongkoi", "bangkokbiznews-30-phi"],
  th=dict(name="ผีกองกอย", alt="ผีป่าขาเดียว",
   text="ผีป่าขาเดียว กระโดดไปด้วยขาข้างเดียว ร้อง “กองกอย ๆ” เป็นที่มาของชื่อ บ้างว่าหน้าเหมือนลิงหรือค่าง บ้างว่าปากเป็นท่อเหมือนแมลงวัน",
   eats="ดูดเลือดจากหัวแม่เท้าของคนที่ค้างแรมในป่า",
   keep="นอนไขว้ขาหรือชิดเท้าทั้งสองข้าง อย่าเอาเท้าออกนอกเต็นท์",
   odd="ชาวภูไทที่หนองสูง มุกดาหาร ว่ามันมีครอบครัว ชอบเดินถอยหลัง และพูดตรงข้ามกับความจริงทุกครั้ง",
   toy="ชิดเท้า เก็บเข้าเต็นท์"),
  en=dict(name="Phi kong koi", alt="the one-legged one",
   text="A forest ghost on one leg. It hops, and cries “kong koi, kong koi”, which is its name. Some say it has the face of a monkey or a langur; some, a mouth like a fly's tube.",
   eats="Blood, from the big toe of whoever sleeps the night in the forest.",
   keep="Sleep with your legs crossed or your feet together, and keep them inside the tent.",
   odd="The Phu Thai of Nong Sung, Mukdahan, say it has a family, walks backwards, and says the opposite of whatever is true.",
   toy="Feet together, inside the tent")),
 dict(id="pop", regions=["isan", "lanna"], kind="off", src=["thw-pop"],
  th=dict(name="ผีปอบ", alt="ผีที่กินไม่รู้จักอิ่ม",
   text="ปอบไม่มีตัวตน มันเข้าสิงคน มักเป็นคนเล่นคาถาอาคมแล้วรักษาไว้ไม่ได้ หรือทำผิดข้อห้ามที่คนอีสานเรียกว่าคะลำ แล้วกินของดิบของสดไม่รู้จักอิ่ม ในเรื่องเล่ามันกินตับไตไส้พุงคนที่มันสิงจนตายเหมือนนอนหลับ ไม่มีแผล เรียกว่าใหลตาย หมอผีจับมันใส่ข้อง",
   note="นักมานุษยวิทยาอธิบายว่าเป็นความไม่ไว้ใจคนแปลกหน้า หรือคนในชุมชนที่ทำตัวแปลกไป สมัยก่อนคนที่ถูกกล่าวหาว่าเป็นปอบถูกไล่ออกจากหมู่บ้าน",
   odd="ทางเหนือกับอีสานมีปอบหมาดำ หมาตัวใหญ่ขนดำตาแดงตามข้างถนน หมาอิ่ม เจ้าของก็อิ่ม หมาเจ็บ เจ้าของก็เจ็บ"),
  en=dict(name="Phi pop", alt="the one that eats and never fills",
   text="No body of its own. It gets into a person, usually one who used magic and could not keep it, or broke one of its rules, khalam in Isan, and eats raw food without ever filling up. In the story it eats the host's insides until they die in their sleep with no mark on them, lai tai. A ghost doctor catches it in a woven fish creel.",
   note="Anthropologists read it as a village's distrust of a stranger, or of a neighbour who acts differently. People accused of being pop were driven out of their villages.",
   odd="In the north and Isan it goes about as a big black dog with red eyes by the road. When the dog has eaten, its owner is full; when the dog is hurt, so is the owner.")),
 dict(id="ka", regions=["lanna"], kind="off", src=["silpamag-phi-ka", "thw-ka", "lanner-phi-lanna"],
  th=dict(name="ผีกะ", alt="ผีที่ครัวเรือนรับต่อกันมา",
   text="อยู่กับครัวเรือน ไม่ได้อยู่กับที่ สืบทางสายแม่ เลี้ยงไว้ในหม้อดินบนเพดานบ้าน ปิดปากหม้อด้วยผ้ายันต์สีขาว เซ่นไข่ดิบวันละฟอง เลี้ยงดีมันไม่ยุ่งกับบ้านตัวเอง กลางคืนออกไปบ้านคนอื่น ปล่อยให้อด มันหันมาเล่นงานบ้านที่เลี้ยงมัน",
   note="ส่วนที่ไม่ใช่นิทานคือคำกล่าวหา บ้านที่ถูกว่ามีผีกะเป็นบ้านที่ไม่มีใครอยากแต่งเข้า และคำกล่าวหาตกอยู่กับผู้หญิง",
   odd="ผีกะพระ-นางของพวกลิเกและนักดนตรี ตัวเล็ก ๆ เหมือนค่างสองตัว นั่งบนบ่า ตกกลางคืนมันเลียหน้า ยิ่งดึกยิ่งงาม",
   toy="เซ่นไข่ดิบ"),
  en=dict(name="Phi ka", alt="the one a family inherits",
   text="Lives with a household, not a place, and passes down the mother's line. It is kept in a clay pot up in the roof, the mouth tied over with a white cloth written with a yantra, and fed one raw egg a day. Fed, it leaves its own house alone and goes out at night into other people's. Hungry, it turns on the house that holds it.",
   note="The part that is not folklore is the accusation. A house said to carry phi ka is a house nobody marries into, and the accusation lands on women.",
   odd="Likay players and musicians once kept a pair, small as langurs, riding on the shoulder. At night they lick the performer's face, and the later it gets, the better the performer looks.",
   toy="Feed it a raw egg")),
 dict(id="phong", regions=["lanna"], kind="off", src=["th-wiki-phi-phong", "matichon-phi-phong"],
  th=dict(name="ผีโพง", alt="ผีไฟออกจมูก",
   text="คนเป็น ๆ ที่เล่นไสยศาสตร์แล้วคุมวิชาไม่อยู่ หรือปลูกว่านผีโพง สีขาว รสฉุนร้อน แก่แล้วมีปรอทลงกินจนเรืองแสง กลางวันเป็นคนธรรมดา กลางคืนออกไปตามทุ่งนาหากบหาเขียด มีดวงไฟออกจากรูจมูกไว้ส่องทาง",
   note="ถ้าเล่าแบบเรียบที่สุด เรื่องนี้คือแสงจากแก๊สหนองน้ำกลางทุ่งนาตอนกลางคืน"),
  en=dict(name="Phi phong", alt="the one with the light in its nose",
   text="A living person who took up magic and lost hold of it, or who grew wan phi phong, a white, hot, sharp plant that in the telling draws mercury into itself as it ages and starts to glow. By day an ordinary neighbour. At night they go out over the paddy after frogs, with a light coming out of the nose to see by.",
   note="At the flat end of it, the story describes marsh gas over a rice field at night.")),
 dict(id="tani", regions=["central", "all"], kind="feed", src=["thw-tani", "thw-phrai"],
  th=dict(name="นางตานี", alt="ผีต้นกล้วย",
   text="สิงอยู่ในต้นกล้วยตานี แต่ไม่ใช่ทุกต้น เป็นหญิงงาม ผมยาว ห่มสไบสีตองอ่อน นุ่งโจงสีตองแก่ กลิ่นกายหอมดอกกล้วย ฝ่ามือฝ่าเท้าแดงอ่อนเหมือนตีนนกพิราบ ริมฝีปากสีเหมือนตำลึงสุก ต้นกล้วยอวบ นางก็ท้วม ต้นโปร่ง นางก็ระหง",
   keep="อย่าตัดใบตองตานีเข้าบ้านทั้งใบ ให้เจียนเอาแต่ใบหรือหักก้านเสียก่อน ไม่อย่างนั้นจะมีคนในบ้านตาย เพราะแต่ก่อนใช้ใบตองตานีสามใบรองก้นโลงศพ",
   feed="พอกล้วยออกปลี มีพิธีพลี หัวหมู บายศรี ขนมต้มแดงต้มขาว ดอกไม้ธูปเทียน คล้องแหวนสร้อยทองที่งวงปลี แล้วเอาผ้าพันรอบต้นให้นางนุ่งห่ม",
   toy="พันผ้ารอบต้น"),
  en=dict(name="Nang Tani", alt="the lady of the banana tree",
   text="Lives in a kluai tani, the wild seeded banana, though not in every one. Beautiful and long-haired, in a pale-leaf-green sabai and a dark-leaf-green chong kraben, smelling of banana flower. Her palms and soles are pale red like a pigeon's feet; her lips the colour of a ripe ivy gourd. A plump tree has a plump Tani; a slender tree, a slender one.",
   keep="Do not bring a whole tani leaf into the house. Trim it, or break the stem first, or someone in the house will die: three tani leaves once lined the bottom of a coffin.",
   feed="When the tree flowers: a pig's head, bai si, red and white sweets, flowers and incense, gold rings and chains hung on the blossom, and a cloth wound round the trunk for her to wear.",
   toy="Wind a cloth round the trunk")),
 dict(id="takhian", regions=["central", "all"], kind="feed", src=["thw-takhian"],
  th=dict(name="นางตะเคียน", alt="ผีต้นตะเคียน",
   text="สิงอยู่ในต้นตะเคียน ไม้ที่คนใช้ขุดเรือ ใต้ต้นของนางสะอาดเหมือนมีคนมากวาดอยู่ทุกวัน หน้าตาสะสวย ผมยาว ห่มสไบ หวงที่อยู่ ใครคิดรุกรานนางจะดุร้ายมาก",
   keep="จะโค่นไปขุดเรือหรือสร้างบ้าน ต้องทำพิธีบวงสรวงขออนุญาตนางก่อน นางย้ายไปกับเนื้อไม้ เป็นเรือ นางก็เป็นแม่ย่านาง เป็นบ้าน นางก็เป็นเจ้าที่ ผีบ้านผีเรือน",
   toy="ขอก่อน แล้วขุดเรือ"),
  en=dict(name="Nang Takhian", alt="the lady of the takhian tree",
   text="Lives in a takhian, Hopea odorata, the tree dugouts are cut from. The ground under her tree stays clean, as if someone sweeps it every morning. Lovely, long-haired, in a sabai, and fierce with anyone who threatens her home.",
   keep="Ask her first, with offerings, before the tree comes down for a boat or a house. She goes with the wood: in a boat she becomes mae ya nang, the lady of the bow; in a house, its guardian.",
   toy="Ask, then carve a boat")),
 dict(id="phrai", regions=["all", "lanna"], kind="off", src=["thw-phrai", "lanner-phi-lanna"],
  th=dict(name="ผีพราย", alt="ผีในน้ำ",
   text="ผีขนาดเล็ก อยู่ในน้ำเป็นส่วนมาก เป็นหญิงใส่ชุดขาว หรือเป็นแสงพราวอยู่ใต้น้ำ ชาวบ้านว่าเป็นหญิงสาวที่จมน้ำตาย มันฉุดขาคนว่ายน้ำให้เป็นตะคริว แล้วดึงลงไปเป็นเพื่อน",
   keep="ยายทางเหนือไม่ให้หลานลงเล่นน้ำตอนโพล้เพล้",
   odd="ในล้านนา ผีพรายยังหมายถึงหญิงที่ตายเพราะคลอดลูก ชอบเข้าสิงคนที่ป่วยหนัก"),
  en=dict(name="Phi phrai", alt="the one in the water",
   text="A small kind of spirit, mostly in water: a woman in white, or lights glinting under the surface. The village telling is that she was a girl who drowned. She takes a swimmer by the leg, gives them cramp, and pulls them under for company.",
   keep="A northern grandmother does not let a child swim at dusk.",
   odd="In Lanna phi phrai is also the woman who died in childbirth, who gets into people who are very ill.")),
 dict(id="am", regions=["all"], kind="off", src=["thw-am"],
  th=dict(name="ผีอำ", alt="ผีที่ทับตัว",
   text="พจนานุกรมราชบัณฑิตยสถานนิยามว่า อาการเมื่อนอนเคลิ้มไปว่ามีคนปลุกปล้ำหรือยึดคร่า จนเหนื่อยหอบตื่นขึ้น รู้สึกตัวแต่ขยับไม่ได้ ร้องไม่ออก เป็นอยู่ไม่กี่วินาทีถึงสิบนาที มักเกิดกับคนนอนหงาย",
   keep="มีคนเรียก สะกิด หรือปลุก ก็หาย หรือนอนนิ่ง ๆ สักพักก็หายเอง",
   note="หมอเรียกว่า sleep paralysis สมองตื่นแล้ว แต่ร่างกายยังไม่ตื่นตาม",
   toy="สะกิดปลุก"),
  en=dict(name="Phi am", alt="the one that presses",
   text="The Royal Institute dictionary defines it: as you drift off, the feeling that someone is wrestling you down, until you wake gasping. You are awake and cannot move or call out. It lasts from a few seconds to ten minutes, and comes most to people sleeping on their backs.",
   keep="Someone calls you, touches you or shakes you, and it goes. Or lie still and it goes on its own.",
   note="Medicine calls it sleep paralysis: the brain is awake before the body is.",
   toy="Shake them awake")),
 dict(id="kuman", regions=["central", "all"], kind="feed", src=["thw-kuman"],
  th=dict(name="กุมารทอง", alt="เด็กทอง",
   text="วิญญาณเด็กผู้ชายในรูปกุมาร ไว้จุก นุ่งโจงกระเบน ปิดทองทั้งตัว ผู้บูชาเลี้ยงเหมือนลูก ให้ข้าวให้น้ำ เรียกมากินข้าว เดี๋ยวนี้นิยมไหว้ด้วยน้ำแดง แล้วกุมารจะคุ้มครองบ้าน ช่วยการค้า และเตือนภัยล่วงหน้า ถ้าเป็นวิญญาณเด็กผู้หญิงเรียกว่าโหงพราย",
   feed="ข้าว น้ำ น้ำแดง และเรียกให้มากินข้าวด้วย",
   note="ตำราเก่าทำจากเด็กที่ตายในท้องแม่ เดี๋ยวนี้ปั้นจากดินเจ็ดป่าช้า แกะจากไม้รักซ้อนหรือไม้มะยม หรือหล่อโลหะ ตั้งแต่ปี ๒๕๕๘ มีลูกเทพ ตุ๊กตาที่คนเลี้ยงเหมือนลูกอีกแบบหนึ่ง",
   toy="ให้น้ำแดง"),
  en=dict(name="Kuman Thong", alt="the golden boy",
   text="A boy's spirit kept in a little figure with a topknot and a chong kraben, gold all over. The keeper raises him like a son, with rice and water and a call to come and eat, and these days red soda. In return he guards the house, helps the trade along and warns of trouble. A girl's spirit kept the same way is a hong phrai.",
   feed="Rice, water, red soda, and a call to come and eat.",
   note="Old manuscripts make him from a child who died before birth. Today's are moulded from the earth of seven cemeteries, carved from wood, or cast in metal. Since 2015 there are also luk thep, dolls raised like children.",
   toy="Give him red soda")),
 dict(id="jakala", regions=["south", "all"], kind="off", src=["thw-jakala"],
  th=dict(name="ผีจะกละ", alt="ผีแมว",
   text="ผีที่หมอผีเลี้ยงไว้ใช้ทำร้ายศัตรู รูปร่างเหมือนแมวบ้านทุกอย่าง แต่ขนดำสนิท กระด้าง ไม่มีเงา ขนทวนไปข้างหน้าฟูฟ่อง ตาแดงเหมือนเลือด ขุดรูอยู่ กลัวคน เห็นคนก็วิ่งหนีลงรู ภาคใต้เรียกผีล้วง"),
  en=dict(name="Phi jakala", alt="the cat",
   text="A ghost a sorcerer keeps to send against enemies, shaped like a cat. It looks like any house cat except that its fur is jet black, harsh, without a sheen, and grows forwards, and its eyes are blood red. It digs a hole to live in and runs from people. In the South it is phi luang.")),
 dict(id="pokkalong", regions=["lanna"], kind="off", src=["bangkokbiznews-30-phi", "lanner-phi-lanna"],
  th=dict(name="ผีปกกะโหล้ง", alt="ผีป่าทึบ",
   text="อยู่ในป่าทึบ มาเป็นพายุ เป็นสัตว์ หรือเป็นตาแก่น่ากลัวที่มีสัตว์อาศัยอยู่ในเครา ชื่อของมันคือเสียงที่มันทำ"),
  en=dict(name="Phi pok ka long", alt="the one in the deep forest",
   text="Lives in thick forest and arrives as a storm, or as an animal, or as a frightening old man whose beard has animals living in it. Its name is the noise it makes.")),
 dict(id="taihong", regions=["all", "lanna"], kind="off", src=["lanner-phi-lanna", "veridian-phi-north"],
  link=("https://motdang.net/ghost/", "ทัวร์ผีเชียงใหม่", "Ghost Chiang Mai, the walk"),
  th=dict(name="ผีตายโหง", alt="ตายไม่ดี",
   text="ตายเพราะถูกฆ่า ตายกะทันหัน หรือตายนอกบ้าน โดยไม่มีใครทำพิธีให้ ลักษณะสำคัญคือไม่ยอมไปจากที่ที่ตาย ทัวร์ผีเชียงใหม่มีสองจุดที่เป็นของพวกนี้ ประตูเมืองที่ศพกับนักโทษผ่านออกไป และบ้านหลังหนึ่งในย่านตะวันตกเฉียงเหนือ"),
  en=dict(name="Phi tai hong", alt="died wrong",
   text="Killed, or dead suddenly, or dead away from home, with no rites done. What defines them is that they stay. Two stops on the Chiang Mai ghost walk are made of them: the gate the corpses and the condemned went out through, and a house in the north-west quarter.")),
 dict(id="puya", regions=["lanna"], kind="feed", src=["finearts-phi-puya", "lanner-phi-lanna"],
  th=dict(name="ผีปู่ย่า", alt="ผีบรรพบุรุษของบ้าน",
   text="ผีของคนในบ้านที่ตายไปแล้ว อยู่ในหอผีบนเสาในบริเวณบ้าน ครอบครัวทางเหนือเลี้ยงท่าน บอกกล่าวเมื่อจะแต่งงานหรือย้ายบ้าน และขอขมาท่าน พิพิธภัณฑสถานแห่งชาติเชียงใหม่วางเรื่องนี้ไว้เป็นฐานของทั้งระบบ ก่อนเรื่องอื่น บ้านมีผีของตัวเองอยู่ในลาน",
   feed="ข้าว ดอกไม้ เทียน และบอกกล่าวทุกเรื่องใหญ่ของบ้าน",
   toy="ยกสำรับไปให้"),
  en=dict(name="Phi pu ya", alt="the grandparents",
   text="The household's own dead, in a small house on a post in the compound. A northern family feeds them, tells them about a marriage or a move, and says sorry to them. Chiang Mai's national museum puts this at the base of the whole system: before anything else, a house has its own dead in the yard.",
   feed="Rice, flowers, a candle, and word of everything big that happens in the house.",
   toy="Bring them a tray")),
 dict(id="suea", regions=["lanna"], kind="feed", src=["lanner-phi-lanna", "veridian-phi-north"],
  link=("https://motdang.net/ghost/", "ทัวร์ผีเชียงใหม่", "Ghost Chiang Mai, the walk"),
  th=dict(name="ผีเสื้อบ้าน · เสื้อวัด · เสื้อเมือง", alt="ผู้ปกคลุมที่",
   text="เสื้อในที่นี้ไม่ใช่เสื้อผ้า แต่คือผู้ที่ปกคลุมรักษาที่แห่งนั้น เป็นวิญญาณของผู้สร้างหรือผู้ปกครองพื้นที่ อยู่ในหอในศาลเพื่อดูแลต่อไป พระย้ายออกไป วัดก็ยังมีเสื้อวัดอยู่ วัดร้างในเชียงใหม่จึงไม่ใช่ตึกว่าง"),
  en=dict(name="Phi suea ban · suea wat · suea mueang", alt="the guardians of a house, a wat, a city",
   text="Suea here is not the shirt; it is the one that covers a place. These are the spirits of whoever founded or ruled the ground, housed in a shrine so they go on looking after it. A wat keeps its guardian after the monks leave, which is why an abandoned wat in Chiang Mai is not an empty building.")),
 dict(id="pusae", regions=["lanna"], kind="feed", src=["th-wiki-pusae", "en-wiki-pusae", "maehia-pusae"],
  link=("https://motdang.net/ghost/", "ทัวร์ผีเชียงใหม่", "Ghost Chiang Mai, the walk"),
  th=dict(name="ปู่แสะ ย่าแสะ", alt="ยักษ์สองผัวเมีย",
   text="ยักษ์สองผัวเมียที่กินคนในหุบเขานี้จนเมืองร้าง พระพุทธเจ้าโปรดจนรับศีล แล้วทั้งสองขอกินคนเดือนละคน ไม่ได้ ขอปีละคน ก็ไม่ได้ ข้อตกลงที่อยู่ได้คือกับเจ้าเมืองลัวะ ควายปีละตัว แลกกับการรักษาหุบเขาไว้ห้าพันปี ลูกชายของทั้งสองบวชเป็นฤๅษีบนดอย ชื่อดอยสุเทพมาจากท่าน",
   feed="ควายปีละตัว ในประเพณีเลี้ยงดงที่แม่เหียะ"),
  en=dict(name="Pu Sae and Ya Sae", alt="the ogres",
   text="Two ogres who ate the people of this valley until the town emptied. The Buddha taught them and they took the precepts, then asked whether they might still have one person a month: refused. One a year: refused. The bargain that held was with the lord of the Lawa: one buffalo a year, for keeping the valley safe five thousand years. Their son became a hermit on the mountain, and Doi Suthep is named after him.",
   feed="One buffalo a year, at the liang dong rite in Mae Hia.")),
 dict(id="motmeng", regions=["lanna"], kind="rite", src=["sac-fon-phi", "th-wiki-fon-phi"],
  th=dict(name="ฟ้อนผีมด ผีเม็ง", alt="ผีบรรพบุรุษลงมาฟ้อน",
   text="ผีมดคือผีของชาวลัวะสามัญ ผีเม็งคือผีของแม่ทัพมอญ ตระกูลในเชียงใหม่รู้ว่าตัวเองฟ้อนผีไหน ปีละครั้งหรือสองสามปีครั้ง มักเดือนพฤษภาคมหรือมิถุนายน ปลูกผาม ตั้งเครื่องเซ่น ดนตรีเรียกผีบรรพบุรุษ ผีลงทรงลูกหลานแล้วลุกขึ้นฟ้อน สองสามวัน",
   note="ไม่ใช่การแสดงและไม่ได้โฆษณา เดือนพฤษภาถ้าได้ยินวงกลองดังในบ้านในซอยเป็นวันที่สอง ก็คือฟ้อนผี",
   toy="ตีกลอง"),
  en=dict(name="Fon phi mot, phi meng", alt="the ancestors come down to dance",
   text="Phi mot are the dead of ordinary Lawa, phi meng the dead of Mon commanders, and a Chiang Mai lineage knows which it dances. Once a year, or every two or three, usually in May or June, a shelter goes up, the offerings are laid, music calls the ancestors, and they come into their own descendants, who get up and dance, for two or three days.",
   note="It is not a show and it is not advertised. A drum band going in a compound off a soi in May for a second day running is what it sounds like.",
   toy="Play the drum")),
]

# who is out at which hour, for the night clock (Chiang Mai time)
OUT = [
    dict(id="phrai", frm=17.5, to=19.5, th="ผีพราย", en="Phi phrai", wth="ในน้ำ", wen="in the water"),
    dict(id="maenak", frm=18.0, to=19.5, th="แม่นาก", en="Mae Nak", wth="รอที่บ้าน", wen="waiting at home"),
    dict(id="krasue", frm=18.5, to=5.5, th="กระสือ", en="Krasue", wth="เหนือทุ่ง", wen="over the paddy"),
    dict(id="thangklom", frm=19.0, to=4.0, th="ผีตายทั้งกลม", en="Phi tai thang klom", wth="ร้องกล่อมลูก", wen="singing to the child"),
    dict(id="krahang", frm=19.0, to=4.0, th="กระหัง", en="Krahang", wth="บินผ่านดวงจันทร์", wen="across the moon"),
    dict(id="phong", frm=19.0, to=4.5, th="ผีโพง", en="Phi phong", wth="หากบในนา", wen="after frogs in the paddy"),
    dict(id="ka", frm=20.0, to=4.0, th="ผีกะ", en="Phi ka", wth="ไปบ้านคนอื่น", wen="out in other people's houses"),
    dict(id="kongkoi", frm=20.0, to=5.0, th="ผีกองกอย", en="Phi kong koi", wth="ชายป่า", wen="at the forest edge"),
    dict(id="am", frm=22.0, to=6.5, th="ผีอำ", en="Phi am", wth="ข้างเตียง", wen="by the bed"),
]

PAGE = dict(
    title_th="ผีเหนือ ผีไทย", title_en="Ghosts, Drawn",
    sub_th="ผีล้านนา และผีภาคอื่นของไทย วาดเป็นการ์ตูน", sub_en="The phi of Lanna and the rest of Thailand, as cartoons",
    intro_th="คนเหนือแบ่งผีเป็นสองกองก่อนจะพูดอะไรต่อ ผีดีต้องเลี้ยง ผีร้ายต้องกัน ผีจะตกกองไหนมักตัดสินจากว่าตายอย่างไร และมีใครทำพิธีให้หรือเปล่า ที่นี่มีทั้งสองกอง กับผีภาคกลาง อีสาน และใต้ แตะรูปเพื่อเล่น",
    intro_en="The north sorts its dead into two piles before it says anything else about them. Phi di are the ones you feed; phi rai, the ones you keep off. Which pile a dead person lands in usually turns on how they died, and whether anyone did the rites. Both piles are here, with the ghosts of the Centre, Isan and the South. Tap a picture to play.",
    out_th="ตอนนี้ออกมา:", out_en="Out now:",
    day_th="กลางวัน ผีส่วนใหญ่หลบ กระสือคือหญิงเงียบ ๆ ที่หน้าต่าง ลากเวลาไปตอนค่ำดู", day_en="Daylight, and most of them are in. The Krasue is the quiet woman at the window. Drag the clock to evening.",
    clock_th="เวลาเชียงใหม่", clock_en="Chiang Mai time",
    close_title_th="ขึด", close_title_en="Khuet",
    close_th="ขึดไม่ใช่ผี เป็นคำเมืองเรียกการกระทำที่นำเรื่องร้ายมาสู่ตัว รายการในใบลานยาวและละเอียด เรื่องวัด ของศักดิ์สิทธิ์ของเมือง ตลาด ไร่นา ต้นไม้บางต้น สัตว์บางตัว ทำเข้าก็ตกขึด แล้วต้องทำพิธีถอน ผีเหนือส่วนใหญ่จึงไม่ได้มีไว้ให้กลัว แต่เป็นกฎว่าจะทำตัวอย่างไรบนที่ที่เป็นของคนอื่น",
    close_en="Not a ghost. Khuet is the northern word for an act that brings the bad down on you, and the list in the palm-leaf manuscripts is long and specific: about wats, a town's sacred things, markets, fields, particular trees, particular animals. Do one and you have fallen into khuet, and there is a rite to get out. It is the frame the rest sits in: the north's dead are less a source of fright than a set of rules for behaving on ground that belongs to somebody else.",
)

FILTERS = [("all", "ทั้งหมด", "All"), ("lanna", "ล้านนา", "Lanna"), ("central", "ภาคกลาง", "Central"),
           ("isan", "อีสาน", "Isan"), ("south", "ภาคใต้", "South"), ("feed", "ผีดี ต้องเลี้ยง", "Fed"),
           ("off", "ผีร้าย ต้องกัน", "Kept off")]


def pair(th, en, tag="span"):
    return f'<{tag} class="th" lang="th">{E(th)}</{tag}><{tag} class="en" lang="en">{E(en)}</{tag}>'


def card(g):
    th, en = g["th"], g["en"]
    tags = " ".join(sorted(set(g["regions"] + [g["kind"]] + (["all"] if "all" in g["regions"] else []))))
    chips = "".join(f'<span class="chip r-{r}">{pair(*REGION[r])}</span>' for r in g["regions"])
    chips += f'<span class="chip k-{g["kind"]}">{pair(*KIND[g["kind"]])}</span>'
    rows = ""
    for k in ("eats", "feed", "keep", "note", "odd"):
        if k in th:
            rows += f'<dt>{pair(*LABEL[k])}</dt><dd>{pair(th[k], en[k])}</dd>'
    toy = ""
    if "toy" in th:
        cnt = ' <span class="n"></span>' if g["id"] in ("pret",) else ""
        toy = f'<button class="toy" type="button">{pair(th["toy"], en["toy"])}{cnt}</button>'
    more = ""
    if g.get("link"):
        u, lt, le = g["link"]
        more = f'<p class="more"><a href="{u}">{pair(lt, le)} →</a></p>'
    srcs = " · ".join(f'<a href="{E(SRC[s]["url"])}" rel="noopener">{E(SRC[s]["title"])}</a>' for s in g["src"])
    alt_th = f'<span class="alt th" lang="th">{E(th["alt"])}</span>'
    alt_en = f'<span class="alt en" lang="en">{E(en["alt"])}</span>'
    name = f'<span class="th" lang="th">{E(th["name"])}</span><span class="en" lang="en">{E(en["name"])} · <span lang="th">{E(th["name"])}</span></span>'
    return f'''<article class="ghost" id="{g["id"]}" data-tags="{tags}">
<div class="art" data-g="{g["id"]}" role="img" aria-label="{E(en["name"])}"></div>
<div class="body"><h2>{name}{alt_th}{alt_en}</h2><div class="chips">{chips}</div>
<p>{pair(th["text"], en["text"])}</p>{f"<dl>{rows}</dl>" if rows else ""}{toy}{more}
<p class="src">{pair("ที่มา", "Sources")}: {srcs}</p></div></article>'''


DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<radialGradient id="gGlow"><stop offset="0" stop-color="#b8ffb0" stop-opacity=".85"/><stop offset="1" stop-color="#b8ffb0" stop-opacity="0"/></radialGradient>
<radialGradient id="gGold"><stop offset="0" stop-color="#ffe27a" stop-opacity=".95"/><stop offset="1" stop-color="#ffb02e" stop-opacity="0"/></radialGradient>
<radialGradient id="gRed"><stop offset="0" stop-color="#ff3348" stop-opacity=".8"/><stop offset="1" stop-color="#ff3348" stop-opacity="0"/></radialGradient>
<radialGradient id="gWhite"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#bfe8ff" stop-opacity="0"/></radialGradient>
<radialGradient id="gMoon"><stop offset=".6" stop-color="#fff6d2" stop-opacity=".5"/><stop offset="1" stop-color="#fff6d2" stop-opacity="0"/></radialGradient>
<linearGradient id="gBeam" x1="0" x2="1"><stop offset="0" stop-color="#eaffd9" stop-opacity=".9"/><stop offset="1" stop-color="#b8ffb0" stop-opacity="0"/></linearGradient>
<linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset="1" stop-color="#2b3468"/></linearGradient>
<linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2a5a"/><stop offset=".7" stop-color="#b8607a"/><stop offset="1" stop-color="#f09a6a"/></linearGradient>
<linearGradient id="gDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4d5fa8"/><stop offset=".6" stop-color="#f4b58a"/><stop offset="1" stop-color="#ffe2a8"/></linearGradient>
<linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e2f4fb"/></linearGradient>
<linearGradient id="gForest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1a14"/><stop offset="1" stop-color="#284232"/></linearGradient>
<linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset=".38" stop-color="#1c2c5a"/><stop offset=".4" stop-color="#1b4f78"/><stop offset="1" stop-color="#082236"/></linearGradient>
<linearGradient id="gRoom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1636"/><stop offset="1" stop-color="#3a2f5a"/></linearGradient>
<linearGradient id="gRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#5a3a26"/></linearGradient>
<linearGradient id="gShelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a1a24"/><stop offset="1" stop-color="#a8323a"/></linearGradient>
<linearGradient id="gStorm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2230"/><stop offset="1" stop-color="#3a4a3a"/></linearGradient>
<pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4h8M4 0v8" stroke="#8a5a2b" stroke-width="1.4"/></pattern>
</defs></svg>'''


def build(url):
    css = (HERE / "page.css").read_text()
    js = "\n".join((HERE / f).read_text() for f in ("art.js", "page.js", "hero.js"))
    out_js = json.dumps([{"from": o["frm"], "to": o["to"], "th": o["th"], "en": o["en"], "wth": o["wth"], "wen": o["wen"]} for o in OUT], ensure_ascii=False)
    P = PAGE
    used = []
    for g in G:
        for s in g["src"]:
            if s not in used:
                used.append(s)
    for s in ("khuet-book", "cmu-khuet"):
        used.append(s)
    srclist = "".join(f'<li><a href="{E(SRC[s]["url"])}" rel="noopener">{E(SRC[s]["title"])}</a> · {E(SRC[s]["pub"])}' + (f' · {E(SRC[s]["lic"])}' if SRC[s].get("lic") else "") + f' · {pair("อ่าน", "read")} {E(SRC[s].get("read", ""))}</li>' for s in used)
    filters = "".join(f'<button type="button" data-f="{k}" aria-pressed="{"true" if k == "all" else "false"}">{pair(t, e)}</button>' for k, t, e in FILTERS)
    cards = "\n".join(card(g) for g in G)
    desc = "ผีล้านนาและผีไทย วาดเป็นการ์ตูนเคลื่อนไหว กระสือ กระหัง แม่นาก เปรต ผีกองกอย ผีกะ ผีโพง นางตานี · Thai and Lanna ghosts as animated cartoons, with their sources."
    return f'''<!doctype html>
<html lang="th" data-lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ghosts, Drawn · ผีเหนือ ผีไทย</title>
<meta name="description" content="{E(desc)}">
<meta property="og:title" content="Ghosts, Drawn · ผีเหนือ ผีไทย">
<meta property="og:description" content="{E(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{url}card.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b1030">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M14 56V28a18 18 0 0136 0v28l-6-5-6 5-6-5-6 5-6-5z' fill='%23eef2ff' stroke='%2322162e' stroke-width='4'/%3E%3Ccircle cx='26' cy='28' r='4' fill='%2322162e'/%3E%3Ccircle cx='38' cy='28' r='4' fill='%2322162e'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@500;600;700&family=Sarabun:wght@400;600&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>
{DEFS}
<header class="top"><a class="brand" href="#">{pair("ผีเหนือ ผีไทย", "Ghosts, Drawn")}</a>
<div class="lang" role="group" aria-label="ภาษา · language"><button type="button" class="bt" data-l="th">ไทย</button><button type="button" class="be" data-l="en">EN</button></div></header>
<section class="hero">
<canvas id="night" aria-label="A Lanna house at night with ghosts over the paddy"></canvas>
<div class="words"><h1>{pair(P["title_th"], P["title_en"])}<small>{pair(P["sub_th"], P["sub_en"])}</small></h1></div>
<div class="clock"><label><span>{pair(P["clock_th"], P["clock_en"])}</span><span class="t" id="hh"></span><input id="hour" type="range" min="0" max="23.99" step="0.05" aria-label="hour"></label><p class="who" id="who"></p></div>
</section>
<main>
<p class="intro">{pair(P["intro_th"], P["intro_en"])}</p>
<div class="filters">{filters}</div>
<div class="grid">
{cards}
</div>
<section class="close"><h2>{pair(P["close_title_th"], P["close_title_en"])}</h2><p>{pair(P["close_th"], P["close_en"])}</p>
<p class="src">{pair("ที่มา", "Sources")}: <a href="{E(SRC["khuet-book"]["url"])}">{E(SRC["khuet-book"]["title"])}</a> · <a href="{E(SRC["cmu-khuet"]["url"])}">{E(SRC["cmu-khuet"]["title"])}</a></p></section>
</main>
<footer class="foot">
<p class="links"><a href="https://motdang.net/ghost/">{pair("ทัวร์ผีเชียงใหม่ เดินเอง ๒๔ จุด", "Ghost Chiang Mai: a self-guided walk, 24 stops")}</a> · <a href="https://wichaa.net/">wichaa.net</a> · <a href="https://motdang.net/sites/">{pair("เว็บทั้งหมดของมดแดง", "all motdang.net sites")}</a> · <a href="https://nanobotco.github.io/">NaNoBotCo</a></p>
<p>{pair("รูปทุกรูปวาดด้วยโค้ดบนหน้านี้ เรื่องเล่าเขียนใหม่จากที่มาข้างล่าง ไม่ได้คัดลอก", "Every picture is drawn by code on this page. The stories are retold from the sources below, not copied.")}</p>
<ol>{srclist}</ol>
<p>{pair("ข้อความ CC BY 4.0 · โค้ด MIT", "Text CC BY 4.0 · code MIT")}</p>
</footer>
<script>window.GHOST_OUT={out_js};window.GHOST_OUTLABEL={{th:{json.dumps(P["out_th"], ensure_ascii=False)},en:{json.dumps(P["out_en"])}}};window.GHOST_DAY={{th:{json.dumps(P["day_th"], ensure_ascii=False)},en:{json.dumps(P["day_en"])}}};</script>
<script>{js}</script>
</body>
</html>
'''


def main():
    docs = ROOT / "docs"
    docs.mkdir(exist_ok=True)
    (docs / "index.html").write_text(build(f"https://nanobotco.github.io/{SLUG}/"))
    print("docs/index.html")
    if "--motdang" in sys.argv:
        md = ROOT.parent / "mot-dang"
        page = build(f"https://motdang.net/sites/{SLUG}/")
        for base in (md / "assets" / "sites" / SLUG, md / "docs" / "sites" / SLUG):
            base.mkdir(parents=True, exist_ok=True)
            (base / "index.html").write_text(page)
            for f in ("card.jpg", "icon.svg"):
                if (docs / f).exists():
                    shutil.copy2(docs / f, base / f)
            shutil.copy2(ROOT / "motdang-card.json", base / "card.json")
            print(base)


if __name__ == "__main__":
    main()
