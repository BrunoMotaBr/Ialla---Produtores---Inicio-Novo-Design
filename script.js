import * as THREE from 'three';
gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText);
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.addEventListener('load', () => {

    const videoHero = document.querySelector(".bg video");
    videoHero.src = "imgs/Video_Project.mp4";
    videoHero.autoplay = true;
    videoHero.loop = true;
    videoHero.muted = true;

    const videoFooter = document.querySelector("footer video");
    videoFooter.src = "imgs/Video_Project2.mp4";
    videoFooter.autoplay = true;
    videoFooter.loop = true;
    videoFooter.muted = true;

    const linhaDoTempo = gsap.timeline({
        scrollTrigger:{
            trigger: ".transicao",
            scrub: 2,
            start: "0% 0%",
            end: "+=3000",
            pin: true,
        }
    });

    linhaDoTempo.to(".retangulos div", {
        y: 0,
        stagger: 0.2,
        duration: 4
    });

    linhaDoTempo.to(".secao2", {
        opacity: 1,
        duration: 0.1

    });

    linhaDoTempo.from(".secao2 h2", {
        y:200
    });

    const split = new SplitText(".secao2 h2", {
        types: "chars",
        mask: "lines"
    });

    linhaDoTempo.from(split.chars, {
        y: 100,
        stagger: 0.1,
        duration: 1

    })

    const linhaDoTempo2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".animacao-footer",
            scrub: 2,
            pin: true,
            end: "+=3000"
        }
    });

    const textosSecao3D = document.querySelectorAll(".secao3D h2");
    textosSecao3D.forEach((palavra) => {
        
        const split2 = new SplitText(palavra, {
            types: "chars"
        });

        linhaDoTempo2.from(split2.chars, {
            opacity: 0,
            filter: "blur(400px)",
            stagger: {
                each: .8,
                from: "random"
            }
        });

        linhaDoTempo2.to(split2.chars, {
            opacity: 0,
            stagger: .8
        }, "+=10");
    });
    
    const cena = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        40, 
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 10;

    const projetor = new THREE.WebGLRenderer({alpha: true, antialias: true});

    projetor.setSize(window.innerWidth, window.innerHeight);

    const divDiamante = document.querySelector(".diamante");

    divDiamante.appendChild(
        projetor.domElement
    );

    const gltfLoader = new GLTFLoader();
    let diamante = null;

    gltfLoader.load("imgs/diamond.glb", (modelo) => {
        diamante = modelo.scene;
        diamante.position.z = -8;
        diamante.position.y = 1.5;

        if(window.innerWidth >= 545){
            diamante.position.z = -60;
        }

        const linhaDoTempoDiamante = gsap.timeline({
            scrollTrigger:{
                trigger: ".animacao-footer",
                scrub: 2,
                end: "+=3500",
            }
            });

        linhaDoTempoDiamante.to(diamante.position, {
            y: 0,
            duration: 2
        });
        linhaDoTempoDiamante.to(diamante.rotation, {
            x: 4.7,
            duration: 2
        }, "<")

        linhaDoTempoDiamante.to(diamante.position, {
            z: 9,
            duration: 0.3
        })

        linhaDoTempoDiamante.to("footer", {
            opacity: 1,
        })

        cena.add(diamante);
    });

    const txtLoader = new THREE.TextureLoader();
    txtLoader.load( 'imgs/hdri.webp', (textura) => {
        textura.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(projetor);
        const ambiente = pmrem.fromEquirectangular(textura).texture;
        cena.environment = ambiente;
    });



    function animar(){
        if(diamante !== null){diamante.rotation.y += 0.02;}
        projetor.render(cena, camera);
        requestAnimationFrame(animar);
    }

    animar();
});


