# La evaluación docente del Ineval, explicada para el equipo

> Investigación del 26 nov 2026, para entender a quién le vendemos y estructurar Pragma sin enredos.
> Fuentes oficiales leídas: el Modelo de Evaluación del Desempeño Docente, la Nota técnica de calificación (abril 2026) y el Reglamento (Resolución INEVAL-INEVAL-2026-0012-R, 24 abr 2026). Lo que viene de blogs está marcado.

## 1. Qué es y para qué sirve

- Es la **Evaluación del Desempeño Docente (EVDO)** del Ineval, el instituto público que evalúa la educación en Ecuador.
- **Es obligatoria** para los docentes públicos con **nombramiento definitivo** en escuelas y colegios **fiscales y fiscomisionales** (Reglamento, art. 2). Los particulares no la rinden.
- **Para qué la usa el Ministerio** (Modelo, pág. 11):
  1. armar rutas de formación para cada docente;
  2. los procesos de **ascenso y recategorización** en el escalafón docente.
- **Por qué le importa tanto al docente:** el escalafón tiene categorías (de la G, la de ingreso, a la A). Subir de categoría significa **ganar más sueldo**, y uno de los requisitos para subir es tener la calificación exigida en esta evaluación (Reglamento General de la LOEI, art. 266). Según la Codificación de la LOEI, art. 185, el resultado del Ineval cuenta para categorizar a cada docente.
- **Si le va mal:** la ley dice que la evaluación **no es sancionadora**, así que nadie pierde el puesto. Lo que pierde es la posibilidad de ascender (dato de blogs; el puntaje mínimo para el ascenso todavía lo tiene que fijar un reglamento del Ministerio).

## 2. Cómo se organiza

**Por especialidad, y cada docente rinde UNA.** El modelo oficial lo dice así: *«El personal docente será evaluado conforme a la especialidad del nombramiento obtenido»*. No importa si en la práctica da varias materias: se evalúa en la especialidad de su nombramiento, que el Ministerio tiene registrada.

**Por fases.** Cada fase agrupa varias especialidades (Reglamento, art. 4). Según lo que Ineval presentó en la Asamblea (dato de blogs):

| Fase | Especialidades |
|---|---|
| **1** | **EGB 2.º a 7.º**, Ciencias Naturales 8.º a 10.º, Estudios Sociales 8.º a 10.º, Biología, Química, Filosofía, Emprendimiento y Gestión, Educación para la Ciudadanía (estas cuatro de Bachillerato) |
| 2 | Matemática (8.º EGB a 3.º BGU), Lengua y Literatura (8.º EGB a 3.º BGU), Física, Historia, Educación Inicial, Educación Física |
| 3 | Bachillerato Técnico, Educación Cultural y Artística |
| 4 | Inglés, Kichwa, Shuar, Francés |

Las fases 1 y 2 suman cerca del **88 % de los docentes** (dato de blogs).

**Las 6 fichas que mandó el cuñado son las de la Fase 1.** Solo falta la de Educación para la Ciudadanía.

**EGB 2.º a 7.º es una sola especialidad.** Es el profesor de escuela, que da todas las materias a su grado. Por eso su prueba mezcla Matemática, Lengua, Naturales y Sociales. **No es lo mismo** que el profesor de Matemática de colegio, que es otra especialidad (Fase 2) con otra ficha.

## 3. La prueba de la Dimensión 1 (la que preparamos)

- Son **99 preguntas** de opción múltiple (Nota técnica, tabla 2):

  | Parte | Preguntas |
  |---|---|
  | Conocimientos de la especialidad | 60 |
  | Conocimientos pedagógicos | 21 |
  | Conocimientos digitales | 18 |

  Pedagógicos y digitales (39 en total) son **iguales para todas las especialidades**.
- La nota va **de 0 a 1000** y sale de los aciertos con una tabla oficial (Nota técnica, anexo 1). Hay cuatro niveles:

  | Nivel | Puntaje | Aciertos (de 99) |
  |---|---|---|
  | En formación | 0 a 600 | 0 a 28 |
  | Fundamental | 601 a 700 | 29 a 60 |
  | Favorable | 701 a 950 | 61 a 92 |
  | Excelente | 951 a 1000 | 93 a 99 |

- Para el docente, el dato útil es este: **con 61 aciertos (62 %) llega a «Favorable»**, y con 93 a «Excelente».
- Las dimensiones 2 y 3 son cuestionarios sin respuestas correctas: dan 1000 puntos a quien los completa. La 4 es una clase grabada que se califica con rúbrica. **Por eso la Dimensión 1 es la única que se prepara estudiando.**

## 4. Decisiones para Pragma (26 nov)

1. **Un curso = una especialidad del Ineval**, con su ficha. Al entrar, el docente elige **la especialidad de su nombramiento**, y la plataforma le explica por qué: es la única en la que lo van a evaluar. Así ya no hay enredo de «doy dos materias».
2. **Conocimientos generales** se escribe una vez y va dentro de todos los cursos (ya funciona así).
3. **Los $45 abren todos los cursos** (ya funciona así). El docente puede **cambiar de curso** cuando quiera, sin perder su avance; sirve si se equivocó al elegir.
4. **Las lecciones gratis siguen siendo 3 en total, no 3 por curso.** Como cada docente rinde una sola especialidad, dar 3 por curso no le aporta nada y abre un hueco: cambiando de curso se sacaría gratis todo Conocimientos generales. Si el dueño lo quiere distinto, es un número en `lib/acceso.ts`.
5. **Mostrar el puntaje como lo da el Ineval:** «tu puntaje estimado: 715 de 1000, Favorable», con la tabla oficial, en el diagnóstico, en el simulacro y en «Mi progreso». Es lo que el docente entiende y lo que le importa para ascender.
6. **El catálogo de cursos sigue las fases:** primero las especialidades de la Fase 1 (tenemos sus fichas), luego Matemática y Lengua de la Fase 2. Los nombres y niveles son los oficiales: «Matemática» es de 8.º EGB a 3.º BGU, no solo «EGB Superior».
7. **El orden de trabajo:** EGB 2.º a 7.º primero (pedido del cuñado y la especialidad con más docentes), después las otras de la Fase 1, y luego la Fase 2.

## 5. Pendiente de confirmar con el cuñado

- **La fecha de la Dimensión 1 en 2027.** El dueño dice que las dimensiones 2, 3 y 4 ya se aplicaron y que la 1 queda para 2027: la jornada de julio de 2026 falló por la plataforma del Ineval. No encontramos la fecha oficial nueva.
- **El puntaje mínimo para ascender.** Lo fija el Ministerio en un reglamento que, según la Asamblea, todavía se estaba preparando.
- **Cómo se reparten las 60 preguntas de EGB** entre las 4 asignaturas. La ficha no lo dice.

## Fuentes

- Ineval, [Modelo de Evaluación del Desempeño Docente](https://www.evaluacion.gob.ec/wp-content/uploads/downloads/2026/05/INEVAL_EVDO_Modelo-de-Evaluacio%CC%81n-de-Desempen%CC%83o-Docente.pdf) (2026).
- Ineval, [Nota técnica de calificación](https://www.evaluacion.gob.ec/wp-content/uploads/downloads/2026/05/INEVAL_EVDO_Nota-te%CC%81cnica-para-la-EVDO.pdf) (abril 2026).
- Ineval, [Reglamento para la Evaluación del Desempeño Docente](https://une.edu.ec/wp-content/uploads/2026/06/INEVAL-EVDO-Reglamento-EVDO-1-1.pdf), Resolución INEVAL-INEVAL-2026-0012-R.
- Blog Dark Oficial Educación: [la Comisión de Educación analiza la evaluación docente](https://darkoficialeducacion1.blogspot.com/2026/02/comision-de-educacion-analiza-de-forma.html) (fases y especialidades) e [INEVAL EVDO 2026](https://darkoficialeducacion1.blogspot.com/p/ineval-evaluacion-docente-2026.html).
- Quiero Ser Maestro: [qué pasa si repruebo](https://quierosermaestro.com.ec/blog/post/que-pasa-si-repruebo-evaluacion-docente-ineval-2026/) y [requisitos para el ascenso](https://quierosermaestro.com.ec/blog/post/requisitos-para-el-ascenso-de-categoria-docente-2026-guia-completa-segun-el-rloei/).
- El Diario, [Ineval reprograma la primera jornada](https://eldiario.ec/ecuador/ineval-reprograma-la-primera-jornada-de-la-evaluacion-del-desempeno-docente-tras-fallos-en-sistema-02072026/) (2 jul 2026).
