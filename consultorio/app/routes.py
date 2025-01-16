from flask import Flask, render_template, redirect, request, session, flash, url_for
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Usuarios de ejemplo 
USERS = {
    'admin': {'password': generate_password_hash('admin123'), 'role': 'admin'},
    'secretary': {'password': generate_password_hash('secretary123'), 'role': 'secretary'},
    'doctor': {'password': generate_password_hash('doctor123'), 'role': 'doctor'},
    'patient': {'password': generate_password_hash('patient123'), 'role': 'patient'}
}

# Ruta para la pantalla principal (inicio de sesión y creación de cuenta)
@app.route('/')
def home():
    if 'role' in session:
        # Redirigir automáticamente a su panel si ya está autenticado
        if session['role'] == 'admin':
            return redirect(url_for('admin_dashboard'))
        elif session['role'] == 'secretary':
            return redirect(url_for('secretary_dashboard'))
        elif session['role'] == 'doctor':
            return redirect(url_for('doctor_dashboard'))
        elif session['role'] == 'patient':
            return redirect(url_for('patient_dashboard'))
    
    # Si no está autenticado, mostrar la página principal para iniciar sesión o crear una cuenta
    return render_template('home.html')

# Ruta para el inicio de sesión
@app.route('/login', methods=['GET', 'POST'])
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

# Ruta para la pantalla del admin
@app.route('/admin_dashboard')
def admin_dashboard():
    if 'role' in session and session['role'] == 'admin':
        return render_template('admin_dashboard.html')
    return redirect(url_for('login'))

# Ruta para la pantalla del secretario
@app.route('/secretary_dashboard')
def secretary_dashboard():
    if 'role' in session and session['role'] == 'secretary':
        return render_template('secretary_dashboard.html')
    return redirect(url_for('login'))

# Ruta para la pantalla del doctor
@app.route('/doctor_dashboard')
def doctor_dashboard():
    if 'role' in session and session['role'] == 'doctor':
        return render_template('doctor_dashboard.html')
    return redirect(url_for('login'))

# Ruta para la pantalla del paciente
@app.route('/patient_dashboard')
def patient_dashboard():
    if 'role' in session and session['role'] == 'patient':
        return render_template('patient_dashboard.html')
    return redirect(url_for('login'))

# Ruta para crear una nueva cuenta
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']
        
        if username in USERS:
            flash('El usuario ya existe.')
            return redirect(url_for('register'))
        
        USERS[username] = {
            'password': generate_password_hash(password),
            'role': role
        }
        
        flash('Cuenta creada exitosamente. Inicia sesión.')
        return redirect(url_for('login'))
    
    return render_template('register.html')

# Ruta para el logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
