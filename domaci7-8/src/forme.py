from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_wtf.file import FileField, FileAllowed
from wtforms import Form
from wtforms.widgets import html5

class registracijaForm(FlaskForm):
	username = StringField('Korisničko ime', validators=[DataRequired(), Length(min=2, max=20)])
	email = StringField('Email', validators=[DataRequired(), Email()])
	password = PasswordField('Lozinka', validators=[DataRequired()])
	confirm_password = PasswordField('Potvrdi lozinku', validators=[DataRequired(), EqualTo('password')])
	pol = SelectField(
		'Pol',
		choices = [('m', 'muski'), ('z', 'zenski')],
		validators=[DataRequired()]
	)
	godina_rodjenja = IntegerField('Godina rodjenja', widget=html5.NumberInput())
	tip_korisnika = SelectField(
		'Tip korisnika:',
		choices = [('admin', 'admin'), ('prodavac', 'prodavac')],
		validators=[DataRequired()]
	)
	slika = FileField("Profilna slika", validators=[FileAllowed(['jpg', 'png'])])
	submit = SubmitField('Registruj se')

class update_korisnikForm(FlaskForm):
	email = StringField('Email', validators=[DataRequired(), Email()])
	password = PasswordField('Lozinka', validators=[DataRequired()])
	confirm_password = PasswordField('Potvrdi lozinku', validators=[DataRequired(), EqualTo('password')])
	pol = SelectField(
		'Pol',
		choices = [('m', 'muski'), ('z', 'zenski')],
		validators=[DataRequired()]
	)
	godina_rodjenja = IntegerField('Godina rodjenja', widget=html5.NumberInput())
	tip_korisnika = SelectField(
		'Tip korisnika:',
		choices = [('admin', 'admin'), ('prodavac', 'prodavac')],
		validators=[DataRequired()]
	)
	slika = FileField("Profilna slika", validators=[FileAllowed(['jpg', 'png'])])
	datum = StringField('Datum registracije', validators=[DataRequired()])
	submit = SubmitField('Izmeni profil')

class loginForm(FlaskForm):
	username = StringField('Korisnicko ime', validators=[DataRequired()])
	password = PasswordField('Šifra', validators=[DataRequired()])
	submit = SubmitField('Prijavi se')

class proizvodForm(FlaskForm):
	naziv = StringField('Naziv', validators=[DataRequired()])
	cena = IntegerField('Cena', widget=html5.NumberInput())
	kolicina = IntegerField('Količina', widget=html5.NumberInput())
	slika = FileField("Slika proizvoda", validators=[FileAllowed(['jpg', 'png'])])
	submit = SubmitField('Dodaj proizvod')

class update_proizvodForm(FlaskForm):
	naziv = StringField('Naziv', validators=[DataRequired()])
	cena = IntegerField('Cena', widget=html5.NumberInput())
	kolicina = IntegerField('Količina', widget=html5.NumberInput())
	slika = FileField("Slika proizvoda", validators=[FileAllowed(['jpg', 'png'])])
	prodavac = StringField('Prodavac ID', validators=[DataRequired()])
	submit = SubmitField('Izmeni proizvod')