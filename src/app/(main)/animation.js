import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function AnimHero(Ref) {
    return useGSAP(() => {
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: Ref.current,
            // markers:true,
            start: '-1 top',
            end: '50% top',
            toggleActions: 'play reverse play reverse',
            }
        })
        tl.fromTo('#headline', { 
            scale: 0, 
            opacity: 0 
            }, {
            scale: 1,
            opacity: 1, 
            duration: 0.75,
            ease: 'power1.out',
            clearProps: "all"
            })
        .fromTo('#subheadline', {
            scale: 0,
            opacity: 0
            }, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power1.out',
            clearProps: "all"
            }, '<')
        .fromTo('#cta-button', {
            scale: 0,
            opacity: 0
            }, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay:0.5 ,
            ease: 'power1.out',
            clearProps: "all"
            }, '<')
        .fromTo('#hero-image', {
            scale: 0,
            opacity: 0,
            rotate: -360
            }, {
            scale: 1,
            opacity: 1,
            duration: 0.75, 
            rotate: 0, 
            ease: 'power1.out',
            clearProps: "all"
            } )  
        
        }, { scope: Ref.current })    
};

function AnimTech(Ref) {
    return useGSAP(() => {
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: Ref.current,
            // markers:true,
            start: 'top 50%',
            end: 'bottom 50%',
            toggleActions: 'play reverse play reverse',
            clearProps: "all"
            }
        })
        tl.fromTo('#tech-title', {
            scale: 0, 
            opacity: 0 
            }, {
            scale: 1,
            opacity: 1, 
            duration: 0.75, 
            ease: 'power1.out',
            clearProps: "all"
        })
        tl.fromTo('.tech-card', {
            scaleY: 0,
            // skewY: 10
        }, {
            scaleY: 1,
            // skewY: 0,
            duration: 0.5,
            // stagger: 0.2,
            ease: 'power1.out',
            clearProps: "all"
        })
    })
}

function AnimFeatures(Ref) {
    return useGSAP(() => {
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: Ref.current,
            // markers:true,
            start: 'top 50%',
            end: 'bottom 50%',
            toggleActions: 'play reverse play reverse',
            clearProps: "all"
            }
        })
        tl.fromTo('#features-title', {
            scale: 0, 
            opacity: 0 
            }, {
            scale: 1,
            opacity: 1, 
            duration: 0.75, 
            ease: 'power1.out',
            clearProps: "all"
        })
        tl.fromTo('.features-card', {
            scaleY: 0,
            // skewY: 10
        }, {
            scaleY: 1,
            // skewY: 0,
            duration: 0.5,
            // stagger: 0.2,
            ease: 'power1.out',
            clearProps: "all"
        })
    })
}

function AnimImpacts(Ref) {
    return useGSAP(() => {
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: Ref.current,
            // markers:true,
            start: 'top 50%',
            end: 'bottom 50%',
            toggleActions: 'play reverse play reverse',
            clearProps: "all"
            }
        })
        tl.fromTo('#impacts-title', {
            scale: 0, 
            opacity: 0 
            }, {
            scale: 1,
            opacity: 1, 
            duration: 0.75, 
            ease: 'power1.out',
            clearProps: "all"
        })
        tl.fromTo('.impacts-card', {
            scaleX: 0,
            // skewY: 10
        }, {
            scaleX: 1,
            // skewY: 0,
            duration: 0.5,
            // stagger: 0.2,
            ease: 'power1.out',
            clearProps: "all"
        })
    })
}

function AnimSteps(Ref, cardsData) {
    return useGSAP(() => {
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: Ref.current,
            markers:true,
            start: 'top 50%',
            end: 'bottom 50%',
            toggleActions: 'play reverse play reverse',
            clearProps: "all"
            }
        })
        tl.fromTo('#steps-title', {
            scale: 0, 
            opacity: 0 
            }, {
            scale: 1,
            opacity: 1, 
            duration: 0.75, 
            ease: 'power1.out',
            clearProps: "all"
        })
        cardsData.forEach(element => {
            tl.fromTo(`#steps-card-${element.id}`, {
                scaleX: 0,
            }, {
                scaleX: 1,
                transformOrigin: element.side == 'left' ? 'right center' : 'left center',
                duration: 0.5,
                ease: 'power1.out',
                clearProps: "all", 
            });
        });
    })
}

export {AnimHero, AnimTech, AnimFeatures, AnimImpacts, AnimSteps}