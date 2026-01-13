import type { CSSProperties } from "react"
import { useState, useRef, useEffect } from 'react'
import config from './assets/config.json'

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

export const Progress = ({ prog = true, percent = 0, children }: ProgressBar) => <div className='progress text-white leading-normal' style={{ "--percent": `${percent*100}%` } as CSSProperties}> {children} { prog && <>({Math.round(percent*100)}%)</> } </div>

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

  return <span>{value}</span>
}

export const ContentSkeleton = () => <div className='mt-5 px-3'>
  <div className='p-3 bg-blue-900/60 rounded-2xl'>
    <h1 className='text-[22px] font-semibold flex items-center gap-2'><img src="/loading.gif" />{config.text.loading.title}</h1>
    <p>{config.text.loading.content}</p>
  </div>
</div>

export const Title = () => <div className='p-3 text-[18px] font-semibold items-center gap-2 flex'>
  <img src="/icon.png" alt="icon" className='size-5' />
  <p>{config.title}</p>
</div>

export const User = ({ name, avatar, level }: UserBadge) => {
  return <div className='flex gap-5 items-center'>
    <img src={avatar} alt='user' className='size-12.5 border rounded-full' />
    
    <div className='leading-5'>
      <h1 className='text-[18px] font-semibold'>{name}</h1>
      <p className='flex items-center gap-1.5'>{config.text.level} {level}</p>
    </div>
  </div>
}

export const AutoRedeem = ({ title, price, points, img }: Redemption) => <div className='p-3.5 flex items-center justify-center'>
  <div className='rounded-2xl w-5/6 bg-white text-black leading-4' style={{ boxShadow: "inset 0 0 25px rgba(0,0,0,0.2)" }}>
    <img src={`https://rewards.bing.com/rewardscdn/images/rewards/rc/${img}`} onError={(e) => (e.target)} className='w-full rounded-t-2xl' />
    
    <div className="p-3 py-2">
      <h1 className='font-semibold text-2xl m-0 p-0'>{title}</h1>
      <p className='mb-2'>{ config.text.redemption.worth.replace("{price}", String(price)) }</p>

      <Progress prog={price-points > 0} percent={points/price}>{ price-points <= 0 ? config.text.redemption.ready : `${price-points} ${config.text.redemption.remain}` }</Progress>
    </div>
  </div>
</div>

export const Warning = () => <div className='p-3.5'>
  <div className='p-2.5 bg-white text-black leading-4.5 rounded-xl'>
    <h1 className='text-xl font-semibold'>{config.text.warning.title}</h1>
    <p>{config.text.warning.content}</p>
  </div>
</div>

export const SignIn = () => <div className='p-3.5'>
  <h1 className='text-[20px] font-semibold'>{config.text.signin.title}</h1>
  <p>{config.text.signin.content}</p>
</div>