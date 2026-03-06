# Propuesta PoC
## Plataforma digital privada para comunidad residencial premium

---

# 1. Objetivo general

Diseñar y validar un **Proof of Concept (PoC)** de una plataforma digital privada orientada a residentes de edificios residenciales premium, con foco en facilitar interacción segura entre residentes, generación de confianza y dinamización de servicios internos.

La solución busca resolver necesidades reales de comunidad dentro del edificio mediante un entorno digital controlado y validado.

---

# 2. Problema que resuelve

Actualmente en edificios residenciales de alto estándar existen necesidades recurrentes que no cuentan con una solución digital integrada:

- compra y venta interna de artículos entre residentes
- recomendaciones confiables de servicios personales
- visibilidad de emprendimientos o servicios ofrecidos por residentes
- canal seguro de interacción entre vecinos

Esto genera una oportunidad clara de crear una plataforma privada con identidad comunitaria.

---

# 3. Alcance inicial PoC (MVP)

El PoC considera tres módulos principales:

---

# 3.1 Marketplace interno

## Objetivo

Permitir compra y venta entre residentes del mismo edificio.

## Funcionalidades mínimas

- publicación de productos
- carga de imágenes
- descripción
- precio
- categoría
- estado (activo / vendido)
- contacto interno o chat simple
- historial de publicaciones

## Casos de uso

- venta de muebles
- electrodomésticos
- artículos de mudanza
- objetos usados

## Consideraciones

- moderación de contenido
- límite de publicaciones por usuario
- validación de usuarios residentes

---

# 3.2 Recomendaciones de servicios

## Objetivo

Permitir que residentes recomienden proveedores o servicios confiables.

## Categorías ejemplo

- nana
- transporte
- paseador de perros
- decorador
- electricista
- jardinero
- personal trainer

## Funcionalidades mínimas

- publicación de recomendación
- rating simple
- comentario
- categoría
- contacto opcional

## Valor principal

Genera confianza dentro de comunidad cerrada.

---

# 3.3 Emprendedores residentes

## Objetivo

Dar visibilidad a residentes que ofrecen productos o servicios.

## Ejemplos

- abogado
- psicólogo
- diseñador interior
- coach
- fotógrafo

## Funcionalidades mínimas

- perfil básico
- descripción servicio
- contacto
- descuento para residentes (opcional)

---

# 4. Control de acceso y seguridad

Este punto es crítico para viabilidad.

## Mínimo necesario

- login con correo validado
- teléfono validado
- unidad/departamento asociado
- aprobación por administración

## Ideal

- integración con base de residentes
- invitación cerrada

---

# 5. Moderación y gobierno de contenido

Necesario para proteger reputación del edificio.

## Funciones mínimas

- reporte de publicación
- panel administración
- bloqueo de usuario
- baja de contenido

## Riesgos mitigados

- spam
- contenido inapropiado
- publicaciones no autorizadas

---

# 6. Arquitectura recomendada

## Frontend móvil

**React Native**

Ventajas:

- una sola base de código para iOS y Android
- buen balance entre velocidad de desarrollo y madurez tecnológica
- facilidad para escalar con TypeScript
- amplia disponibilidad de desarrolladores en mercado chileno

## Backend

**Firebase** o backend custom según nivel de control requerido

Ventajas:

- autenticación rápida
- base de datos escalable
- notificaciones push
- reducción de tiempo de desarrollo en etapas iniciales

## Panel administración

Aplicación web simple para administración interna.

## Infraestructura sugerida

- Firebase Authentication
- Firestore
- Cloud Functions
- Storage
- Push Notifications

---

# 7. Roadmap sugerido

## Fase 1 — Discovery

Duración estimada: 2 a 3 semanas

Incluye:

- workshops funcionales
- definición alcance
- diseño de flujos
- wireframes
- arquitectura inicial

## Entregables

- documento funcional
- backlog inicial
- prototipo navegable

---

## Fase 2 — Desarrollo PoC

Duración estimada: 8 a 12 semanas

Incluye:

- desarrollo app móvil
- backend
- panel administración
- testing

## Entregables

- versión interna operativa
- ambiente de pruebas
- piloto controlado

---

## Fase 3 — Piloto controlado

Duración estimada: 4 a 6 semanas

Aplicación en un edificio real.

## Objetivos

- validar adopción
- medir frecuencia de uso
- detectar fricciones reales

---

# 8. Estimación económica mercado chileno

## Opción A — MVP básico

Incluye:

- login
- marketplace
- recomendaciones
- emprendedores
- admin básico

**Estimación:** 8M – 15M CLP

---

## Opción B — MVP sólido

Incluye:

- chat interno
- notificaciones push
- moderación robusta
- UX más pulida

**Estimación:** 15M – 30M CLP

---

## Opción C — Producto escalable multi edificio

Incluye:

- multi tenant
- roles
- dashboards
- arquitectura escalable
- APIs

**Estimación:** 30M – 60M+ CLP

---

# 9. Costos mensuales posteriores

## Infraestructura

- cloud
- base de datos
- storage

## Soporte

- correcciones
- actualizaciones
- monitoreo

**Estimación:** 500 mil a 2M CLP mensuales

---

# 10. Riesgos principales

## Riesgo técnico

Moderación insuficiente o mal control de acceso.

## Riesgo negocio

Baja adopción de usuarios.

## Riesgo producto

Construir demasiado antes de validar uso real.

---

# 11. Oportunidad futura

Si el piloto funciona, puede evolucionar hacia producto para:

- edificios premium
- multifamily
- condominios
- administradoras inmobiliarias

## Modelo posible

- setup inicial
- fee mensual SaaS

---

# 12. Próximo paso recomendado

Antes de desarrollo completo:

## Validar comercialmente

Pregunta clave:

**¿Cuántos edificios pagarían por esto además del primero?**

---

# 13. Recomendación final

Construir primero un PoC liviano, validar uso real y luego decidir escalamiento.

La prioridad inicial no es complejidad tecnológica, sino adopción real de residentes y capacidad de moderación.
