# 📘 EduCom Web – Plataforma de Gestión Escolar

<div align="center">

![Version](https://img.shields.io/badge/versión-1.0.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/estado-Finalizado-green.svg?style=for-the-badge)
![Tech](https://img.shields.io/badge/stack-MEVN-green.svg?style=for-the-badge)
![License](https://img.shields.io/badge/licencia-Privada-red.svg?style=for-the-badge)

**Transformación digital para la comunicación entre el Colegio Arica y su comunidad.**

[Ver Demo](#) · [Reportar Bug](https://github.com/J2N-Software/educom-web/issues) · [Solicitar Feature](https://github.com/J2N-Software/educom-web/issues)

</div>

---

## 🧩 Descripción General

**EduCom Web** es una solución integral desarrollada por **J2N Software** para modernizar los procesos administrativos y comunicacionales del **Colegio Arica**.

El sistema elimina las barreras de la comunicación tradicional, centralizando la información en un entorno seguro y rápido. Permite a los docentes gestionar cursos y asistencia, mientras que los apoderados reciben notificaciones en tiempo real con confirmación de lectura obligatoria, garantizando la trazabilidad de la información.

---

## 📸 Galería del Sistema

> **Nota:** El sistema cuenta con una interfaz basada en *Glassmorphism* y modo oscuro para una experiencia visual moderna y cómoda.

| **1. Home (Landing Page)** | **2. Acceso y Seguridad** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/6ded73bc-d19d-42cf-96f2-549529ced988" width="100%" alt="Home Page" /> | <img src="https://github.com/user-attachments/assets/60648b43-f29a-401e-bcb9-79ad57b63495" width="100%" alt="Login Segura" /> |
| *Portal público informativo con diseño moderno.* | *Autenticación segura con JWT y validación de roles.* |

| **3. Portal del Profesor** | **4. Portal del Apoderado** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/78b30c77-3573-4212-9cc1-f030006b25f5" width="100%" alt="Dashboard Profesor" /> | <img src="https://github.com/user-attachments/assets/4b3cd1da-7048-41f1-8e81-0f397ca63e9f" width="100%" alt="Dashboard Apoderado" /> |
| *Gestión de cursos, métricas y envío de comunicados.* | *Bandeja de entrada en tiempo real y alertas.* |

| **5. Dashboard de Administración (TI)** | **6. Portal del Director** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/50daef34-ab73-4dbf-8a23-fa7514bdf581" width="100%" alt="Dashboard TI" /> | <img src="https://github.com/user-attachments/assets/eeda7157-9f5f-4288-ab4e-0e4e92c72260" width="100%" alt="Dashboard Director" /> |
| *Control total de usuarios, base de datos y auditoría.* | *Visión estratégica y gestión institucional.* |

---

## 🚀 Características Clave

- **📡 Comunicación en Tiempo Real:** Actualización automática (Polling/Push) de notificaciones sin recargar la página.
- **✅ Trazabilidad:** Confirmación de lectura y asistencia digital por parte de los apoderados.
- **🛡️ Seguridad Robusta:** Encriptación de contraseñas (Bcrypt), JWT para sesiones y protección contra borrados accidentales.
- **👥 Gestión de Roles:** Permisos granulares para Administradores, TI, Profesores, Directores y Apoderados.
- **📊 Auditoría Completa:** Registro detallado de todas las acciones realizadas en el sistema (Logs).

---

## 🛠️ Stack Tecnológico

El proyecto utiliza una arquitectura moderna y escalable:

### Frontend
- **Framework:** ![Vue.js](https://img.shields.io/badge/-Vue.js_3-4FC08D?logo=vue.js&logoColor=white)
- **Build Tool:** ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
- **Estilos:** ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
- **Iconos:** Lucide Vue

### Backend
- **Runtime:** ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
- **Framework:** ![Express](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white)
- **ORM:** ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white)
- **Base de Datos:** MySQL / PostgreSQL
- **Seguridad:** JSON Web Tokens (JWT) + Bcrypt

---

## 🏗️ Arquitectura del Sistema

```mermaid
graph TD
    A["Cliente Web (Vue 3)"] -->|"REST API / Axios"| B["Servidor (Express.js)"]
    B -->|"Auth Middleware"| C{"¿JWT Válido?"}
    C -->|Sí| D[Controladores]
    C -->|No| E["Error 401 Unauthorized"]
    D -->|"Prisma ORM"| F[("Base de Datos")]
    D -->|"Audit Logs"| F
