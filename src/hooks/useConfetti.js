import { useRef, useCallback } from 'react'

class ConfettiParticle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.size = Math.random() * 8 + 4
    this.color = color
    this.speedX = Math.random() * 10 - 5
    this.speedY = Math.random() * -15 - 5
    this.gravity = 0.35
    this.rotation = Math.random() * 360
    this.rotationSpeed = Math.random() * 10 - 5
    this.opacity = 1
    this.fadeSpeed = Math.random() * 0.015 + 0.005
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.speedY += this.gravity
    this.rotation += this.rotationSpeed
    this.opacity -= this.fadeSpeed
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.globalAlpha = Math.max(0, this.opacity)
    ctx.fillStyle = this.color
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    ctx.restore()
  }
}

export function useConfetti() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animFrameRef = useRef(null)

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0)
    particlesRef.current.forEach((p) => { p.update(); p.draw(ctx) })
    if (particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      animFrameRef.current = null
    }
  }, [])

  const triggerConfetti = useCallback(
    (activeGroupColor) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899']
      if (activeGroupColor) colors.push(activeGroupColor)
      const spawnX = window.innerWidth / 2
      const spawnY = window.innerHeight * 0.7
      for (let i = 0; i < 80; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        particlesRef.current.push(
          new ConfettiParticle(spawnX - 100 + Math.random() * 200, spawnY, color)
        )
      }
      if (!animFrameRef.current) animate()
    },
    [animate]
  )

  return { canvasRef, triggerConfetti }
}
