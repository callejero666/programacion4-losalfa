document.addEventListener("DOMContentLoaded", function () {
    let medicoSeleccionado = null;
    let turnoSeleccionado = null;
    let pacienteId = 123; // Simulado
    let turnoPorMedicoSeleccionado = {};
    let fechaActual = new Date();
  
    const doctores = [
      { id: 1, nombre: "Dr. Juan Pérez", horarioTrabajo: ["09:00-12:00", "14:00-18:00"] },
      { id: 2, nombre: "Dra. María López", horarioTrabajo: ["08:00-12:00", "13:00-17:00"] },
      { id: 3, nombre: "Dr. Carlos Gómez", horarioTrabajo: ["08:00-12:00", "13:00-17:00"] },
      { id: 4, nombre: "Dra. Ana Rodríguez", horarioTrabajo: ["09:00-12:00", "14:00-18:00"] },
    ];
  
    const horariosDisponibles = [
      { doctorId: 1, dia: "2025-01-25", turnos: ["09:00", "09:30", "10:00", "10:30"] },
      { doctorId: 2, dia: "2025-01-26", turnos: ["08:00", "08:30", "09:00", "09:30"] },
      { doctorId: 3, dia: "2025-02-05", turnos: ["08:00", "08:30", "09:00", "09:30"] },
      { doctorId: 4, dia: "2025-02-15", turnos: ["09:00", "09:30", "10:00", "10:30"] },
    ];
  
    const calendarioTemplate = `
      <div class="mes-selector">
        <button class="prev-month">Anterior</button>
        <span class="mes-titulo"></span>
        <button class="next-month">Siguiente</button>
      </div>
      <div class="calendario-grid"></div>
      <ul class="turnos-disponibles"></ul>
    `;
  
    // Configurar tarjetas de doctores
    document.querySelectorAll(".doctor-card").forEach((card, index) => {
      const doctor = doctores[index];
      const calendarioContainer = card.querySelector(".calendario-container");
      calendarioContainer.innerHTML = calendarioTemplate;
  
      // Evento al seleccionar doctor
      card.addEventListener("click", () => {
        medicoSeleccionado = doctor;
  
        // Ocultar otros calendarios
        document.querySelectorAll(".calendario-container").forEach((calendario) => {
          calendario.classList.add("hidden");
        });
  
        // Mostrar calendario actual
        calendarioContainer.classList.remove("hidden");
        mostrarCalendario(calendarioContainer, fechaActual.getMonth(), fechaActual.getFullYear());
      });
  
      // Botones de navegación del calendario
      const btnPrev = calendarioContainer.querySelector(".prev-month");
      const btnNext = calendarioContainer.querySelector(".next-month");
  
      btnPrev.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        mostrarCalendario(calendarioContainer, fechaActual.getMonth(), fechaActual.getFullYear());
      });
  
      btnNext.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        mostrarCalendario(calendarioContainer, fechaActual.getMonth(), fechaActual.getFullYear());
      });
    });
  
    // Mostrar calendario
    function mostrarCalendario(container, mes, año) {
      const calendarioGrid = container.querySelector(".calendario-grid");
      const mesTitulo = container.querySelector(".mes-titulo");
      calendarioGrid.innerHTML = "";
      mesTitulo.textContent = `${mes + 1} - ${año}`;
  
      const primerDia = new Date(año, mes, 1);
      const ultimoDia = new Date(año, mes + 1, 0);
  
      for (let i = 0; i < primerDia.getDay(); i++) {
        calendarioGrid.appendChild(document.createElement("div"));
      }
  
      for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const fecha = new Date(año, mes, dia).toISOString().split("T")[0];
        const divDia = document.createElement("div");
        divDia.textContent = dia;
        divDia.classList.add("dia");
  
        const diaDisponible = horariosDisponibles.find(
          (d) => d.dia === fecha && d.doctorId === medicoSeleccionado.id
        );
  
        if (diaDisponible) {
          divDia.classList.add("disponible");
          divDia.addEventListener("click", () => mostrarTurnos(container, diaDisponible));
        }
  
        calendarioGrid.appendChild(divDia);
      }
    }
  
    // Mostrar turnos disponibles
    function mostrarTurnos(container, dia) {
      const turnosUl = container.querySelector(".turnos-disponibles");
      turnosUl.innerHTML = "";
  
      dia.turnos.forEach((turno) => {
        const li = document.createElement("li");
        li.textContent = turno;
        li.classList.add("turno-disponible");
        li.addEventListener("click", () => seleccionarTurno(dia.dia, turno, li));
        turnosUl.appendChild(li);
      });
    }
  
    // Seleccionar turno
    function seleccionarTurno(dia, turno, liElemento) {
      if (turnoPorMedicoSeleccionado[medicoSeleccionado.id]) {
        alert("Ya seleccionaste un turno con este médico.");
        return;
      }
  
      turnoSeleccionado = { dia, turno };
      turnoPorMedicoSeleccionado[medicoSeleccionado.id] = turno;
  
      liElemento.classList.remove("turno-disponible");
      liElemento.classList.add("turno-seleccionado");
  
      alert(`Turno seleccionado para el ${dia} a las ${turno}.`);
    }
  });
  