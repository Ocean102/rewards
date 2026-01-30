import { StrictMode, use, useEffect, useState } from 'react'
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
import { AnimatePresence, motion } from 'framer-motion'

const text = config.text.main // THE TEXTS CAN BE CHANGED THROUGH THE CONFIG FILE!

// ACCOUNT'S DATA TYPE
type Account = {
  user: boolean

  name: string; pfp: string | null
  points: number; level: number; streak: number

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

// THE REQUIRED FUNCTION TO HAVE THE DATE COMPATIBLE WITH THE REWARDS'S DAILY PROMOTION SET DATE FORMAT 
const d = new Date()
const getDate = () => `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`
const getLevel = (string: string): number => Number(string.toLowerCase().split("level")[1])

function compareVersions(v1: string, v2: string) {
  const a = v1.split('.').map(Number)
  const b = v2.split('.').map(Number)

  const len = Math.max(a.length, b.length)

  for (let i = 0; i < len; i++) {
    const num1 = a[i] || 0
    const num2 = b[i] || 0

    if (num1 > num2) return 1   // v1 is newer
    if (num1 < num2) return -1  // v1 is older
  }

  return 0; // same version
}

// CONTENT SIGMA

const Content = ({ account }: { account: Account }) => {
  
  const UserFX = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  }

  let pfp: `https://${string}` = `https://+${
    account.pfp?.includes("://") ?
    account.pfp.split("://")[1] :
    account.pfp
  }`

  return <div className='mt-5 px-3'>
    <User level={account.level} name={account.name} avatar={
      pfp
    }/>
    
    <div className='h-6' />
    
    { /* STATISTIC TRACKING */ }
    <motion.div
      initial={UserFX.initial}
      animate={UserFX.animate}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
    >
      <Progress prog={false} percent={100}>{text.points.text}: <CountUp from={0} to={account.points} duration={1000} /> {text.points.suffix}</Progress>
    </motion.div>

    <motion.div
      initial={UserFX.initial}
      animate={UserFX.animate}
      transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
    >
      <Progress prog={false} percent={100}>{text.streak.text}: <CountUp from={0} to={account.streak} duration={1000} /> {text.streak.suffix}</Progress>
    </motion.div>

    <motion.hr
      className='my-5'
      initial={UserFX.initial}
      animate={{ x: 0, opacity: 0.3 }}
      transition={{ delay: 0.55, duration: 0.25, ease: "easeOut" }}
    />

    { /* PROGRESS TRACKING */ }
    <motion.div
      initial={UserFX.initial}
      animate={UserFX.animate}
      transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
    >
      <Progress percent={ account.search.val / account.search.max }>{text.search.text} {account.search.val}/{account.search.max} {text.search.suffix}</Progress>
    </motion.div>

    <motion.div
      initial={UserFX.initial}
      animate={UserFX.animate}
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

const UserFX = {
  initial: { x: -30, opacity: 0 },
  animate: { x: 0, opacity: 1 },
}

const App = () => {
  const [reload, setReload] = useState(0)
  const [load, setloaded] = useState(false)
  const [userData, setData] = useState<Account>({
    name: "", user: false, pfp: null, 
    points: 0, level: 0, streak: 0,

    search: { max: 30, val: 0 },
    quest: { amount: 3, completed: 0 },
    redeem: { name: null, img: "", price: 0 }
  })

  const [verState, setVS] = useState<number | null>(null)

  useEffect(() => {
    fetch(versionFile).then(res => res.text()).then(latest => {
      const cmp = compareVersions(latest.trim(), config.version)
      setVS(cmp)
    })
  }, [])


  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY)

    // TRY TO USE THE CACHED DATA
    if (cached) try {
      setData(JSON.parse(cached))
      setloaded(true)
      console.log('[ SYSTEM ] USING CACHE ADD LOADING LATER...')
    } catch {
      console.log("[ SYSTEM ] FETCHING NEW DATA...")
    }

    // GET THE TOKEN AND USER DATA
    fetch(api.token).then(res => res.text())
      .then(account => {
        // PFP URL AND DISPLAY NAME
        const pfp = account.split(config.split.pfp)[1].split(`" `)[0]
        const user = account.split(config.split.user)[1].split('"')[0]

        console.log("[ ACCOUNT ]:")
        console.log("- Profile Picture:", pfp)
        console.log("- Display Name:", user)
        
        // GET THE REWARD'S PROGRAM USER DATA
        return fetch(api.data, {
          headers: {
            "accept": "application/json, text/javascript, */* q=0.01",
            "accept-language": "en-US,enq=0.9,vi-VNq=0.8,viq=0.7",
            "correlation-context": "v=1,ms.b.tel.market=en-US",
            "priority": "u=1, i",
            "sec-ch-ua": `"Google Chrome"v="143", "Chromium"v="143", "Not A(Brand"v="24"`,
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

        // INITIALIZES NEW DATA
        const freshData: Account = {
          ...userData,
          points: rewards.userStatus.availablePoints,
          streak: rewards.streakProtectionPromo.streakCount,
          level: userLevel,
          name: user,
          pfp: pfp,
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

        console.log("- Points:", freshData.points)
        console.log("- Streak", freshData.streak)
        console.log("- Level:", freshData.level)
        console.log("- Auto Redemption:", freshData.redeem)
        console.log("- Search Progress:", freshData.search)
        console.log("- Quests progress:", freshData.quest)

        console.log("[ QUEST ] Gathered quests through API:")
        questList.forEach(v => console.log(`${v.title} - Completed:`, v.complete,`/ Eligible to Complete:`, v.eligible, `/ Unlocked At:`, v.questLevel))

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
    { (verState != 0 && verState) &&
      <div className='absolute bottom-0 w-full bg-blue-800/30 px-3 p-2'>
      The current version {config.version} is {(verState || 0) > 0 ? "outdated" : "newer (how)"}. Please update for
      better support and compatability
      </div>
    }
    { load ? (userData.user ? <Content account={userData} /> : <SignIn />) : <ContentSkeleton /> }
    <Warning />
  </div>
}

createRoot(document.getElementById('root')!).render(<StrictMode>
  <App/>
</StrictMode>)