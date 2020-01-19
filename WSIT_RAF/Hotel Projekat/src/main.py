from flask import Flask, render_template, flash, redirect, url_for, request, session, jsonify
from forme import registracijaForm, loginForm, admin_loginForm, rezervacijaForm, dodajSobu, updateProfil
from pymongo import MongoClient
from flask_mail import Mail
from flask_uploads import UploadSet, IMAGES, configure_uploads
from datetime import datetime
from bson import ObjectId
import hashlib
import time
import datetime
import string
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pSkJHDRJNMNv9X9Fb83KXJf8u8'
app.config['UPLOADED_PHOTOS_DEST'] = 'src'
app.config['UPLOAD_FOLDER'] = 'static'

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)

db = MongoClient("mongodb+srv://admin:admin@cluster0-zmarb.mongodb.net/test?retryWrites=true&w=majority").get_database("hotel")
users = db["users"]
admins = db["admin"]
rezervacije = db["rezervacije"]
sobe = db["sobe"]

@app.route('/', methods=['POST', 'GET'])
def index():
	form = registracijaForm()
	login = loginForm()
	rezervacija = rezervacijaForm()

	if form.validate_on_submit():
		postojeci_korisnik = users.find_one({"korisnicko_ime": form.username.data})
		if postojeci_korisnik is not None:
			flash(f'Korisnicko ime \"{form.username.data}\" je zauzeto', 'danger')
		else:
			if form.slika.data is None:
				putanja = "/static/img/korisnici/default.png"
			else:
				ime_rnd = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
				photos.save(form.slika.data, 'static/img/korisnici', form.username.data + '_' + ime_rnd + '.jpg')
				putanja = "/static/img/korisnici/" + form.username.data + '_' + ime_rnd + ".jpg"

			hash_pw = hashlib.sha256(form.password.data.encode())
			password_hashed = hash_pw.hexdigest()
			korisnik = {
				"korisnicko_ime":form.username.data,
				"ime_prezime":form.ime_prezime.data,
				"email":form.email.data,
				"godina_rodjenja":form.godina_rodjenja.data,
				"password":password_hashed,
				"telefon":form.telefon.data,
				"slika":putanja,
				"registrovan":time.strftime("%d.%m.%Y %H:%M")
			}
			users.insert_one(korisnik)
			flash(f'{form.username.data} Uspešno ste se registrovali!')
			return redirect(url_for('index'))


	return render_template('index.html', login=login, form=form, rezervacija=rezervacija)

@app.route('/login', methods=['POST'])
def login():
	login = loginForm()
	if '_id' in session:
		flash(f"Već ste ulogovani kao: {session['usr']}");
		return redirect(url_for('index'))

	hash_pw = hashlib.sha256(login.password.data.encode())
	password_hashed = hash_pw.hexdigest()
	korisnik = users.find_one({'korisnicko_ime':login.username.data, 'password':password_hashed})

	if korisnik is None:
		flash('Neuspešan login. Pogrešan username ili password')
	else:
		session['_id'] = str(korisnik['_id'])
		session['usr'] = korisnik['korisnicko_ime']
		session['slika'] = korisnik['slika']
		if 'rezervisao' in session:
			session.pop('rezervisao', None)
		flash('Uspešno ste se ulogovali!', 'success')
	return redirect(url_for('index'))

@app.route('/logout')
def logout():
	if "_id" in session:
		session.pop('_id', None)
		session.pop('usr', None)
		session.pop('slika', None)
		flash("Uspešno ste se odjavili sa profila!")
		return redirect(url_for('index'))
	else: 
		flash("Niste ulogovani!")
		return redirect(url_for('index'))

@app.route('/admin', methods=['POST', 'GET'])
def admin():
	if 'admin_id' in session:
		return redirect(url_for('admin_panel'))

	admin_forma = admin_loginForm();

	if admin_forma.validate_on_submit():
		hash_pw = hashlib.sha256(admin_forma.password.data.encode())
		password_hashed = hash_pw.hexdigest()
		admin = admins.find_one({'ime_admina':admin_forma.username.data, 'lozinka_admina':password_hashed})
		
		if admin is None:
			flash('Neuspešan login. Pogrešan username ili password!')
		else:
			session['admin_id'] = str(admin['_id'])
			session['admin_ime'] = admin['ime_admina']
			flash('Uspešno ste se ulogovali!', 'success')
			return redirect(url_for('admin_panel'))

	return render_template("admin_login.html", admin=admin_forma)

@app.route('/admin/logout')
def admin_logout():
	if "admin_id" in session:
		session.pop('admin_id', None)
		session.pop('admin_ime', None)
		flash("Uspešno ste se odjavili sa admin panela!")
		return redirect(url_for('admin'))
	else: 
		flash("Niste ulogovani kao admin!")
		return redirect(url_for('admin'))

@app.route('/admin/panel', methods=['POST', 'GET'])
def admin_panel():
	soba = dodajSobu();
	if "admin_id" not in session:
		flash("Morate biti ulogovani kao admin!")
		return redirect(url_for('admin'))
		
	k = list(users.find()) #svi korisnici
	a = list(admins.find()) #svi admini
	r = list(rezervacije.find()) #sve rezervacije
	s = list(sobe.find()) #sve sobe

	if soba.validate_on_submit():
		sb = sobe.find_one({"broj_sobe":soba.broj_sobe.data})
		if sb is not None: 
			flash("Broj sobe već postoji")
			return redirect(url_for('admin'))
		s = {
			"broj_sobe":str(soba.broj_sobe.data),
			"broj_kreveta":str(soba.broj_kreveta.data),
			"cena_nocenja":soba.cena_nocenja.data
		}
		sobe.insert_one(s)
		flash("Uspešno ste dodali sobu")
		return redirect(url_for('admin'))

	return render_template('admin_panel.html', k=k, a=a, r=r, s=s, soba=soba)

@app.route('/rezervisi', methods=['POST'])
def rezervisi():
	danas = request.form["danas"]
	datum1 = request.form["datum1"]
	datum2 = request.form["datum2"]
	osobe = request.form["osobe"]
	
	danas_date = time.strptime(danas, "%Y-%m-%d")
	datum1_date = time.strptime(datum1, "%Y-%m-%d")
	datum2_date = time.strptime(datum2, "%Y-%m-%d")

	if datum2_date <= datum1_date:
		return jsonify({'error' : 'Datum odjave mora biti veci od datuma prijave' })

	if datum1 and datum2 and osobe:
		lista_soba = sobe.find({"broj_kreveta" : str(osobe)})
		if lista_soba is None: 
			return jsonify({'error' : 'Greška!'})

		for soba in lista_soba:
			slobodno = 0
			broj_rezervacija = 0
			lista_rezervacija = rezervacije.find({"soba_id" : soba['broj_sobe']})

			for rezervacija in lista_rezervacija:
				rezervisana_od = time.strptime(rezervacija['pocetni_datum'], "%Y-%m-%d")
				rezervisana_do = time.strptime(rezervacija['datum_odjave'], "%Y-%m-%d")
				
				broj_rezervacija = broj_rezervacija + 1
				if (datum1_date < rezervisana_od and datum2_date < rezervisana_od) or datum1_date > rezervisana_do:
					slobodno = slobodno + 1

			if slobodno == broj_rezervacija: 
				session['datum1'] = datum1
				session['datum2'] = datum2
				session['brojSobe'] = soba['broj_sobe']
				return jsonify({'poruka' : 'Postoji slobodna soba' + osobe})

		return jsonify({'error' : 'Zadati termin nije dostupan' + osobe})
	else: 
		return jsonify({'error' : 'Popunite sva polja'})

@app.route('/rezervacija', methods=['POST'])
def rezervacija():
	if 'rezervisao' in session:
		flash('Potrebno je da se registrujete za više od jedne rezervacije')
		return redirect(url_for('index'))
	form = rezervacijaForm()

	if '_id' in session:
		ime_korisnika = session['usr']
		slika_korisnika = session['slika']
		id_korisnika = session['_id']
	else:
		ime_korisnika = form.ime_prezime.data
		slika_korisnika = "/static/img/korisnici/default.png"
		id_korisnika = "gost"
		session['rezervisao'] = "da"
		
	rezervacija = {
		"pocetni_datum" : session['datum1'],
		"datum_odjave" : session['datum2'],
		"soba_id" : session['brojSobe'],
		"vreme" : time.strftime("%d.%m.%Y %H:%M"),
		"korisnik_id" : id_korisnika,
		"korisnik_ime" : ime_korisnika,
		"korisnik_slika" : slika_korisnika
	}

	rezervacije.insert_one(rezervacija)
	flash(f"Uspešno ste napravili rezervaciju za sobu broj {rezervacija['soba_id']}")
	return redirect(url_for('index'))

@app.route('/obrisi/sobu/<id>', methods=['POST', 'GET'])
def obrisi_sobu(id):
	if "admin_id" not in session:
		flash("Morate biti ulogovani kao admin!")
		return redirect(url_for('admin'))
	try: 
		ObjectId(id)
		soba = sobe.find_one({"_id":ObjectId(id)})

		sobe.remove(soba)
		flash("Soba je uspešno obrisana!")
		return redirect(url_for('admin'))
	except: 
		flash(f"Greška ID: \"{ id }\" nije validan!");
		return redirect(url_for('admin'))

@app.route('/obrisi/korisnika/<id>', methods=['POST', 'GET'])
def obrisi_korisnika(id):
	if "admin_id" not in session:
		flash("Morate biti ulogovani kao admin!")
		return redirect(url_for('admin'))
	try: 
		ObjectId(id)
		korisnik = users.find_one({"_id":ObjectId(id)})

		users.remove(korisnik)
		flash("Korisnik je uspešno obrisan!")
		return redirect(url_for('admin'))
	except: 
		flash(f"Greška ID: \"{ id }\" nije validan!");
		return redirect(url_for('admin'))

@app.route('/obrisi/rezervaciju/<id>', methods=['POST', 'GET'])
def obrisi_rezervaciju(id):
	if "admin_id" not in session:
		flash("Morate biti ulogovani kao admin ili korisnik!")
		return redirect(url_for('admin'))
	try: 
		ObjectId(id)
		rezervacija = rezervacije.find_one({"_id":ObjectId(id)})

		rezervacije.remove(rezervacija)
		flash("Rezervacija je uspešno obrisana!")
		return redirect(url_for('admin'))
	except: 
		flash(f"Greška ID: \"{ id }\" nije validan!");
		return redirect(url_for('admin'))

@app.route('/profil/<id>', methods=['POST', 'GET'])
def profil(id):
	if "_id" not in session:
		if "admin_id" not in session:
			flash("Morate biti ulogovani!")
			return redirect(url_for('index'))

	korisnik = users.find_one({"_id":ObjectId(id)})

	if '_id' in session and session['_id'] == id or 'admin_id' in session:
		form = updateProfil();

		if form.validate_on_submit():
			if form.slika.data is None:
				putanja = korisnik['slika']
			else:
				ime_rnd = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
				photos.save(form.slika.data, 'static/img/korisnici', session['usr'] + '_' + ime_rnd + '.jpg')
				putanja = "/static/img/korisnici/" + session['usr'] + '_' + ime_rnd + ".jpg"

			hash_pw = hashlib.sha256(form.password.data.encode())
			password_hashed = hash_pw.hexdigest()
			if "admin_id" not in session:
				session['slika'] = putanja
			user = {
				"ime_prezime":form.ime_prezime.data,
				"email":form.email.data,
				"godina_rodjenja":form.godina_rodjenja.data,
				"password":password_hashed,
				"telefon":form.telefon.data,
				"slika":putanja,
				"registrovan":time.strftime("%d.%m.%Y %H:%M")
			}
			users.update_one({"_id":ObjectId(id)}, {"$set":user})
			flash("Uspešno ste izmenili profil")
			return redirect(request.url)
		ima = 1
		lista_rezervacija = rezervacije.find({"korisnik_id":id})
		if lista_rezervacija is None:
			ima = 0
		return render_template("profil.html", korisnik=korisnik, k=form, lista_rezervacija=lista_rezervacija, ima=ima)

	else:
		flash("Niste ulogovani kao korisnik!")

	return redirect(url_for('index'))

@app.route('/obrisi/rezervaciju/korisnik/<id>', methods=['POST', 'GET'])
def obrisi_rezervaciju_k(id):
	if "_id" in session:
		try: 
			ObjectId(id)
			rezervacija = rezervacije.find_one({"_id":ObjectId(id)})
			if(rezervacija['korisnik_id'] == session['_id']):
				rezervacije.remove(rezervacija)
				flash("Rezervacija je uspešno obrisana!")
				return redirect(url_for('index'))
			flash("Nemate pristup ovoj rezervaciji!")
			return redirect(url_for('index'))
		except: 
			flash(f"Greška ID: \"{ id }\" nije validan!");
			return redirect(url_for('index'))

	flash("Niste ulogovani!")
	return redirect(url_for('index'))

if __name__ == '__main__':
	app.run(debug=True)