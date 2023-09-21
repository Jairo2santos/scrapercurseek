import puppeteer from "puppeteer";
import fs from "fs";


async function extractCourseDetails(urls) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let courseDetails = [];

    for (let url of urls) {
        await page.goto(url);
    
        const details = await page.evaluate(() => {
            let title, startDate, duration, price, modalities, teachers, courseDescription;
    
            try {
                title = document.querySelector('h1').innerText;
            } catch (error) {
                console.error("Error al obtener el título del curso.");
            }
    
            try {
                startDate = document.querySelector('p.MuiTypography-root.MuiTypography-body1.css-x52e50').innerText;
            } catch (error) {
                console.error("Error al obtener la fecha de inicio del curso.");
            }
    
            try {
                duration = document.querySelector('p.MuiTypography-root.MuiTypography-body1.css-1ly5z01 > span').innerText;
            } catch (error) {
                console.error("Error al obtener la duración del curso.");
            }
    
            try {
                price = document.querySelector('label.text-price.m-0 > span').innerText;
            } catch (error) {
                console.error("Error al obtener el precio del curso.");
            }
    
            try {
                modalities = Array.from(document.querySelectorAll('.modalities-features-label')).map(el => el.innerText);
            } catch (error) {
                console.error("Error al obtener las modalidades del curso.");
            }
    
            try {
                teachers = Array.from(document.querySelectorAll('div.pt-4.pb-4.px-0.pl-md-3.mx-auto.col-11.col-md-10 > h3')).map(el => el.innerText).join(', ');
            } catch (error) {
                console.error("Error al obtener los profesores del curso.");
            }
   
            try {
                courseDescription = document.querySelector('div.MuiBox-root.css-1u6733f > section > h6').innerText;
            } catch (error) {
                console.error("Error al obtener la descripción del curso.");
            }
    
            return {
                title,
                startDate,
                duration,
                price,
                modalities,
                teachers,
                courseDescription
            };
        });

        courseDetails.push(details);
    }

    await browser.close();
    return courseDetails;
}

// Lista de URLs de cursos
const courseUrls = [
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1402/gestion-del-programa-de-seguridad-y-legajo-tecnico-en-obra?id=999192272',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1774/diplomatura-de-coaching-ludico-y-gamificacion-con-mindfulness-e-inteligencia-emocional?id=999192001',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1548/curso-de-gestion-del-cliente?id=999190925',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1169/neurociencia-aplicada-a-las-organizaciones?id=999190669',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1148/fundamentos-de-bpm-gobierno-y-organizacion-por-procesos?id=999193577',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1147/diplomatura-en-gestion-por-procesos-de-negocio-bpm?id=999193578',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2562/curso-de-trading-y-analisis-tecnico-de-cero-a-avanzado-con-binance?id=999190410',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1134/administracion-y-contabilidad-para-no-especialistas?id=999191230',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1552/curso-de-mi-primer-trabajo-como-jefe?id=999191170',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/392/analista-de-inversiones-y-mercados-financieros-con-aplicacion-de-simulador-de-operaciones-bursatiles-en-tiempo-real?id=999191146',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1595/gestion-estrategica-y-riesgos-aplicado-a-los-sistemas-de-gestion-de-calidad-iso-9001?id=999190815',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1117/seguridad-y-saneamiento-de-la-planta-industrial?id=999191800',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/989/diplomatura-en-gestion-de-pymes-con-orientacion-en-comunicacion-eficaz?id=999190695',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/461/como-gestionar-una-pyme?id=999190698',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1542/diplomado-en-recursos-humanos?id=999191743',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/2116/diplomatura-de-felicidad-y-bienestar-organizacional?id=999192010',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/118/diplomado-en-gestion-municipal?id=999190712',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1266/product-owner-gestion-de-productos-con-metodologias-agiles?id=999190710',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/326/experto-universitario-en-comportamiento-organizacional?id=999190722',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2175/curso-de-evaluacion-y-clasificacion-de-areas-peligrosas?id=999190726',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2048/curso-de-liquidacion-de-sueldos?id=999191696',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1998/data-product-management-data-y-analytics?id=999190745',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/180/introduccion-a-la-gestion-por-procesos?id=999191739',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2798/curso-de-compliance-y-lavado-de-dinero?id=999191962',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1145/marketing-y-canales-de-distribucion-en-las-industrias-artisticas-creativas-y-culturales?id=999190149',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2922/curso-de-administracion-de-personal-en-contextos-hibridos?id=999193023',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2522/curso-de-introduccion-al-coaching-profesional?id=999193678',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2598/costos-desde-cero?id=999190691',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3167/curso-de-atencion-al-cliente-gestion-de-reclamos-y-medicion-de-la-satisfaccion?id=999193643',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2939/curso-de-administracion-de-tiempo-y-productividad-personal-con-chat-gpt?id=999193007',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3199/metricas-agiles-con-jira?id=999193778',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2508/curso-de-como-convertirse-en-asesor-financiero?id=999190387',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3195/curso-de-equipos-agiles-de-alto-rendimiento?id=999193782',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1376/operador-de-mercados-financieros?id=999190766',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1715/taller-de-curaduria-en-el-arte-contemporaneo?id=999190361',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1410/experto-universitario-en-estudios-de-terrorismo-y-crimen-organizado?id=999191087',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1983/diplomatura-en-product-management?id=999191287',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1086/introduccion-a-iso-9001-2015?id=999190822',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2599/curso-de-economia-para-principiantes?id=999190720',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2929/curso-de-liquidacion-de-iva-y-libro-digital-iva?id=999193017',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/posgrado/1218/posgrado-en-gestion-de-proyectos?id=999190801',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3173/curso-de-liderazgo-agil-y-transformacion-organizacional?id=999193670',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/2035/diplomatura-en-sistemas-de-gestion-de-la-calidad-iso-9001?id=999190813',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/110/experto-universitario-en-lean-six-sigma-black-belt?id=999191829',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/105/experto-universitario-en-lean-six-sigma-green-belt?id=999191832',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1468/curso-estrategias-y-recursos-para-un-cambio-laboral-efectivo?id=999192251',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1460/curso-de-oratoria-persuasion-y-comunicacion-efectiva?id=999192097',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/996/gestion-y-administracion-de-proyectos-de-automatizacion?id=999191922',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2976/it-recruiter?id=999193111',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/482/scrum-grand-master?id=999190970',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/701/implementacion-de-un-sistema-de-gestion-de-seguridad-de-informacion-sgsi-basado-en-la-normativa-iso-iec-27001?id=999190491',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1794/gestion-del-inversor-financiero?id=999191592',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/457/liderazgo-estrategico?id=999190804',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2801/inclusion-laboral-de-personas-con-discapacidad?id=999192292',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/612/diplomatura-en-liderazgo-y-competencias-directivas?id=999190807',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2521/curso-de-liquidacion-ingresos-brutos-convenio-multilateral-afip?id=999190399',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/611/laboratorio-de-analisis-microbiologico-de-agua-y-alimentos-primeros-pasos-hacia-la-acreditacion-de-competencia?id=999191853',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2474/freelancers-como-trabajar-por-tu-cuenta-y-captar-clientes?id=999193147',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1587/implementacion-de-sistema-de-gestion-de-medio-ambiente-iso-14001-2015?id=999191058',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2561/curso-de-monotributo-afip-argentina?id=999190436',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1449/diplomatura-en-gestion-de-ventas?id=999190911',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1546/curso-de-profesional-de-ventas?id=999190916',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1151/tecnologias-bpm-simulacion-y-automatizacion-de-procesos?id=999190656',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1300/diplomado-en-recursos-humanos-del-sector-publico?id=999191198',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1103/relaciones-economicas-internacionales-en-la-actualidad?id=999191946',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2244/liderazgo-y-emociones-en-marcos-de-trabajo-agiles?id=999192082',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2338/curso-de-trading-avanzado-en-criptomonedas?id=999193145',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3278/curso-de-customer-experience-cx-nivel-introductorio?id=999194043',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/381/gestion-agil-de-proyectos-pmi-acp?id=999191410',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1600/agile-grand-coach?id=999191269',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/551/analista-pmo-project-management-officer?id=999191251',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/433/coaching-ontologico?id=999192281',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/382/experto-universitario-en-reclutamiento-2-0-y-seleccion-por-competencias?id=999191176',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/380/introduccion-a-la-programacion-neurolinguistica-pnl?id=999192230',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/309/contabilidad-basica-y-finanzas-para-no-especialistas?id=999191222',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/537/control-de-riesgo-de-proceso-psrm?id=999190482',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1444/curso-de-comunicacion-para-directivos?id=999191073',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/63/control-estadistico-de-procesos?id=999191515',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/389/administrador-de-inversiones-y-gestion-de-patrimonios-financieros-con-aplicacion-de-simulador-de-operaciones-bursatiles-en-tiempo-real?id=999191143',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/552/valoracion-y-clasificacion-arancelaria-de-las-mercaderias?id=999191823',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1933/curso-de-modelado-de-procesos-en-bpmn?id=999193573',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1409/experto-universitario-en-mercado-de-capitales?id=999191139',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1528/diplomatura-en-marketing-politico?id=999191556',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1085/auditor-interno-en-gestion-de-la-calidad-iso-9001-2015?id=999190818',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1453/experto-universitario-en-counseling?id=999192091',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2846/curso-de-neuromanagement-y-neuroliderazgo?id=999192190',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1905/experto-universitario-en-administracion-de-consorcios?id=999191361',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3216/curso-de-business-model-canvas-y-lean-canvas-con-chat-gpt?id=999193839',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1982/curso-de-habilidades-directivas-i?id=999191105',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1963/diplomatura-en-sistemas-de-gestion-ambiental-iso-14001?id=999193149',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1547/gestion-de-la-fuerza-de-ventas?id=999190920',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1164/introduccion-a-la-norma-iso-14001-2015?id=999193164',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/317/el-analisis-de-balance-enfocado-en-la-toma-de-decisiones?id=999191225',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1124/curso-de-asistente-administrativo-inicial?id=999190617',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/3192/experto-universitario-en-lean-management?id=999193722',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2797/curso-de-responsabilidad-social-empresaria?id=999191126',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3106/nuevas-formas-de-trabajo-y-empleos-del-futuro?id=999193766',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1456/inversion-y-trading-de-criptomonedas?id=999191705',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/391/analista-tecnico-financiero-y-bursatil?id=999191150',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1473/community-manager-estrategias-de-social-media-y-marketing-digital?id=999191490',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1457/curso-de-bases-de-la-negociacion-para-directivos?id=999191115',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1221/microorganismos-indicadores-en-el-analisis-de-aguas-alimentos-superficies-y-ambientes-de-trabajo?id=999191858',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/2961/diplomatura-en-transformacion-digital?id=999193037',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1417/agrofinanzas?id=999191701',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1588/curso-de-investigacion-de-accidentes-de-trabajo?id=999191807',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1735/operador-de-bonos?id=999191589',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/284/metodologias-agiles-para-el-desarrollo-de-software?id=999191837',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1268/dev-ops-integracion-y-agilidad-continua?id=999191709',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1382/workshop-para-la-identificacion-de-peligros-y-evaluacion-de-los-riesgos-iso-45001-2018?id=999191675',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3231/como-invertir-en-etf-desde-cero?id=999193886',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1704/diplomatura-en-sistemas-de-gestion-de-la-seguridad-y-salud-en-el-trabajo-iso-45001-2018?id=999191682',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1999/curso-de-lean-six-sigma-certificacion-black-belt?id=999191834',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2104/curso-de-growth-marketing?id=999191278',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1394/introduccion-a-la-norma-iso-45001-2018?id=999191679',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/226/formulacion-y-evaluacion-de-proyectos-de-tecnologia?id=999191562',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1654/curso-de-lean-six-sigma-certificacion-yellow-belt?id=999191813',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1396/experto-universitario-en-gestion-de-riesgos-y-evaluacion-de-la-seguridad-y-salud-en-el-trabajo?id=999193882',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2637/curso-de-dinero-mercado-y-finanzas-4-0?id=999190758',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1965/curso-de-analisis-y-diseno-de-procesos?id=999190662',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2084/auditoria-cy-mat?id=999191933',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/1099/experto-universitario-en-relaciones-internacionales?id=999191936',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1451/fundamentos-del-liderazgo-y-el-coaching?id=999191076',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2064/curso-de-auditor-interno-en-sistemas-de-gestion-de-la-seguridad-vial-iso-39001-2012?id=999191930',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1190/trader-en-opciones-financieras-y-futuros?id=999191723',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/471/como-dirigir-la-empresa-familiar?id=999190704',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1384/diplomatura-en-metodologias-y-marcos-de-trabajo-agiles?id=999191275',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1229/prevencion-del-lavado-de-dinero-y-financiacion-del-terrorismo?id=999191727',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1966/diplomatura-en-derecho-internacional-humanitario-y-refugiados?id=999191050',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1534/curso-de-seguridad-y-salud-en-el-uso-de-equipos-autoelevadores?id=999192256',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/122/liderazgo-en-el-marco-de-la-gestion-del-cambio-competencias-directivas-empowerment-y-trabajo-en-equipo?id=999192147',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2861/curso-de-alfabetizacion-financiera-para-principiantes?id=999192225',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1984/curso-de-habilidades-directivas-ii?id=999191108',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1150/medicion-y-transformacion-de-procesos?id=999193574',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1104/debates-de-la-politica-exterior-argentina?id=999191951',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/813/oratoria-para-empresarios?id=999190554',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/393/ejecutivo-en-finanzas-y-mercado-de-capitales?id=999191153',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1543/curso-de-liquidacion-de-sueldos-y-jornales-para-la-industria-de-la-construccion?id=999192247',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1605/curso-de-implementacion-de-sistemas-de-gestion-de-la-seguridad-y-salud-en-el-trabajo-iso-45001-2018?id=999191684',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1957/workshop-para-la-identificacion-y-gestion-de-los-aspectos-ambientales-iso-14001-2015?id=999193165',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/700/auditoria-interna-de-un-sistema-de-gestion-de-seguridad-de-la-informacion-sgsi-basado-en-la-norma-iso-iec-27001?id=999190489',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/460/desarrollo-de-habilidades-y-competencias-para-dirigir-una-pyme?id=999190810',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1389/curso-de-implementacion-de-sistema-de-gestion-de-la-calidad-iso-9001-2015?id=999190824',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/462/como-comunicar-de-manera-eficaz?id=999190701',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1101/el-impacto-de-china-en-el-escenario-regional?id=999191942',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1105/brasil-de-america-del-sur-a-los-los-brics-de-la-region-al-mundo?id=999191953',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1553/curso-de-auditor-interno-en-sistemas-de-gestion-ambiental-iso-14001-2015?id=999193166',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1425/auditor-interno-en-sistemas-de-gestion-de-la-seguridad-y-salud-en-el-trabajo-iso-45001-2018?id=999191687',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1102/el-regionalismo-en-america-latina-aspectos-teoricos-y-ejemplos?id=999191947',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/702/riesgos-controles-e-indicadores-de-gestion-de-un-sistema-de-gestion-de-seguridad-de-la-informacion-sgsi-basado-en-la-norma-iso-iec-27001?id=999190485',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1594/diplomatura-en-capital-humano?id=999194024',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1405/diplomatura-en-proteccion-contra-incendios-y-seguridad-humana?id=999193624',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/3111/curso-de-planificacion-gestion-y-evaluacion-de-politicas-publicas?id=999193821',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/2831/experto-universitario-en-desarrollo-y-mejora-de-la-cultura-organizacional?id=999193715',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1141/diplomatura-en-administracion-de-las-industrias-artisticas-creativas-y-culturales?id=999193201',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1143/contexto-politico-y-economico-de-las-industrias-artisticas-creativas-y-culturales?id=999193202',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1146/mercado-y-cadena-de-valor-en-las-industrias-artisticas-creativas-y-culturales?id=999193203',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1144/marco-juridico-fiscal-laboral-en-los-sectores-de-las-industrias-artisticas-creativas-y-culturales?id=999193204',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/2988/diplomatura-en-gestion-estrategica-de-proyectos-sociales-hacia-el-desarrollo-sostenible?id=999193680',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1142/administracion-y-formulacion-de-proyectos-en-las-industrias-artisticas-creativas-y-culturales?id=999193205',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/3123/tecnicatura-universitaria-en-seguridad-vial?id=999193587',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2883/auditor-interno-iso-50001-gestion-de-la-energia?id=999192428',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2243/tecnico-universitario-en-comercio-electronico-y-marketing-digital?id=999189730',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2842/licenciatura-en-negocios-digitales?id=999192083',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2857/licenciatura-en-comercio-electronico?id=999192117',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1972/bitcoin-y-criptoactivos-perspectiva-tecnologica-economica-regulatoria-e-impositiva?id=999189575',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1407/diplomatura-de-modelo-de-negocios-en-las-industrias-artisticas-creativas-y-culturales-iacc?id=999189866',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/520/experto-universitario-en-comercio-exterior?id=999188099',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/1136/diplomado-en-gobierno-abierto-y-gobierno-electronico?id=999188571',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/804/tecnicatura-universitaria-en-administracion?id=999190496',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/684/experto-universitario-en-liderazgo-efectivo-de-personas-y-equipos-para-mandos-medios?id=999190535',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2409/tecnicatura-universitaria-en-negociacion-de-bienes?id=999192907',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/648/tecnicatura-universitaria-en-higiene-y-seguridad-en-el-trabajo?id=999192903',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/1478/licenciatura-en-higiene-y-seguridad-en-el-trabajo?id=999192898',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2276/licenciatura-en-administracion-de-empresas?id=999192897',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/carrera/2407/tecnicatura-universitaria-en-logistica?id=999192906',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/experto-universitario/2140/experto-en-project-management?id=999191023',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1843/como-gamificar-un-entorno-virtual?id=999190201',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/1461/curso-de-innovacion-y-creatividad-para-directivos?id=999191118',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/699/fundamentos-e-introduccion-a-la-norma-iso-iec-27001-sistema-de-gestion-de-seguridad-de-la-informacion-sgsi?id=999190487',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/diplomatura/698/diplomatura-en-implementacion-y-auditoria-de-sistemas-de-gestion-de-seguridad-de-la-informacion-sgsi-normativa-iso-iec-27001?id=999190484',
    'https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/2749/test-campus-qa?id=999193616',
];

extractCourseDetails(courseUrls).then(details => {
    // Guardar los detalles en un archivo JSON
    fs.writeFileSync('courseDetails.json', JSON.stringify(details, null, 2));
    console.log('Detalles guardados en courseDetails.json');
});