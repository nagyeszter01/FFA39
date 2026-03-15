const express = require("express");
const router = express.Router();

const { sql, kapcsolodas } = require("../dbconfig");

// GET /api/tipusok
router.get("/tipusok", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();

        const eredmeny = await kapcsolat.request().query(`
            SELECT tipus_id, tipus_kod, tipus_nev
            FROM dbo.Tipusok
            ORDER BY tipus_nev
        `);

        valasz.json(eredmeny.recordset);
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Hiba történt a típusok lekérdezésekor.",
            hiba: hiba.message
        });
    }
});

// GET /api/fagylaltok
router.get("/fagylaltok", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();

        const nev = keres.query.nev || "";
        const tipus = keres.query.tipus || "";
        const elerheto = keres.query.elerheto || "";
        const rendezes = keres.query.rendezes || "";

        let lekerdezes = `
            SELECT
                dbo.Fagylaltok.fagylalt_id,
                dbo.Fagylaltok.nev,
                dbo.Fagylaltok.ar,
                dbo.Fagylaltok.leiras,
                dbo.Fagylaltok.elerheto,
                dbo.Fagylaltok.nepszerusegi_pont,
                dbo.Fagylaltok.letrehozva,
                dbo.Tipusok.tipus_id,
                dbo.Tipusok.tipus_kod,
                dbo.Tipusok.tipus_nev
            FROM dbo.Fagylaltok
            INNER JOIN dbo.Tipusok
                ON dbo.Fagylaltok.tipus_id = dbo.Tipusok.tipus_id
            WHERE 1 = 1
        `;

        const request = kapcsolat.request();

        if (nev !== "") {
            lekerdezes += ` AND dbo.Fagylaltok.nev LIKE @nev`;
            request.input("nev", sql.NVarChar, "%" + nev + "%");
        }

        if (tipus !== "") {
            lekerdezes += ` AND dbo.Tipusok.tipus_kod = @tipus`;
            request.input("tipus", sql.NVarChar, tipus);
        }

        if (elerheto === "elerheto") {
            lekerdezes += ` AND dbo.Fagylaltok.elerheto = 1`;
        }

        if (elerheto === "nemelerheto") {
            lekerdezes += ` AND dbo.Fagylaltok.elerheto = 0`;
        }

        if (rendezes === "nevnovekvo") {
            lekerdezes += ` ORDER BY dbo.Fagylaltok.nev ASC`;
        } else if (rendezes === "nevcsokkeno") {
            lekerdezes += ` ORDER BY dbo.Fagylaltok.nev DESC`;
        } else if (rendezes === "arnovekvo") {
            lekerdezes += ` ORDER BY dbo.Fagylaltok.ar ASC`;
        } else if (rendezes === "arcsokkeno") {
            lekerdezes += ` ORDER BY dbo.Fagylaltok.ar DESC`;
        } else {
            lekerdezes += ` ORDER BY dbo.Fagylaltok.fagylalt_id ASC`;
        }

        const eredmeny = await request.query(lekerdezes);

        valasz.json(eredmeny.recordset);
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Hiba történt a fagyik lekérdezésekor.",
            hiba: hiba.message
        });
    }
});

// POST /api/fagylaltok
router.post("/fagylaltok", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();

        const nev = keres.body.fagyiNev;
        const tipusKod = keres.body.fagyiTipus;
        const ar = Number(keres.body.fagyiAr);
        const leiras = keres.body.fagyiLeiras || "";
        const elerhetoseg = keres.body.fagyiElerheto;

        if (!nev || !tipusKod || !ar || !elerhetoseg) {
            return valasz.status(400).json({
                uzenet: "Hiányzó adat."
            });
        }

        const elerheto = elerhetoseg === "igen" ? 1 : 0;

        const tipusEredmeny = await kapcsolat.request()
            .input("tipusKod", sql.NVarChar, tipusKod)
            .query(`
                SELECT tipus_id
                FROM dbo.Tipusok
                WHERE tipus_kod = @tipusKod
            `);

        if (tipusEredmeny.recordset.length === 0) {
            return valasz.status(400).json({
                uzenet: "Nincs ilyen típus."
            });
        }

        const tipusId = tipusEredmeny.recordset[0].tipus_id;

        const beszuras = await kapcsolat.request()
            .input("nev", sql.NVarChar, nev)
            .input("tipusId", sql.Int, tipusId)
            .input("ar", sql.Int, ar)
            .input("leiras", sql.NVarChar, leiras)
            .input("elerheto", sql.Bit, elerheto)
            .query(`
                INSERT INTO dbo.Fagylaltok (nev, tipus_id, ar, leiras, elerheto, nepszerusegi_pont)
                OUTPUT INSERTED.fagylalt_id
                VALUES (@nev, @tipusId, @ar, @leiras, @elerheto, 0)
            `);

        valasz.status(201).json({
            uzenet: "Sikeres hozzáadás.",
            fagylalt_id: beszuras.recordset[0].fagylalt_id
        });
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Hiba történt a mentéskor.",
            hiba: hiba.message
        });
    }
});

// PUT /api/fagylaltok/:id
router.put("/fagylaltok/:id", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();
        const id = parseInt(keres.params.id);

        if (isNaN(id)) {
            return valasz.status(400).json({
                uzenet: "Érvénytelen azonosító."
            });
        }

        const nev = keres.body.fagyiNev;
        const tipusKod = keres.body.fagyiTipus;
        const ar = Number(keres.body.fagyiAr);
        const leiras = keres.body.fagyiLeiras || "";
        const elerhetoseg = keres.body.fagyiElerheto;

        if (!nev || !tipusKod || !ar || !elerhetoseg) {
            return valasz.status(400).json({
                uzenet: "Hiányzó adat."
            });
        }

        const elerheto = elerhetoseg === "igen" ? 1 : 0;

        const tipusEredmeny = await kapcsolat.request()
            .input("tipusKod", sql.NVarChar, tipusKod)
            .query(`
                SELECT tipus_id
                FROM dbo.Tipusok
                WHERE tipus_kod = @tipusKod
            `);

        if (tipusEredmeny.recordset.length === 0) {
            return valasz.status(400).json({
                uzenet: "Nincs ilyen típus."
            });
        }

        const tipusId = tipusEredmeny.recordset[0].tipus_id;

        const frissites = await kapcsolat.request()
            .input("id", sql.Int, id)
            .input("nev", sql.NVarChar, nev)
            .input("tipusId", sql.Int, tipusId)
            .input("ar", sql.Int, ar)
            .input("leiras", sql.NVarChar, leiras)
            .input("elerheto", sql.Bit, elerheto)
            .query(`
                UPDATE dbo.Fagylaltok
                SET
                    nev = @nev,
                    tipus_id = @tipusId,
                    ar = @ar,
                    leiras = @leiras,
                    elerheto = @elerheto
                WHERE fagylalt_id = @id
            `);

        if (frissites.rowsAffected[0] === 0) {
            return valasz.status(404).json({
                uzenet: "Nem található ilyen fagylalt."
            });
        }

        valasz.json({
            uzenet: "Sikeres módosítás."
        });
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Hiba történt a módosításkor.",
            hiba: hiba.message
        });
    }
});

// DELETE /api/fagylaltok/:id
router.delete("/fagylaltok/:id", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();
        const id = parseInt(keres.params.id);

        if (isNaN(id)) {
            return valasz.status(400).json({
                uzenet: "Érvénytelen azonosító."
            });
        }

        const torles = await kapcsolat.request()
            .input("id", sql.Int, id)
            .query(`
                DELETE FROM dbo.Fagylaltok
                WHERE fagylalt_id = @id
            `);

        if (torles.rowsAffected[0] === 0) {
            return valasz.status(404).json({
                uzenet: "Nem található ilyen fagylalt."
            });
        }

        valasz.json({
            uzenet: "Sikeres törlés."
        });
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Hiba történt a törlésnél.",
            hiba: hiba.message
        });
    }
});

// GET /api/tesztkapcsolat
router.get("/tesztkapcsolat", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();

        const eredmeny = await kapcsolat.request().query(`
            SELECT 
                @@SERVERNAME AS szerver,
                DB_NAME() AS adatbazis
        `);

        valasz.json(eredmeny.recordset[0]);
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Kapcsolati hiba.",
            hiba: hiba.message
        });
    }
});

// GET /api/statisztika/:tipus
router.get("/statisztika/:tipus", async function (keres, valasz) {
    try {
        const kapcsolat = await kapcsolodas();
        const tipus = keres.params.tipus;

        let lekerdezes = "";

        if (tipus === "legnepszerubb") {
            lekerdezes = `
                SELECT TOP 10
                    dbo.Fagylaltok.nev,
                    dbo.Tipusok.tipus_nev,
                    dbo.Fagylaltok.nepszerusegi_pont
                FROM dbo.Fagylaltok
                INNER JOIN dbo.Tipusok
                    ON dbo.Fagylaltok.tipus_id = dbo.Tipusok.tipus_id
                ORDER BY dbo.Fagylaltok.nepszerusegi_pont DESC, dbo.Fagylaltok.nev ASC
            `;
        } else if (tipus === "legdragabb") {
            lekerdezes = `
                SELECT TOP 10
                    dbo.Fagylaltok.nev,
                    dbo.Tipusok.tipus_nev,
                    dbo.Fagylaltok.ar
                FROM dbo.Fagylaltok
                INNER JOIN dbo.Tipusok
                    ON dbo.Fagylaltok.tipus_id = dbo.Tipusok.tipus_id
                ORDER BY dbo.Fagylaltok.ar DESC, dbo.Fagylaltok.nev ASC
            `;
        } else if (tipus === "elerheto") {
            lekerdezes = `
                SELECT
                    dbo.Fagylaltok.nev,
                    dbo.Tipusok.tipus_nev,
                    dbo.Fagylaltok.ar
                FROM dbo.Fagylaltok
                INNER JOIN dbo.Tipusok
                    ON dbo.Fagylaltok.tipus_id = dbo.Tipusok.tipus_id
                WHERE dbo.Fagylaltok.elerheto = 1
                ORDER BY dbo.Fagylaltok.nev ASC
            `;
        } else if (tipus === "tipusonkent") {
            lekerdezes = `
                SELECT
                    dbo.Tipusok.tipus_nev,
                    COUNT(dbo.Fagylaltok.fagylalt_id) AS darab
                FROM dbo.Tipusok
                LEFT JOIN dbo.Fagylaltok
                    ON dbo.Tipusok.tipus_id = dbo.Fagylaltok.tipus_id
                GROUP BY dbo.Tipusok.tipus_nev
                ORDER BY dbo.Tipusok.tipus_nev ASC
            `;
        } else {
            return valasz.status(400).json({
                uzenet: "Nincs ilyen statisztika."
            });
        }

        const eredmeny = await kapcsolat.request().query(lekerdezes);

        valasz.json(eredmeny.recordset);
    } catch (hiba) {
        valasz.status(500).json({
            uzenet: "Hiba történt a statisztika lekérdezésekor.",
            hiba: hiba.message
        });
    }
});

module.exports = router;
