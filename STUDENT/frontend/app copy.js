const API_URL = "http://localhost:4000/api";

// ── DOM elemek ─────────────────────────────────────────────────────────────────

const fagyiKartyaTarolo    = document.getElementById("fagyiKartyaTarolo");
const fagyiLekerdezoGomb   = document.getElementById("fagyiLekerdezoGomb");
const fagyiNevKereso       = document.getElementById("fagyiNevKereso");
const tipusSzuro           = document.getElementById("tipusSzuro");
const elerhetosegSzuro     = document.getElementById("elerhetosegSzuro");
const rendezesValaszto     = document.getElementById("rendezesValaszto");
const fagyiMuveletUzenet   = document.getElementById("fagyiMuveletUzenet");

const statisztikaValaszto  = document.getElementById("statisztikaValaszto");
const statisztikaFejlecSor = document.getElementById("statisztikaFejlecSor");
const statisztikaTorzs     = document.getElementById("statisztikaTorzs");
const statisztikaUzenet    = document.getElementById("statisztikaUzenet");

const fagyiUrlap           = document.getElementById("fagyiUrlap");
const uzenet               = document.getElementById("uzenet");

// Bootstrap modal példányok — modalokLetrehozasa() tölti fel
let szerkesztesModalPeldany  = null;
let torlesModalPeldany       = null;
let visszajelzesModalPeldany = null;

// Törléshez tárolt ID
let torlesAlattiId = null;


// ── Modalok dinamikus létrehozása ──────────────────────────────────────────────

function modalokLetrehozasa() {
    const tarolo = document.getElementById("modalTarolo");
    if (!tarolo) return;

    tarolo.innerHTML = `

        <div class="modal fade" id="szerkesztesModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Fagylalt szerkesztése</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="szerkesztesUrlap">
                        <div class="modal-body">
                            <input type="hidden" id="szerkesztesId">
                            <div class="mb-3">
                                <label class="form-label">Név</label>
                                <input type="text" class="form-control" id="szerkesztesNev" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Típus</label>
                                <select class="form-select" id="szerkestesTipus" required></select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Ár (Ft)</label>
                                <input type="number" class="form-control" id="szerkesztesAr" min="1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Leírás</label>
                                <textarea class="form-control" id="szerkesztesLeiras" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Elérhető</label>
                                <select class="form-select" id="szerkesztesElerheto" required>
                                    <option value="igen">Igen</option>
                                    <option value="nem">Nem</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                            <button type="submit" class="btn btn-primary">Mentés</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="torlesModal" tabindex="-1">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Törlés megerősítése</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Biztosan törlöd: <strong id="torlesNev"></strong>?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                        <button type="button" class="btn btn-danger" id="torlesMegerosites">Törlés</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="visszajelzesModal" tabindex="-1">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="visszajelzesCim"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p id="visszajelzesUzenet" class="mb-0 fw-semibold text-center"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>

    `;

    szerkesztesModalPeldany  = new bootstrap.Modal(document.getElementById("szerkesztesModal"));
    torlesModalPeldany       = new bootstrap.Modal(document.getElementById("torlesModal"));
    visszajelzesModalPeldany = new bootstrap.Modal(document.getElementById("visszajelzesModal"));

    document.getElementById("szerkesztesUrlap").addEventListener("submit", function (e) {
        e.preventDefault();

        const id   = document.getElementById("szerkesztesId").value;
        const adat = {
            fagyiNev:      document.getElementById("szerkesztesNev").value,
            fagyiTipus:    document.getElementById("szerkestesTipus").value,
            fagyiAr:       document.getElementById("szerkesztesAr").value,
            fagyiLeiras:   document.getElementById("szerkesztesLeiras").value,
            fagyiElerheto: document.getElementById("szerkesztesElerheto").value
        };

        fetch(API_URL + "/fagylaltok/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adat)
        })
            .then(r => r.json())
            .then(valasz => {
                szerkesztesModalPeldany.hide();
                uzenetMutat("Sikeres módosítás", valasz.uzenet, "siker");
                fagyikLekerdezese();
            })
            .catch(() => uzenetMutat("Hiba", "Hiba történt a módosítás során.", "hiba"));
    });

    document.getElementById("torlesMegerosites").addEventListener("click", function () {
        if (!torlesAlattiId) return;

        fetch(API_URL + "/fagylaltok/" + torlesAlattiId, { method: "DELETE" })
            .then(r => r.json())
            .then(valasz => {
                torlesModalPeldany.hide();
                torlesAlattiId = null;
                uzenetMutat("Sikeres törlés", valasz.uzenet, "siker");
                fagyikLekerdezese();
            })
            .catch(() => {
                torlesModalPeldany.hide();
                uzenetMutat("Hiba", "Hiba történt a törlés során.", "hiba");
            });
    });
}


// ── Visszajelzés modal ────────────────────────────────────────────────────────

function uzenetMutat(cim, szoveg, tipus) {
    const cimElem    = document.getElementById("visszajelzesCim");
    const szovegElem = document.getElementById("visszajelzesUzenet");
    if (!visszajelzesModalPeldany || !cimElem || !szovegElem) return;

    cimElem.textContent  = cim;
    szovegElem.textContent = szoveg;
    szovegElem.className = "mb-0 fw-semibold text-center " + (tipus === "hiba" ? "text-danger" : "text-success");

    visszajelzesModalPeldany.show();
}


// ── Típusok betöltése ─────────────────────────────────────────────────────────

function tipusokBetoltese(selectId) {
    const selectElem = document.getElementById(selectId);
    if (!selectElem) return;

    fetch(API_URL + "/tipusok")
        .then(r => r.json())
        .then(adatok => {
            adatok.forEach(t => {
                const opcio       = document.createElement("option");
                opcio.value       = t.tipus_kod;
                opcio.textContent = t.tipus_nev;
                selectElem.appendChild(opcio);
            });
        })
        .catch(() => {
            if (fagyiMuveletUzenet) {
                fagyiMuveletUzenet.textContent = "Nem sikerült betölteni a típusokat.";
                fagyiMuveletUzenet.className   = "text-danger text-center mb-4";
            }
        });
}


// ── Fagylalt kártya ───────────────────────────────────────────────────────────

function fagyiKartyaKeszites(fagyi) {
    const oszlop = document.createElement("div");
    oszlop.className = "col-12 col-md-6 col-xl-4";
    oszlop.innerHTML = `
        <div class="card shadow-sm h-100">
            <div class="card-body">
                <h5 class="card-title fw-bold">${fagyi.nev}</h5>
                <p class="mb-2"><strong>Típus:</strong> ${fagyi.tipus_nev}</p>
                <p class="mb-2"><strong>Ár:</strong> ${fagyi.ar} Ft</p>
                <p class="mb-2">${fagyi.leiras || "Nincs leírás."}</p>
                <p class="mb-1">
                    <strong>Elérhetőség:</strong>
                    ${fagyi.elerheto ? "Elérhető" : "Nem elérhető"}
                </p>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-sm btn-outline-primary"
                        data-id="${fagyi.fagylalt_id}"
                        data-nev="${fagyi.nev}"
                        data-ar="${fagyi.ar}"
                        data-leiras="${fagyi.leiras || ""}"
                        data-elerheto="${fagyi.elerheto}"
                        data-tipuskod="${fagyi.tipus_kod}"
                        onclick="szerkesztesModalMegnyit(this)">
                        Szerkesztés
                    </button>
                    <button class="btn btn-sm btn-outline-danger"
                        data-id="${fagyi.fagylalt_id}"
                        data-nev="${fagyi.nev}"
                        onclick="torlesModalMegnyit(this)">
                        Törlés
                    </button>
                </div>
            </div>
        </div>
    `;
    return oszlop;
}


// ── Fagylaltok megjelenítése ──────────────────────────────────────────────────

function fagyikMegjelenitese(fagylaltok) {
    if (!fagyiKartyaTarolo) return;

    fagyiKartyaTarolo.innerHTML = "";

    if (fagylaltok.length === 0) {
        fagyiKartyaTarolo.innerHTML = `<p class="text-center text-muted">Nincs megjeleníthető fagylalt.</p>`;
        return;
    }

    fagylaltok.forEach(f => fagyiKartyaTarolo.appendChild(fagyiKartyaKeszites(f)));
}


// ── Fagylaltok lekérdezése ────────────────────────────────────────────────────

function fagyikLekerdezese() {
    if (!fagyiKartyaTarolo) return;

    fagyiMuveletUzenet.textContent = "Betöltés...";
    fagyiMuveletUzenet.className   = "text-muted text-center mb-4";

    const parameterek = new URLSearchParams({
        nev:      fagyiNevKereso.value,
        tipus:    tipusSzuro.value,
        elerheto: elerhetosegSzuro.value,
        rendezes: rendezesValaszto.value
    });

    fetch(API_URL + "/fagylaltok?" + parameterek.toString())
        .then(r => r.json())
        .then(adatok => {
            fagyikMegjelenitese(adatok);
            fagyiMuveletUzenet.textContent = "A lekérdezés sikeres.";
            fagyiMuveletUzenet.className   = "text-success text-center mb-4";
        })
        .catch(() => {
            fagyiMuveletUzenet.textContent = "Hiba történt a lekérdezés közben.";
            fagyiMuveletUzenet.className   = "text-danger text-center mb-4";
        });
}


// ── Szerkesztés modal megnyitása ──────────────────────────────────────────────

function szerkesztesModalMegnyit(gomb) {
    if (!szerkesztesModalPeldany) return;

    document.getElementById("szerkesztesId").value       = gomb.dataset.id;
    document.getElementById("szerkesztesNev").value      = gomb.dataset.nev;
    document.getElementById("szerkesztesAr").value       = gomb.dataset.ar;
    document.getElementById("szerkesztesLeiras").value   = gomb.dataset.leiras;
    document.getElementById("szerkesztesElerheto").value = gomb.dataset.elerheto === "1" ? "igen" : "nem";

    const tipusSelect = document.getElementById("szerkestesTipus");
    tipusSelect.innerHTML = "";

    fetch(API_URL + "/tipusok")
        .then(r => r.json())
        .then(tipusok => {
            tipusok.forEach(t => {
                const opcio       = document.createElement("option");
                opcio.value       = t.tipus_kod;
                opcio.textContent = t.tipus_nev;
                if (t.tipus_kod === gomb.dataset.tipuskod) opcio.selected = true;
                tipusSelect.appendChild(opcio);
            });
            szerkesztesModalPeldany.show();
        });
}


// ── Törlés modal megnyitása ───────────────────────────────────────────────────

function torlesModalMegnyit(gomb) {
    if (!torlesModalPeldany) return;

    torlesAlattiId = gomb.dataset.id;
    document.getElementById("torlesNev").textContent = gomb.dataset.nev;
    torlesModalPeldany.show();
}


// ── Statisztika ───────────────────────────────────────────────────────────────

const statisztikaBeallitasok = {
    legnepszerubb: {
        fejlecek: ["Név", "Típus", "Népszerűségi pont"],
        mezok: ["nev", "tipus_nev", "nepszerusegi_pont"]
    },
    legdragabb: {
        fejlecek: ["Név", "Típus", "Ár"],
        mezok: ["nev", "tipus_nev", "ar"],
        formaz: { ar: v => v + " Ft" }
    },
    elerheto: {
        fejlecek: ["Név", "Típus", "Ár"],
        mezok: ["nev", "tipus_nev", "ar"],
        formaz: { ar: v => v + " Ft" }
    },
    tipusonkent: {
        fejlecek: ["Típus", "Darab"],
        mezok: ["tipus_nev", "darab"]
    }
};

function statisztikaTablazatMegjelenitese(adatok, tipus) {
    statisztikaFejlecSor.innerHTML = "";
    statisztikaTorzs.innerHTML     = "";

    if (adatok.length === 0) {
        statisztikaUzenet.textContent = "Nincs megjeleníthető adat.";
        return;
    }

    const beallitas = statisztikaBeallitasok[tipus];

    statisztikaFejlecSor.innerHTML = beallitas.fejlecek
        .map(f => `<th>${f}</th>`)
        .join("");

    adatok.forEach(sor => {
        const tr = document.createElement("tr");
        tr.innerHTML = beallitas.mezok
            .map(mezo => {
                const ertek = beallitas.formaz?.[mezo]
                    ? beallitas.formaz[mezo](sor[mezo])
                    : sor[mezo];
                return `<td>${ertek}</td>`;
            })
            .join("");
        statisztikaTorzs.appendChild(tr);
    });

    statisztikaUzenet.textContent = "A statisztika sikeresen betöltve.";
}

function statisztikaLekerdezese() {
    if (!statisztikaValaszto) return;

    const valasztott = statisztikaValaszto.value;
    statisztikaFejlecSor.innerHTML = "";
    statisztikaTorzs.innerHTML     = "";

    if (!valasztott) {
        statisztikaUzenet.textContent = "";
        return;
    }

    statisztikaUzenet.textContent = "Betöltés...";

    fetch(API_URL + "/statisztika/" + valasztott)
        .then(r => r.json())
        .then(adatok => statisztikaTablazatMegjelenitese(adatok, valasztott))
        .catch(() => {
            statisztikaUzenet.textContent = "Hiba történt a statisztika lekérdezésekor.";
        });
}


// ── Új fagyi mentése (POST) ───────────────────────────────────────────────────

function ujFagyiMentese(esemeny) {
    esemeny.preventDefault();

    const adat = {
        fagyiNev:      document.getElementById("fagyiNev").value,
        fagyiTipus:    document.getElementById("fagyiTipus").value,
        fagyiAr:       document.getElementById("fagyiAr").value,
        fagyiLeiras:   document.getElementById("fagyiLeiras").value,
        fagyiElerheto: document.getElementById("fagyiElerheto").value
    };

    fetch(API_URL + "/fagylaltok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adat)
    })
        .then(r => r.json())
        .then(valasz => {
            uzenet.textContent = valasz.uzenet;
            uzenet.className   = "mt-4 text-center text-success fw-semibold";
            fagyiUrlap.reset();
        })
        .catch(() => {
            uzenet.textContent = "Hiba történt a mentés során.";
            uzenet.className   = "mt-4 text-center text-danger fw-semibold";
        });
}


// ── Indítás ───────────────────────────────────────────────────────────────────

modalokLetrehozasa();

if (fagyiLekerdezoGomb) {
    tipusokBetoltese("tipusSzuro");
    fagyiLekerdezoGomb.addEventListener("click", fagyikLekerdezese);
}

if (statisztikaValaszto) {
    statisztikaValaszto.addEventListener("change", statisztikaLekerdezese);
}

if (fagyiUrlap) {
    tipusokBetoltese("fagyiTipus");
    fagyiUrlap.addEventListener("submit", ujFagyiMentese);
}
