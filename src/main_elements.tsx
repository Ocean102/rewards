import type { CSSProperties } from "react"
import { useState, useRef, useEffect } from 'react'
import config from './assets/config.json'
import { motion } from "framer-motion"


function RedemptionTitle({ title, price }: { title: string; price: number }) {
  const [titleText, setTitleText] = useState("")

  const ref = useRef<HTMLHeadingElement | null>(null)
  const typed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || typed.current) return
        typed.current = true

        // ---- title typing ----
        let i = -1
        const titleType = setInterval(() => {
          i++
          setTitleText((prev) => prev + title.charAt(i))
          if (i >= title.length - 1) clearInterval(titleType)
        }, 50)
      },
      { threshold: 0.67 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [title])

  return (
    <>
      <h1
        ref={ref}
        className="font-semibold text-2xl m-0 p-0"
      >
        {titleText || "Loading..."}
      </h1>

      <p className="mb-2">
        {config.text.redemption.worth.replace(
          "{price}",
          String(price)
        )}
      </p>
    </>
  )
}

// TYPES
type ProgressBar = {
  prog?: boolean
  percent: number
  children: any
}

type UserBadge = {
  name: string
  level: number
  avatar: `https://${string}`
}

type Redemption = {
  // METADATA
  title: string
  img: string

  price: number
  points: number
}

// REACT COMPONENTS, SELF EXPLAINATORY
let totalBars = 0

export function CountUp({
  from = 0,
  to = 0,
  duration = 1000
}: {
  from?: number
  to?: number
  duration?: number
}) {
  const [value, setValue] = useState(from)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    startTime.current = null

    const step = (timestamp: number) => {
      if (startTime.current === null)  startTime.current = timestamp
      const progress = Math.min( (timestamp - startTime.current) / duration, 1)
      setValue(Math.floor(progress * (to - from) + from))
      if (progress < 1) rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)
    return () => { rafId.current !== null && cancelAnimationFrame(rafId.current) }
  }, [from, to, duration])

  return <span>{value.toLocaleString()}</span>
}

export const Progress = ({ prog = true, percent = 0, children }: ProgressBar) => {
  const [p,sp] = useState(0)

  useEffect(() => {
    if (percent < 100) totalBars++
    setTimeout(() => sp(percent), percent >= 100 ? 0 : totalBars * 250)
  }, [])

  return <div className='progress text-white leading-normal' style={{ "--percent": `${p*100}%` } as CSSProperties}> {children} { prog && <>({Math.round(percent*100)}%)</> } </div>
}

export const ContentSkeleton = () => <div className='mt-5 px-3'>
  <div className='p-3 bg-blue-900/60 rounded-2xl'>
    <h1 className='text-[22px] font-semibold flex items-center gap-2'><img src="/assets/loading.gif" />{config.text.loading.title}</h1>
    <p>{config.text.loading.content}</p>
  </div>
</div>

export const Title = () => <div className='p-3 text-[18px] font-semibold items-center gap-2 flex'>
  <img src="/assets/icon.png" alt="rewards" className='size-5' />
  <p>{config.title} <span className="text-[12px] text-[#aaa]">({config.version})</span></p>
</div>

const UserFX = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
}

export const User = ({ name, avatar, level }: UserBadge) => {
  return <div className='flex gap-5 items-center'>
    <motion.img
      onError={(e: any) => {e.target.src="https://rewards.bing.com/rewardscdn/images/rewards/membercenter/missions/profilePicBackground.svg"}}
      src={avatar}
      alt={`pfp_${name}`}
      className='size-12.5 border rounded-full' {...UserFX}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
    
    <div className='leading-5'>
      <motion.h1 
        className='text-[18px] font-semibold' {...UserFX}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
      >
        {name}
      </motion.h1>
      <motion.p
        className='flex items-center gap-1.5' {...UserFX}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
      >
        {config.text.level} {level}
      </motion.p>
    </div>
  </div>
}

export const AutoRedeem = ({ title, price, points, img }: Redemption) => <div className='p-3.5 flex items-center justify-center'>
  <div className='rounded-2xl w-5/6 bg-white text-black leading-4' style={{ boxShadow: "inset 0 0 25px rgba(0,0,0,0.2)" }}>
    <img src={`https://rewards.bing.com/rewardscdn/images/rewards/rc/${img}`} onError={(e) => (e.target)} className='w-full rounded-t-2xl' />
    
    <div className="p-3 py-2">
      <RedemptionTitle title={title} price={price} />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: !0, amount: 0.8 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Progress prog={price-points > 0} percent={points/price}>
        { price-points <= 0 ? config.text.redemption.ready : <>
          <span><CountUp from={0} to={price - points} duration={1000}/> {config.text.redemption.remain}</span>
        </>}
        </Progress>
      </motion.div>
    </div>
  </div>
</div>

export const Warning = () => <motion.div 
  className='p-3.5'
  initial={{ opacity: 0, y: -30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.3, duration: 0.5 }}
>
  <div className='p-2.5 bg-white text-black leading-4.5 rounded-xl'>
    <h1 className='text-xl font-semibold'>{config.text.warning.title}</h1>
    <p>{config.text.warning.content}</p>
  </div>
</motion.div>

export const SignIn = () => <motion.div className='p-3.5 pb-2.5' transition={{ duration: 0.3 }} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}><h1 className='text-[20px] font-semibold'>{config.text.signin.title}</h1> <p>{config.text.signin.content}</p> </motion.div>