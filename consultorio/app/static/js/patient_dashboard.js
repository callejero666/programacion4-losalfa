document.addEventListener("DOMContentLoaded", function() {
    let medicoSeleccionado = null;
    let turnoSeleccionado = null;
    let fechaActual = new Date(); // Fecha actual para iniciar el calendario
    let fechaSeleccionada = null; // Para guardar la fecha seleccionada
    let turnosOcupados = []; // Array para almacenar los turnos ocupados (ya seleccionados)
    let pacienteHaSeleccionadoTurno = false; // Variable para controlar si el paciente ya ha seleccionado un turno

    // Simulación de médicos y turnos
    const doctores = [
        { id: 1, nombre: 'Dr. Juan Pérez', horarioTrabajo: ['09:00-12:00', '14:00-18:00'] },
        { id: 2, nombre: 'Dra. María López', horarioTrabajo: ['08:00-12:00', '13:00-17:00'] }
    ];

    const horariosDisponibles = [
        { doctorId: 1, dia: '2025-01-25', turnos: ['09:00', '09:25', '09:50', '10:15', '10:40'] },
        { doctorId: 2, dia: '2025-01-26', turnos: ['08:00', '08:25', '08:50', '09:15', '09:40'] }
    ];

    const listaDoctores = document.getElementById('lista-doctores');
    doctores.forEach(doctor => {
        const li = document.createElement('li');
        li.textContent = doctor.nombre;
        li.addEventListener('click', () => seleccionarDoctor(doctor));
        listaDoctores.appendChild(li);
    });

    function seleccionarDoctor(doctor) {
        if (pacienteHaSeleccionadoTurno) {
            alert('Ya has seleccionado un turno con otro doctor. No puedes seleccionar más de uno.');
            return;
        }

        medicoSeleccionado = doctor;
        document.getElementById('calendario').classList.remove('hidden');
        mostrarCalendario();
    }

    function mostrarCalendario() {
        const diasAtencion = document.getElementById('dias-atencion');
        const mesTitulo = document.getElementById('mes-titulo');
        diasAtencion.innerHTML = '';

        const diasDisponibles = horariosDisponibles.filter(h => h.doctorId === medicoSeleccionado.id);
        const diasDelMes = obtenerDiasDelMes(fechaActual);

        mesTitulo.textContent = `${fechaActual.toLocaleString('es', { month: 'long' })} ${fechaActual.getFullYear()}`;

        diasDelMes.forEach((dia, index) => {
            const divDia = document.createElement('div');
            divDia.textContent = dia.getDate();

            // Verificar si el día está disponible
            const fechaFormateada = dia.toISOString().split('T')[0]; // YYYY-MM-DD
            const turnoDisponible = diasDisponibles.some(h => h.dia === fechaFormateada);

            if (turnoDisponible && !turnosOcupados.includes(fechaFormateada)) {
                divDia.classList.add('disponible');
                divDia.addEventListener('click', () => mostrarTurnos(dia));
            } else {
                divDia.classList.add('desactivado');
            }

            // Asegurarse de que los días de la semana estén correctos (mostrar el calendario en formato adecuado)
            if (index < fechaActual.getDay()) {
                divDia.classList.add('desactivado');
            }

            diasAtencion.appendChild(divDia);
        });
    }

    function obtenerDiasDelMes(fecha) {
        const dias = [];
        const primeroDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const ultimoDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
        
        for (let dia = primeroDelMes; dia <= ultimoDelMes; dia.setDate(dia.getDate() + 1)) {
            dias.push(new Date(dia));
        }

        return dias;
    }

    function mostrarTurnos(dia) {
        if (pacienteHaSeleccionadoTurno) {
            alert('Ya has seleccionado un turno. No puedes seleccionar más.');
            return;
        }

        fechaSeleccionada = dia;
        const detallesTurno = document.getElementById('detalles-turno');
        const turnosDisponibles = horariosDisponibles.filter(h => h.dia === dia.toISOString().split('T')[0]);

        const turnos = turnosDisponibles[0] ? turnosDisponibles[0].turnos : [];
        const franjaHoraria = medicoSeleccionado.horarioTrabajo.join(' / ');

        document.getElementById('franja-horaria').textContent = `Franja Horaria: ${franjaHoraria}`;
        document.getElementById('turnos-disponibles').innerHTML = '';

        turnos.forEach(turno => {
            const li = document.createElement('li');
            li.textContent = turno;

            // Comprobar si el turno ya ha sido ocupado
            if (turnosOcupados.includes(turno)) {
                li.classList.add('ocupado');
            } else {
                li.classList.add('disponible');
            }

            li.addEventListener('click', () => seleccionarTurno(turno));
            document.getElementById('turnos-disponibles').appendChild(li);
        });

        detallesTurno.classList.remove('hidden');
    }

    function seleccionarTurno(turno) {
        // Si el turno ya está ocupado, no permitir seleccionar
        if (turnosOcupados.includes(turno)) {
            alert('Este turno ya ha sido seleccionado.');
            return;
        }

        // Marcar el turno como ocupado
        turnosOcupados.push(turno);

        // Marcar la fecha como ocupada (para que no se pueda seleccionar otro turno en la misma fecha)
        const fechaFormateada = fechaSeleccionada.toISOString().split('T')[0]; // YYYY-MM-DD
        turnosOcupados.push(fechaFormateada);

        // Cambiar el color del turno a rojo (seleccionado)
        const turnosList = document.querySelectorAll('#turnos-disponibles li');
        turnosList.forEach(li => {
            if (li.textContent === turno) {
                li.classList.remove('disponible');
                li.classList.add('ocupado');
            }
        });

        // Desactivar todos los otros turnos para esa fecha
        const turnosDia = document.querySelectorAll(`#turnos-disponibles li`);
        turnosDia.forEach(turnoItem => {
            if (turnoItem.textContent !== turno) {
                turnoItem.classList.add('desactivado');
            }
        });

        // Desactivar toda la franja horaria
        const diasDisponibles = document.querySelectorAll('.disponible');
        diasDisponibles.forEach(dia => {
            dia.classList.add('desactivado');
        });

        // Marcar que el paciente ha seleccionado un turno
        pacienteHaSeleccionadoTurno = true;

        // Confirmar el turno
        alert(`Turno confirmado para ${medicoSeleccionado.nombre} el ${fechaSeleccionada.toLocaleDateString()} a las ${turno}`);
        
        // Ocultar el cuadro de los turnos
        document.getElementById('detalles-turno').classList.add('hidden');
    }

    // Funciones para navegar entre meses
    document.getElementById('prev-month').addEventListener('click', () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        mostrarCalendario();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        mostrarCalendario();
    });

    // Función para cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        // Aquí puedes eliminar las credenciales de sesión o realizar la lógica correspondiente
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirige a la página de inicio de sesión
    });
});
