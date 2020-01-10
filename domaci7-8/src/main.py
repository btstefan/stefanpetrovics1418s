from flask import Flask, render_template, flash, redirect, url_for, request, session
from forme import registracijaForm, update_korisnikForm, loginForm, proizvodForm, update_proizvodForm
from pymongo import MongoClient
from flask_uploads import UploadSet, IMAGES, configure_uploads
from datetime import datetime
from bson import ObjectId
import hashlib
import time
import string
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'NEKI RANDOM STRING'
app.config['UPLOADED_PHOTOS_DEST'] = 'src'
app.config['UPLOAD_FOLDER'] = 'static'

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)

db = MongoClient("mongodb+srv://admin:admin@cluster0-zmarb.mongodb.net/test?retryWrites=true&w=majority").get_database("db_kupovina")
proizvodi = db["proizvodi"]
users = db["users"]

@app.route('/')
@app.route('/index')
def index():
	p = list(proizvodi.find())
	u = list(users.find())
	return render_template('index.html', korisnici = u, proizvodi = p)

@app.route('/register', methods=['POST', 'GET'])
def register():
	form = registracijaForm()
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
				"email":form.email.data,
				"password":password_hashed,
				"pol":form.pol.data,
				"godina_rodjenja":form.godina_rodjenja.data,
				"slika":putanja,
				"tip_korisnika":form.tip_korisnika.data,
				"registrovan":time.strftime("%d.%m.%Y %H:%M")
			}
			users.insert_one(korisnik)
			flash(f'Profil {form.username.data} je napravljen !', 'success')
			return redirect(url_for('index'))

	return render_template('register.html', form=form)

@app.route('/login', methods=['POST', 'GET'])
def login():
	form = loginForm()
	if '_id' in session:
		flash(f"Već ste ulogovani kao: {session['tip_korisnika']}", "info");
		return redirect(url_for('index'))

	if form.validate_on_submit():
		hash_pw = hashlib.sha256(form.password.data.encode())
		password_hashed = hash_pw.hexdigest()
		korisnik = users.find_one({'korisnicko_ime':form.username.data, 'password':password_hashed})

		if korisnik is None:
			flash('Neuspesan login. Pogresan username ili password', 'danger')
		else:
			session['_id'] = str(korisnik['_id'])
			session['tip_korisnika'] = korisnik['tip_korisnika']
			session['usr'] = korisnik['korisnicko_ime']
			flash('Uspešno ste se ulogovali!', 'success')
			return redirect(url_for('index'))

	return render_template('login.html', form=form)

@app.route('/logout')
def logout():
	if "_id" in session:
		session.pop('_id', None)
		session.pop('tip_korisnika', None)
		session.pop('usr', None)
		flash("Uspešno ste se izlogovali!", 'warning')
		return redirect(url_for('index'))
	else: 
		flash("Niste ulogovani!", 'warning')
		return redirect(url_for('index'))

@app.route('/dodaj_proizvod', methods=['POST', 'GET'])
def dodaj_proizvod():
	if "_id" in session:
		if session['tip_korisnika'] != 'prodavac':
			flash('Samo prodavci mogu da dodaju proizvode!', 'warning')
			return redirect(url_for('index'))

		form = proizvodForm()
		if form.validate_on_submit():
			if form.slika.data is None:
				putanja = "/static/img/proizvodi/default.png"
			else:
				ime = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
				photos.save(form.slika.data, 'static/img/proizvodi/', ime + '.jpg')
				putanja = "/static/img/proizvodi/" + ime + ".jpg"

				proizvod = {
					"naziv":form.naziv.data,
					"cena":form.cena.data,
					"kolicina":form.kolicina.data,
					"slika":putanja,
					"ProdavacId":str(session['_id'])
				}
				proizvodi.insert_one(proizvod)
				flash(f'Proizvod: \"{form.naziv.data}\" je uspešno dodat !', 'success')
				return redirect(url_for('index'))
				
		return render_template('dodaj_proizvod.html', form=form)
	else:
		flash('Morate biti ulogovani kao prodavac da bi ste dodali proizvode!', 'warning')
		return redirect(url_for('login'))

@app.route('/update/<id>',methods = ["GET","POST"])
def update(id):
	#bolji nacin je da se direktno u html upisu putanje
	try: 
		k = users.find_one({"_id":ObjectId(id)})
		if k is None:
			p = proizvodi.find_one({"_id":ObjectId(id)})
			if p is None:
				flash(f"Greška ID: \"{ id }\" nije pronadjen!", "danger");
				return redirect(url_for('index'))
			else:
				return redirect('/update/proizvod/' + id)
		else:
			return redirect('/update/korisnik/' + id)
	except: 
		flash(f"Greška ID: \"{ id }\" nije validan!", "danger");
		return redirect(url_for('index'))

@app.route('/update/korisnik/<id>', methods=['POST', 'GET'])
def update_korisnik(id):
	if "_id" in session:
		if session['tip_korisnika'] == 'admin':
			try:
				form = update_korisnikForm()
				k = users.find_one({"_id":ObjectId(id)})
				if k is None:
					flash(f"Greška ID: \"{ id }\" nije pronadjen!", "danger");
					return redirect(url_for('index'))
				if form.validate_on_submit():
					if form.slika.data is None:
						putanja = k['slika'];
					else:
						ime_rnd = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
						photos.save(form.slika.data, 'static/img/korisnici', k['korisnicko_ime'] + '_' + ime_rnd + '.jpg')
						putanja = "/static/img/korisnici/" + k['korisnicko_ime'] + '_' + ime_rnd + ".jpg"

					hash_pw = hashlib.sha256(form.password.data.encode())
					password_hashed = hash_pw.hexdigest()

					korisnik = {
						"email":form.email.data,
						"password":password_hashed,
						"pol":form.pol.data,
						"godina_rodjenja":form.godina_rodjenja.data,
						"slika":putanja,
						"tip_korisnika":form.tip_korisnika.data,
						"registrovan":form.datum.data
					}
					users.update_one({"_id":ObjectId(id)}, {"$set":korisnik})
					flash("Profil je uspešno ažuriran!", "success");
					return redirect(url_for('index'))
			except:
				flash(f"ID korisnika: \"{id}\" nije validan", "danger");
				return redirect(url_for('index'))

			return render_template('update_user.html', form=form, k=k)

		else:
			flash("Samo admin može da menja korisnike!", "danger");
			return redirect(url_for('index'))
	else:
		flash("Morate biti ulogovani!", "danger");
		return redirect(url_for('index'))

@app.route('/update/proizvod/<id>', methods=['POST', 'GET'])
def update_proizvod(id):
	if "_id" in session:
		try:
			p = proizvodi.find_one({"_id":ObjectId(id)})
			if session['tip_korisnika'] == 'admin' or session['_id'] == p['ProdavacId']:
				form = update_proizvodForm()
				if p is None:
					flash(f"Greška ID: \"{ id }\" nije pronadjen!", "danger");
					return redirect(url_for('index'))
				if form.validate_on_submit():
					if form.slika.data is None:
						putanja = p['slika'];
					else:
						ime_rnd = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
						photos.save(form.slika.data, 'static/img/proizvodi', ime_rnd + '.jpg')
						putanja = "/static/img/proizvodi/" + ime_rnd + ".jpg"

					proizvod = {
						"naziv":form.naziv.data,
						"cena":form.cena.data,
						"kolicina":form.kolicina.data,
						"slika":putanja,
						"ProdavacId":form.prodavac.data
					}
					proizvodi.update_one({"_id":ObjectId(id)}, {"$set":proizvod})
					flash("Proizvod je uspešno ažuriran!", "success");
			else:
				flash("Morate biti ulogovani kao admin ili kao prodavac koji je napravio proizvod!", "danger");
				return redirect(url_for('index'))
		except:
			flash("ID korisnika nije validan", "danger");
			return redirect(url_for('index'))
	else:
		flash("Morate biti ulogovani!", "danger");
		return redirect(url_for('index'))

	return render_template('update_proizvod.html', form=form, p=p)

@app.route('/delete/<id>',methods = ["GET","POST"])
def delete(id):
	try: 
		ObjectId(id)
		k = users.find_one({"_id":ObjectId(id)})
		if k is None:
			proizvod = proizvodi.find_one({"_id":ObjectId(id)})
			if proizvod is None:
				flash(f"Greška ID: \"{ id }\" nije pronadjen!", "danger");
				return redirect(url_for('index'))
			else:
				return redirect('/delete/proizvod/' + id)
		else:
			return redirect('/delete/korisnik/' + id)
	except: 
		flash(f"Greška ID: \"{ id }\" nije validan!", "danger");
		return redirect(url_for('index'))

@app.route('/delete/proizvod/<id>',methods = ["GET"])
def delete_p(id):
	if "_id" in session:
		if session['tip_korisnika'] == 'admin':
			try: 
				ObjectId(id)
				proizvod = proizvodi.find_one({"_id":ObjectId(id)})
				proizvodi.remove(proizvod)
				return redirect(url_for('index'))
			except: 
				flash(f"Greška ID: \"{ id }\" nije validan!", "danger");
				return redirect(url_for('index'))
		else:
			flash("Samo admin može da briše proizvode", "danger");
			return redirect(url_for('index'))
	else:
		flash("Morate biti ulogovani", "danger");
		return redirect(url_for('index'))

@app.route('/delete/korisnik/<id>',methods = ["GET"])
def delete_k(id):
	if "_id" in session:
		if session['tip_korisnika'] == 'admin':
			try: 
				ObjectId(id)
				korisnik = users.find_one({"_id":ObjectId(id)})
				# ako korisnik obrise svoj profil:
				if(korisnik['korisnicko_ime'] == session['usr']):
					flash(f"Obrisali ste svoj profil", "danger")
					users.remove(korisnik)
					return redirect(url_for('logout'))

				users.remove(korisnik)
				return redirect(url_for('index'))
			except: 
				flash(f"Greška ID: \"{ id }\" nije validan!", "danger");
				return redirect(url_for('index'))
		else:
			flash("Samo admin može da briše korisnike", "danger");
			return redirect(url_for('index'))
	else:
		flash("Morate biti ulogovani", "danger");
		return redirect(url_for('index'))

if __name__ == '__main__':
	app.run(debug=True)