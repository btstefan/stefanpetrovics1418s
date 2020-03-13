from flask import Flask, render_template, flash, redirect, url_for, request, session, jsonify
from forme import registracijaForm, loginForm, admin_loginForm, rezervacijaForm, dodajSobu, updateProfil
from pymongo import MongoClient
from flask_mail import Mail
from flask_mail import Message
from flask_uploads import UploadSet, IMAGES, configure_uploads
from datetime import datetime, date
from bson import ObjectId
import hashlib, time, string, random
from PIL import Image
import os
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pSkJHDRJNMNv9X9Fb83KXJf8u8'
app.config['UPLOADED_PHOTOS_DEST'] = 'src'
app.config['UPLOAD_FOLDER'] = 'static'

# MAIL konfiguracija
app.config.update(
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = "srbwebshop@gmail.com",
	MAIL_PASSWORD = "rodjak555"
	)
mail = Mail(app)

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)

db = MongoClient("mongodb+srv://admin:admin@cluster0-zmarb.mongodb.net/test?retryWrites=true&w=majority").get_database("hotel")
users = db["users"]
admins = db["admin"]
rezervacije = db["rezervacije"]
sobe = db["sobe"]

def upload_sliku(slika, korisnik):
    ime_rnd = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
    #_, f_ext = os.path.splitext(slika.filename)
    slika_ime = korisnik + '_' + ime_rnd + '.jpg'
    slika_putanja = os.path.join(app.root_path, 'static/img/korisnici', slika_ime)

    velicina = (200, 200)
    s = Image.open(slika)
    s.thumbnail(velicina, Image.ANTIALIAS)
    s.save(slika_putanja)

    return slika_ime

@app.route('/', methods=['POST', 'GET'])
def index():
	form = registracijaForm()
	login = loginForm()
	rezervacija = rezervacijaForm()

	if form.validate_on_submit():
		postojeci_korisnik = users.find_one({"korisnicko_ime": form.r_username.data})
		if postojeci_korisnik is not None:
			flash(f'Username \"{form.r_username.data}\" already exist', 'danger')
		else:
			if form.r_slika.data is None:
				putanja = "/static/img/korisnici/default.png"
			else:
				putanja = "/static/img/korisnici/" + upload_sliku(form.r_slika.data, form.r_username.data)

				#ime_rnd = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
				#photos.save(i, 'static/img/korisnici', form.r_username.data + '_' + ime_rnd + '.jpg')
				#putanja = "/static/img/korisnici/" + form.r_username.data + '_' + ime_rnd + ".jpg"

			hash_pw = hashlib.sha256(form.r_password.data.encode())
			password_hashed = hash_pw.hexdigest()
			korisnik = {
				"korisnicko_ime":form.r_username.data,
				"ime_prezime":form.r_ime_prezime.data,
				"email":form.r_email.data,
				"godina_rodjenja":form.r_godina_rodjenja.data,
				"password":password_hashed,
				"telefon":form.r_telefon.data,
				"slika":putanja,
				"registrovan":time.strftime("%d.%m.%Y %H:%M")
			}
			users.insert_one(korisnik)
			k = users.find_one({'korisnicko_ime':form.r_username.data, 'password':password_hashed})
			if k is not None:
				session['_id'] = str(k['_id'])
				session['usr'] = k['korisnicko_ime']
				session['slika'] = k['slika']
			flash('Registration was successful!')
			return redirect(url_for('index'))


	return render_template('index.html', login=login, form=form, rezervacija=rezervacija)

@app.route('/login', methods=['POST'])
def login():
	login = loginForm()
	if '_id' in session:
		flash(f"You are already logged in: {session['usr']}");
		return redirect(url_for('index'))

	hash_pw = hashlib.sha256(login.password.data.encode())
	password_hashed = hash_pw.hexdigest()
	korisnik = users.find_one({'korisnicko_ime':login.username.data, 'password':password_hashed})

	if korisnik is None:
		flash('Wrong username or password')
	else:
		session['_id'] = str(korisnik['_id'])
		session['usr'] = korisnik['korisnicko_ime']
		session['slika'] = korisnik['slika']
		if 'rezervisao' in session:
			session.pop('rezervisao', None)
	return redirect(url_for('index'))

@app.route('/logout')
def logout():
	if "_id" in session:
		session.pop('_id', None)
		session.pop('usr', None)
		session.pop('slika', None)
		return redirect(url_for('index'))
	else: 
		flash("You are not logged in!")
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
			flash('Wrong username or password!')
		else:
			session['admin_id'] = str(admin['_id'])
			session['admin_ime'] = admin['ime_admina']
			return redirect(url_for('admin_panel'))

	return render_template("admin_login.html", admin=admin_forma)

@app.route('/admin/logout')
def admin_logout():
	if "admin_id" in session:
		session.pop('admin_id', None)
		session.pop('admin_ime', None)
		return redirect(url_for('admin'))
	else: 
		flash("You are not logged in as admin!")
		return redirect(url_for('admin'))

@app.route('/admin/panel', methods=['POST', 'GET'])
def admin_panel():
	soba = dodajSobu();
	if "admin_id" not in session:
		flash("You must be logged in as admin!")
		return redirect(url_for('admin'))
		
	k = list(users.find()) #svi korisnici
	a = list(admins.find()) #svi admini
	r = list(rezervacije.find()) #sve rezervacije
	s = list(sobe.find()) #sve sobe

	if soba.validate_on_submit():
		sb = sobe.find_one({"broj_sobe":str(soba.broj_sobe.data)})
		if sb is None: 
			s = {
				"broj_sobe" : str(soba.broj_sobe.data),
				"broj_kreveta" : str(soba.broj_kreveta.data),
				"cena_nocenja" : soba.cena_nocenja.data
			}
			sobe.insert_one(s)
			flash("Room added successfuly!")
		else:
			flash(f"Room number {soba.broj_sobe.data} already exist")
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

	d1 = datetime.strptime(datum1, "%Y-%m-%d")
	d2 = datetime.strptime(datum2, "%Y-%m-%d")
	razlika = abs((d2 - d1).days)
	
	if datum2_date <= datum1_date:
		return jsonify({'error' : 'CHECK-OUT date must be after CHECK-IN date' })

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
				total = razlika * int(soba['cena_nocenja'])
				session['total'] = total
				return jsonify({
					'poruka' : 'There is a room available.', 
					'soba' : soba['broj_sobe'], 
					'cena' : soba['cena_nocenja'],
					'dani' : str(razlika),
					'total' : total
				})

		return jsonify({'error' : 'There is no room available in selected period.'})
	else: 
		return jsonify({'error' : 'All fields are required!'})

@app.route('/rezervacija', methods=['POST'])
def rezervacija():
	if 'rezervisao' in session:
		flash('For more than one reservation, you need to LOGIN.')
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
	flash(f"Reservation created for room #{rezervacija['soba_id']}")
	return redirect(url_for('index'))

@app.route('/obrisi/sobu/<id>', methods=['POST', 'GET'])
def obrisi_sobu(id):
	if "admin_id" not in session:
		flash("You must be logged in as admin!")
		return redirect(url_for('admin'))
	try: 
		ObjectId(id)
		soba = sobe.find_one({"_id":ObjectId(id)})

		sobe.remove(soba)
		flash("Room deleted!")
		return redirect(url_for('admin'))
	except: 
		flash(f"Error: \"{ id }\" is not a valid id!");
		return redirect(url_for('admin'))

@app.route('/obrisi/korisnika/<id>', methods=['POST', 'GET'])
def obrisi_korisnika(id):
	if "admin_id" not in session:
		flash("You must be logged in as admin!")
		return redirect(url_for('admin'))
	try: 
		ObjectId(id)
		korisnik = users.find_one({"_id":ObjectId(id)})

		users.remove(korisnik)
		flash("User deleted!")
		return redirect(url_for('admin'))
	except: 
		flash(f"Error: \"{ id }\" is not a valid id!");
		return redirect(url_for('admin'))


@app.route('/obrisi/rezervaciju/<id>', methods=['POST', 'GET'])
def obrisi_rezervaciju(id):
	if "admin_id" not in session:
		flash("You must be logged in")
		return redirect(url_for('admin'))
	try: 
		ObjectId(id)
		rezervacija = rezervacije.find_one({"_id":ObjectId(id)})

		rezervacije.remove(rezervacija)
		flash("Reservation canceled!")
		return redirect(url_for('admin'))
	except: 
		flash(f"Error: \"{ id }\" is not a valid id!");
		return redirect(url_for('admin'))


@app.route('/profil/<id>', methods=['POST', 'GET'])
def profil(id):
	if "_id" not in session:
		if "admin_id" not in session:
			flash("You must be logged in!")
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
			flash("Your profile was changed!")
			return redirect(request.url)

		lista_rezervacija = []
		show = True
		if rezervacije.find_one({"korisnik_id":id}) is None:
			show = False

		if show:
			lista_rezervacija = rezervacije.find({"korisnik_id":id})
		
		return render_template("profil.html", korisnik=korisnik, k=form, lista_rezervacija=lista_rezervacija, show=show)

	else:
		flash("You are not logged in as user!")

	return redirect(url_for('index'))


@app.route('/obrisi/rezervaciju/korisnik/<id>', methods=['POST', 'GET'])
def obrisi_rezervaciju_k(id):
	if "_id" in session:
		try: 
			ObjectId(id)
			rezervacija = rezervacije.find_one({"_id":ObjectId(id)})
			if(rezervacija['korisnik_id'] == session['_id']):
				rezervacije.remove(rezervacija)
				flash("Reservation deleted!")
				return redirect(url_for('index'))
			flash("Access denied!")
			return redirect(url_for('index'))
		except: 
			flash(f"Error: \"{ id }\" is not a valid id!");
			return redirect(url_for('index'))

	flash("You are not logged in!")
	return redirect(url_for('index'))

@app.route('/kontakt', methods=['POST'])
def kontakt():
	ime = request.form['ime_prezime']
	email = request.form['email']
	poruka = request.form['poruka']
	
	if ime and email and poruka:
		msg = Message('Hotel contact', sender='savadunav5@gmail.com', recipients=['stefanpetrovicsrb@gmail.com'])
		msg.html = '<b>Hotel contact form<br/><br/>Name:</b> ' + ime + '<br/>' + '<b>Email:</b> ' + email + '<br/>' + '<b>Message:</b><br/>' + poruka
		mail.send(msg)
		return jsonify({'poruka' : 'success'})
	
	return jsonify({'error' : 'error'})

if __name__ == '__main__':
	app.run(debug=True)