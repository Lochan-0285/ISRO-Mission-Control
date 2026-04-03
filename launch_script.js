const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

let rocketAltitude = 400;
let activeLaunch = false;

// ⭐ stars
let stars = [];
for (let i = 0; i < 120; i++) {
    stars.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        size: Math.random() * 3 + 1
    });
}

// 💨 smoke
let smoke = [];

// 🎨 render
function render() {
    let sky = ctx.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, "#000022");
    sky.addColorStop(1, "#000066");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 800, 500);

    // ⭐ stars
    stars.forEach(star => {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // 🌙 moon
    ctx.beginPath();
    ctx.arc(700, 80, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#fdfd96";
    ctx.fill();

    // 💨 smoke
    smoke.forEach((p, i) => {
        ctx.fillStyle = "rgba(200,200,200," + p.opacity + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += 2;
        p.size += 0.3;
        p.opacity -= 0.02;

        if (p.opacity <= 0) smoke.splice(i, 1);
    });

    // ground
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 480, 800, 20);

    // 🚀 rocket
    ctx.save();
    ctx.translate(150, rocketAltitude);

    ctx.fillStyle = "#fff";
    ctx.fillRect(-15, 0, 30, 60);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(0, -25);
    ctx.lineTo(15, 0);
    ctx.fill();

    // 🔥 flame + smoke
    if (activeLaunch) {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.moveTo(-10, 60);
        ctx.lineTo(0, 100);
        ctx.lineTo(10, 60);
        ctx.fill();

        smoke.push({
            x: 150,
            y: rocketAltitude + 70,
            size: 6,
            opacity: 0.6
        });
    }

    ctx.restore();
}

// ⏳ launch
function processLaunch() {
    let inputVal = document.getElementById("codeField").value;
    let statusLog = document.getElementById("displayStatus");

    let pattern = /^ISRO-[A-Z]{4}-[0-9]{2}$/;

    if (pattern.test(inputVal)) {
        statusLog.innerText = "🚀 LAUNCH!";
        statusLog.style.color = "cyan";

        // 🔊 sound
        let sound = document.getElementById("launchSound");
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }

        activeLaunch = true;
        rocketAltitude = 400;
        runAnimation();
    } else {
        statusLog.innerText = "❌ INVALID CODE";
        statusLog.style.color = "red";
    }
}

// 🎬 animation
function runAnimation() {
    ctx.clearRect(0, 0, 800, 500);
    render();

    if (activeLaunch && rocketAltitude > -150) {
        rocketAltitude -= 3;
        requestAnimationFrame(runAnimation);
    }
}

// ⭐ background loop (IMPORTANT)
function animate() {
    ctx.clearRect(0, 0, 800, 500);
    render();
    requestAnimationFrame(animate);
}

animate();
