from flask import Blueprint, render_template, request, session, flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

# Definir un Blueprint para las rutas
main_routes = Blueprint('main_routes', __name__)

# Simulando base de datos de usuarios
USERS = {
    'admin': {'password': generate_password_hash('admin123'), 'role': 'admin'},
    'secretary': {'password': generate_password_hash('secretary123'), 'role': 'secretary'},
    'doctor': {'password': generate_password_hash('doctor123'), 'role': 'doctor'},
    'patient': {'password': generate_password_hash('patient123'), 'role': 'patient'}
}

# Ruta para la pantalla principal (inicio de sesión y creación de cuenta)
@main_routes.route('/')
def home():
    if 'role' in session:
        return redirect(url_for(f'{session["role"]}_dashboard'))
    return render_template('home.html')

# Ruta para iniciar sesión
@main_routes.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = USERS.get(username)
        if user and check_password_hash(user['password'], password):
            session['username'] = username
            session['role'] = user['role']
            return redirect(url_for(f'{user["role"]}_dashboard'))
        else:
            flash('Credenciales incorrectas')
    
    return render_template('login.html')

# Ruta para el dashboard de admin
@main_routes.route('/admin_dashboard')
def admin_dashboard():
    if 'role' in session and session['role'] == 'admin':
        return render_template('admin_dashboard.html')
    return redirect(url_for('main_routes.login'))

# Ruta para el dashboard del secretario
@main_routes.route('/secretary_dashboard')
def secretary_dashboard():
    if 'role' in session and session['role'] == 'secretary':
        return render_template('secretary_dashboard.html')
    return redirect(url_for('main_routes.login'))

# Ruta para el dashboard del doctor
@main_routes.route('/doctor_dashboard')
def doctor_dashboard():
    if 'role' in session and session['role'] == 'doctor':
        return render_template('doctor_dashboard.html')
    return redirect(url_for('main_routes.login'))

# Ruta para el dashboard del paciente
@main_routes.route('/patient_dashboard')
def patient_dashboard():
    if 'role' in session and session['role'] == 'patient':
        return render_template('patient_dashboard.html')
    return redirect(url_for('main_routes.login'))

# Ruta para crear una cuenta
@main_routes.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']
        
        if username in USERS:
            flash('El usuario ya existe.')
            return redirect(url_for('main_routes.register'))
        
        USERS[username] = {
            'password': generate_password_hash(password),
            'role': role
        }
        
        flash('Cuenta creada exitosamente. Inicia sesión.')
        return redirect(url_for('main_routes.login'))
    
    return render_template('register.html')

# Ruta para cerrar sesión
@main_routes.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main_routes.home'))
