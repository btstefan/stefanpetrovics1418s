from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, IntegerField, FileField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_wtf.file import FileField, FileAllowed
from wtforms import Form
from wtforms.widgets import html5
from wtforms.fields.html5 import DateField

class registracijaForm(FlaskForm):
	username = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Korisničko ime"})
	ime_prezime = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Ime i prezime"})
	email = StringField(validators=[DataRequired(), Email()], render_kw={"placeholder": "Email adresa"})
	godina_rodjenja = IntegerField('Godina rodjenja', widget=html5.NumberInput(), render_kw={"placeholder" : "Godina Rodjenja"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Lozinka"})
	confirm_password = PasswordField(validators=[DataRequired(), EqualTo('password')], render_kw={"placeholder": "Potvrdi lozinku"})
	telefon = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Telefon"})
	slika = FileField("Profilna slika", validators=[FileAllowed(['jpg', 'png'])])
	submit = SubmitField('Registruj se', render_kw={"id": "reg"})

class loginForm(FlaskForm):
	username = StringField(validators=[DataRequired()], render_kw={"placeholder": "Username"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Lozinka"})
	submit = SubmitField('Prijavi se')

class admin_loginForm(FlaskForm):
	username = StringField(validators=[DataRequired()], render_kw={"placeholder": "Username"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Lozinka"})
	submit = SubmitField('Prijavi se')

class rezervacijaForm(FlaskForm):
	ime_prezime = StringField(validators=[DataRequired(), Length(min=2, max=30)], render_kw={"placeholder": "Ime i prezime"})
	email = StringField(validators=[DataRequired(), Email()], render_kw={"placeholder": "Email adresa"})
	telefon = StringField(validators=[DataRequired(), Length(min=2, max=30)], render_kw={"placeholder": "Telefon"})
	submit = SubmitField('Rezerviši sobu')

class dodajSobu(FlaskForm):
	broj_sobe = IntegerField(widget=html5.NumberInput(), render_kw={"placeholder" : "Broj sobe"})
	broj_kreveta = IntegerField(widget=html5.NumberInput(), render_kw={"placeholder" : "Broj kreveta"})
	cena_nocenja = IntegerField(widget=html5.NumberInput(), render_kw={"placeholder" : "Cena noćenja"})
	submit = SubmitField('Dodaj sobu')

class updateProfil(FlaskForm):
	ime_prezime = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Ime i prezime"})
	email = StringField(validators=[DataRequired(), Email()], render_kw={"placeholder": "Email adresa"})
	godina_rodjenja = IntegerField('Godina rodjenja', widget=html5.NumberInput(), render_kw={"placeholder" : "Godina Rodjenja"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Lozinka"})
	confirm_password = PasswordField(validators=[DataRequired(), EqualTo('password')], render_kw={"placeholder": "Potvrdi lozinku"})
	telefon = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Telefon"})
	slika = FileField("Profilna slika", validators=[FileAllowed(['jpg', 'png'])])
	submit = SubmitField('Izmeni profil')