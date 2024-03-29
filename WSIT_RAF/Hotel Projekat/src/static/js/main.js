$(document).ready(function() {
	setTimeout(function() {
		$('.obavestenje').fadeOut('slow');
	}, 2000);
});

$(document).ready(function () 
{
	var dt = new Date();
	var dan = dt.getDate();
	if(dan < 10) {
		dan = "0" + dan;
	}
	var mesec = dt.getMonth()+1;
	if(mesec < 10) {
		mesec = "0" + mesec;
	}
	var godina = dt.getFullYear();
	
	var datum_danas = godina + "-" + mesec + "-" + dan;
	document.querySelector(".prijava").value = datum_danas;
	document.querySelector(".odjava").valueAsDate = new Date(dt.valueOf() + 1000*3600*24);

	$(".datum").on("change", function() {
		this.setAttribute("min", datum_danas);
		this.setAttribute(
			"data-date",
			moment(this.value, "YYYY-MM-DD")
			.format( this.getAttribute("format-datuma") )
		)
	}).trigger("change")

    $("#registracija_wrap").click(function() { 
        $('#registracija_wrap').hide();
        $('#registracija').hide();
    });

    $(".registruj").click(function() {
        $('#registracija_wrap').show();
        $('#registracija').show();
	});
});

$(document).ready(function() {
	$(".mob_btn").click(function() { 
		$(".mob_nav").toggleClass('mob_class');
	});
	$(".mob_nav a").click(function() { 
		$(".mob_nav").toggleClass('mob_class');
	});
	$(".ime").click(function() { 
		$(".slika_korisnika").toggleClass('mob_class');
		$(".profil_info").toggleClass('mob_class');
	});
});

$(document).ready(function() 
{
	$('#TestDatum').on('submit', function(event) {
		var datum_prijave = document.querySelector(".prijava").value;
		var datum_odjave = document.querySelector(".odjava").value;
		var id = document.getElementById("osobe22").selectedIndex;
		var osobe = document.getElementsByTagName("option")[id].text;

		var danas = new Date();
		var danas_dan = danas.getDate();
		if(danas_dan < 10) {
			danas_dan = "0" + danas_dan;
		}
		var danas_mesec = danas.getMonth()+1;
		if(danas_mesec < 10) {
			danas_mesec = "0" + danas_mesec;
		}
		var danas_godina = danas.getFullYear();

		var danas_datum = danas_godina + "-" + danas_mesec + "-" + danas_dan;
		$('.obavestenje2').text("...").show();
		$.ajax({
			data : {
				danas : danas_datum,
				datum1 : datum_prijave,
				datum2 : datum_odjave,
				osobe : osobe
			}, 
			type : 'POST', 
			url : '/rezervisi'
		})
		.done(function(data) {
			if (data.error) {
				$('.obavestenje2').text(data.error);
			}
			else {
				$('.obavestenje2').text(data.poruka).show();
				$("#rezervacija_wrap").css('display', 'block');
				$('#broj_sobe').text(data.soba);
				$('#cena_sobe').text(data.cena);
				$('#rez_dani').text(data.dani);
				$('#total').text(data.total);
				$('#rezervisi').css('display', 'block');
			}
		});
		event.preventDefault();
	});
});

$(document).ready(function () {
	$("#rezervacija_wrap").click(function() { 
		$("#rezervacija_wrap").css('display', 'none');
		$('#rezervisi').css('display', 'none');
	});
});

$(document).ready(function() 
{
	$('#kontaktForm').on('submit', function(event) {
		var ip = $('#p_ime_prezime').val();
		var e = $('#p_email').val();
		var p = $('#p_poruka').val();
		$('#kontaktForm').css('display', 'none')
		$('.sending').css('display', 'block')
		$.ajax({
			data : {
				ime_prezime : ip,
				email : e,
				poruka : p
			},
			type : 'POST',
			url : '/kontakt'
		})
		.done(function(data) {
			if(data.error) {
				$('.sending').css('display', 'none')
				$('.error').css('display', 'block')
			}
			else {
				$('.sending').css('display', 'none')
				$('.success').css('display', 'block')
			}
		});
		event.preventDefault();
	});
});