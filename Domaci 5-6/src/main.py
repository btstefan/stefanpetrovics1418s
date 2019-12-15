from flask import Flask, render_template, url_for, request
import csv

app = Flask(__name__)

@app.route('/')
def index():
	f = open("src/RAFraspored.csv","r", encoding='utf8')
	redovi = f.readlines()

	lista_predavaca = [red.split(',')[2] for red in redovi]
	lista_ucionica = [red.split(',')[6] for red in redovi]

	svi_predavaci = []
	for ime in lista_predavaca:
		if ime not in svi_predavaci:
			svi_predavaci.append(ime)

	sve_ucionice = []
	for ucionica in lista_ucionica:
		if ucionica not in sve_ucionice:
			sve_ucionice.append(ucionica)

	lista_predavaca = svi_predavaci.sort()
	lista_ucionica = sve_ucionice.sort()

	#max broj potreban za ispis podataka u istu tabelu
	p = len(svi_predavaci)
	u = len(sve_ucionice)
	if p > u:
		broj = p
	else:
		broj = u

	return render_template("index.html", 
		redovi = redovi, 
		predavaci = svi_predavaci, 
		ucionice = sve_ucionice,
		broj = broj, p = p, u = u
	)

if __name__ == '__main__':
	app.run(debug=True)