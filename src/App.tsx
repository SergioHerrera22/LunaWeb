import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cog,
  Drill,
  Factory,
  HardHat,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

/* ── Scroll reveal hook ──────────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── Count-up hook ───────────────────────────────────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    if (target === 0) return;
    let rafId = 0;
    let startTime: number | null = null;
    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);

  return value;
}

/* ── Reveal wrapper ──────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ${className} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const services = [
  {
    icon: Factory,
    title: "Ingenieria y fabricacion a medida",
    description:
      "Desarrollamos y ejecutamos soluciones metalmecanicas para operacion minera e industrial, sin comercializar productos de catalogo.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento industrial en terreno",
    description:
      "Atendemos paradas programadas y correctivos con equipos certificados para sostener continuidad operativa.",
  },
  {
    icon: Drill,
    title: "Montaje de equipos criticos",
    description:
      "Realizamos alineamiento, montaje y puesta en marcha de sistemas metalicos bajo estandares estrictos de seguridad.",
  },
];

const serviceDifferentials = [
  {
    icon: ClipboardList,
    title: "Alcance tecnico por frente de trabajo",
    description:
      "Definimos actividades, recursos, secuencia y criterios de aceptacion para cada servicio antes de iniciar ejecucion.",
  },
  {
    icon: HardHat,
    title: "Ejecucion segura en terreno minero",
    description:
      "Operamos con personal habilitado, control de riesgos en sitio y coordinacion con protocolos HSEC del mandante.",
  },
  {
    icon: Cog,
    title: "Trazabilidad y control de calidad",
    description:
      "Documentamos avances, verificaciones y cierre tecnico para asegurar continuidad operativa y cumplimiento contractual.",
  },
];

const stats: {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}[] = [
  {
    value: 18,
    prefix: "+",
    suffix: "",
    label: "años en metalurgia industrial",
  },
  { value: 250, prefix: "+", suffix: "", label: "proyectos ejecutados" },
  { value: 98, prefix: "", suffix: "%", label: "cumplimiento de plazos" },
  { value: 0, prefix: "", suffix: "", label: "accidentes incapacitantes 2025" },
];

const projects = [
  {
    title: "Revestimiento antiabrasivo para chute primario",
    location: "Division Norte",
    image:
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Fabricacion de pasarelas y estructuras de proceso",
    location: "Complejo Cordillera",
    image:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Recuperacion de tolvas de alimentacion",
    location: "Mina Los Andes",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
  },
];

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Levantamiento tecnico",
    desc: "Visita a terreno y diagnostico detallado del alcance y riesgos del trabajo.",
  },
  {
    icon: Cog,
    step: "02",
    title: "Ingenieria y fabricacion",
    desc: "Diseno, modelado y fabricacion en taller con control de calidad documentado.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Montaje y entrega",
    desc: "Ejecucion en faena, pruebas de funcionamiento y traspaso con reporte final.",
  },
];

const aboutPoints = [
  "Somos una empresa argentina con base operativa en el NOA y cobertura nacional.",
  "Prestamos servicios de ingenieria, fabricacion, montaje y mantenimiento para industria y mineria.",
  "No comercializamos productos en serie: cada servicio se define segun objetivo, contexto y criticidad.",
];

const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "servicios", label: "Servicios" },
  { id: "sobre-nosotros", label: "Nosotros" },
  { id: "proceso", label: "Proceso" },
  { id: "proyectos", label: "Casos" },
  { id: "contacto", label: "Contacto" },
];

/* ── StatCard ────────────────────────────────────────────────────────────── */
function StatCard({
  value,
  prefix,
  suffix,
  label,
  active,
}: {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, active);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-linear-to-b from-zinc-900/80 to-zinc-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5">
      <div
        className="shine-sweep pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <p className="font-heading text-3xl font-bold text-amber-300">
        {prefix}
        {value === 0 ? 0 : count}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
        {label}
      </p>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [servicesIndex, setServicesIndex] = useState(0);
  const [projectsIndex, setProjectsIndex] = useState(0);
  const [showWhatsappHint, setShowWhatsappHint] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);

    const updateActiveSection = () => {
      const scrollProbe = window.scrollY + 140;
      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (scrollProbe >= section.offsetTop) {
          currentSection = id;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        currentSection = sectionIds[sectionIds.length - 1];
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setServicesIndex((prev) => (prev + 1) % services.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProjectsIndex((prev) => (prev + 1) % projects.length);
    }, 5800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let hideTimeoutId = 0;

    const showHint = () => {
      setShowWhatsappHint(true);
      hideTimeoutId = window.setTimeout(() => {
        setShowWhatsappHint(false);
      }, 3200);
    };

    const initialId = window.setTimeout(showHint, 5000);
    const intervalId = window.setInterval(showHint, 20000);

    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
      window.clearTimeout(hideTimeoutId);
    };
  }, []);

  const prevService = () =>
    setServicesIndex((prev) => (prev - 1 + services.length) % services.length);
  const nextService = () =>
    setServicesIndex((prev) => (prev + 1) % services.length);
  const prevProject = () =>
    setProjectsIndex((prev) => (prev - 1 + projects.length) % projects.length);
  const nextProject = () =>
    setProjectsIndex((prev) => (prev + 1) % projects.length);

  const handleNavClick =
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const section = document.getElementById(id);
      if (!section) return;
      setActiveSection(id);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ── Command Nav ── */}
      <nav
        aria-label="Navegacion principal"
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/65 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <a
            href="#inicio"
            onClick={handleNavClick("inicio")}
            aria-label="Luna Metal Industrial - Inicio"
            className="group inline-flex items-center"
          >
            <div className="grid h-10 w-10 place-items-center rounded-md bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/40">
              <HardHat size={21} strokeWidth={2.5} />
            </div>
          </a>

          <div className="command-nav relative flex min-w-0 flex-1 items-center justify-center overflow-x-auto rounded-2xl border border-zinc-700/70 bg-zinc-900/75 px-2 py-2 shadow-xl shadow-black/35 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" />
            <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-linear-to-r from-transparent via-amber-300/40 to-transparent" />
            <div className="flex min-w-max items-center gap-1">
              {navItems.map((item) => {
                const active = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={handleNavClick(item.id)}
                    className={`nav-segment group relative px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:px-4 ${
                      active
                        ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                        : "text-zinc-300 hover:bg-zinc-800/90 hover:text-zinc-100"
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <a
            href="#contacto"
            className="hidden rounded-md border border-amber-500/60 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-amber-300 transition-all duration-200 hover:bg-amber-500 hover:text-zinc-950 hover:shadow-md hover:shadow-amber-500/25 lg:inline-flex"
          >
            Cotizar proyecto
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header id="inicio" className="relative overflow-hidden pt-24">
        <div
          className="blob absolute -left-20 top-14 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="blob blob-delay absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 hero-grid opacity-20"
          aria-hidden="true"
        />
        <div
          className="scan-line absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent"
          aria-hidden="true"
        />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-24 pt-8 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left */}
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-900/60 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
                </span>
                Empresa argentina de servicios metalurgicos
              </span>

              <h1 className="font-heading text-4xl uppercase leading-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                Servicios de ingenieria y ejecucion{" "}
                <span className="gradient-text">metalurgica</span> que sostiene
                la operacion minera
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Brindamos servicios de diagnostico, ingenieria, fabricacion a
                medida y montaje en campo para operaciones de alta exigencia.
                Trabajamos por proyecto, con foco en seguridad, cumplimiento y
                continuidad operacional.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#contacto"
                  className="group inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 transition-all duration-200 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30"
                >
                  Solicitar visita tecnica
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1.5"
                  />
                </a>
                <a
                  href="#proyectos"
                  className="rounded-md border border-zinc-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                >
                  Ver casos mineros
                </a>
              </div>
            </div>

            {/* Right – image */}
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-2xl bg-linear-to-br from-amber-500/20 via-transparent to-cyan-400/10 blur-sm"
                aria-hidden="true"
              />
              <img
                src="https://images.unsplash.com/photo-1573164574230-db1d5e960238?auto=format&fit=crop&w=1200&q=80"
                alt="Trabajadores metalurgicos en planta minera industrial"
                width={1200}
                height={800}
                className="relative h-140 w-full rounded-2xl object-cover shadow-2xl shadow-zinc-950/70"
                loading="eager"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/8" />
              <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-zinc-700/60 bg-zinc-950/80 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Servicio destacado
                </p>
                <p className="mt-1 font-semibold text-zinc-100">
                  Reingenieria estructural en planta concentradora
                </p>
                <p className="mt-1.5 text-sm text-zinc-300">
                  Mejora del <strong className="text-amber-300">22%</strong> en
                  vida util de componentes sometidos a abrasion.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <StatCard {...item} active={statsVisible} />
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10" aria-hidden="true">
        <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-700/60 to-transparent" />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-20 lg:px-10">
        {/* ── Services ── */}
        <section id="servicios" aria-labelledby="servicios-heading">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-300">
                Nuestros servicios
              </p>
              <h2
                id="servicios-heading"
                className="mt-3 font-heading text-3xl uppercase text-zinc-100 sm:text-4xl"
              >
                Soluciones para cada etapa del proceso minero
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-4 backdrop-blur-sm sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-cyan-400/5" />
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${servicesIndex * 100}%)` }}
                >
                  {services.map(({ icon: Icon, title, description }) => (
                    <article key={title} className="min-w-full px-1">
                      <div className="rounded-xl border border-zinc-800/80 bg-linear-to-b from-zinc-900/80 to-zinc-950/70 p-6 sm:p-8">
                        <div className="mb-4 inline-flex rounded-lg bg-zinc-800/80 p-3 text-amber-300">
                          <Icon size={22} />
                        </div>
                        <h3 className="font-heading text-2xl uppercase text-zinc-100">
                          {title}
                        </h3>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          {description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {services.map((item, idx) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setServicesIndex(idx)}
                      aria-label={`Ir al servicio ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === servicesIndex
                          ? "w-8 bg-amber-400"
                          : "w-2.5 bg-zinc-600 hover:bg-zinc-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevService}
                    aria-label="Servicio anterior"
                    className="grid h-9 w-9 place-items-center rounded-md border border-zinc-700 bg-zinc-900/80 text-zinc-200 transition hover:border-amber-400/60 hover:text-amber-300"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextService}
                    aria-label="Servicio siguiente"
                    className="grid h-9 w-9 place-items-center rounded-md border border-zinc-700 bg-zinc-900/80 text-zinc-200 transition hover:border-amber-400/60 hover:text-amber-300"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {serviceDifferentials.map(
              ({ icon: Icon, title, description }, i) => (
                <Reveal key={title} delay={i * 120}>
                  <article className="group relative h-full overflow-hidden rounded-xl border border-zinc-800/80 bg-linear-to-b from-zinc-900/80 to-zinc-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-xl hover:shadow-black/30">
                    <div
                      className="shine-sweep pointer-events-none absolute inset-0"
                      aria-hidden="true"
                    />
                    <div className="mb-5 inline-flex rounded-lg bg-zinc-800/80 p-3 text-amber-300 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-zinc-950 group-hover:shadow-md group-hover:shadow-amber-500/30">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-heading text-xl uppercase text-zinc-100">
                      {title}
                    </h3>
                    <div className="mt-2 h-0.5 w-8 rounded-full bg-amber-500/50 transition-all duration-500 group-hover:w-14 group-hover:bg-amber-400" />
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {description}
                    </p>
                  </article>
                </Reveal>
              ),
            )}
          </div>
        </section>

        {/* ── How we work ── */}
        <section id="sobre-nosotros" aria-labelledby="sobre-nosotros-heading">
          <Reveal>
            <div className="grid gap-8 rounded-2xl border border-zinc-800/70 bg-linear-to-br from-zinc-900/70 to-zinc-950/90 p-7 shadow-inner shadow-black/20 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-amber-300">
                  Sobre nosotros
                </p>
                <h2
                  id="sobre-nosotros-heading"
                  className="mt-3 font-heading text-3xl uppercase text-zinc-100 sm:text-4xl"
                >
                  Equipo argentino especializado en servicios industriales
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  En Luna Metal trabajamos como socio tecnico para empresas que
                  necesitan resolver desafios operativos complejos. Nuestra
                  propuesta se centra en prestar servicios de principio a fin,
                  no en vender productos estandar.
                </p>
              </div>

              <div className="space-y-3">
                {aboutPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-4"
                  >
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-300"
                    />
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── How we work ── */}
        <section id="proceso" aria-labelledby="proceso-heading">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-300">
                Como trabajamos
              </p>
              <h2
                id="proceso-heading"
                className="mt-3 font-heading text-3xl uppercase text-zinc-100 sm:text-4xl"
              >
                Proceso simple, resultados medibles
              </h2>
            </div>
          </Reveal>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div
              className="absolute left-[16.6%] right-[16.6%] top-12 hidden h-px bg-linear-to-r from-amber-500/20 via-amber-500/50 to-amber-500/20 md:block"
              aria-hidden="true"
            />
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <Reveal key={step} delay={i * 140}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5 grid h-24 w-24 place-items-center rounded-full border border-zinc-700/60 bg-zinc-900 shadow-lg shadow-black/30 transition-all duration-300 hover:border-amber-400/60 hover:shadow-amber-500/10">
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-950 shadow-sm shadow-amber-400/40">
                      {step}
                    </span>
                    <Icon size={30} className="text-amber-300" />
                  </div>
                  <h3 className="font-heading text-xl uppercase text-zinc-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="proyectos" aria-labelledby="proyectos-heading">
          <div className="grid gap-8 rounded-2xl border border-zinc-800/60 bg-linear-to-br from-zinc-900/60 to-zinc-950/80 p-7 shadow-inner shadow-black/20 backdrop-blur-sm lg:grid-cols-[1fr_1.2fr] lg:p-10">
            <Reveal>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-amber-300">
                  Capacidad operacional
                </p>
                <h2
                  id="proyectos-heading"
                  className="mt-4 font-heading text-3xl uppercase text-zinc-100 sm:text-4xl"
                >
                  Ejecutamos servicios de alto impacto para grandes operaciones
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  Coordinamos ingenieria, taller y montaje en terreno para
                  responder a desafios de produccion continua, manteniendo
                  productividad, seguridad y cumplimiento contractual.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                  {[
                    "Protocolos HSEC alineados a estandares de mandantes mineros.",
                    "Soldadores y supervisores certificados para faena de alta exigencia.",
                    "Logistica y respuesta rapida para ventanas cortas de mantencion.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <ShieldCheck
                        size={17}
                        className="mt-0.5 shrink-0 text-amber-300"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/70">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${projectsIndex * 100}%)` }}
                >
                  {projects.map((project) => (
                    <article key={project.title} className="min-w-full">
                      <div className="relative h-72 overflow-hidden sm:h-80">
                        <img
                          src={project.image}
                          alt={project.title}
                          width={1200}
                          height={800}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                          <p className="text-xs uppercase tracking-[0.18em] text-amber-300/90">
                            {project.location}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-zinc-100 sm:text-xl">
                            {project.title}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevProject}
                    aria-label="Proyecto anterior"
                    className="grid h-9 w-9 place-items-center rounded-md border border-zinc-600/90 bg-zinc-950/70 text-zinc-100 backdrop-blur-md transition hover:border-amber-400/60 hover:text-amber-300"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextProject}
                    aria-label="Proyecto siguiente"
                    className="grid h-9 w-9 place-items-center rounded-md border border-zinc-600/90 bg-zinc-950/70 text-zinc-100 backdrop-blur-md transition hover:border-amber-400/60 hover:text-amber-300"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-950/75 px-3 py-1.5 backdrop-blur-md">
                  {projects.map((project, idx) => (
                    <button
                      key={project.title}
                      type="button"
                      onClick={() => setProjectsIndex(idx)}
                      aria-label={`Ir al proyecto ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === projectsIndex
                          ? "w-7 bg-amber-300"
                          : "w-2 bg-zinc-500 hover:bg-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contacto" aria-labelledby="contacto-heading">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-500/12 via-zinc-900 to-zinc-950 p-8 lg:p-12">
              <div
                className="glow-orb absolute -left-10 -top-10 h-52 w-52 rounded-full bg-amber-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="glow-orb glow-orb-delay absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">
                    Listos para su siguiente parada de planta
                  </p>
                  <h2
                    id="contacto-heading"
                    className="mt-3 font-heading text-3xl uppercase text-white sm:text-4xl lg:text-5xl"
                  >
                    Convirtamos su desafio en una{" "}
                    <span className="gradient-text">ventaja operativa</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">
                    Agende una reunion tecnica y reciba una propuesta de
                    servicio con alcance, cronograma y plan de ejecucion para su
                    operacion minera o industrial.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-300 sm:flex-row sm:flex-wrap sm:gap-6">
                    <a
                      href="tel:+5493871234567"
                      className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
                    >
                      <Phone size={15} className="text-amber-300" /> +54 9 387
                      123 4567
                    </a>
                    <a
                      href="mailto:contacto@lunametal.com.ar"
                      className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
                    >
                      <Mail size={15} className="text-amber-300" />{" "}
                      contacto@lunametal.com.ar
                    </a>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={15} className="text-amber-300" /> Salta,
                      Argentina
                    </span>
                  </div>
                </div>

                <a
                  href="mailto:contacto@lunametal.com.ar"
                  className="group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 transition-all duration-200 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/40"
                >
                  <span
                    className="absolute inset-0 rounded-xl ring-0 ring-amber-400/50 transition-all duration-300 group-hover:ring-4"
                    aria-hidden="true"
                  />
                  Hablar con un asesor tecnico
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative overflow-hidden border-t border-zinc-800/60 bg-zinc-950">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-10">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20">
                <HardHat size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-heading text-lg uppercase tracking-[0.18em] text-zinc-100">
                  Luna Metal Industrial
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Servicios industriales para mineria
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Prestamos servicios de ingenieria aplicada, fabricacion a medida,
              mantenimiento y montaje para operaciones que exigen continuidad,
              seguridad y cumplimiento.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/5493871234567"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 transition-all duration-200 hover:border-emerald-400/60 hover:bg-emerald-500/15"
              >
                <MessageCircle size={14} />
                WhatsApp tecnico
              </a>
              <a
                href="mailto:contacto@lunametal.com.ar"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 transition-all duration-200 hover:border-amber-500/40 hover:text-amber-300"
              >
                <Mail size={14} />
                Contacto tecnico
              </a>
            </div>
          </div>

          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-zinc-200">
              Accesos rapidos
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
              <a
                href="#sobre-nosotros"
                className="transition-colors hover:text-amber-300"
              >
                Sobre nosotros
              </a>
              <a
                href="#servicios"
                className="transition-colors hover:text-amber-300"
              >
                Servicios
              </a>
              <a
                href="#proceso"
                className="transition-colors hover:text-amber-300"
              >
                Proceso de trabajo
              </a>
              <a
                href="#proyectos"
                className="transition-colors hover:text-amber-300"
              >
                Proyectos
              </a>
              <a
                href="#contacto"
                className="transition-colors hover:text-amber-300"
              >
                Contacto de servicios
              </a>
            </div>
          </div>

          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-zinc-200">
              Contacto
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
              <a
                href="https://wa.me/5493871234567"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-emerald-300"
              >
                <MessageCircle size={15} className="text-emerald-300" />
                WhatsApp: +54 9 387 123 4567
              </a>
              <a
                href="tel:+5493871234567"
                className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
              >
                <Phone size={15} className="text-amber-300" />
                +54 9 387 123 4567
              </a>
              <a
                href="mailto:contacto@lunametal.com.ar"
                className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
              >
                <Mail size={15} className="text-amber-300" />
                contacto@lunametal.com.ar
              </a>
              <p className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-amber-300" />
                Salta, Argentina
              </p>
              <p className="pt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                Respuesta tecnica en menos de 24 horas habiles
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <p>
              © {new Date().getFullYear()} Luna Metal Industrial S.A. Todos los
              derechos reservados.
            </p>
            <p>
              Servicios metalurgicos e industriales en Argentina. Soporte
              tecnico para operaciones de alta exigencia.
            </p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5493871234567?text=Hola%20Luna%20Metal%2C%20quiero%20cotizar%20un%20servicio."
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        className={`whatsapp-float group fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/35 bg-emerald-500 p-0 text-zinc-950 shadow-lg shadow-emerald-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
          showWhatsappHint ? "show-tooltip" : ""
        }`}
      >
        <span className="whatsapp-tooltip" aria-hidden="true">
          Escribenos ahora
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 fill-current"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 8.014 0C3.685 0 .163 3.525.161 7.858c0 1.387.363 2.742 1.053 3.94L0 16l4.304-1.128a7.84 7.84 0 0 0 3.706.947h.004c4.329 0 7.852-3.526 7.854-7.858a7.83 7.83 0 0 0-2.267-5.635zm-5.587 12.17h-.003a6.54 6.54 0 0 1-3.335-.913l-.239-.142-2.554.67.682-2.49-.156-.255A6.53 6.53 0 0 1 1.405 7.86c.002-3.603 2.933-6.534 6.61-6.534a6.57 6.57 0 0 1 4.679 1.943A6.53 6.53 0 0 1 14.037 7.86c-.002 3.604-2.933 6.536-6.61 6.536z" />
          <path d="M11.64 9.58c-.203-.102-1.2-.592-1.386-.658-.186-.068-.322-.102-.458.102-.136.203-.526.658-.645.794-.118.135-.237.152-.44.05-.203-.101-.857-.316-1.633-1.007-.603-.538-1.01-1.202-1.128-1.405-.119-.203-.013-.313.088-.415.09-.089.203-.237.305-.355.102-.118.136-.203.203-.338.068-.136.034-.254-.017-.355-.05-.102-.458-1.103-.627-1.512-.165-.395-.333-.34-.458-.347l-.39-.007a.75.75 0 0 0-.542.254c-.186.203-.711.694-.711 1.693 0 .997.728 1.96.829 2.096.102.135 1.432 2.194 3.47 3.077.485.21.863.334 1.158.428.487.156.929.134 1.28.081.39-.058 1.2-.49 1.37-.963.169-.474.169-.88.118-.963-.05-.084-.186-.135-.39-.237z" />
        </svg>
      </a>
    </div>
  );
}
