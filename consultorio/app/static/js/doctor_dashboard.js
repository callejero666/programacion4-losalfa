document.addEventListener('DOMContentLoaded', () => {
    const diasAtencion = document.getElementById('dias-atencion');
    const mesTitulo = document.getElementById('mes-titulo');
    const turnosDisponibles = document.getElementById('turnos-disponibles');
    const horarioInicioInput = document.getElementById('horario-inicio');
    const horarioFinInput = document.getElementById('horario-fin');
    const aplicarHorariosBtn = document.getElementById('aplicar-horarios');
    const cuadroTurnos = document.getElementById('cuadro-turnos');
    const diasSeleccionados = new Set();

    let fechaActual = new Date();
    const horariosPorDia = {};

    // Generar calendario
    function generarCalendario(mes, año) {
        diasAtencion.innerHTML = '';
        mesTitulo.textContent = `${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(año, mes))} ${año}`;

        const primerDia = new Date(año, mes, 1).getDay();
        const diasEnMes = new Date(año, mes + 1, 0).getDate();

        // Crear días vacíos al inicio
        const diasPrevios = (primerDia === 0 ? 6 : primerDia - 1);
        for (let i = 0; i < diasPrevios; i++) {
            const diaVacio = document.createElement('div');
            diaVacio.classList.add('dia-vacio');
            diasAtencion.appendChild(diaVacio);
        }

        // Crear días del mes
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const diaElemento = document.createElement('div');
            diaElemento.classList.add('dia');
            diaElemento.textContent = dia;

            const fecha = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            diaElemento.dataset.fecha = fecha;

            diaElemento.addEventListener('click', () => toggleSeleccionDia(fecha, diaElemento));

            diasAtencion.appendChild(diaElemento);
        }
    }

    function toggleSeleccionDia(fecha, diaElemento) {
        if (diasSeleccionados.has(fecha)) {
            diasSeleccionados.delete(fecha);
            diaElemento.classList.remove('seleccionado');
        } else {
            diasSeleccionados.add(fecha);
            diaElemento.classList.add('seleccionado');
        }
    }

    function aplicarHorario() {
        const horarioInicio = horarioInicioInput.value;
        const horarioFin = horarioFinInput.value;

        if (!horarioInicio || !horarioFin) {
            alert('Por favor, selecciona una hora de inicio y fin.');
            return;
        }

        if (horarioInicio >= horarioFin) {
            alert('La hora de inicio debe ser menor que la hora de fin.');
            return;
        }

        diasSeleccionados.forEach(fecha => {
            if (!horariosPorDia[fecha]) {
                horariosPorDia[fecha] = [];
            }

            horariosPorDia[fecha] = { inicio: horarioInicio, fin: horarioFin };
            document.querySelector(`[data-fecha="${fecha}"]`).style.backgroundColor = '#ADD8E6';
        });

        diasSeleccionados.clear();
        mostrarTurnos();
    }

    function mostrarTurnos() {
        cuadroTurnos.innerHTML = '';
        for (const fecha in horariosPorDia) {
            const { inicio, fin } = horariosPorDia[fecha];
            const bloque = document.createElement('div');
            bloque.classList.add('turno-bloque');

            let horaActual = new Date(`1970-01-01T${inicio}:00`);
            const horaFin = new Date(`1970-01-01T${fin}:00`);

            while (horaActual < horaFin) {
                const turno = document.createElement('div');
                turno.classList.add('turno');
                const siguienteTurno = new Date(horaActual.getTime() + 25 * 60 * 1000);

                turno.textContent = `${horaActual.toTimeString().substring(0, 5)} - ${siguienteTurno.toTimeString().substring(0, 5)}`;
                bloque.appendChild(turno);

                horaActual = siguienteTurno;
            }

            const tituloFecha = document.createElement('h3');
            tituloFecha.textContent = fecha;

            cuadroTurnos.appendChild(tituloFecha);
            cuadroTurnos.appendChild(bloque);
        }
    }

    // Navegar entre meses
    document.getElementById('prev-month').addEventListener('click', () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        generarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());
    });

    document.getElementById('next-month').addEventListener('click', () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        generarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());
    });

    aplicarHorariosBtn.addEventListener('click', aplicarHorario);

    generarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());
});
