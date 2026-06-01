const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const imageFilePath = path.join(__dirname, 'src', 'assets', 'img');
const tableOutputPath = path.join(__dirname, 'tabla_imagenes_optimizadas.md');

const imageConversion = [
  // Fondos con patrón en la home se pasa a WEBP con tres tamaños en función de la resolución de pantalla que se aplicarán a través de CSS porque son backgrounds.
  {
    input: 'bg_1.png',
    outputs: [
      { name: 'bg_1_768.webp', format: 'webp', width: 768 },
      { name: 'bg_1_1200.webp', format: 'webp', width: 1200 },
      { name: 'bg_1_1600.webp', format: 'webp', width: 1600 },
    ],
  },
  {
    input: 'bg_2.png',
    outputs: [
      { name: 'bg_2_768.webp', format: 'webp', width: 768 },
      { name: 'bg_2_1200.webp', format: 'webp', width: 1200 },
      { name: 'bg_2_1600.webp', format: 'webp', width: 1600 },
    ],
  },
  {
    input: 'bg_main.png',
    outputs: [
      { name: 'bg_main_768.webp', format: 'webp', width: 768 },
      { name: 'bg_main_1200.webp', format: 'webp', width: 1200 },
      { name: 'bg_main_1600.webp', format: 'webp', width: 1600 },
    ],
  },

  // Los platos de categoría y de la home: se pasa a WEBP con resolución responsive por anchura (size)
  {
    input: 'plato_tacos.png',
    outputs: [
      { name: 'plato_tacos_320.webp', format: 'webp', width: 320 },
      { name: 'plato_tacos_480.webp', format: 'webp', width: 480 },
      { name: 'plato_tacos_640.webp', format: 'webp', width: 640 },
      { name: 'plato_tacos_960.webp', format: 'webp', width: 960 },
    ],
  },
  {
    input: 'plato_fajita.png',
    outputs: [
      { name: 'plato_fajita_320.webp', format: 'webp', width: 320 },
      { name: 'plato_fajita_480.webp', format: 'webp', width: 480 },
      { name: 'plato_fajita_640.webp', format: 'webp', width: 640 },
      { name: 'plato_fajita_960.webp', format: 'webp', width: 960 },
    ],
  },
  {
    input: 'aguachile.png',
    outputs: [
      { name: 'aguachile_320.webp', format: 'webp', width: 320 },
      { name: 'aguachile_480.webp', format: 'webp', width: 480 },
      { name: 'aguachile_640.webp', format: 'webp', width: 640 },
      { name: 'aguachile_960.webp', format: 'webp', width: 960 },
    ],
  },
  {
    input: 'enchilada.png',
    outputs: [
      { name: 'enchilada_320.webp', format: 'webp', width: 320 },
      { name: 'enchilada_480.webp', format: 'webp', width: 480 },
      { name: 'enchilada_640.webp', format: 'webp', width: 640 },
      { name: 'enchilada_960.webp', format: 'webp', width: 960 },
    ],
  },

  // Dirección de arte para detalle 1 y 2, se pasa a WEBP con 2 tamaños en función de si es mobile o tablet/desktop o con fit cover para cortar la imagen
  {
    input: 'tacos.png',
    outputs: [
      {
        name: 'det1_header_mobile.webp',
        format: 'webp',
        width: 480,
        height: 620,
        fit: 'cover',
        quality: 65,
      },
      {
        name: 'det1_header_desktop.webp',
        format: 'webp',
        width: 1600,
        height: 700,
        fit: 'cover',
        quality: 70,
      },
    ],
  },
  {
    input: 'fajita_carrousel_3.png',
    outputs: [
      {
        name: 'det2_header_mobile.webp',
        format: 'webp',
        width: 480,
        height: 620,
        fit: 'cover',
        quality: 65,
      },
      {
        name: 'det2_header_desktop.webp',
        format: 'webp',
        width: 1600,
        height: 700,
        fit: 'cover',
        quality: 70,
      },
    ],
  },

  // Carrusel tacos  se pasa a WEBP con dos formatos para resolution switching.
  ...[1, 2, 3, 4].map((num) => ({
    input: `taco_carrousel_${num}.png`,
    outputs: [
      {
        name: `taco_carrousel_${num}_1x.webp`,
        format: 'webp',
        width: 600,
        quality: 65,
      },
      {
        name: `taco_carrousel_${num}_2x.webp`,
        format: 'webp',
        width: 1200,
        quality: 60,
      },
    ],
  })),

  // Carrusel fajitas: resolution switching por densidad 1x / 2x
  ...[1, 2, 3, 4].map((num) => ({
    input: `fajita_carrousel_${num}.png`,
    outputs: [
      {
        name: `fajita_carrousel_${num}_1x.webp`,
        format: 'webp',
        width: 600,
        quality: 65,
      },
      {
        name: `fajita_carrousel_${num}_2x.webp`,
        format: 'webp',
        width: 1200,
        quality: 60,
      },
    ],
  })),
];

//Como quiero crear una tabla, creo un metodo para obtener el tamaño del archivo y otro para obtener la mejora.
function getSizeFileKb(filePath) {
  const stats = fs.statSync(filePath);
  return Number((stats.size / 1024).toFixed(2));
}

function getImprovementPercentatge(originalKb, optimizedKb) {
  return Number((((originalKb - optimizedKb) / originalKb) * 100).toFixed(2));
}

//Función de conversion con sharp utilizando resize e indicando anchura, altura, fit y withoutEnlargement;
async function imageOptimization(inputPath, outputPath, config) {
  let image = sharp(inputPath).resize({
    width: config.width,
    height: config.height,
    fit: config.fit || 'inside',
    withoutEnlargement: true,
  });

  if (config.format === 'webp') {
    image = image.webp({
      quality: config.quality || 70,
      effort: 6,
    });
  }

  await image.toFile(outputPath);
}

//El main ejecuta la conversion y ademas creo un ficher .md con la tabla además de mostrar los logs cuando ejecuto npm run sharp_img_optimization
async function main() {
  const reportRows = [];

  for (const image of imageConversion) {
    const inputPath = path.join(imageFilePath, image.input);

    if (!fs.existsSync(inputPath)) {
      console.warn(`No se ha encontrado la imagen: ${image.input}`);
      continue;
    }

    const originalKb = getSizeFileKb(inputPath);
    const originalFormat = path.extname(image.input).replace('.', '').toUpperCase();

    for (const output of image.outputs) {
      const outputPath = path.join(imageFilePath, output.name);

      await imageOptimization(inputPath, outputPath, output);

      const optimizedKb = getSizeFileKb(outputPath);
      const optimizedFormat = path.extname(output.name).replace('.', '').toUpperCase();
      const improvement = getImprovementPercentatge(originalKb, optimizedKb);

      reportRows.push({
        original: image.input,
        optimized: output.name,
        originalFormat,
        optimizedFormat,
        originalKb,
        optimizedKb,
        improvement,
      });

      console.log(`${image.input} -> ${output.name} | ${originalKb} KB -> ${optimizedKb} KB | ${improvement}%`);
    }
  }

  const markdown = [
    '| Imagen original | Imagen optimizada | Formato original | Formato optimizado | Peso original | Peso nuevo | Mejora % |',
    ...reportRows.map(
      (row) =>
        `| ${row.original} | ${row.optimized} | ${row.originalFormat} | ${row.optimizedFormat} | ${row.originalKb} KB | ${row.optimizedKb} KB | ${row.improvement}% |`,
    ),
  ].join('\n');

  fs.writeFileSync(tableOutputPath, markdown, 'utf8');
}

main().catch((error) => {
  console.error(error);
});
