project:
  name: "EduCom Web – Plataforma de Comunicación Colegio Arica"
  version: "1.0.0"
  updated: "Noviembre 2025"
  developed_by: "J2N Software"
  leader: "Jorell Bermejo Arias"
  repository: "https://github.com/J2N-Software/educom-web"

description: |
  EduCom Web es una plataforma web desarrollada por J2N Software para mejorar la comunicación formal entre el Colegio Arica y sus apoderados.
  Permite enviar, recibir y confirmar notificaciones institucionales en tiempo real, asegurando trazabilidad, transparencia y eficiencia administrativa.
  Este proyecto busca optimizar los canales de comunicación, reducir costos operativos y fortalecer la participación de las familias.

objectives:
  - Centralizar la comunicación entre colegio y apoderados.
  - Garantizar la confirmación de lectura de los comunicados enviados.
  - Permitir la gestión administrativa de cursos, usuarios y mensajes.
  - Proveer un panel de control intuitivo para directivos y docentes.
  - Impulsar la transformación digital educativa en el Colegio Arica.

architecture:
  model: "Full-Stack Modular"
  details: |
    El proyecto sigue una arquitectura escalable basada en separación de capas:
      - Frontend: Vite + Vue.js + TailwindCSS
      - Backend: Node.js + Express + Prisma ORM
      - Autenticación: JWT Tokens con middleware seguro
      - Base de datos: PostgreSQL
      - Infraestructura: Servidor local y sincronización con OneDrive

technologies:
  frontend: ["Vue.js 3", "Vite", "TailwindCSS", "Lucide Icons"]
  backend: ["Node.js", "Express", "Prisma ORM"]
  database: "PostgreSQL"
  authentication: "JSON Web Tokens (JWT)"
  infrastructure: ["OneDrive", "Firebase Hosting (demo)", "GitHub"]
  management: ["Scrum", "ITIL 4"]

repository_structure:
  root: "/educom-web"
  folders:
    - frontend:
        files: ["src/", "public/", "vite.config.js"]
    - backend:
        files: ["src/", "prisma/", "server.js"]
    - docs:
        files: ["Plan_Gestion_Proyecto.pdf", "Matriz_Riesgos.pdf", "Solicitud_Cambio_SC-2025-01.pdf", "Informe_Gestion_J2N.pdf"]
    - README: "README.md"

features:
  - "Envío de comunicados con trazabilidad y confirmación de lectura."
  - "Gestión de cursos y docentes desde panel administrativo."
  - "Historial y filtrado de notificaciones enviadas."
  - "Autenticación segura por roles (Administración, Profesor, Apoderado)."
  - "Despliegue rápido con Vite y sincronización en OneDrive."
  - "Módulo de reportes para métricas institucionales."

methodology:
  type: "Scrum + ITIL 4"
  description: |
    El proyecto se desarrolló bajo metodologías ágiles con reuniones quincenales con el cliente.
    Se integraron principios ITIL 4 para la gestión de cambios, incidentes y calidad del servicio.

budget:
  original: "7.900.000 CLP (con IVA)"
  updated: "8.700.000 CLP (con IVA)"
  change_request: "SC-2025-01"
  reason: "Incremento del 10% por costos operativos y de infraestructura adicionales."

team:
  - name: "Jorell Antonio Bermejo Arias"
    role: "Líder de Proyecto / Backend Lead"
    responsibilities: "Arquitectura del sistema, autenticación y despliegue."
  - name: "Nicolás Benjamín Ponce Hernández"
    role: "Scrum Master / Frontend"
    responsibilities: "Coordinación ágil, componentes UI y conexión API."
  - name: "Juan David Camilo Churata Mamani"
    role: "QA / Tester"
    responsibilities: "Pruebas funcionales, documentación y control de calidad."

installation:
  requirements:
    - "Node.js ≥ 18"
    - "PostgreSQL ≥ 14"
    - "Git"
    - "Navegador moderno (Chrome, Firefox o Edge)"
  steps: |
    git clone https://github.com/J2N-Software/educom-web.git
    cd educom-web/frontend
    npm install
    npm run dev
    cd ../backend
    npm install
    npm run dev
  access_url: "http://localhost:5173"

security:
  - "JWT Tokens con expiración controlada."
  - "Cifrado de contraseñas con bcrypt."
  - "Control de roles y permisos en endpoints críticos."
  - "Registro de auditoría en base de datos."

documentation:
  folder: "/docs"
  files:
    - "Plan de Gestión de Proyecto"
    - "Matriz de Riesgos"
    - "Solicitud de Cambio SC-2025-01"
    - "Informe de Gestión Final"

license:
  owner: "J2N Software"
  client: "Colegio Arica"
  restrictions: "Proyecto exclusivo, no reproducible sin autorización escrita."
  year: 2025

contact:
  team_email: "j2nsoftware@gmail.com"
  leader_email: "jorellbermejo@gmail.com"
  location: "Arica, Chile"
  year: 2025
