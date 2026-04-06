import React, { useEffect, useRef } from 'react';

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기를 화면에 맞춤
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#FF924C'];

    // 파편 생성기
    const createParticle = () => {
      return {
        x: canvas.width / 2, // 중앙에서 발사
        y: canvas.height / 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 10 - 5,
        speedY: Math.random() * -15 - 5, // 위로 솟구치게
        gravity: 0.4,
        opacity: 1,
      };
    };

    // 초기 발사 (한 번에 100개)
    for (let i = 0; i < 100; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.speedY += p.gravity; // 중력 적용
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.01; // 점점 투명하게

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        // 사각형 파편 그리기
        ctx.fillRect(p.x, p.y, p.size, p.size);

        // 화면 밖으로 나가거나 투명해지면 삭제 (렉 방지 핵심)
        if (p.opacity <= 0 || p.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    // 윈도우 리사이즈 대응
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[110]"
      style={{ width: '100%', height: '100%' }}
    />
  );
};