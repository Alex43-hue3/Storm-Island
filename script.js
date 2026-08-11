
/* =========================================================
   STORM ISLAND
   SCRIPT.JS
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

// IMPORTANTE:
// Reemplaza este número por tu número de WhatsApp.
// Formato internacional, sin +, espacios ni guiones.
//
// Ejemplo México:
// 8112345678 -> 528112345678

const WHATSAPP_NUMBER = "5218112345678";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const designUpload = document.getElementById("designUpload");

const designPreview = document.getElementById("designPreview");

const shirtPreview = document.getElementById("shirtPreview");

const shirtOptions = document.querySelectorAll(".shirt-option");

const colorOptions = document.querySelectorAll(".color-option");

const generateMockup = document.getElementById("generateMockup");

const menuToggle = document.getElementById("menuToggle");

const nav = document.querySelector(".nav");

const whatsappHeader = document.getElementById("whatsappHeader");

const whatsappFooter = document.getElementById("whatsappFooter");


/* =========================================================
   VARIABLES DEL MOCKUP
   ========================================================= */

let uploadedImage = null;

let currentShirt = "negra";

let currentColor = "negro";

let designScale = 1;

let designX = 0;

let designY = 0;

let isDragging = false;

let startMouseX = 0;

let startMouseY = 0;

let startDesignX = 0;

let startDesignY = 0;


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Storm Island iniciado.");

    setupNavigation();

    setupDesignUpload();

    setupShirtSelector();

    setupColorSelector();

    setupDesignMovement();

    setupGenerateMockup();

    setupWhatsApp();

});


/* =========================================================
   MENÚ MOBILE
   ========================================================= */

function setupNavigation() {

    if (!menuToggle || !nav) {
        return;
    }

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("open");

        const icon = menuToggle.querySelector("i");

        if (nav.classList.contains("open")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });


    // Cerrar menú al seleccionar una sección

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            const icon = menuToggle.querySelector("i");

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        });

    });

}


/* =========================================================
   SUBIR DISEÑO
   ========================================================= */

function setupDesignUpload() {

    if (!designUpload) {
        return;
    }

    designUpload.addEventListener("change", event => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }


        // Verificar formato

        if (!file.type.startsWith("image/")) {

            alert("Por favor selecciona una imagen válida.");

            designUpload.value = "";

            return;
        }


        // Verificar tamaño máximo: 10 MB

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {

            alert("La imagen es demasiado grande. Máximo permitido: 10 MB.");

            designUpload.value = "";

            return;
        }


        const reader = new FileReader();


        reader.onload = event => {

            uploadedImage = new Image();

            uploadedImage.onload = () => {

                createDesignPreview(uploadedImage);

            };

            uploadedImage.src = event.target.result;

        };


        reader.readAsDataURL(file);

    });

}


/* =========================================================
   CREAR PREVIEW DEL DISEÑO
   ========================================================= */

function createDesignPreview(image) {

    designPreview.innerHTML = "";

    designPreview.classList.add("has-design");


    const img = document.createElement("img");

    img.src = image.src;

    img.alt = "Diseño personalizado";


    designPreview.appendChild(img);


    // Reiniciar posición

    designScale = 1;

    designX = 0;

    designY = 0;

    updateDesignPosition();

}


/* =========================================================
   SELECCIONAR PLAYERA
   ========================================================= */

function setupShirtSelector() {

    shirtOptions.forEach(option => {

        option.addEventListener("click", () => {

            shirtOptions.forEach(item => {

                item.classList.remove("active");

            });


            option.classList.add("active");


            const image = option.dataset.image;

            const shirt = option.dataset.shirt;


            if (image) {

                shirtPreview.src = image;

            }


            currentShirt = shirt || "negra";


            // Sincronizar color

            updateActiveColor(currentShirt);

        });

    });

}


/* =========================================================
   SELECCIONAR COLOR
   ========================================================= */

function setupColorSelector() {

    colorOptions.forEach(option => {

        option.addEventListener("click", () => {

            colorOptions.forEach(item => {

                item.classList.remove("active");

            });


            option.classList.add("active");


            const color = option.dataset.color;

            currentColor = color;


            changeShirtByColor(color);

        });

    });

}


/* =========================================================
   CAMBIAR PLAYERA SEGÚN COLOR
   ========================================================= */

function changeShirtByColor(color) {

    const shirtImages = {

        negro:
            "img/playeras/playera-negra.png",

        gris:
            "img/playeras/playera-gris.png",

        blanco:
            "img/playeras/playera-blanca.png",

        beige:
            "img/playeras/playera-beige.png"

    };


    if (shirtImages[color]) {

        shirtPreview.src = shirtImages[color];

        currentShirt = color;

    }


    // Actualizar botones de playera

    shirtOptions.forEach(option => {

        option.classList.remove("active");


        if (option.dataset.shirt === color) {

            option.classList.add("active");

        }

    });

}


/* =========================================================
   ACTUALIZAR COLOR ACTIVO
   ========================================================= */

function updateActiveColor(color) {

    colorOptions.forEach(option => {

        option.classList.remove("active");


        if (option.dataset.color === color) {

            option.classList.add("active");

        }

    });


    currentColor = color;

}


/* =========================================================
   MOVIMIENTO DEL DISEÑO
   ========================================================= */

function setupDesignMovement() {

    if (!designPreview) {
        return;
    }


    // Arrastrar con mouse

    designPreview.addEventListener("mousedown", event => {

        if (!uploadedImage) {
            return;
        }


        isDragging = true;

        startMouseX = event.clientX;

        startMouseY = event.clientY;

        startDesignX = designX;

        startDesignY = designY;


        designPreview.style.cursor = "grabbing";

        event.preventDefault();

    });


    document.addEventListener("mousemove", event => {

        if (!isDragging) {
            return;
        }


        const movementX = event.clientX - startMouseX;

        const movementY = event.clientY - startMouseY;


        designX = startDesignX + movementX;

        designY = startDesignY + movementY;


        updateDesignPosition();

    });


    document.addEventListener("mouseup", () => {

        if (!isDragging) {
            return;
        }


        isDragging = false;

        designPreview.style.cursor = "move";

    });


    // Cambiar tamaño con rueda

    designPreview.addEventListener("wheel", event => {

        if (!uploadedImage) {
            return;
        }


        event.preventDefault();


        if (event.deltaY < 0) {

            designScale += 0.05;

        } else {

            designScale -= 0.05;

        }


        // Límites

        if (designScale < 0.4) {

            designScale = 0.4;

        }

        if (designScale > 2.5) {

            designScale = 2.5;

        }


        updateDesignPosition();

    }, {
        passive: false
    });

}


/* =========================================================
   ACTUALIZAR POSICIÓN DEL DISEÑO
   ========================================================= */

function updateDesignPosition() {

    const image = designPreview.querySelector("img");

    if (!image) {
        return;
    }


    image.style.transform =
        `translate(${designX}px, ${designY}px) scale(${designScale})`;

}


/* =========================================================
   GENERAR MOCKUP
   ========================================================= */

function setupGenerateMockup() {

    if (!generateMockup) {
        return;
    }


    generateMockup.addEventListener("click", () => {

        if (!uploadedImage) {

            alert("Primero sube tu diseño.");

            return;
        }


        generateFinalMockup();

    });

}


/* =========================================================
   CREAR IMAGEN FINAL
   ========================================================= */

function generateFinalMockup() {

    const shirt = new Image();

    const design = new Image();


    shirt.crossOrigin = "anonymous";

    design.crossOrigin = "anonymous";


    shirt.src = shirtPreview.src;

    design.src = uploadedImage.src;


    shirt.onload = () => {

        design.onload = () => {

            const canvas = document.createElement("canvas");

            const width = 1000;

            const height = 1000;


            canvas.width = width;

            canvas.height = height;


            const ctx = canvas.getContext("2d");


            /*
             * Fondo
             */

            ctx.fillStyle = "#080808";

            ctx.fillRect(
                0,
                0,
                width,
                height
            );


            /*
             * PLAYERA
             */

            const shirtWidth = 720;

            const shirtHeight =
                shirt.height *
                (shirtWidth / shirt.width);


            const shirtX =
                (width - shirtWidth) / 2;

            const shirtY =
                (height - shirtHeight) / 2;


            ctx.drawImage(
                shirt,
                shirtX,
                shirtY,
                shirtWidth,
                shirtHeight
            );


            /*
             * DISEÑO
             */

            const printWidth =
                shirtWidth * 0.31;


            const ratio =
                design.height /
                design.width;


            const printHeight =
                printWidth * ratio;


            const printCenterX =
                width / 2 + designX;


            const printCenterY =
                shirtY +
                shirtHeight * 0.30 +
                designY;


            const finalWidth =
                printWidth * designScale;

            const finalHeight =
                printHeight * designScale;


            ctx.drawImage(
                design,
                printCenterX - finalWidth / 2,
                printCenterY - finalHeight / 2,
                finalWidth,
                finalHeight
            );


            /*
             * MOSTRAR RESULTADO
             */

            showGeneratedMockup(canvas);

        };

    };

}


/* =========================================================
   MOSTRAR MOCKUP GENERADO
   ========================================================= */

function showGeneratedMockup(canvas) {

    const imageURL =
        canvas.toDataURL("image/png");


    // Crear ventana/modal

    const modal =
        document.createElement("div");


    modal.className =
        "mockup-result-modal";


    modal.innerHTML = `

        <div class="mockup-result-content">

            <button
                class="close-result"
                aria-label="Cerrar"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <h2>
                TU MOCKUP
            </h2>

            <p>
                Así podría verse tu diseño.
            </p>

            <img
                src="${imageURL}"
                alt="Mockup generado"
                class="generated-mockup"
            >

            <div class="result-buttons">

                <button
                    class="download-mockup"
                >
                    <i class="fa-solid fa-download"></i>
                    DESCARGAR
                </button>

                <button
                    class="send-whatsapp"
                >
                    <i class="fa-brands fa-whatsapp"></i>
                    ENVIAR POR WHATSAPP
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    /*
     * CERRAR
     */

    const closeButton =
        modal.querySelector(".close-result");


    closeButton.addEventListener("click", () => {

        modal.remove();

    });


    /*
     * DESCARGAR
     */

    const downloadButton =
        modal.querySelector(".download-mockup");


    downloadButton.addEventListener("click", () => {

        const link =
            document.createElement("a");


        link.download =
            "storm-island-mockup.png";


        link.href =
            imageURL;


        link.click();

    });


    /*
     * WHATSAPP
     */

    const whatsappButton =
        modal.querySelector(".send-whatsapp");


    whatsappButton.addEventListener("click", () => {

        sendToWhatsApp();

    });


    /*
     * CERRAR AL HACER CLICK FUERA
     */

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.remove();

        }

    });

}


/* =========================================================
   WHATSAPP
   ========================================================= */

function setupWhatsApp() {

    if (whatsappHeader) {

        whatsappHeader.addEventListener("click", event => {

            event.preventDefault();

            sendToWhatsApp();

        });

    }


    if (whatsappFooter) {

        whatsappFooter.addEventListener("click", event => {

            event.preventDefault();

            sendToWhatsApp();

        });

    }

}


/* =========================================================
   ENVIAR INFORMACIÓN A WHATSAPP
   ========================================================= */

function sendToWhatsApp() {

    const message =

        `Hola, Storm Island. 👋

Me interesa una playera personalizada.

Playera: ${currentShirt}

Color: ${currentColor}

Ya realicé mi mockup y quisiera información sobre precio y disponibilidad.`;


    const encodedMessage =
        encodeURIComponent(message);


    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   BOTÓN CATÁLOGO
   ========================================================= */

const viewCatalog =
    document.getElementById("viewCatalog");


if (viewCatalog) {

    viewCatalog.addEventListener("click", () => {

        alert(
            "Aquí podremos mostrar todos los diseños de Storm Island."
        );

    });

}


/* =========================================================
   ANIMACIÓN AL HACER SCROLL
   ========================================================= */

const sections =
    document.querySelectorAll(
        ".catalog-section, .mockup-section, .benefit"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.12
        }
    );


sections.forEach(section => {

    section.style.opacity = "0";

    section.style.transform =
        "translateY(25px)";

    section.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    observer.observe(section);

});


/* =========================================================
   MENSAJE DE INICIO
   ========================================================= */

console.log(
    "%c STORM ISLAND ",
    "background:#000;color:#d4af37;font-size:20px;font-weight:bold;padding:8px;"
);

console.log(
    "%c Diseños que dejan huella. ",
    "color:#fff;font-size:13px;"
);
