# 🎭 Confesionario Anónimo

Sistema web de confesiones anónimas donde los usuarios pueden compartir sus pensamientos de forma segura, pero con un panel administrativo que permite a usuarios autorizados ver la identidad real de los confesores cuando sea necesario.

## 🚀 Demo en Vivo

- **API Base URL:** `https://confesionario-api.onrender.com`
- **Health Check:** `https://confesionario-api.onrender.com/actuator/health`

---

## 💡 Concepto del Proyecto

**Confesionario Anónimo** es una plataforma que permite a los usuarios expresarse libremente de manera anónima, pero con un sistema de moderación responsable. 

### La Idea Principal

Los usuarios pueden:
- ✍️ Publicar confesiones de forma **completamente anónima**
- 💬 Comentar en confesiones de otros
- ❤️ Dar "me gusta" a las confesiones que resuenen con ellos
- 📂 Organizar confesiones por categorías (amor, amistad, trabajo, familia, etc.)

### El Twist: Panel de Administración

A diferencia de sistemas completamente anónimos donde nadie sabe quién escribió qué, este sistema incluye un **panel de administración** donde:

- 👤 **Solo usuarios autorizados** (que tú designes) pueden acceder
- 🔍 Los admins pueden **revelar la identidad** del autor de cualquier confesión
- 🛡️ Esto permite **moderación responsable** en caso de contenido inapropiado
- ⚖️ Balance entre **anonimato y accountability**

### ¿Por qué esto es útil?

- **Para comunidades educativas:** Permite feedback anónimo pero con accountability si hay bullying
- **Para empresas:** Opiniones honestas de empleados con opción de seguimiento
- **Para grupos sociales:** Confesiones sin juicio, pero con moderación cuando sea necesario
- **Para terapia grupal:** Expresión libre con supervisión profesional controlada

---

## ✨ Características Principales

### Para Usuarios Regulares
- 🎭 **Anonimato Garantizado** - Nadie más que los admins puede saber quién escribió
- 📝 **Confesiones por Categoría** - Organiza tus pensamientos
- ❤️ **Sistema de Likes** - Muestra empatía sin revelar tu identidad
- 💬 **Comentarios** - Participa en conversaciones anónimas
- 🌐 **Vista Pública** - Preview de confesiones sin necesidad de registrarse

### Para Administradores
- 👁️ **Revelación de Identidad** - Ver quién escribió cada confesión
- 🗑️ **Moderación** - Eliminar contenido inapropiado
- 📊 **Estadísticas** - Ver métricas de actividad
- 🔐 **Control de Acceso** - Designar quién puede ser administrador
- 📋 **Historial** - Ver todas las acciones de moderación

### Seguridad y Privacidad
- 🔒 Las identidades están **encriptadas** en el frontend para usuarios regulares
- 🔑 Solo los admins tienen la "clave" para desencriptar y ver identidades
- 📝 Sistema de logs para auditar quién reveló qué identidad y cuándo
- ⚡ Las confesiones se muestran **siempre anónimas** en el feed público

---

## 🛠️ Stack Tecnológico

### Backend
- **Java 17** con **Spring Boot 3.5.6**
- **Spring Data JPA** para manejo de base de datos
- **MySQL 8.0** como base de datos principal
- **Spring Security** para autenticación y roles
- **Spring Boot Actuator** para monitoring
- **Lombok** para código más limpio

### Infraestructura
- **Aiven** - Hosting de MySQL (Plan gratuito 1GB - Permanente)
- **Render** - Hosting de la API (Plan gratuito 750h/mes)
- **Docker** - Containerización para deployment consistente
- **GitHub** - Control de versiones y CI/CD automático

### Frontend (Opciones de Integración)
- Puede consumirse desde cualquier framework (React, Vue, Angular)
- Compatible con sitios estáticos (GitHub Pages, Netlify, Vercel)
- CORS configurado para permitir integraciones

---

## 🎯 Casos de Uso

### 1. Universidad / Colegio
**Problema:** Los estudiantes tienen miedo de dar feedback honesto sobre profesores o compañeros.

**Solución:** Pueden confesarlo anónimamente, pero si hay bullying o amenazas, los administradores (directivos) pueden identificar al autor.

### 2. Empresa
**Problema:** Los empleados no se sienten cómodos expresando opiniones sobre la cultura laboral.

**Solución:** Confesiones anónimas sobre ambiente de trabajo, pero RRHH puede investigar casos específicos si es necesario.

### 3. Grupo de Amigos
**Problema:** Quieren compartir secretos o confesiones sin juicio, pero con una "válvula de escape" si algo es serio.

**Solución:** Todos pueden confesar anónimamente, pero un moderador designado puede intervenir si detecta algo preocupante.

### 4. Terapia Grupal
**Problema:** Pacientes necesitan expresarse sin inhibiciones, pero el terapeuta necesita poder identificar si alguien está en riesgo.

**Solución:** El terapeuta tiene acceso administrativo para ver identidades cuando sea clínicamente necesario.

---

## 🔐 Sistema de Roles y Permisos

### Rol: Usuario Regular
- ✅ Crear confesiones anónimas
- ✅ Ver todas las confesiones (sin ver autores)
- ✅ Dar likes y comentar
- ✅ Ver sus propias confesiones
- ❌ Ver quién escribió otras confesiones
- ❌ Acceder al panel de administración

### Rol: Administrador
- ✅ Todo lo que puede hacer un usuario regular
- ✅ **Ver la identidad real** de cualquier confesión
- ✅ Eliminar confesiones inapropiadas
- ✅ Ver estadísticas detalladas
- ✅ Gestionar otros administradores
- ✅ Ver logs de moderación

### Rol: Super Administrador (Tú)
- ✅ Todo lo que puede hacer un administrador
- ✅ **Designar nuevos administradores**
- ✅ Revocar permisos de administrador
- ✅ Configurar reglas del sistema
- ✅ Exportar datos

---

## 📱 Flujo de Usuario

### Para un Usuario Regular:

1. **Registro/Login** → Crea su cuenta
2. **Dashboard** → Ve confesiones anónimas de otros
3. **Nueva Confesión** → Escribe su confesión, elige categoría, envía
4. **Feed Público** → Su confesión aparece anónima para todos
5. **Interacción** → Otros pueden dar like o comentar (también anónimamente)

### Para un Administrador:

1. **Login Administrativo** → Accede con credenciales especiales
2. **Panel Admin** → Ve todas las confesiones
3. **Revelar Identidad** → Click en "Ver autor" de cualquier confesión
4. **Sistema de Logs** → Se registra que el admin X reveló la identidad de la confesión Y
5. **Moderación** → Puede eliminar o marcar contenido según reglas

---

## 🔌 Consumir la API

### Endpoints Públicos (Sin Autenticación)

```javascript
// Obtener preview de confesiones (anónimas)
GET /api/confesiones/preview

// Obtener estadísticas generales
GET /api/confesiones/stats
```

### Endpoints de Usuario (Requiere Token)

```javascript
// Ver todas las confesiones (anónimas)
GET /api/confesiones

// Crear nueva confesión
POST /api/confesiones
Headers: { "Usuario-Id": "123" }
Body: { 
  "contenido": "Mi confesión...",
  "categoria": "AMOR",
  "anonimo": true 
}

// Dar like
POST /api/confesiones/{id}/like
Headers: { "Usuario-Id": "123" }
```

### Endpoints Administrativos (Requiere Rol Admin)

```javascript
// Revelar identidad de una confesión
GET /api/admin/confesiones/{id}/autor
Headers: { 
  "Authorization": "Bearer admin_token",
  "Admin-Id": "1" 
}

// Ver logs de moderación
GET /api/admin/logs

// Eliminar confesión
DELETE /api/admin/confesiones/{id}
```

---

## 📊 Ejemplo de Respuesta

### Confesión Anónima (Usuario Regular)
```json
{
  "id": 150,
  "contenido": "Nunca le dije a nadie esto pero...",
  "categoria": "SECRETO",
  "fecha": "2025-10-18T22:30:00",
  "likes": 23,
  "comentarios": 5,
  "anonimo": true,
  "autor": "Anónimo"  // ← Siempre muestra "Anónimo"
}
```

### Confesión Revelada (Administrador)
```json
{
  "id": 150,
  "contenido": "Nunca le dije a nadie esto pero...",
  "categoria": "SECRETO",
  "fecha": "2025-10-18T22:30:00",
  "likes": 23,
  "comentarios": 5,
  "anonimo": true,
  "autor": "Anónimo",
  "autorReal": {  // ← Solo visible para admins
    "id": 42,
    "username": "juan_perez",
    "email": "juan@example.com"
  },
  "reveladoPor": "admin_maria",
  "fechaRevelacion": "2025-10-19T10:15:00"
}
```

---

## 🚀 Deployment y Hosting

### Base de Datos: Aiven (Gratis y Permanente)
- **Plan:** 1 GB de almacenamiento
- **Costo:** $0 (gratis para siempre)
- **Backups:** Automáticos cada 24 horas
- **Ubicación:** Seleccionable (recomendado: São Paulo para LATAM)

### API: Render (Gratis)
- **Plan:** 750 horas/mes (suficiente para 24/7)
- **Costo:** $0 (gratis)
- **Auto-deploy:** Cada push a GitHub
- **Cold Start:** Se duerme después de 15 min sin uso (despierta en 30-60 seg)

### Frontend: GitHub Pages / Vercel (Gratis)
- **Plan:** Hosting estático ilimitado
- **Costo:** $0 (gratis)
- **Deploy:** Automático desde GitHub

**Total de costos mensuales: $0** 🎉

---

## 💻 Instalación Local

### Prerrequisitos
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Pasos Rápidos

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/Confesionario.git
cd Confesionario

# 2. Configurar base de datos
mysql -u root -p
CREATE DATABASE confesiones_db;

# 3. Configurar credenciales
# Editar src/main/resources/application.properties

# 4. Ejecutar
mvn spring-boot:run
```

La API estará en: `http://localhost:8080`

---

## 🔒 Consideraciones de Privacidad

### Lo que SÍ hace el sistema:
✅ Guarda la relación entre usuario y confesión en la base de datos  
✅ Permite a administradores autorizados ver esta relación  
✅ Registra en logs cada vez que un admin revela una identidad  
✅ Muestra confesiones como anónimas para usuarios regulares  

### Lo que NO hace el sistema:
❌ No vende ni comparte datos con terceros  
❌ No muestra identidades públicamente  
❌ No permite que usuarios regulares vean autores  
❌ No usa los datos para publicidad  

### Recomendaciones para uso responsable:
- 🔐 Solo designar admins de **extrema confianza**
- 📝 Establecer **políticas claras** sobre cuándo revelar identidades
- ⚖️ Usar el poder de revelación **solo cuando sea necesario** (amenazas, bullying grave, etc.)
- 📋 Revisar logs regularmente para detectar abusos de poder administrativo

---

## 📈 Escalabilidad

### Con el plan gratuito actual:
- ✅ Hasta **100,000+ usuarios**
- ✅ Hasta **500,000+ confesiones**
- ✅ Millones de likes y comentarios
- ✅ Perfecto para comunidades pequeñas a medianas

### Si crece más allá de eso:
- **Aiven:** Upgrade a $8-10/mes (10-25 GB)
- **Render:** Upgrade a $7/mes (sin cold starts)
- **Total:** ~$15-20/mes para comunidades muy grandes

---

## 🤝 Contribuir

Este proyecto está abierto a contribuciones. Ideas de features:

- 🔔 Sistema de notificaciones
- 🏷️ Tags personalizados
- 🔍 Búsqueda avanzada
- 📧 Reportes por email
- 🌓 Modo oscuro
- 📱 App móvil nativa

---

## 📄 Licencia

MIT License - Usa, modifica y distribuye libremente.

---

## 🙏 Agradecimientos

- **Aiven** por el hosting gratuito de MySQL
- **Render** por el hosting gratuito de APIs
- **Spring Boot** por el excelente framework
- La comunidad open source

---

## 📞 Contacto

¿Preguntas? ¿Ideas? ¿Quieres implementar esto en tu comunidad?

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

---

**⭐ Si te interesa el proyecto, dale una estrella en GitHub!**

**🔐 Recuerda: Con gran poder (de revelar identidades) viene gran responsabilidad.**
