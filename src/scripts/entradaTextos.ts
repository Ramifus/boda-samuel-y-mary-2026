// Entrada elegante de los textos de una sección: cada elemento con
// data-entrada="arriba|abajo|izq|der" llega desde ese lado, uno tras otro.
// Se repite cada vez que se baja hasta la sección. Las imágenes no se tocan.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESDE: Record<string, gsap.TweenVars> = {
    arriba: { y: -30 },
    abajo: { y: 30 },
    izq: { x: -50 },
    der: { x: 50 },
};

export function entradaTextos(selector: string) {
    const root = document.querySelector<HTMLElement>(selector);
    if (!root || root.dataset.entradaLista) return;
    root.dataset.entradaLista = "1";

    const textos = Array.from(root.querySelectorAll<HTMLElement>("[data-entrada]"));
    if (!textos.length) return;

    textos.forEach((el) => {
        gsap.set(el, { opacity: 0, ...DESDE[el.dataset.entrada ?? "abajo"] });
    });

    const tl = gsap.timeline({ paused: true });
    textos.forEach((el, i) => {
        tl.to(
            el,
            { opacity: 1, x: 0, y: 0, duration: 1.1, ease: "power3.out" },
            0.2 + i * 0.25,
        );
    });

    ScrollTrigger.create({
        trigger: root,
        start: "top 65%",
        onEnter: () => tl.timeScale(1).restart(),
        onLeaveBack: () => tl.timeScale(2.5).reverse(),
    });
}
