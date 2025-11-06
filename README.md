
# 📘 EduCom Web – Plataforma de Comunicación Colegio Arica

**Desarrollado por:** J2N Software  
**Versión:** 1.0.0  
**Líder de Proyecto:** [Jorell Bermejo Arias](https://github.com/JorellBermejo)  
**Última actualización:** Noviembre 2025  

---

## 🧩 Descripción General

**EduCom Web** es una plataforma desarrollada por **J2N Software** para optimizar la comunicación entre el **Colegio Arica** y los **apoderados**.  
El sistema permite enviar y confirmar notificaciones institucionales en tiempo real, garantizando trazabilidad y transparencia, mejorando así los procesos administrativos y la participación familiar.

---

## 🚀 Objetivos del Proyecto

- Centralizar la comunicación entre colegio y apoderados.  
- Garantizar la **confirmación de lectura** de comunicados.  
- Permitir la **gestión de usuarios, cursos y mensajes**.  
- Ofrecer un **panel administrativo moderno e intuitivo**.  
- Impulsar la **transformación digital educativa** en el Colegio Arica.

---

## 🏗️ Arquitectura del Proyecto

Frontend (Vite + Vue.js)
│
├── Componentes UI → TailwindCSS + Lucide Icons
│
Backend (Node.js + Express)
│
├── ORM → Prisma
├── Autenticación → JWT Tokens + Middleware seguro
│
Base de Datos (PostgreSQL)
│
Infraestructura → Servidor local + OneDrive Sync


---

## ⚙️ Tecnologías Utilizadas

| Categoría | Tecnología |
|------------|-------------|
| **Frontend** | Vue.js 3, Vite, TailwindCSS |
| **Backend** | Node.js, Express, Prisma ORM |
| **Base de Datos** | PostgreSQL |
| **Autenticación** | JSON Web Tokens (JWT) |
| **Infraestructura** | OneDrive, GitHub, Firebase Hosting (demo) |
| **Gestión de Proyecto** | Scrum + ITIL 4 |

---

## 💡 Características Principales

- 📩 Envío y confirmación de comunicados institucionales.  
- 🧑‍🏫 Gestión de cursos, docentes y apoderados.  
- 🔒 Autenticación por roles con JWT.  
- ⚡ Carga rápida mediante Vite.  
- 📊 Reportes con métricas educativas.  
- 🧾 Historial y seguimiento de notificaciones.

---

## 🧠 Metodología de Trabajo

El desarrollo se realizó bajo un enfoque **ágil (Scrum)** con entregas iterativas y reuniones quincenales con el cliente.  
Además, se aplicaron prácticas de **ITIL 4** en la gestión de incidentes, cambios y aseguramiento de calidad del servicio.

---

## 👥 Equipo de Desarrollo

| Integrante | Rol | Responsabilidades |
|-------------|------|-------------------|
| **Jorell Antonio Bermejo Arias** | Líder de Proyecto / Backend Lead | Arquitectura, autenticación y despliegue |
| **Nicolás Benjamín Ponce Hernández** | Scrum Master / Frontend | Coordinación ágil y desarrollo UI |
| **Juan David Camilo Churata Mamani** | QA / Tester | Pruebas funcionales y documentación |

---

## 📦 Instalación y Ejecución

### 🔧 Requisitos Previos
- Node.js ≥ 18  
- PostgreSQL ≥ 14  
- Git  
- Navegador moderno (Chrome, Firefox o Edge)

### 💻 Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/J2N-Software/educom-web.git

# Instalar dependencias Frontend
cd educom-web/frontend
npm install
npm run dev

# Instalar dependencias Backend
cd ../backend
npm install
npm run dev

Accede al entorno local en:
👉 http://localhost:5173

