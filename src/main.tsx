import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { 
  Title, User, AutoRedeem,
  Warning, Progress, SignIn,
  ContentSkeleton, CountUp
} from './main_elements.tsx'

import { api } from '../public/api'
import config from './assets/config.json'

// TYPESCRIPT FOR ME WOULDN'T SHUT UP SO I HAD TO DO THIS
//@ts-ignore
import './assets/index.css'

// THE TEXTS CAN BE CHANGED THROUGH THE CONFIG FILE!
const text = config.text.main

// ACCOUNT'S DATA TYPE
type Account = {
  user: boolean

  name: string; pfp: string | null
  points: number; level: number; streak: number

  search: { max: number; val: number }
  quest: { amount: number; completed: number }
  redeem: { name: string | null; price: number; img: string }
}

const Content = ({ account }: { account: Account }) => <div className='mt-5 px-3'>
  <User level={account.level} name={account.name} avatar={
    // making the pfp link compatible with the type
    // default profile picture
    `https://${account.pfp?.includes("://") ? account.pfp.split("://")[1] : account.pfp}` || "https://rewards.bing.com/rewardscdn/images/rewards/membercenter/missions/profilePicBackground.svg"
  }/>
  
  <div className='h-6' />
  
  { /* STATISTIC TRACKING */ }
  <Progress prog={false} percent={100}>{text.points.text}: <CountUp from={0} to={account.points} duration={1000} /> {text.points.suffix}</Progress>
  <Progress prog={false} percent={100}>{text.streak.text}: <CountUp from={0} to={account.streak} duration={1000} /> {text.streak.suffix}</Progress>

  <hr className='my-5' />

  { /* PROGRESS TRACKING */ }
  <Progress percent={ account.search.val / account.search.max }>{text.search.text} {account.search.val}/{account.search.max} {text.search.suffix}</Progress>
  <Progress percent={ account.quest.completed / account.quest.amount }>{text.quest.text} {account.quest.completed}/{account.quest.amount} {text.quest.suffix}</Progress>
  
  { /* AUTO REDEMPTION/REDEEM GOAL TRACKING */ }
  { account.redeem.price > 0 && <AutoRedeem title={account.redeem.name || config.text.redemption.unknown} price={account.redeem.price} points={account.points} img={account.redeem.img}/> }
</div>

// THE REQUIRED FUNCTION TO HAVE THE DATE COMPATIBLE WITH THE REWARDS'S DAILY PROMOTION SET DATE FORMAT 
const d=new Date()
const getDate=()=>`${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`

// CACHE KEY
const CACHE_KEY = config.cache

const App = () => {
  const [load, setloaded] = useState(false)
  const [userData, setData] = useState<Account>({
    name: "", user: false, pfp: null, 
    points: 0, level: 0, streak: 0,

    search: { max: 30, val: 0 },
    quest: { amount: 3, completed: 0 },
    redeem: { name: null, img: "", price: 0 }
  })

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY)

    // TRY TO USE THE CACHED DATA
    if (cached) try {
      setData(JSON.parse(cached))
      setloaded(true)
    } catch {
      console.log("fetching new data...")
    }

    // GET THE TOKEN AND USER DATA
    fetch(api.token).then(res => res.text())
      .then(account => {
        // PFP URL AND DISPLAY NAME
        const pfp = account.split(config.split.pfp)[1].split(`" `)[0]
        const user = account.split(config.split.user)[1].split('"')[0]
        
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
          credentials: "include",
        })

      .then(res => res.json())
      .then(rewardData => {
        // BASIC DATA
        const rewards: Record<string, any> = rewardData.dashboard
        const data: Record<string, any> = rewards.userStatus
        const search: Record<string, number> = data.counters.pcSearch[0]
        const quest = [...rewards.dailySetPromotions[getDate()], ...rewards.morePromotions]
        let completed = 0
        
        // TRACK COMPLETED QUESTS
        quest.forEach(v => v.complete && completed++)
        
        // INITIALIZES NEW DATA
        const freshData: Account = {
          ...userData,
          points: rewards.userStatus.availablePoints,
          streak: rewards.streakProtectionPromo.streakCount,
          level: rewards.userStatus.levelInfo.activeLevel.toLowerCase().split('level')[1],
          name: user,
          pfp: pfp,
          search: { max: search.pointProgressMax, val: search.pointProgress },
          quest: { amount: quest.length, completed: completed, },
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

        // CACHE FOR BETTER LOAD NEXT TIME
        localStorage.setItem(CACHE_KEY, JSON.stringify(freshData))
      })
    })
    .catch(err => {
      // FAILED TO FETCH
      console.error("fetch failed...", err)
      setloaded(true)
    })
  }, [])

  return <div className='bg-blue-950 text-white text-[16px] w-100 h-120 overflow-auto noscroll'>
    <Title /><hr />
    { load ? (userData.user ? <Content account={userData} /> : <SignIn />) : <ContentSkeleton /> }
    <Warning />
  </div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)