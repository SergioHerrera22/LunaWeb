import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
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
    title: "Fabricacion metalmecanica pesada",
    description:
      "Tolvas, chutes, estructuras y componentes para faenas mineras con trazabilidad completa de materiales.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento industrial en terreno",
    description:
      "Paradas programadas y correctivos con cuadrillas certificadas para reducir tiempos muertos en planta.",
  },
  {
    icon: Drill,
    title: "Montaje de equipos criticos",
    description:
      "Alineamiento, montaje y puesta en marcha de sistemas metalicos bajo estandares de seguridad minera.",
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ── Sticky Nav ── */}
      <nav
        aria-label="Navegacion principal"
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-zinc-800/80 bg-zinc-950/90 shadow-lg shadow-black/30 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a
            href="/"
            aria-label="Luna Metal Industrial - Inicio"
            className="group flex items-center gap-3"
          >
            <div className="grid h-11 w-11 place-items-center rounded-md bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/40">
              <HardHat size={23} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-heading text-xl uppercase tracking-widest text-zinc-100">
                Luna Metal
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                Industrial Mining Solutions
              </p>
            </div>
          </a>
          <a
            href="#contacto"
            className="rounded-md border border-amber-500/60 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-amber-300 transition-all duration-200 hover:bg-amber-500 hover:text-zinc-950 hover:shadow-md hover:shadow-amber-500/25"
          >
            Cotizar proyecto
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden pt-24">
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
                Partner metalurgico para la gran mineria
              </span>

              <h1 className="font-heading text-4xl uppercase leading-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                Ingenieria y fabricacion{" "}
                <span className="gradient-text">metalurgica</span> que sostiene
                la operacion minera
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Diseñamos, fabricamos y montamos soluciones metalmecanicas de
                alto desgaste para plantas de chancado, molienda y transporte de
                mineral. Estandares de seguridad, tiempos exigentes y enfoque
                total en continuidad operacional.
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
                  Proyecto destacado
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
        <section aria-labelledby="servicios-heading">
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

          <div className="grid gap-6 md:grid-cols-3">
            {services.map(({ icon: Icon, title, description }, i) => (
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
            ))}
          </div>
        </section>

        {/* ── How we work ── */}
        <section aria-labelledby="proceso-heading">
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
                  Ejecutamos trabajos de alto impacto para grandes mineras
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

            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.title} delay={i * 100}>
                  <article className="group overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 transition-all duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-black/40">
                    <div className="overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-amber-400/70">
                        {project.location}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold leading-snug text-zinc-100">
                        {project.title}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
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
                    Agende una reunion tecnica y reciba una propuesta con
                    alcance, cronograma y plan de ejecucion para su operacion
                    minera.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-300 sm:flex-row sm:flex-wrap sm:gap-6">
                    <a
                      href="tel:+56912345678"
                      className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
                    >
                      <Phone size={15} className="text-amber-300" /> +56 9 1234
                      5678
                    </a>
                    <a
                      href="mailto:ventas@lunametal.cl"
                      className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
                    >
                      <Mail size={15} className="text-amber-300" />{" "}
                      ventas@lunametal.cl
                    </a>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={15} className="text-amber-300" />{" "}
                      Antofagasta, Chile
                    </span>
                  </div>
                </div>

                <a
                  href="mailto:ventas@lunametal.cl"
                  className="group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 transition-all duration-200 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/40"
                >
                  <span
                    className="absolute inset-0 rounded-xl ring-0 ring-amber-400/50 transition-all duration-300 group-hover:ring-4"
                    aria-hidden="true"
                  />
                  Hablar con ventas
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
                  Industrial Mining Solutions
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Fabricacion metalmecanica, mantenimiento industrial y montaje de
              equipos criticos para operaciones mineras que exigen continuidad,
              seguridad y cumplimiento.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 transition-all duration-200 hover:border-emerald-400/60 hover:bg-emerald-500/15"
              >
                <MessageCircle size={14} />
                WhatsApp comercial
              </a>
              <a
                href="mailto:ventas@lunametal.cl"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 transition-all duration-200 hover:border-amber-500/40 hover:text-amber-300"
              >
                <Mail size={14} />
                Ventas tecnicas
              </a>
            </div>
          </div>

          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-zinc-200">
              Accesos rapidos
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
              <a
                href="#servicios-heading"
                className="transition-colors hover:text-amber-300"
              >
                Servicios
              </a>
              <a
                href="#proceso-heading"
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
                Contacto comercial
              </a>
            </div>
          </div>

          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-zinc-200">
              Contacto
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
              <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-emerald-300"
              >
                <MessageCircle size={15} className="text-emerald-300" />
                WhatsApp: +56 9 1234 5678
              </a>
              <a
                href="tel:+56912345678"
                className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
              >
                <Phone size={15} className="text-amber-300" />
                +56 9 1234 5678
              </a>
              <a
                href="mailto:ventas@lunametal.cl"
                className="inline-flex items-center gap-2 transition-colors hover:text-amber-300"
              >
                <Mail size={15} className="text-amber-300" />
                ventas@lunametal.cl
              </a>
              <p className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-amber-300" />
                Antofagasta, Chile
              </p>
              <p className="pt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                Respuesta comercial en menos de 24 horas habiles
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
              Metalurgia industrial para mineria en Chile. Soporte comercial y
              tecnico para faenas de alta exigencia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
