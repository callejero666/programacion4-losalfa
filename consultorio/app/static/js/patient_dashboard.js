document.addEventListener('DOMContentLoaded', () => {
    const doctoresContainer = document.getElementById('lista-doctores');
    const calendarioContainer = document.getElementById('dias-atencion');
    const horariosContainer = document.getElementById('lista-horarios');

    const seccionCalendario = document.getElementById('calendario');
    const seccionHorarios = document.getElementById('horarios');

    // Datos simulados
    const doctores = [
        { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología' },
        { id: 2, nombre: 'Dra. Ana López', especialidad: 'Pediatría' },
    ];

    const horarios = {
        1: ['2025-01-20', '2025-01-21', '2025-01-22'],
        2: ['2025-01-23', '2025-01-24'],
    };

    const turnos = {
        '2025-01-20': { '16:00': false, '16:30': false, '17:00': false },
        '2025-01-21': { '10:00': false, '10:30': false, '11:00': false },
        '2025-01-23': { '09:00': false, '09:30': false, '10:00': false },
    };

    // Mostrar doctores
    doctores.forEach((doctor) => {
        const li = document.createElement('li');
        li.textContent = `${doctor.nombre} - ${doctor.especialidad}`;
        li.addEventListener('click', () => seleccionarDoctor(doctor.id));
        doctoresContainer.appendChild(li);
    });

    // Seleccionar un doctor
    function seleccionarDoctor(idDoctor) {
        seccionCalendario.classList.remove('hidden');
        calendarioContainer.innerHTML = ''; // Limpia los días anteriores

        (horarios[idDoctor] || []).forEach((dia) => {
            const diaDiv = document.createElement('div');
            diaDiv.textContent = dia;
            diaDiv.addEventListener('click', () => seleccionarDia(dia));
            calendarioContainer.appendChild(diaDiv);
        });
    }

    // Seleccionar un día
    function seleccionarDia(dia) {
        seccionHorarios.classList.remove('hidden');
        horariosContainer.innerHTML = ''; // Limpia los horarios anteriores

        if (!turnos[dia]) return;

        Object.keys(turnos[dia]).forEach((hora) => {
            const li = document.createElement('li');
            li.textContent = hora;

            // Estilo según disponibilidad
            li.style.backgroundColor = turnos[dia][hora] ? 'red' : 'green';
            li.style.color = '#fff';

            if (!turnos[dia][hora]) {
                li.addEventListener('click', () => reservarTurno(dia, hora, li));
            } else {
                li.style.cursor = 'not-allowed';
            }

            horariosContainer.appendChild(li);
        });
    }

    // Reservar turno
    function reservarTurno(dia, hora, elemento) {
        if (turnos[dia][hora]) {
            alert('Este turno ya está ocupado.');
            return;
        }

        // Marcar como ocupado
        turnos[dia][hora] = true;
        elemento.style.backgroundColor = 'red';
        elemento.style.cursor = 'not-allowed';
        elemento.removeEventListener('click', reservarTurno);

        alert(`Turno reservado para el día ${dia} a las ${hora}`);
    }
});