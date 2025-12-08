/**
 * Google Antigravity-style background animation
 * Creates floating particles/elements that interact with the mouse
 */

class AntigravityAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853']; // Google colors

        this.init();
    }

    init() {
        this.canvas.id = 'antigravity-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-10';
        this.canvas.style.pointerEvents = 'none'; // Click through to content
        this.canvas.style.background = '#ffffff'; // White background base

        document.body.prepend(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse interaction
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const spacing = 40; // Distance between dots
        const rows = Math.ceil(this.canvas.height / spacing);
        const cols = Math.ceil(this.canvas.width / spacing);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * spacing + spacing / 2;
                const y = j * spacing + spacing / 2;

                this.particles.push({
                    x: x,
                    y: y,
                    originX: x,
                    originY: y,
                    size: 2, // Small dots
                    color: '#bdc1c6', // Light gray standard dot
                    vx: 0,
                    vy: 0,
                    density: (Math.random() * 30) + 1
                });
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            // Spring physics to return to origin
            const dx = p.originX - p.x;
            const dy = p.originY - p.y;
            const distanceOriginal = Math.sqrt(dx * dx + dy * dy);

            // Spring force
            const springForce = distanceOriginal * 0.05; // Stiffness
            const springAngle = Math.atan2(dy, dx);

            p.vx += Math.cos(springAngle) * springForce;
            p.vy += Math.sin(springAngle) * springForce;

            // Mouse Repulsion
            if (this.mouse.x != null) {
                const mouseDx = p.x - this.mouse.x;
                const mouseDy = p.y - this.mouse.y;
                const distanceMouse = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                const repulsionRadius = 150;

                if (distanceMouse < repulsionRadius) {
                    // Calculate repulsion force
                    const force = (repulsionRadius - distanceMouse) / repulsionRadius;
                    const repulsionStrength = 15; // How strongly they move away
                    const angle = Math.atan2(mouseDy, mouseDx);

                    p.vx += Math.cos(angle) * force * repulsionStrength;
                    p.vy += Math.sin(angle) * force * repulsionStrength;
                }
            }

            // Friction/Damping
            p.vx *= 0.85;
            p.vy *= 0.85;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Start animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AntigravityAnimation();
});
