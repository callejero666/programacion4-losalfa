from flask import Flask

app = Flask(__name__)
app.secret_key = 'clave-secreta-super-segura'  # Cambia esto por algo más robusto

from consultorio import routes


