import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Sparkles,
  BookOpen,
  Calendar,
  X,
  Compass,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Globe2,
} from 'lucide-react';

export interface HistoricalLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  category: 'algeria_revolution' | 'cold_war' | 'non_aligned' | 'global_economy';
  categoryLabel: string;
  year: string;
  color: string;
  bacSignificance: string;
  examTip: string;
  keyFigures: string[];
}

export const HISTORICAL_LOCATIONS: HistoricalLocation[] = [
  {
    id: 'algiers',
    name: 'الجزائر العاصمة (قلب الثورة التحريرية)',
    country: 'الجزائر 🇩🇿',
    lat: 36.7538,
    lng: 3.0588,
    category: 'algeria_revolution',
    categoryLabel: 'الثورة التحريرية الجزائرية',
    year: '1954 - 1962',
    color: '#59dad1',
    bacSignificance: 'تفجير الثورة التحريرية 1 نوفمبر 1954، معركة الجزائر 1957، ومظاهرات 11 ديسمبر 1960 التي دوّلت القضية الجزائرية في الأمم المتحدة.',
    examTip: 'ركز على دور مظاهرات 11 ديسمبر في إسقاط أطروحة الجزائر فرنسية وفرض المفاوضات.',
    keyFigures: ['العربي بن مهيدي', 'ديدوش مراد', 'مصطفى بن بولعيد'],
  },
  {
    id: 'evian',
    name: 'إيفيان (اتفاقيات إيفيان واسترجاع السيادة)',
    country: 'فرنسا 🇫🇷',
    lat: 46.401,
    lng: 6.586,
    category: 'algeria_revolution',
    categoryLabel: 'الثورة التحريرية الجزائرية',
    year: '18 مارس 1962',
    color: '#59dad1',
    bacSignificance: 'توقيع اتفاقيات إيفيان الثانية ووقف إطلاق النار في 19 مارس 1962 واعتراف فرنسا بوحدة التراب الوطني واستقلال الجزائر الكامل.',
    examTip: 'مفتاح منهجي: التمسك الجزائري بالصحراء الجزائرية ووحدة الشعب كان جوهر انتصار المفاوضات.',
    keyFigures: ['كريم بلقاسم', 'سعد دحلب', 'محمد الصديق بن يحيى'],
  },
  {
    id: 'bandung',
    name: 'باندونغ (مؤتمر باندونغ وتأسيس عدم الانحياز)',
    country: 'إندونيسيا 🇮🇩',
    lat: -6.9175,
    lng: 107.6191,
    category: 'non_aligned',
    categoryLabel: 'حركة عدم الانحياز والتحرر',
    year: '18 - 24 أفريل 1955',
    color: '#ffe16d',
    bacSignificance: 'المؤتمر التأسيسي للتضامن الأفرو-آسيوي ونواة حركة عدم الانحياز، مع قبول إدراج القضية الجزائرية رسمياً كقضية تصفية استعمار.',
    examTip: 'حضور الوفد الخارجي الجزائري بقيادة حسين آيت أحمد ومحمد يزيد كان أول اعتراف دولي بالثورة.',
    keyFigures: ['أحمد سوكارنو', 'جواهر لال نهرو', 'جمال عبد الناصر'],
  },
  {
    id: 'cairo',
    name: 'القاهرة (صوت الجزائر الحرة وقيادة الخارج)',
    country: 'مصر 🇪🇬',
    lat: 30.0444,
    lng: 31.2357,
    category: 'algeria_revolution',
    categoryLabel: 'الثورة التحريرية الجزائرية',
    year: '1954 - 1958',
    color: '#59dad1',
    bacSignificance: 'إذاعة بيان أول نوفمبر من إذاعة صوت العرب، واحتضان قيادة الوفد الخارجي والحكومة المؤقتة للجمهورية الجزائرية (GPRA) المعلنة في 19 سبتمبر 1958.',
    examTip: 'ركز على أثر الدعم المصري للثورة وكونه السبب المباشر في العدوان الثلاثي على مصر 1956.',
    keyFigures: ['فرحات عباس', 'أحمد بن بلة', 'جمال عبد الناصر'],
  },
  {
    id: 'washington',
    name: 'واشنطن (قيادة المعسكر الغربي الرأسمالي)',
    country: 'الولايات المتحدة الأمريكية 🇺🇸',
    lat: 38.9072,
    lng: -77.0369,
    category: 'cold_war',
    categoryLabel: 'القطبية الثنائية والحرب الباردة',
    year: '1947 - 1991',
    color: '#79f6ed',
    bacSignificance: 'إعلان مبدأ ترومان 1947، مشروع مارشال لإعادة إعمار أوروبا، وتأسيس حلف شمال الأطلسي (الناتو NATO) 1949، وسياسة ملء الفراغ واحتواء الشيوعية.',
    examTip: 'احفظ الفرق بين استراتيجية الاحتواء، التطويق، وملء الفراغ كروافد للمشروع الأمريكي.',
    keyFigures: ['هاري ترومان', 'جورج مارشال', 'دوايت أيزنهاور'],
  },
  {
    id: 'moscow',
    name: 'موسكو (قيادة المعسكر الشرقي الاشتراكي)',
    country: 'الاتحاد السوفياتي / روسيا 🇷🇺',
    lat: 55.7558,
    lng: 37.6173,
    category: 'cold_war',
    categoryLabel: 'القطبية الثنائية والحرب الباردة',
    year: '1947 - 1991',
    color: '#ff7b7b',
    bacSignificance: 'إعلان مبدأ جدانوف ومكتب الكومنفورم 1947، إنشاء منظمة الكوميكون 1949، وتأسيس حلف وارسو 1955، ثم قيادة مبادرة التعايش السلمي وانفراط العقد السوفياتي 1991.',
    examTip: 'الربط بين سقوط جدار برلين 1989 وتفكك الاتحاد السوفياتي 25 ديسمبر 1991 في مقال البكالوريا.',
    keyFigures: ['جوزيف ستالين', 'أندريه جدانوف', 'نيكيتا خروتشوف'],
  },
  {
    id: 'berlin',
    name: 'برلين (بؤرة التوتر القصوى وجدار برلين)',
    country: 'ألمانيا 🇩🇪',
    lat: 52.52,
    lng: 13.405,
    category: 'cold_war',
    categoryLabel: 'القطبية الثنائية والحرب الباردة',
    year: '1948 - 1989',
    color: '#ffe16d',
    bacSignificance: 'أزمة برلين الأولى 1948 (الحصار والجسر الجوي)، أزمة برلين الثانية وبناء جدار برلين 13 أوت 1961، وسقوط الجدار 9 نوفمبر 1989 رمزاً لنهاية الحرب الباردة.',
    examTip: 'سؤال كلاسيكي في البكالوريا: انعكاسات أزمات برلين على العلاقات الدولية وتقسيم ألمانيا لدولتين.',
    keyFigures: ['جون كينيدي', 'نيكيتا خروتشوف', 'كونراد أديناور'],
  },
  {
    id: 'yalta',
    name: 'يالطا (مؤتمر اقتسام مناطق النفوذ 1945)',
    country: 'شبه جزيرة القرم / البحر الأسود 🌊',
    lat: 44.4952,
    lng: 34.1663,
    category: 'cold_war',
    categoryLabel: 'القطبية الثنائية والحرب الباردة',
    year: '4 - 11 فيفري 1945',
    color: '#ffdb3c',
    bacSignificance: 'مؤتمر القمة بين الثلاثة الكبار لترتيب خارطة العالم ما بعد الحرب العالمية 2، وتأسيس هيئة الأمم المتحدة وتقسيم ألمانيا.',
    examTip: 'احفظ قادة مؤتمر يالطا الثلاثة: روزفلت، تشرشل، وستالين.',
    keyFigures: ['فرانكلين روزفلت', 'ونستون تشرشل', 'جوزيف ستالين'],
  },
  {
    id: 'vienna',
    name: 'فيينا (مقر منظمة أوبك OPEC وسوق الطاقة)',
    country: 'النمسا 🇦🇹',
    lat: 48.2082,
    lng: 16.3738,
    category: 'global_economy',
    categoryLabel: 'الاقتصاد العالمي والمبادلات',
    year: 'تأسست 1960',
    color: '#ffb4ab',
    bacSignificance: 'مقر منظمة الدول المصدرة للبترول (OPEC)، مركز التنسيق الاستراتيجي للسياسات النفطية وحماية عائدات المحروقات للدول النامية ومن بينها الجزائر.',
    examTip: 'في الجغرافيا: أوبك تحدد حصص الإنتاج لكن أسعار البترول تتحكم فيها بورصات نيويورك ولندن والشركات الاحتكارية.',
    keyFigures: ['الدول المؤسسة الـ 5 (السعودية، العراق، الكويت، إيران، فنزويلا) + الجزائر (1969)'],
  },
  {
    id: 'jerusalem',
    name: 'القدس الشريف (القضية الفلسطينية والصراع العربي الصهيوني)',
    country: 'فلسطين المحتلة 🇵🇸',
    lat: 31.7683,
    lng: 35.2137,
    category: 'non_aligned',
    categoryLabel: 'حركة عدم الانحياز والتحرر',
    year: '1947 - حتى الآن',
    color: '#ffe16d',
    bacSignificance: 'قرار التقسيم 181 الصادر في 29 نوفمبر 1947، النكبة 1948، النكسة 1967، وإعلان قيام دولة فلسطين بالجزائر العاصمة في 15 نوفمبر 1988.',
    examTip: 'الربط المنهجي: الجزائر هي عاصمة إعلان قيام الدولة الفلسطينية في قصر الصنوبر البحري 1988.',
    keyFigures: ['ياسر عرفات', 'الشيخ أحمد ياسين', 'هوارى بومدين'],
  },
  {
    id: 'beijing',
    name: 'بكين (الصين الشعبية والقوة الاقتصادية الصاعدة)',
    country: 'الصين 🇨🇳',
    lat: 39.9042,
    lng: 116.4074,
    category: 'global_economy',
    categoryLabel: 'الاقتصاد العالمي والمبادلات',
    year: '1949 - حتى الآن',
    color: '#ffb4ab',
    bacSignificance: 'انتصار الثورة الشيوعية 1949 بقيادة ماو تسي تونغ، سياسة الإصلاح والانفتاح الاقتصادي 1978، والتحول إلى ورشة العالم وثاني أقوى اقتصاد عالمي.',
    examTip: 'في جغرافيا البكالوريا: ركز على عوامل القوة الصينية (الديموغرافيا، الواجهة البحرية الشرقية، تدفق الاستثمارات الأجنبية IDE).',
    keyFigures: ['ماو تسي تونغ', 'دينغ سياوبينغ', 'شي جين بينغ'],
  },
  {
    id: 'tokyo',
    name: 'طوكيو (اليابان والتنين الآسيوي)',
    country: 'اليابان 🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    category: 'global_economy',
    categoryLabel: 'الاقتصاد العالمي والمبادلات',
    year: 'النموذج الآسيوي',
    color: '#79f6ed',
    bacSignificance: 'قطب الثالوث الاقتصادي العالمي، المعجزة التكنولوجية والصناعية رغم فقر الموارد الطبيعية، والتفوق عبر الرأسمال البشري والمجمعات الصناعية (الميغالوبوليس).',
    examTip: 'احفظ مفهوم الميغالوبوليس الياباني (طوكيو - ناغويا - أوساكا) كمركز ثقل عالمي.',
    keyFigures: ['إمبراطورية ميجي', 'مؤسسو شركات التكنولوجيا الكبرى'],
  },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export const GlobeBackground: React.FC<{ interactive?: boolean; className?: string }> = ({
  interactive = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<HistoricalLocation | null>(
    HISTORICAL_LOCATIONS[0]
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isRotatingAutomatically, setIsRotatingAutomatically] = useState(true);

  // References to communicate with the Three.js loop
  const targetRotationRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0.2,
    y: -Math.PI / 4,
    active: false,
  });

  const rotateToLocation = (loc: HistoricalLocation) => {
    setSelectedLocation(loc);
    setIsRotatingAutomatically(false);

    // Calculate globe target rotation for this lat/lng
    const targetY = -(loc.lng * Math.PI) / 180 - Math.PI / 2;
    const targetX = (loc.lat * Math.PI) / 180 * 0.5;

    targetRotationRef.current = {
      x: targetX,
      y: targetY,
      active: true,
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 68;

    // Sphere Wireframe
    const sphereGeo = new THREE.SphereGeometry(radius, 28, 28);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x59dad1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, wireframeMat);
    globeGroup.add(globeMesh);

    // Inner Glowing Core Sphere
    const innerGeo = new THREE.SphereGeometry(radius * 0.96, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x080d3b,
      transparent: true,
      opacity: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    // Outer Equator and Latitudinal Ring Rings
    const ringGeo1 = new THREE.RingGeometry(radius * 1.25, radius * 1.28, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffe16d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    globeGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(radius * 1.4, radius * 1.41, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x59dad1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = Math.PI / 4;
    globeGroup.add(ring2);

    // Clickable Interactive Pins
    const interactiveMeshes: { mesh: THREE.Object3D; location: HistoricalLocation }[] = [];
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);

    HISTORICAL_LOCATIONS.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, radius * 1.01);

      // Dot point (Sphere)
      const dotGeo = new THREE.SphereGeometry(2.8, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(loc.color),
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      pinsGroup.add(dot);
      interactiveMeshes.push({ mesh: dot, location: loc });

      // Generous invisible hit-box sphere (Radius 12) for effortless clicking/tapping
      const hitBoxGeo = new THREE.SphereGeometry(12, 12, 12);
      const hitBoxMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.copy(pos);
      pinsGroup.add(hitBox);
      interactiveMeshes.push({ mesh: hitBox, location: loc });

      // Light beam sticking out
      const normal = pos.clone().normalize();
      const beamStart = pos.clone();
      const beamEnd = pos.clone().add(normal.clone().multiplyScalar(7));
      const beamGeo = new THREE.BufferGeometry().setFromPoints([beamStart, beamEnd]);
      const beamMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(loc.color),
        transparent: true,
        opacity: 0.85,
      });
      const beam = new THREE.Line(beamGeo, beamMat);
      pinsGroup.add(beam);

      // Pulse ring around point
      const haloGeo = new THREE.RingGeometry(2.2, 4.5, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(loc.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(beamEnd);
      halo.lookAt(normal.multiplyScalar(200));
      pinsGroup.add(halo);
      interactiveMeshes.push({ mesh: halo, location: loc });
    });

    // Particle Cloud around globe
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const pLat = (Math.random() - 0.5) * 180;
      const pLng = (Math.random() - 0.5) * 360;
      const pDist = radius * (1.1 + Math.random() * 0.45);
      const v = latLngToVector3(pLat, pLng, pDist);
      particlePositions[i * 3] = v.x;
      particlePositions[i * 3 + 1] = v.y;
      particlePositions[i * 3 + 2] = v.z;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe16d,
      size: 1.8,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // Initial orientation focusing on Algeria & North Africa
    globeGroup.rotation.y = -Math.PI / 4;
    globeGroup.rotation.x = 0.2;

    // Raycaster for click/tap interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse & Touch Interaction Handling
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let previousMousePosition = { x: 0, y: 0 };
    let hasDraggedSignificantly = false;

    const handlePointerDown = (clientX: number, clientY: number) => {
      if (!interactive) return;
      isDragging = true;
      hasDraggedSignificantly = false;
      dragStartX = clientX;
      dragStartY = clientY;
      previousMousePosition = { x: clientX, y: clientY };
      targetRotationRef.current.active = false;
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!interactive) return;

      // Update hover cursor when not dragging
      if (!isDragging) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hitMeshes = raycaster.intersectObjects(interactiveMeshes.map((m) => m.mesh), true);
        const hitGlobe = raycaster.intersectObject(innerMesh, false);
        if (hitMeshes.length > 0 || hitGlobe.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
        } else {
          renderer.domElement.style.cursor = 'grab';
        }
        return;
      }

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      if (Math.abs(clientX - dragStartX) > 8 || Math.abs(clientY - dragStartY) > 8) {
        hasDraggedSignificantly = true;
      }

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      isDragging = false;

      // Clean tap or click detection
      if (!hasDraggedSignificantly && interactive) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // 1. Direct hit on pin meshes or hitboxes
        const meshesToTest = interactiveMeshes.map((item) => item.mesh);
        const pinIntersects = raycaster.intersectObjects(meshesToTest, true);

        if (pinIntersects.length > 0) {
          const hit = pinIntersects[0].object;
          const found = interactiveMeshes.find((item) => item.mesh === hit);
          if (found) {
            rotateToLocation(found.location);
            return;
          }
        }

        // 2. Fallback: Raycast on the globe surface to find the closest location
        const globeIntersects = raycaster.intersectObject(innerMesh, false);
        if (globeIntersects.length > 0) {
          const hitPoint = globeIntersects[0].point;
          // Transform hitPoint from world space to local globe space
          const localPoint = globeGroup.worldToLocal(hitPoint.clone());
          
          // Find closest HistoricalLocation by vector distance
          let closestLoc: HistoricalLocation | null = null;
          let minDistance = Infinity;

          HISTORICAL_LOCATIONS.forEach((loc) => {
            const locVec = latLngToVector3(loc.lat, loc.lng, radius * 0.96);
            const dist = localPoint.distanceTo(locVec);
            if (dist < minDistance) {
              minDistance = dist;
              closestLoc = loc;
            }
          });

          // If click is within reasonable proximity (e.g. 50 units)
          if (closestLoc && minDistance < 55) {
            rotateToLocation(closestLoc);
          }
        }
      }
    };

    // Mouse Events
    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = (e: MouseEvent) => handlePointerUp(e.clientX, e.clientY);

    // Touch Events for Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth interpolation to target rotation if clicked
      if (targetRotationRef.current.active) {
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.08;
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.08;

        if (
          Math.abs(targetRotationRef.current.y - globeGroup.rotation.y) < 0.01 &&
          Math.abs(targetRotationRef.current.x - globeGroup.rotation.x) < 0.01
        ) {
          targetRotationRef.current.active = false;
        }
      } else if (!isDragging && isRotatingAutomatically) {
        globeGroup.rotation.y += 0.0012;
      }

      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.0015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      sphereGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [interactive, isRotatingAutomatically]);

  const filteredLocations =
    activeCategoryFilter === 'all'
      ? HISTORICAL_LOCATIONS
      : HISTORICAL_LOCATIONS.filter((l) => l.category === activeCategoryFilter);

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Category Filter Pills (Interactive Navigation Bar) */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-3 px-2 z-10">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Globe2 className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>المسرح الجيوسياسي التفاعلي (اضغط أي محطة لاستكشافها فوراً)</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'جميع المحطات 🌍' },
            { id: 'algeria_revolution', label: 'الثورة الجزائرية 🇩🇿' },
            { id: 'cold_war', label: 'الحرب الباردة ⚔️' },
            { id: 'non_aligned', label: 'عدم الانحياز 🕊️' },
            { id: 'global_economy', label: 'أوبك والاقتصاد ⚡' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                  : 'bg-white/5 text-[#a2a6d0] hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Location Jump Chips */}
      <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 pb-2 px-2 z-10">
        {filteredLocations.map((loc) => {
          const isSelected = selectedLocation?.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => rotateToLocation(loc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black border-amber-300 shadow-md shadow-amber-400/20 scale-105'
                  : 'bg-[#0b1238]/90 text-[#dfe0ff] border-white/10 hover:border-amber-400/40 hover:bg-[#121c4e]'
              }`}
            >
              <MapPin
                className={`h-3 w-3 ${isSelected ? 'text-stone-950 fill-stone-950' : 'text-amber-400'}`}
              />
              <span>{loc.name.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[340px] flex items-center justify-center">
        <div
          ref={containerRef}
          style={{ touchAction: 'none' }}
          className="w-full h-full cursor-grab active:cursor-grabbing relative"
          title="اسحب لتدوير المجسم، أو انقر على أي نقطة تاريخية لعرض تفاصيلها المنهجية"
        />

        {/* Rotation Control Overlay Indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-stone-300 pointer-events-none">
          <Compass className="h-3 w-3 text-amber-400 animate-spin" />
          <span>اسحب للتدوير • انقر للتحديد</span>
        </div>
      </div>

      {/* Interactive Detail Card for Clicked Location */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            key={selectedLocation.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="w-full mt-2 rounded-2xl bg-gradient-to-br from-[#0c133a] via-[#101b4e] to-[#090f2e] border border-amber-500/30 p-4 sm:p-5 shadow-2xl space-y-3.5 z-10 text-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {selectedLocation.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">
                      {selectedLocation.country}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#59dad1] font-bold block">
                    {selectedLocation.categoryLabel} • {selectedLocation.year}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLocation(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="إغلاق البطاقة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content & Significance */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#dfe0ff] leading-relaxed">
                <strong className="text-amber-300 font-black block mb-1">
                  📌 الأهمية التاريخية والجغرافية في بكالوريا الجزائر:
                </strong>
                <p>{selectedLocation.bacSignificance}</p>
              </div>

              {/* Exam Tip */}
              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 flex items-start gap-2">
                <Award className="h-4 w-4 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black text-teal-300">💡 نصيحة المصحح للبكالوريا: </strong>
                  <span>{selectedLocation.examTip}</span>
                </div>
              </div>

              {/* Key Figures */}
              {selectedLocation.keyFigures.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                  <span className="font-bold text-stone-400">أبرز الأعلام والرموز:</span>
                  {selectedLocation.keyFigures.map((fig, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 font-bold"
                    >
                      {fig}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
