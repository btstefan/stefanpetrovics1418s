from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, IntegerField, FileField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_wtf.file import FileField, FileAllowed
from wtforms import Form
from wtforms.widgets import html5
from wtforms.fields.html5 import DateField

class registracijaForm(FlaskForm):
	r_username = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Username"})
	r_ime_prezime = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Name and surname"})
	r_email = StringField(validators=[DataRequired(), Email()], render_kw={"placeholder": "Email address"})
	r_godina_rodjenja = IntegerField('Godina rodjenja', widget=html5.NumberInput(), render_kw={"placeholder" : "Year of birth"})
	r_password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Password"})
	r_confirm_password = PasswordField(validators=[DataRequired(), EqualTo('r_password')], render_kw={"placeholder": "Confirm password"})
	r_telefon = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Phone number"})
	r_slika = FileField("Profile photo", validators=[FileAllowed(['jpg', 'png'])])
	r_submit = SubmitField('Sign Up', render_kw={"id": "reg"})

class loginForm(FlaskForm):
	username = StringField(validators=[DataRequired()], render_kw={"placeholder": "Username"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Password"})
	submit = SubmitField('Login')

class admin_loginForm(FlaskForm):
	username = StringField(validators=[DataRequired()], render_kw={"placeholder": "Username"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Password"})
	submit = SubmitField('Login')

class rezervacijaForm(FlaskForm):
	ime_prezime = StringField(validators=[DataRequired(), Length(min=2, max=30)], render_kw={"placeholder": "Name and surname"})
	email = StringField(validators=[DataRequired(), Email()], render_kw={"placeholder": "Email address"})
	telefon = StringField(validators=[DataRequired(), Length(min=2, max=30)], render_kw={"placeholder": "Phone number"})
	submit = SubmitField('Make reservation')

class dodajSobu(FlaskForm):
	broj_sobe = IntegerField(widget=html5.NumberInput(), render_kw={"placeholder" : "Room number"})
	broj_kreveta = IntegerField(widget=html5.NumberInput(), render_kw={"placeholder" : "Bed count"})
	cena_nocenja = IntegerField(widget=html5.NumberInput(), render_kw={"placeholder" : "Price per night"})
	submit = SubmitField('Add room')

class updateProfil(FlaskForm):
	ime_prezime = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Name and surname"})
	email = StringField(validators=[DataRequired(), Email()], render_kw={"placeholder": "Email address"})
	godina_rodjenja = IntegerField('Godina rodjenja', widget=html5.NumberInput(), render_kw={"placeholder" : "Year of birth"})
	password = PasswordField(validators=[DataRequired()], render_kw={"placeholder": "Password"})
	confirm_password = PasswordField(validators=[DataRequired(), EqualTo('password')], render_kw={"placeholder": "Confirm password"})
	telefon = StringField(validators=[DataRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Phone number"})
	slika = FileField("Profile photo", validators=[FileAllowed(['jpg', 'png'])])
	submit = SubmitField('Edit profile')