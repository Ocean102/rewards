import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { 
  Title, User, AutoRedeem,
  Warning, Progress, SignIn,
  ContentSkeleton, CountUp
} from './main_elements.tsx'

import { api } from '../public/scripts/api'
import config from './assets/config.json'

// TYPESCRIPT FOR ME WOULDN'T SHUT UP SO I HAD TO DO THIS
//@ts-ignore
import './assets/style.css'
import { motion } from 'framer-motion'

const text = config.text.main // THE TEXTS CAN BE CHANGED THROUGH THE CONFIG FILE!

// ACCOUNT'S DATA TYPE
type Account = {
  user: boolean

  name: string
  pfp: string | null
  points: number
  level: number
  streak: number

  streakData: {
    bonus: {
      daysLeft: number
      points: number
      cycleStart: string | null
      lastDaysLeft: number | null
    }
    days: number
  }

  search: { max: number; val: number }
  quest: { amount: number; completed: number }
  redeem: { name: string | null; price: number; img: string }
}

type Quest = {
  title: string
  questLevel: number
  complete: boolean
  eligible: boolean
}

function estimateCycleStart(daysLeft: number, now = new Date(), cycle = config.BONUS_CYCLE_ESTIMATION) {
  const mod = daysLeft % cycle
  const daysIntoCycle = mod === 0 ? 0 : cycle - mod

  const start = new Date(now)
  start.setDate(start.getDate() - daysIntoCycle)

  return start
}

function detectCycleReset(prev: number | null, current: number) {
  if (prev === null) return false
  return current > prev
}

// THE REQUIRED FUNCTION TO HAVE THE DATE COMPATIBLE WITH THE REWARDS'S DAILY PROMOTION SET DATE FORMAT 
const d = new Date()
const getDate = () => `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`
const getLevel = (string: string): number => Number(string.toLowerCase().split("level")[1])

function compareVersions(v1: string, v2: string) {
  const a = v1.split('.').map(Number)
  const b = v2.split('.').map(Number)

  const len = Math.max(a.length, b.length)

  for (let i = 0; i < len; i++) {
    const num1 = a[i]||0
    const num2 = b[i]||0
    if (num1 > num2) return 1   // v1 is newer
    if (num1 < num2) return -1  // v1 is older
  }

  return 0 // same version
}

// CONTENT SIGMA

const Content = ({ account }: { account: Account }) => {
  
  const UserFX = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  }

  let pfp: `https://${string}` = `https://${account.pfp?.includes("://") ? account.pfp.split("://")[1] : account.pfp}`
  const cycleStartDate = new Date(account.streakData.bonus.cycleStart ?? Date.now())
  const end = new Date(cycleStartDate.getTime() + account.streakData.bonus.daysLeft * 86400000)
  const now = Date.now()
  const percent = ((now - cycleStartDate.getTime()) / (end.getTime() - cycleStartDate.getTime()))

  console.log(percent)

  return <div className='mt-5 px-3'>
    <User level={account.level} name={account.name} avatar={pfp}/>
    
    <div className='h-6' />
    
    { /* STATISTIC TRACKING */ }
    <motion.div
      {...UserFX}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      className='mb-2 bg-(--stupid) p-2 rounded-lg flex'
    >
      <img className='size-18' src='/assets/points.png' alt="points" />
      
      <div className='flex flex-col h-fit leading-7'>
        <p className='text-[16px]'>{text.points.text}</p>
        <p className='text-[35px] font-semibold'>
          <CountUp from={0} to={account.points} duration={1000} /> {text.points.suffix}
        </p>
      </div>
    </motion.div>

    <motion.div
      {...UserFX}
      transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
    >
      <div className='p-3 bg-(--stupid) rounded-lg'>
        <div className='flex justify-between gap-1 items-center'>
        <div className='flex flex-col items-center'>
          <div className='font-semibold text-2xl size-15.5 p-2 justify-center text-center items-center rounded-full bg-yellow-400 border-5 border-yellow-600'><CountUp from={0} to={account.streak} duration={account.streak * (Math.random() * 30)} /></div>
          <p>Days Streak</p>
        </div>

        <div className='w-44 flex flex-col gap-1.5'>
          <div className='h-2.5 w-44 bg-[#222] rounded-xl border border-white/10'>
            <motion.div
              className='h-full bg-blue-300 rounded-xl'
              initial={{width:"0%"}}
              animate={{width:`${Math.round(percent * 100)}%`}}
            />
          </div>

          <p className='text-[14px] w-44'>
          {
            account.streakData.bonus.daysLeft >= 0 ?
            config.text.main.streak.dayAway
              .replace("{day}", String(account.streakData.bonus.daysLeft))
              .replace("{bonus}", account.streakData.bonus.points.toLocaleString())
            :
            config.text.main.streak.bonus.replace('{bonus}', account.streakData.bonus.points.toLocaleString())
          }
          </p>
        </div>

        <img className='size-18' src={`/assets/chest${account.streakData.bonus.daysLeft >= 0 ? "" : "closed"}.png`} />
      </div>
      </div>
    </motion.div>

    <motion.hr
      className='my-5'
      initial={UserFX.initial}
      animate={{ x: 0, opacity: 0.3 }}
      transition={{ delay: 0.55, duration: 0.25, ease: "easeOut" }}
    />

    { /* PROGRESS TRACKING */ }
    <motion.div
      {...UserFX}
      transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
    >
      <Progress percent={ account.search.val / account.search.max }>{text.search.text} {account.search.val}/{account.search.max} {text.search.suffix}</Progress>
    </motion.div>

    <motion.div
      {...UserFX}
      transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
    >
      <Progress percent={ account.quest.completed / account.quest.amount }>{text.quest.text} {account.quest.completed}/{account.quest.amount} {text.quest.suffix}</Progress>
    </motion.div>
    
    { /* AUTO REDEMPTION/REDEEM GOAL TRACKING */ }
    { account.redeem.price > 0 && <AutoRedeem title={account.redeem.name || config.text.redemption.unknown} price={account.redeem.price} points={account.points} img={account.redeem.img}/> }
  </div>
}

// CACHE KEY
const CACHE_KEY: string = config.cache

const REPO = {
  owner: "Ocean102",
  name: "rewards"
}

const versionFile = `https://raw.githubusercontent.com/${REPO.owner}/${REPO.name}/refs/heads/main/VERSION`

const App = () => {
  const [reload, setReload] = useState(0)
  const [load, setloaded] = useState(false)
  const [userData, setData] = useState<Account>({
    name: "", user: false, pfp: null, 
    points: 0, level: 0, streak: 0,

    search: { max: 30, val: 0 },
    quest: { amount: 3, completed: 0 },
    redeem: { name: null, img: "", price: 0 },
    streakData: {
      days: 0,
      bonus: {
        points: 0,
        daysLeft: 0,
        cycleStart: null,
        lastDaysLeft: null
      }
    }
  })

  const [verState, setVS] = useState<number | null>(null)

  useEffect(() => {
    fetch(versionFile).then(res => res.text()).then(latest => {
      const cmp = compareVersions(latest.trim(), config.version)
      setVS(cmp)
    })
  }, [])


  useEffect(() => {
    fetch(api.token).then(res => res.text())
      .then(account => {
        // PFP URL AND DISPLAY NAME
        const pfp = account.split(config.split.pfp)[1].split(`" `)[0]
        const user = account.split(config.split.user)[1].split('"')[0]

        console.group("[ ACCOUNT ]:")
        console.log("Profile Picture:", pfp)
        console.log("Display Name:", user)
        console.groupEnd()
        
        // GET THE REWARD'S PROGRAM USER DATA
        return fetch(api.data, {
          headers: {
            "accept": "application/json, text/javascript, */* q=0.01",
            "accept-language": "en-US,enq=0.9,vi-VNq=0.8,viq=0.7",
            "correlation-context": "v=1,ms.b.tel.market=en-US",
            "priority": "u=1, i"
          },
          referrer: "https://rewards.bing.com/",
          credentials: "include"
        })
      .then(res => res.json())
      .then(rewardData => {
        // BASIC DATA
        const rewards: Record<string, any> = rewardData.dashboard
        const data: Record<string, any> = rewards.userStatus
        const search: Record<string, number> = data.counters.pcSearch[0]
        const quest: Array<Record<string, any>> = [...rewards.dailySetPromotions[getDate()], ...rewards.morePromotions]
        
        // TRACK COMPLETED QUESTS
        const userLevel = getLevel(rewards.userStatus.levelInfo.activeLevel)
        const questList: Quest[] = []

        let completed = 0
        let ammount = 0

        quest.forEach(v => { 
          const questLevel = getLevel(v.attributes.locked_category_criteria || "level1")
          const eligible = userLevel >= questLevel

          questList.push({
            title: v.title,
            complete: v.complete,
            eligible,
            questLevel
          })

          if (eligible) {
            ammount++
            if (v.complete) completed++
          }
        })

        const streakBonus = rewards.streakBonusPromotions[rewards.streakBonusPromotions.length-1]
        const untilBonus = streakBonus.attributes.description
        const bonusPoints = streakBonus.attributes.complete_description
        const numberRegex = /(\d+)/     

        const bonus = {
          daysLeft: Number(untilBonus.match(numberRegex)[0]) || 0,
          points: Number(bonusPoints.match(numberRegex)[0]),
          
        }

        const prevBonus = userData.streakData?.bonus ?? {
          cycleStart: null,
          lastDaysLeft: null
        }

        let cycleStart = prevBonus.cycleStart

        const resetDetected = detectCycleReset(
          prevBonus.lastDaysLeft,
          bonus.daysLeft
        )

        // New cycle detected
        if (resetDetected) cycleStart = new Date().toISOString()
        if (!cycleStart) cycleStart = estimateCycleStart(bonus.daysLeft).toISOString()

        const finalBonus = {
          ...bonus,
          cycleStart,
          lastDaysLeft: bonus.daysLeft
        }

        // INITIALIZES NEW DATA
        const freshData: Account = {
          ...userData,
          points: rewards.userStatus.availablePoints,
          streak: rewards.streakProtectionPromo.streakCount,
          streakData: {
            days: rewards.streakProtectionPromo.streakCount,
            bonus: finalBonus
          },
          level: userLevel,
          name: user,
          pfp,
          search: { max: search.pointProgressMax, val: search.pointProgress },
          quest: { amount: ammount, completed: completed, },
          redeem: {
            price: rewards.autoRedeemItem.price,
            name: rewards.autoRedeemItem.title && rewards.autoRedeemItem.title.split('—')[1].trim(),
            img: rewards.autoRedeemItem.mediumImageUrl,
          },
          user: true
        }

        // FINISH THE LOADING
        setData(freshData)
        setloaded(true)

        console.group("[ ACCOUNT STATUS ]")
        console.log("Points:", freshData.points)
        console.log("Streak:", freshData.streak)
        console.log("Level:", freshData.level)
        console.log("Auto Redemption:", freshData.redeem)
        console.log("Search Progress:", freshData.search)
        console.log("Quests Progress:", freshData.quest)
        console.log(freshData)
        console.groupEnd()

        console.group("[ QUEST ] Gathered quests through API")
        questList.forEach(v => console.log(`${v.title}:`, v))
        console.groupEnd()

        console.log(JSON.stringify(freshData))

        // CACHE FOR BETTER LOAD NEXT TIME
        localStorage.setItem(CACHE_KEY, JSON.stringify(freshData))
      })
    })
    .catch(err => {
      console.error("fetch failed...", err)
      setloaded(true)
    })
  }, [reload])

  useEffect(() => {
    const interval = setInterval(() => {setReload(reload+1)}, 1.5 * 60 * 1000)
    return clearInterval(interval)
  }, [])

  return <div className='relative bg-blue-950 text-white text-[16px] w-100 h-120 overflow-auto noscroll'>
    <Title />
    <hr />
    { load ? (userData.user ? <Content account={userData} /> : <SignIn />) : <ContentSkeleton /> }
    <Warning />
    { (verState != 0 && verState) &&
      <>
        <div className='mt-5 text-transparent'>
          {config.text.notifier.version}
        </div>
        <div className='fixed bottom-0 w-full bg-blue-800/80 backdrop-blur-xl px-3 p-2'>
        {config.text.notifier.version.replace("{v}", config.version).replace("{t}", (verState || 0) > 0 ? config.text.notifier.old : config.text.notifier.new)}
        </div>
      </>
    }
  </div>
}

createRoot(document.getElementById('root')!).render(<StrictMode>
  <App/>
</StrictMode>)