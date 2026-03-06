import { PrismaClient, UserRole, PostCategory, RecommendationCategory, EntrepreneurCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mirador.cl' },
    update: {},
    create: {
      email: 'admin@mirador.cl',
      passwordHash,
      displayName: 'Admin',
      fullName: 'Administración Edificio',
      unitNumber: 'ADMIN',
      role: UserRole.ADMIN,
      approved: true,
      buildingId: building.id,
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: 'maria.gonzalez@gmail.com' },
    update: {},
    create: {
      email: 'maria.gonzalez@gmail.com',
      passwordHash,
      displayName: 'María G.',
      fullName: 'María González Fuentes',
      unitNumber: '1502',
      phone: '+56 9 8765 4321',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
    },
  });

  const carlos = await prisma.user.upsert({
    where: { email: 'carlos.munoz@gmail.com' },
    update: {},
    create: {
      email: 'carlos.munoz@gmail.com',
      passwordHash,
      displayName: 'Carlos M.',
      fullName: 'Carlos Muñoz Soto',
      unitNumber: '801',
      phone: '+56 9 1234 5678',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
    },
  });

  const valentina = await prisma.user.upsert({
    where: { email: 'valentina.silva@gmail.com' },
    update: {},
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
    },
  });

  const andres = await prisma.user.upsert({
    where: { email: 'andres.lopez@gmail.com' },
    update: {},
    create: {
      email: 'andres.lopez@gmail.com',
      passwordHash,
      displayName: 'Andrés L.',
      fullName: 'Andrés López Díaz',
      unitNumber: '1003',
      phone: '+56 9 7777 8888',
      role: UserRole.RESIDENT,
      approved: true,
      buildingId: building.id,
    },
  });

  const camila = await prisma.user.upsert({
    where: { email: 'camila.herrera@gmail.com' },
    update: {},
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
    },
  });

  const pending = await prisma.user.upsert({
    where: { email: 'nuevo.residente@gmail.com' },
    update: {},
    create: {
      email: 'nuevo.residente@gmail.com',
      passwordHash,
      displayName: 'Felipe R.',
      fullName: 'Felipe Ramírez Castro',
      unitNumber: '1801',
      phone: '+56 9 6666 7777',
      role: UserRole.PENDING,
      approved: false,
      buildingId: building.id,
    },
  });

  // Posts (Marketplace)
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Sofá seccional 3 cuerpos',
        description: 'Sofá en excelente estado, color gris, 2 años de uso. Incluye cojines. Lo vendo porque me cambio a uno más grande. Se puede ver en el depto.',
        price: 350000,
        category: PostCategory.FURNITURE,
        images: [],
        authorId: maria.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Smart TV Samsung 55" 4K',
        description: 'Television Samsung Crystal UHD 55 pulgadas, modelo 2024. Con control remoto y caja original. Funciona perfectamente.',
        price: 280000,
        category: PostCategory.ELECTRONICS,
        images: [],
        authorId: carlos.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Bicicleta de ruta Specialized',
        description: 'Bicicleta Specialized Allez, talla 54, color negro. Componentes Shimano 105. Incluye luces y candado. Ideal para rodar por el parque.',
        price: 450000,
        category: PostCategory.SPORTS,
        images: [],
        authorId: andres.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Mesa de comedor 6 personas',
        description: 'Mesa de madera maciza de roble, 180x90cm. Muy buen estado. Ideal para departamentos amplios. Solo mesa, sin sillas.',
        price: 200000,
        category: PostCategory.FURNITURE,
        images: [],
        authorId: valentina.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Cajas de mudanza (20 unidades)',
        description: 'Set de 20 cajas de cartón resistente para mudanza, varios tamaños. Incluye papel de embalaje. Usadas solo una vez.',
        price: 15000,
        category: PostCategory.MOVING_ITEMS,
        images: [],
        authorId: camila.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Aspiradora robot Roomba i7',
        description: 'Roomba i7+ con base de autovaciado. 1 año de uso, funciona perfecto. Incluye filtros extra y repuestos de cepillos.',
        price: 180000,
        category: PostCategory.HOME_APPLIANCES,
        images: [],
        authorId: maria.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Colección libros Gabriel García Márquez',
        description: '8 libros de García Márquez en excelente estado. Incluye Cien Años de Soledad, El Amor en los Tiempos del Cólera, Crónica de una Muerte Anunciada y más.',
        price: 25000,
        category: PostCategory.BOOKS,
        images: [],
        authorId: andres.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Microondas LG NeoChef',
        description: 'Microondas LG 32 litros, tecnología Smart Inverter. Color acero inoxidable. Casi nuevo, solo 6 meses de uso.',
        price: 65000,
        category: PostCategory.HOME_APPLIANCES,
        images: [],
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
        comment: 'Patricia cuida a mis hijos hace 3 años. Es muy responsable, cariñosa y puntual. Totalmente recomendada para familias del edificio.',
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
        serviceName: 'Jorge Gasfíter - Plomería express',
        category: RecommendationCategory.PLUMBER,
        rating: 4,
        comment: 'Me solucionó una filtración de emergencia un domingo. Cobra justo y trabaja rápido. Tiene disponibilidad los fines de semana.',
        contactInfo: '+56 9 8888 9999',
        authorId: andres.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Limpieza Express - Aseo profundo',
        category: RecommendationCategory.CLEANER,
        rating: 5,
        comment: 'Servicio de aseo profundo increíble. Dejaron el departamento como nuevo después de una remodelación. Equipo de 3 personas, muy eficientes.',
        contactInfo: 'www.limpiezaexpress.cl',
        authorId: camila.id,
      },
    }),
    prisma.recommendation.create({
      data: {
        serviceName: 'Marco Díaz - Personal Trainer',
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
        comment: 'Laura me ayudó a decorar el living y el dormitorio principal. Tiene muy buen ojo y se adapta al presupuesto. Trabaja con proveedores nacionales.',
        contactInfo: '@lauradecora en Instagram',
        authorId: valentina.id,
      },
    }),
  ]);

  // Entrepreneur Profiles
  await Promise.all([
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Abogada - Derecho Inmobiliario',
        category: EntrepreneurCategory.LEGAL,
        description: 'Abogada con 12 años de experiencia en derecho inmobiliario y propiedad horizontal. Asesoro en compraventa de propiedades, contratos de arriendo, y conflictos de copropiedad. Consulta inicial gratuita para residentes del edificio.',
        contactInfo: 'valentina.silva@abogados.cl | +56 9 5555 1234',
        residentDiscount: '20% descuento en primera consulta para vecinos',
        userId: valentina.id,
      },
    }),
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Fotógrafo profesional',
        category: EntrepreneurCategory.PHOTOGRAPHY,
        description: 'Fotógrafo con 8 años de experiencia en retratos, eventos familiares y fotografía de producto. Sesiones a domicilio o en exteriores. Entrega de fotos editadas en 48 horas.',
        contactInfo: '@andres.foto en Instagram | +56 9 7777 8888',
        residentDiscount: '15% descuento en sesiones para residentes',
        userId: andres.id,
      },
    }),
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Psicóloga clínica',
        category: EntrepreneurCategory.HEALTH,
        description: 'Psicóloga clínica especialista en ansiedad, estrés laboral y terapia de pareja. Atención presencial y online. Enfoque cognitivo-conductual. Más de 10 años de experiencia.',
        contactInfo: 'camila.herrera@psicologia.cl | +56 9 3333 4444',
        residentDiscount: 'Primera sesión a mitad de precio para vecinos del edificio',
        userId: camila.id,
      },
    }),
    prisma.entrepreneurProfile.create({
      data: {
        profession: 'Desarrollador web y consultor tecnológico',
        category: EntrepreneurCategory.TECHNOLOGY,
        description: 'Desarrollo de sitios web, apps móviles y consultoría en transformación digital para pymes. Trabajo con React, Node.js y cloud. Puedo asesorar en proyectos tecnológicos.',
        contactInfo: 'carlos.munoz.dev@gmail.com | LinkedIn: /in/carlosmunoz',
        residentDiscount: 'Asesoría tecnológica gratuita de 30 min para vecinos',
        userId: carlos.id,
      },
    }),
  ]);

  console.log('');
  console.log('=== SEED DEMO COMPLETADO ===');
  console.log('');
  console.log(`Edificio: ${building.name}`);
  console.log(`Dirección: ${building.address}`);
  console.log('');
  console.log('--- Credenciales (password: demo123456 para todos) ---');
  console.log('');
  console.log(`  ADMIN:    admin@mirador.cl`);
  console.log(`  Residente: maria.gonzalez@gmail.com   (depto 1502)`);
  console.log(`  Residente: carlos.munoz@gmail.com     (depto 801)`);
  console.log(`  Residente: valentina.silva@gmail.com   (depto 2201)`);
  console.log(`  Residente: andres.lopez@gmail.com      (depto 1003)`);
  console.log(`  Residente: camila.herrera@gmail.com    (depto 503)`);
  console.log(`  PENDIENTE: nuevo.residente@gmail.com   (depto 1801) — necesita aprobación admin`);
  console.log('');
  console.log(`  ${posts.length} publicaciones en marketplace`);
  console.log(`  7 recomendaciones de servicios`);
  console.log(`  4 perfiles de emprendedores`);
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
