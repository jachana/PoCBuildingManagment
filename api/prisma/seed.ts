import { PrismaClient, UserRole, PostCategory, RecommendationCategory, EntrepreneurCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Stable avatar URLs keyed by email
function avatar(email: string, size = 200): string {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(email)}`;
}

// Stable product images from picsum.photos (seed-based = always same image)
function productImg(seed: string, w = 800, h = 600): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  // Building
  const building = await prisma.building.upsert({
    where: { id: 'bld-demo-001' },
    update: {},
    create: {
      id: 'bld-demo-001',
      name: 'Torre Mirador del Parque',
      address: 'Av. Apoquindo 4500, Las Condes, Santiago',
      maxPostsPerUser: 10,
    },
  });

  // Users (all with avatar URLs)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mirador.cl' },
    update: { avatarUrl: avatar('admin@mirador.cl') },
    create: {
      email: 'admin@mirador.cl',
      passwordHash,
      displayName: 'Admin',
      fullName: 'Administracion Edificio',
      unitNumber: 'ADMIN',
      role: UserRole.ADMIN,
      approved: true,
      buildingId: building.id,
      avatarUrl: avatar('admin@mirador.cl'),
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: 'maria.gonzalez@gmail.com' },
    update: { avatarUrl: avatar('maria.gonzalez@gmail.com') },
    create: {
      email: 'maria.gonzalez@gmail.com',
      passwordHash,
      displayName: 'Maria G.',
      fullName: 'Maria Gonzalez Fuentes',
      unitNumber: '1502',
      phone: '+56 9 8765 4321',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
      avatarUrl: avatar('maria.gonzalez@gmail.com'),
    },
  });

  const carlos = await prisma.user.upsert({
    where: { email: 'carlos.munoz@gmail.com' },
    update: { avatarUrl: avatar('carlos.munoz@gmail.com') },
    create: {
      email: 'carlos.munoz@gmail.com',
      passwordHash,
      displayName: 'Carlos M.',
      fullName: 'Carlos Munoz Soto',
      unitNumber: '801',
      phone: '+56 9 1234 5678',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
      avatarUrl: avatar('carlos.munoz@gmail.com'),
    },
  });

  const valentina = await prisma.user.upsert({
    where: { email: 'valentina.silva@gmail.com' },
    update: { avatarUrl: avatar('valentina.silva@gmail.com') },
    create: {
      email: 'valentina.silva@gmail.com',
      passwordHash,
      displayName: 'Valentina S.',
      fullName: 'Valentina Silva Rojas',
      unitNumber: '2201',
      phone: '+56 9 5555 1234',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
      avatarUrl: avatar('valentina.silva@gmail.com'),
    },
  });

  const andres = await prisma.user.upsert({
    where: { email: 'andres.lopez@gmail.com' },
    update: { avatarUrl: avatar('andres.lopez@gmail.com') },
    create: {
      email: 'andres.lopez@gmail.com',
      passwordHash,
      displayName: 'Andres L.',
      fullName: 'Andres Lopez Diaz',
      unitNumber: '1003',
      phone: '+56 9 7777 8888',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
      avatarUrl: avatar('andres.lopez@gmail.com'),
    },
  });

  const camila = await prisma.user.upsert({
    where: { email: 'camila.herrera@gmail.com' },
    update: { avatarUrl: avatar('camila.herrera@gmail.com') },
    create: {
      email: 'camila.herrera@gmail.com',
      passwordHash,
      displayName: 'Camila H.',
      fullName: 'Camila Herrera Vidal',
      unitNumber: '503',
      phone: '+56 9 3333 4444',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
      avatarUrl: avatar('camila.herrera@gmail.com'),
    },
  });

  const pending = await prisma.user.upsert({
    where: { email: 'nuevo.residente@gmail.com' },
    update: { avatarUrl: avatar('nuevo.residente@gmail.com') },
    create: {
      email: 'nuevo.residente@gmail.com',
      passwordHash,
      displayName: 'Felipe R.',
      fullName: 'Felipe Ramirez Castro',
      unitNumber: '1801',
      phone: '+56 9 6666 7777',
      role: UserRole.PENDING,
      approved: false,
      buildingId: building.id,
      avatarUrl: avatar('nuevo.residente@gmail.com'),
    },
  });

  // Posts (Marketplace) with images
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Sofa seccional 3 cuerpos',
        description: 'Sofa en excelente estado, color gris, 2 anos de uso. Incluye cojines. Lo vendo porque me cambio a uno mas grande. Se puede ver en el depto.',
        price: 350000,
        category: PostCategory.FURNITURE,
        images: [
          productImg('sofa-gris', 800, 600),
          productImg('sofa-gris-2', 800, 600),
        ],
        authorId: maria.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Smart TV Samsung 55" 4K',
        description: 'Television Samsung Crystal UHD 55 pulgadas, modelo 2024. Con control remoto y caja original. Funciona perfectamente.',
        price: 280000,
        category: PostCategory.ELECTRONICS,
        images: [
          productImg('samsung-tv-55', 800, 600),
        ],
        authorId: carlos.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Bicicleta de ruta Specialized',
        description: 'Bicicleta Specialized Allez, talla 54, color negro. Componentes Shimano 105. Incluye luces y candado. Ideal para rodar por el parque.',
        price: 450000,
        category: PostCategory.SPORTS,
        images: [
          productImg('road-bike-black', 800, 600),
          productImg('bike-detail', 800, 600),
        ],
        authorId: andres.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Mesa de comedor 6 personas',
        description: 'Mesa de madera maciza de roble, 180x90cm. Muy buen estado. Ideal para departamentos amplios. Solo mesa, sin sillas.',
        price: 200000,
        category: PostCategory.FURNITURE,
        images: [
          productImg('dining-table-oak', 800, 600),
        ],
        authorId: valentina.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Cajas de mudanza (20 unidades)',
        description: 'Set de 20 cajas de carton resistente para mudanza, varios tamanos. Incluye papel de embalaje. Usadas solo una vez.',
        price: 15000,
        category: PostCategory.MOVING_ITEMS,
        images: [
          productImg('moving-boxes', 800, 600),
        ],
        authorId: camila.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Aspiradora robot Roomba i7',
        description: 'Roomba i7+ con base de autovaciado. 1 ano de uso, funciona perfecto. Incluye filtros extra y repuestos de cepillos.',
        price: 180000,
        category: PostCategory.HOME_APPLIANCES,
        images: [
          productImg('roomba-robot', 800, 600),
          productImg('roomba-base', 800, 600),
        ],
        authorId: maria.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Coleccion libros Gabriel Garcia Marquez',
        description: '8 libros de Garcia Marquez en excelente estado. Incluye Cien Anos de Soledad, El Amor en los Tiempos del Colera, Cronica de una Muerte Anunciada y mas.',
        price: 25000,
        category: PostCategory.BOOKS,
        images: [
          productImg('book-collection', 800, 600),
        ],
        authorId: andres.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Microondas LG NeoChef',
        description: 'Microondas LG 32 litros, tecnologia Smart Inverter. Color acero inoxidable. Casi nuevo, solo 6 meses de uso.',
        price: 65000,
        category: PostCategory.HOME_APPLIANCES,
        images: [
          productImg('microwave-steel', 800, 600),
        ],
        authorId: carlos.id,
      },
    }),
  ]);

  // Update active post counts
  await prisma.user.update({ where: { id: maria.id }, data: { activePostCount: 2 } });
  await prisma.user.update({ where: { id: carlos.id }, data: { activePostCount: 2 } });
  await prisma.user.update({ where: { id: andres.id }, data: { activePostCount: 2 } });
  await prisma.user.update({ where: { id: valentina.id }, data: { activePostCount: 1 } });
  await prisma.user.update({ where: { id: camila.id }, data: { activePostCount: 1 } });

  // Recommendations
  await Promise.all([
    prisma.recommendation.create({
      data: {
        serviceName: 'Patricia Soto - Nana de confianza',
        category: RecommendationCategory.NANNY,
        rating: 5,
        comment: 'Patricia cuida a mis hijos hace 3 anos. Es muy responsable, carinosa y puntual. Totalmente recomendada para familias del edificio.',
        contactInfo: '+56 9 4444 5555',
        authorId: maria.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Rodrigo Torres - Electricista certificado',
        category: RecommendationCategory.ELECTRICIAN,
        rating: 5,
        comment: 'Excelente trabajo instalando luces LED en todo el departamento. Precios justos y muy profesional. Llega puntual y deja todo limpio.',
        contactInfo: '+56 9 2222 3333',
        authorId: carlos.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'PetWalk Santiago - Paseo de mascotas',
        category: RecommendationCategory.DOG_WALKER,
        rating: 4,
        comment: 'Muy buen servicio de paseo para perros. Mandan fotos durante el paseo. Mi golden retriever los ama. Paseos de 1 hora por el parque.',
        contactInfo: '@petwalk_stgo en Instagram',
        authorId: valentina.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Jorge Gasfiter - Plomeria express',
        category: RecommendationCategory.PLUMBER,
        rating: 4,
        comment: 'Me soluciono una filtracion de emergencia un domingo. Cobra justo y trabaja rapido. Tiene disponibilidad los fines de semana.',
        contactInfo: '+56 9 8888 9999',
        authorId: andres.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Limpieza Express - Aseo profundo',
        category: RecommendationCategory.CLEANER,
        rating: 5,
        comment: 'Servicio de aseo profundo increible. Dejaron el departamento como nuevo despues de una remodelacion. Equipo de 3 personas, muy eficientes.',
        contactInfo: 'www.limpiezaexpress.cl',
        authorId: camila.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Marco Diaz - Personal Trainer',
        category: RecommendationCategory.PERSONAL_TRAINER,
        rating: 5,
        comment: 'Marco viene al gimnasio del edificio. Tiene rutinas personalizadas y es muy motivador. Ideal para empezar o retomar el ejercicio.',
        contactInfo: '+56 9 1111 2222',
        authorId: maria.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Laura Decoraciones - Interiorismo',
        category: RecommendationCategory.DECORATOR,
        rating: 4,
        comment: 'Laura me ayudo a decorar el living y el dormitorio principal. Tiene muy buen ojo y se adapta al presupuesto. Trabaja con proveedores nacionales.',
        contactInfo: '@lauradecora en Instagram',
        authorId: valentina.id,
      },
    }),
  ]);

  // Entrepreneur Profiles (with avatar URLs)
  await Promise.all([
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Abogada - Derecho Inmobiliario',
        category: EntrepreneurCategory.LEGAL,
        description: 'Abogada con 12 anos de experiencia en derecho inmobiliario y propiedad horizontal. Asesoro en compraventa de propiedades, contratos de arriendo, y conflictos de copropiedad. Consulta inicial gratuita para residentes del edificio.',
        contactInfo: 'valentina.silva@abogados.cl | +56 9 5555 1234',
        residentDiscount: '20% descuento en primera consulta para vecinos',
        avatarUrl: avatar('valentina.silva@gmail.com'),
        userId: valentina.id,
      },
    }),
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Fotografo profesional',
        category: EntrepreneurCategory.PHOTOGRAPHY,
        description: 'Fotografo con 8 anos de experiencia en retratos, eventos familiares y fotografia de producto. Sesiones a domicilio o en exteriores. Entrega de fotos editadas en 48 horas.',
        contactInfo: '@andres.foto en Instagram | +56 9 7777 8888',
        residentDiscount: '15% descuento en sesiones para residentes',
        avatarUrl: avatar('andres.lopez@gmail.com'),
        userId: andres.id,
      },
    }),
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Psicologa clinica',
        category: EntrepreneurCategory.HEALTH,
        description: 'Psicologa clinica especialista en ansiedad, estres laboral y terapia de pareja. Atencion presencial y online. Enfoque cognitivo-conductual. Mas de 10 anos de experiencia.',
        contactInfo: 'camila.herrera@psicologia.cl | +56 9 3333 4444',
        residentDiscount: 'Primera sesion a mitad de precio para vecinos del edificio',
        avatarUrl: avatar('camila.herrera@gmail.com'),
        userId: camila.id,
      },
    }),
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Desarrollador web y consultor tecnologico',
        category: EntrepreneurCategory.TECHNOLOGY,
        description: 'Desarrollo de sitios web, apps moviles y consultoria en transformacion digital para pymes. Trabajo con React, Node.js y cloud. Puedo asesorar en proyectos tecnologicos.',
        contactInfo: 'carlos.munoz.dev@gmail.com | LinkedIn: /in/carlosmunoz',
        residentDiscount: 'Asesoria tecnologica gratuita de 30 min para vecinos',
        avatarUrl: avatar('carlos.munoz@gmail.com'),
        userId: carlos.id,
      },
    }),
  ]);

  console.log('');
  console.log('=== SEED DEMO COMPLETADO ===');
  console.log('');
  console.log(`Edificio: ${building.name}`);
  console.log(`Direccion: ${building.address}`);
  console.log('');
  console.log('--- Credenciales (password: demo123456 para todos) ---');
  console.log('');
  console.log(`  ADMIN:    admin@mirador.cl`);
  console.log(`  Residente: maria.gonzalez@gmail.com   (depto 1502)`);
  console.log(`  Residente: carlos.munoz@gmail.com     (depto 801)`);
  console.log(`  Residente: valentina.silva@gmail.com   (depto 2201)`);
  console.log(`  Residente: andres.lopez@gmail.com      (depto 1003)`);
  console.log(`  Residente: camila.herrera@gmail.com    (depto 503)`);
  console.log(`  PENDIENTE: nuevo.residente@gmail.com   (depto 1801) — necesita aprobacion admin`);
  console.log('');
  console.log(`  ${posts.length} publicaciones en marketplace (con imagenes)`);
  console.log(`  7 recomendaciones de servicios`);
  console.log(`  4 perfiles de emprendedores (con avatares)`);
  console.log(`  8 usuarios con fotos de perfil`);
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
