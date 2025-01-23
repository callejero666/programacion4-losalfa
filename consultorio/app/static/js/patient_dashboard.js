document.addEventListener("DOMContentLoaded", function() { 
    let medicoSeleccionado = null;
    let turnoSeleccionado = null;
    let pacienteId = 123; // Id del paciente, simulado
    let pacienteHaSeleccionadoTurno = false;
    let fechaActual = new Date();
    
    // Simulaciones de datos
    const doctores = [
        { id: 1, nombre: 'Dr. Juan Pérez', horarioTrabajo: ['09:00-12:00', '14:00-18:00'] },
        { id: 2, nombre: 'Dra. María López', horarioTrabajo: ['08:00-12:00', '13:00-17:00'] }
    ];

    const horariosDisponibles = [
        { doctorId: 1, dia: '2025-01-25', turnos: ['09:00', '09:30', '10:00', '10:30'] },
        { doctorId: 2, dia: '2025-01-26', turnos: ['08:00', '08:30', '09:00', '09:30'] },
        { doctorId: 1, dia: '2025-02-05', turnos: ['09:00', '09:30', '10:00', '10:30'] },
        { doctorId: 2, dia: '2025-02-15', turnos: ['08:00', '08:30', '09:00', '09:30'] },
        { doctorId: 1, dia: '2025-03-10', turnos: ['09:00', '09:30', '10:00', '10:30'] }
    ];

    // Elementos del DOM
    const listaDoctores = document.getElementById('lista-doctores');
    const calendario = document.getElementById('calendario');
    const detallesTurno = document.getElementById('detalles-turno');
    const turnosDisponiblesDiv = document.getElementById('turnos-disponibles');
    const mesTitulo = document.getElementById('mes-titulo');
    const cancelarTurnoBtn = document.getElementById('cancelar-turno-btn');
    const diasAtencion = document.getElementById('dias-atencion');
    const btnAnteriorMes = document.getElementById('btn-anterior-mes');
    const btnSiguienteMes = document.getElementById('btn-siguiente-mes');

    // Mostramos los doctores
    doctores.forEach(doctor => {
        const li = document.createElement('li');
        li.textContent = doctor.nombre;
        li.addEventListener('click', () => seleccionarDoctor(doctor));
        listaDoctores.appendChild(li);
    });

    // Función para mostrar el calendario de un mes
    function mostrarCalendario(mes, año) {
        // Limpiamos el calendario y el título
        diasAtencion.innerHTML = '';
        mesTitulo.textContent = `${mes + 1} - ${año}`;

        // Obtener primer día del mes
        let primerDia = new Date(año, mes, 1);
        let ultimoDia = new Date(año, mes + 1, 0);
        
        // Crear los días en cuadrícula
        for (let i = 0; i < primerDia.getDay(); i++) {
            const espacioVacio = document.createElement('div');
            diasAtencion.appendChild(espacioVacio);
        }
        
        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
            const divDia = document.createElement('div');
            const fecha = new Date(año, mes, dia);
            divDia.textContent = dia;
            divDia.classList.add('dia');

            // Marcar los días de atención
            const diaDisponible = horariosDisponibles.find(d => new Date(d.dia).toLocaleDateString() === fecha.toLocaleDateString() && d.doctorId === medicoSeleccionado.id);
            if (diaDisponible) {
                divDia.classList.add('disponible');
                divDia.addEventListener('click', () => mostrarTurnos(diaDisponible));
            }

            diasAtencion.appendChild(divDia);
        }
    }

    // Función para seleccionar un doctor
    function seleccionarDoctor(doctor) {
        if (pacienteHaSeleccionadoTurno) {
            alert('Ya has seleccionado un turno. No puedes seleccionar más.');
            return;
        }

        medicoSeleccionado = doctor;
        calendario.classList.remove('hidden');

        // Mostrar el calendario del mes actual
        mostrarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());
    }

    // Función para mostrar los turnos disponibles de un día
    function mostrarTurnos(dia) {
        if (pacienteHaSeleccionadoTurno) {
            alert('Ya has seleccionado un turno. No puedes seleccionar más.');
            return;
        }

        // Mostramos los turnos disponibles
        turnosDisponiblesDiv.innerHTML = '';
        dia.turnos.forEach(turno => {
            const li = document.createElement('li');
            li.textContent = turno;
            li.classList.add('turno-disponible');
            li.addEventListener('click', () => seleccionarTurno(dia.dia, turno, li));
            turnosDisponiblesDiv.appendChild(li);
        });

        detallesTurno.classList.remove('hidden');
    }

    // Función para seleccionar un turno
    function seleccionarTurno(dia, turno, liElemento) {
        if (pacienteHaSeleccionadoTurno) {
            alert('Ya has seleccionado un turno. No puedes seleccionar más.');
            return;
        }

        turnoSeleccionado = { dia: dia, turno: turno };
        pacienteHaSeleccionadoTurno = true;

        // Cambiar el color del turno seleccionado a rojo
        liElemento.classList.remove('turno-disponible');
        liElemento.classList.add('turno-seleccionado');

        alert(`Has seleccionado el turno para el ${new Date(dia).toLocaleDateString()} a las ${turno}.`);

        // Mostrar detalles del turno
        document.getElementById('detalle-turno-seleccionado').textContent = 
            `Turno confirmado: ${new Date(dia).toLocaleDateString()} a las ${turno}`;

        // Ocultar el calendario y mostrar los detalles del turno
        detallesTurno.classList.add('hidden');
        document.getElementById('turno-confirmado').classList.remove('hidden');
    }

    // Función para cancelar el turno
    cancelarTurnoBtn.addEventListener('click', () => {
        if (!pacienteHaSeleccionadoTurno) {
            alert('No tienes un turno seleccionado para cancelar.');
            return;
        }

        // Cancelamos el turno seleccionado
        turnoSeleccionado = null;
        pacienteHaSeleccionadoTurno = false;

        alert('Tu turno ha sido cancelado.');

        // Restablecer el color del turno a verde (disponible)
        const turnosSeleccionados = document.querySelectorAll('.turno-seleccionado');
        turnosSeleccionados.forEach(turno => {
            turno.classList.remove('turno-seleccionado');
            turno.classList.add('turno-disponible');
        });

        // Ocultar el turno confirmado y permitir la selección de un nuevo turno
        document.getElementById('turno-confirmado').classList.add('hidden');
        detallesTurno.classList.remove('hidden');
    });

    // Funciones para cambiar de mes
    btnAnteriorMes.addEventListener('click', () => {
        if (fechaActual.getMonth() > 0) {
            fechaActual.setMonth(fechaActual.getMonth() - 1);
        } else {
            fechaActual.setMonth(11);
            fechaActual.setFullYear(fechaActual.getFullYear() - 1);
        }
        mostrarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());
    });

    btnSiguienteMes.addEventListener('click', () => {
        if (fechaActual.getMonth() < 11) {
            fechaActual.setMonth(fechaActual.getMonth() + 1);
        } else {
            fechaActual.setMonth(0);
            fechaActual.setFullYear(fechaActual.getFullYear() + 1);
        }
        mostrarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());
    });

});

