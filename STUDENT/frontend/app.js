const API_URL = // PORT: 4000, ENDPOINT: /api;;

// ── DOM elemek ────────────────────────────────────────────────────────────────

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

let torlesAlattiId = null;

// ── Modal segéd ───────────────────────────────────────────────────────────────

function modalShow(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show();
}

function modalHide(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();
}

// ── Visszajelzés ──────────────────────────────────────────────────────────────

function uzenetMutat(cim, szoveg, tipus) {

}

// ── Típusok betöltése ─────────────────────────────────────────────────────────

function tipusokBetoltese(selectId) {

}

// ── Fagylalt kártya ───────────────────────────────────────────────────────────

function fagyiKartyaKeszites(fagyi) {

}

// ── Fagylaltok lekérdezése ────────────────────────────────────────────────────

function fagyikLekerdezese() {

}

// ── Szerkesztés modal ─────────────────────────────────────────────────────────

function szerkesztesModalMegnyit(gomb) {

}

document.getElementById("szerkesztesUrlap").addEventListener("submit", function(e) {
    e.preventDefault();

});

// ── Törlés modal ──────────────────────────────────────────────────────────────

function torlesModalMegnyit(gomb) {

}

document.getElementById("torlesMegerosites").addEventListener("click", function() {

});

// ── Statisztika ───────────────────────────────────────────────────────────────

const statisztikaBeallitasok = {

};

function statisztikaLekerdezese() {

}

// ── Új fagyi mentése ──────────────────────────────────────────────────────────

function ujFagyiMentese(e) {
    e.preventDefault();

}

// ── Indítás ───────────────────────────────────────────────────────────────────

if (fagyiLekerdezoGomb) {
    tipusokBetoltese("tipusSzuro");
    fagyiLekerdezoGomb.addEventListener("click", fagyikLekerdezese);
}

statisztikaValaszto.addEventListener("change", statisztikaLekerdezese);

if (fagyiUrlap) {
    tipusokBetoltese("fagyiTipus");
    fagyiUrlap.addEventListener("submit", ujFagyiMentese);
}
