-- ============================================
-- Fagyizó Nyilvántartó Rendszer - DML
-- MSSQL
-- Legalább 50 termék
-- ============================================

USE FagyizoDB;
GO

INSERT INTO dbo.Tipusok (tipus_kod, tipus_nev)
VALUES
(N'gyumolcsos', N'Gyümölcsös'),
(N'csokis', N'Csokis'),
(N'tejes', N'Tejes'),
(N'kulonleges', N'Különleges');
GO

INSERT INTO dbo.Fagylaltok (nev, tipus_id, ar, leiras, elerheto, nepszerusegi_pont)
VALUES
-- GYÜMÖLCSÖS
(N'Eper',               1, 650, N'Friss, enyhén savanykás eperfagylalt.', 1, 92),
(N'Málna',              1, 680, N'Intenzív málnás íz, könnyed állaggal.', 1, 88),
(N'Citrom',             1, 620, N'Hűsítő citromfagylalt nyári napokra.', 1, 95),
(N'Mangó',              1, 720, N'Krémes és egzotikus mangófagylalt.', 1, 84),
(N'Áfonya',             1, 700, N'Gazdag áfonyás íz természetes aromával.', 1, 79),
(N'Meggy',              1, 660, N'Kellemesen fanyar meggyfagylalt.', 1, 81),
(N'Narancs',            1, 640, N'Üde narancsízű fagylalt.', 0, 60),
(N'Ananász',            1, 710, N'Trópusi hangulatú ananászos fagylalt.', 1, 68),
(N'Őszibarack',         1, 690, N'Lágy, gyümölcsös őszibarackíz.', 1, 73),
(N'Görögdinnye',        1, 630, N'Könnyű, frissítő görögdinnyés fagylalt.', 1, 77),
(N'Feketeribizli',      1, 700, N'Erőteljes feketeribizli íz.', 0, 55),
(N'Lime',               1, 650, N'Savanykás limefagylalt.', 1, 71),
(N'Kókusz-ananász',     1, 740, N'Gyümölcsös-trópusi kombináció.', 1, 67),

-- CSOKIS
(N'Csokoládé',          2, 690, N'Klasszikus étcsokoládé fagylalt.', 1, 98),
(N'Duplacsoki',         2, 760, N'Extra csokoládédarabokkal készült.', 1, 93),
(N'Fehér csoki',        2, 730, N'Selymes fehér csokoládés fagylalt.', 1, 75),
(N'Csoki-mogyoró',      2, 780, N'Csokoládé és mogyoró gazdag párosítása.', 1, 91),
(N'Csoki-narancs',      2, 770, N'Narancshéjjal bolondított csokifagyi.', 1, 69),
(N'Brownie',            2, 820, N'Brownie darabokkal készült csokifagyi.', 1, 89),
(N'Nutellás',           2, 850, N'Mogyorókrémes, desszert jellegű fagylalt.', 1, 96),
(N'Csoki-chili',        2, 790, N'Enyhén pikáns különlegesség.', 0, 48),
(N'Kakaó',              2, 670, N'Könnyedebb kakaós fagylalt.', 1, 63),
(N'Csokis keksz',       2, 810, N'Apró kekszdarabokkal gazdagítva.', 1, 86),
(N'Triplacsoki',        2, 890, N'Ét-, tej- és fehércsoki együtt.', 1, 90),
(N'Csoki-karamell',     2, 830, N'Csokoládé sós karamell rétegekkel.', 1, 87),
(N'Csoki-banán',        2, 760, N'Csokoládé és banán harmonikus íze.', 1, 74),

-- TEJES
(N'Vanília',            3, 650, N'Klasszikus bourbon vaníliás fagylalt.', 1, 97),
(N'Tejkaramella',       3, 720, N'Lágy karamellás-tejes fagylalt.', 1, 80),
(N'Puncs',              3, 700, N'Hagyományos puncsízű fagylalt.', 1, 82),
(N'Dió',                3, 760, N'Pirított dióval készített krémes fagylalt.', 1, 85),
(N'Mogyoró',            3, 750, N'Gazdag mogyoróízű tejes fagylalt.', 1, 83),
(N'Pisztácia',          3, 890, N'Prémium pisztáciás fagylalt.', 1, 94),
(N'Joghurt',            3, 680, N'Könnyed, enyhén savanykás joghurtfagyi.', 1, 72),
(N'Stracciatella',      3, 780, N'Vaníliás alap csokoládéforgáccsal.', 1, 88),
(N'Tejberizs',          3, 740, N'Fahéjas-tejes desszertfagylalt.', 0, 58),
(N'Túrórudi',           3, 820, N'Túró, csoki és enyhe citromíz.', 1, 92),
(N'Madártej',           3, 790, N'Hagyományos desszert ihlette fagylalt.', 1, 84),
(N'Tejcsoki',           3, 730, N'Lágy tejcsokoládés, krémes állag.', 1, 78),

-- KÜLÖNLEGES
(N'Sós karamell',       4, 840, N'Édeskés és enyhén sós karamellfagylalt.', 1, 95),
(N'Levandula',          4, 860, N'Illatos, virágos különlegesség.', 0, 44),
(N'Sajttorta',          4, 880, N'Krémes sajttortás desszertfagylalt.', 1, 87),
(N'Tiramisu',           4, 890, N'Kávés-kakaós olasz ihletésű fagylalt.', 1, 90),
(N'Mákos guba',         4, 850, N'Hagyományos magyar desszert ízvilág.', 1, 70),
(N'Rákóczi túrós',      4, 900, N'Barackos-túrós desszertfagylalt.', 1, 66),
(N'Kávé',               4, 760, N'Erőteljes presszókávé íz.', 1, 81),
(N'Red velvet',         4, 920, N'Sütemény ihlette vörös bársony fagylalt.', 1, 62),
(N'Zöld tea',           4, 870, N'Matcha jellegű teás különlegesség.', 0, 40),
(N'Fahéjas alma',       4, 800, N'Almás pite hangulatú fagylalt.', 1, 76),
(N'Mézeskalács',        4, 830, N'Fűszeres, ünnepi hangulatú íz.', 1, 64),
(N'Kekszvaj',           4, 910, N'Krémes, kekszes, telt ízvilág.', 1, 85);
GO