/*
    =============================================================
    ==> Javascript zadatak:
    ==> Autor: Stefan Petrović
    ==> Godina: 2019/2020
    =============================================================
*/

// Lista od 10 zagonetki, niz se sastoji od zagonetki i resenja.
// Za realnu primenu odgovori treba da budu hash-ovani ili na neki drugi nacin sakriveni.
var zagonetka = [
    ["Svaki dan je puniš, a nikad nije puna!", "glava"],
    ["Njuškom rije, petama žile vadi.", "igla"],
    ["Zeva, a jezika nema!", "makaze"],
    ["Bije te, a ne vidiš ga. ", "vetar"],
    ["Bacim ga gore belo, bacim ga dole žuto.", "jaje"],
    ["Druge zove, sebe ne čuje.", "zvono"],
    ["Korice ima - nož nije, listove ima drvo nije.", "knjiga"],
    ["Niti misli, ni govori, samo ti se kaže.", "niti"],
    ["Od nje uzimaš, ona sve veća.", "rupa"],
    ["Ceo dan ide, a nikud ne odmiče.", "sat"]
];

var vreme_za_resavanje = 10;
var zag_reseno = false; // true = zagonetka je resena, false = zagonetka nije resena

// Promenjiva u_toku služi da korisnik ne moze da posalje poruku pre nego sto resi zagonetku
var u_toku = false; // true = odbrojavanje je u toku, false = nije u toku.

function provera() 
{
    // Prikuplja informacije iz input polja
    var ime = document.querySelector('[name="ime"]').value;
    var prezime = document.querySelector('[name="prezime"]').value;
    var indeks = document.querySelector('[name="indeks"]').value;
    var id = document.getElementById("godina").selectedIndex;
    var godina = document.getElementsByTagName("option")[id].text.slice(-2);
    var email = document.querySelector('[name="email"]').value;

    var email_ime = ime.charAt(0).toLowerCase();
    var email_prezime = prezime.toLowerCase();

    // Zahtevan format email adrese (npr: spetrovic1418@raf.edu.rs)
    var email_format = email_ime + email_prezime + indeks + godina + "@raf.edu.rs";
    if(email.toLowerCase() == email_format) {
        // poruka moze da se posalje
        return true;
    }
    else {
        // poruka ne moze da se posalje jer email nije odgovarajuci
        console.log(u_toku);
        if(u_toku == false) {
            // ako zagonetka nije u toku resavanja (tj, ne tece vreme) generise se nova.
            return zagonetkaa();
        }
        else {
            // sprecava slanje poruke u toku resavanja zagonetke
            return false;
        }
    }
}

function zagonetkaa() 
{
    // ukljucuje se brojac
    vreme();
    // Generise se zagonetka:
    var max = zagonetka.length; 
    var random = Math.floor(Math.random() * max);
    var pitanje = document.getElementById("pitanje");
    var odgovor = document.getElementById("odgovor");

    pitanje.innerHTML = zagonetka[random][0];
    odgovor.style.display = "block";
    odgovor.onkeyup = function() {
        if(this.value == zagonetka[random][1]) {
            document.getElementById("zagonetka").innerHTML = "Uspešno ste rešili zagonetku..";
            document.getElementById("datum_txt").style.display = "block";
            document.getElementById("dt").style.display = "block";
            document.getElementById("dt").required = true;
            zag_reseno = true;
            u_toku = false;
            return true;
        }
    }
    return false;
}

/* Rekurzivna funkcija koja odbrojava vreme */
var sekunda = vreme_za_resavanje;
function vreme() 
{
    if(zag_reseno == false) {
        // Ako zagonetka nije resena vreme tece
        u_toku = true;
        if(sekunda > 0) {
            sekunda = sekunda - 1;
            window.setTimeout("vreme()", 1000);
            document.getElementById("abrojac").innerHTML = "Vreme: <i>"  + sekunda + " sec.</i>";
        }
        else if(sekunda == 0) {
            // kada vreme istekne generise se nova zagonetka i vreme se resetuje.
            // (u zadatku nije napisano sta se desi kada vreme istekne)
            alert("Vreme je isteklo!");
            sekunda = vreme_za_resavanje;
            return zagonetkaa();
        }
    }
}

// funkcija vraca broj dana za februar
function prestupna(godina) 
{
    if (godina % 4 == 0)
    {
        if (godina % 100 == 0) {
            if (godina % 400 == 0) {
                return 29;
            }
            else {
                return 28;
            }
        }
        else {
            return 29;
        }
    }
    else {
        return 28;
    }
}

function dani() 
{
    var dani_u_mesecu = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var datum = document.getElementById('dt').value;

    var d = new Date(datum); // Datum uzet iz forme (min: 1.1.1)
    var dan = d.getDate();
    var mesec = d.getMonth()+1;
    var godina = d.getFullYear();

    if(isNaN(dan) || isNaN(mesec) || isNaN(godina)) {
        alert("Popuni sva polja za datum");
        return false;
    }

    var d2 = new Date(); // Trenutni datum
    var dan2 = d2.getDate();
    var mesec2 = d2.getMonth()+1;
    var godina2 = d2.getFullYear();

    var dani_ceo_mesec = 0; // Dani u celim mesecima 31 + 30...
    var preostali_dani = 0; // Dani u preosalim mesecima
    
    // Sprecava unos trenutne godine pa na dalje
    if(godina >= godina2) {
        alert("Unesite tačan datum rodjenja!");
        return false;
    }

    var godine; // Ukupan broj godina
    var brojMeseci; // Ukupan broj meseci (za konzolu / testiranje)

    /*
        Ako je trenutni mesec u kalendaru posle unetog:
        ==> brojMeseci = trenutni mesec - uneti mesec.
    */
    if(mesec2 >= mesec) {
        brojMeseci = 0;
        godine = godina2 - godina;

        if(mesec == mesec2 && dan >= dan2) {
            godine -= 1;
        }

        // Prebrojava dane u tim mesecima i dopunjava promenjivu: dani_ceo_mesec
        for(let i = mesec + 1; i < mesec2; i++) 
        {
            /* Poziva funciju i u niz upisuje broj dana za februar 
            u zavisnositi da li je godina prestupna ili ne */
            dani_u_mesecu[1] = prestupna(godina2);
            brojMeseci++;
            // Sabira dane u mesecu
            dani_ceo_mesec += dani_u_mesecu[i - 1];
        }
    }
    /*
        Ako je trenutni mesec u kalendaru pre unetog:
        ==> racunaju se celi meseci iz unete godine do sledece godine == 12 - broj unetih meseci - 1
        ==> zatim se dodaju meseci iz trenutne godine
        ==> brojMeseci = (12 - uneti mesec) - 1 + trenutni mesec;
    */
    else 
    {
        brojMeseci = 0;
        godine = godina2 - godina - 1; // racunaju se cele godine

        // Racuna broj dana / meseci koji su preostali u unetoj godini ako ih ima
        for(let m = mesec + 2; m < 12; m++) {
            dani_u_mesecu[1] = prestupna(godina);
            brojMeseci++;
            dani_ceo_mesec += dani_u_mesecu[m - 1];
        }

        // Racuna broj dana / meseci u trenutnoj godini ako ih ima
        for(let m2 = 1; m2 < mesec2; m2++) {
            dani_u_mesecu[1] = prestupna(godina2);
            brojMeseci++;
            dani_ceo_mesec += dani_u_mesecu[m2 - 1];
        }
    }

    // Nakon sto su izracunati dani u celim mesecima, racunaju se preostali dani
    preostali_dani = dani_u_mesecu[mesec - 1] - dan + dan2;
    // Ako je uneti jednak trenutnom mesecu taj mesec se oduzima jer nije ceo
    if(mesec == mesec2) {
        preostali_dani -= dani_u_mesecu[mesec - 1];
    }
    // Ako je broj preostalih dana veci od maksimalnog broja dana u tom mesecu onda prelaze u sledeci:
    if(preostali_dani >= dani_u_mesecu[mesec - 1]) {
        brojMeseci++;
        dani_ceo_mesec += dani_u_mesecu[mesec - 1];
        preostali_dani -= dani_u_mesecu[mesec - 1];
    }
    /* 
        Preostali dani su manji od nule kada su oba datuma u poslednjem mesecu 
        a uneti dan je veci od trenutnog 
    */
    else if(preostali_dani < 0) {
        //console.log("manje od nule..");
        brojMeseci = 11;
        dani_u_mesecu[1] = prestupna(godina2);
        // racunanje dana u tih 11 meseci koristeci trenutnu godinu
        for(let i = 0; i < brojMeseci; i++) {
            dani_ceo_mesec += dani_u_mesecu[i];
        }
        // sabira taj minus sa poslednjim mesecom
        preostali_dani = dani_u_mesecu[11] + preostali_dani;
    }

    // Da bi se dobio ukupan broj dana sabiraju se dani iz celih meseci sa preostalim danima.
    var sviDani = dani_ceo_mesec + preostali_dani;
    // Prikazuju se i popunjavaju kvadrati sa brojem godina i brojem dana (onfocusout).
    document.getElementById("kvadrati").style.display = "block";
    document.getElementById("broj_godina").innerHTML = godine;
    document.getElementById("broj_dana").innerHTML = sviDani;
    
    // Klikom na broj dana se generise novi prozor
    document.getElementById("broj_dana").addEventListener('click', function() {
        var sviDani_d = sviDani; // kopira ukupan broj dana
        var mesec_d = 1; // redni broj meseca, 1 = Januar...
        dani_u_mesecu[1] = prestupna(godina2);

        // Pretvara dane u mesece
        for(let i = 0; i < 12; i++) {
            if(sviDani_d > dani_u_mesecu[i]) {
                sviDani_d -= dani_u_mesecu[i];
                mesec_d++;
            }
        }
        // Format datuma Dan.Mesec.Godina
        var n_datum = sviDani_d + "." + mesec_d + "." + godina2;
        var win = window.open("", '_blank');
        // Otvara prazan prozor i u njemu upisuje vrednost datuma
        win.document.write(n_datum);
    });

    console.log("================================");
    console.log("G:" + godine + " M:" + brojMeseci + "(" + dani_ceo_mesec + ") D:" + preostali_dani);
    console.log("Datum 1: " + dan + "." + mesec + "." + godina);
    console.log("Datum 2: " + dan2 + "." + mesec2 + "." + godina2);
}