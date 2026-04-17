// lmao im so used to roblox
const pcall = async <T>(func: () => Promise<T> | T): Promise<[T | any, boolean]> => {
  try {
    const result = await func()
    return [result, true]
  } catch (e) {
    return [e, false]
  }
}


type TaskResponse = "DONE" | "DONE_CONFIRMED" | "RETURN_COMPLETE"
type AcceptedStorageData = string | number | Record<any, any> | Array<any> | boolean
type RewardResponseFormat = `${string}:${string}`
type QuestDateFormat = `${string}/${string}/${string}`
type idk = undefined
type cachedResponsePayload = { rsc?: RewardResponseFormat | idk, html?: RewardResponseFormat | idk}
type QuestData = {
  hash: string
  title: string
  points: number
  offerId: string
  isCompleted: boolean
  isLocked: boolean
  date?: QuestDateFormat
  isPromotional: boolean | `$undefined`
}

const idk = undefined
const cachedResponse: cachedResponsePayload = { rsc: idk, html: idk }

/// =============================================================================== ///
/// REASONABLE SEARCH QUERIES GENERATOR
/// =============================================================================== ///

const year = new Date().getFullYear()
const searches: string[] = []

const games = ['roblox','gta','gta v','gta iv','gta sa','gta liberty city','gta vc','gta vc stories','gta iii','gta ii','gta i','forza','forza 5','ets2','csgo','cs source','cod','rdr','rdr2','gta+','gamepass','xbox','minecraft','robux','roblox pets','world of warcraft','final fantasy','guild wars','lol','dota 2','the sims 4','animal crossing','stardew valley','cyberpunk 2077','elden rings','witcher 3','super smash bros','brawlhalla','fortnite','apex legends','valorant','battlefield 2042','spellforce arena','black desert online','runescape','maple story','phantasy star online 2','smite','heroes of the storm','mobile legends','vainglory','arena of valor','crystal of atlan','terraria','garden paws','eco','my time at portia','skyrim','horizon forbidden west','diablo 4','geometry dash','gta online','hollow knight','silksong','hollow knight silksong','internet cafe simulator','subnautica','subnautica below zero','ark survival evolved','the forest','the long dark','no mans sky','sea of thieves','valheim','rust','7 days to die','dayz','fall guys','among us']
const socialMedias = ["facebook","instagram","twitter","tiktok","snapchat","linkedin","youtube","reddit","pinterest","tumblr","discord","twitch","clubhouse","mastodon","bluesky","threads","wechat","qq","qzone","line","kakaotalk","viber","telegram","signal","whatsapp","messenger","weibo","douyin","vk","odnoklassniki","mixi","baidu tieba","nextdoor","peach","ello","diaspora","minds","steemit","gab","parler","truth social","gettr","rumble","mewe","yubo","caffeine","dlive","trovo","bitchute","vimeo","flickr","deviantart","dribbble","behance","goodreads","letterboxd","anilist","myanimelist","gaia online","habbo hotel","imvu","second life","roblox","steam community","epic games social","battle.net","xbox live","playstation network","newgrounds","soundcloud","bandcamp","audius","last.fm","reverbnation","mixcloud","kik","amino","fanpop","ravelry","couchsurfing","meetup","care2","researchgate","academia.edu","stack overflow","github","gitlab","codepen","dev.to","hashnode","product hunt","angel list","indie hackers","quora","medium","substack","kickstarter","gofundme","patreon","go fund me"]
const gamesWithMaps = ["minecraft","elden ring","skyrim","gta v","sea of thieves","among us","ark: survival evolved","rust","valheim","terraria","no man's sky","subnautica","the forest","dayz","7 days to die","apex legends","fortnite","battlefield 2042","dota 2","league of legends","smite","world of warcraft","final fantasy xiv","guild wars 2","black desert online","runescape","path of exile","diablo iv","monster hunter world","far cry 6","just cause 4","watch dogs 2","cyberpunk 2077","geometry dash","gta san andreas","gta vice city","gta iv","gta iii","forza horizon 5","ets2","red dead redemption 2"]
const toBe = ["successful","productive","good at something","cool","rich","a billionare","a millionare","a trillionare","rich guy","motivated","sigma","gooning"]

const expand = (
  items: string[],
  bases: ((s: string) => string)[],
  extra: ((s: string) => string)[] = []
): string[] =>
  items.flatMap(i => [
    ...bases.map(b => b(i)),
    ...bases.map(b => `${b(i)} ${year}`),
    ...bases.map(b => `${b(i)} in ${year}`),
    ...extra.map(b => b(i))
  ])

const gameBases: ((g: string) => string)[] = [
  g=>g, g=>`${g} giveaway`,g=>`${g} tips`,g=>`${g} tricks`,
  g=>`${g} best mods`, g=>`${g} best glitches`, g=>`${g} best money trick`,
  g=>`${g} download`,g=>`${g} download tutorial`, g=>`${g} cheats`,g=>`${g} hacks cheats`,
  g=>`${g} cheats hacks`, g=>`${g} cheats`
]

const gameExtra: ((g: string) => string)[] = [ g => `how to download ${g}`, g => `how to get ${g}`, g => `how to play ${g}` ]

const socialBases: ((s: string) => string)[] = [
  s => s,
  s => `how to get more ${s} followers`,
  s => `how to get more ${s} subscribers`,
  s => `how to get more ${s} views`,
  s => `how to get more ${s} likes`,
  s => `how to go viral on ${s}`,
  s => `best ${s} alternatives`,
  s => `best ${s} tips`,
  s => `best ${s} tricks`,
  s => `how to use ${s} effectively`,
  s => `how to use ${s} safely`,
  s => `how to use ${s} for marketing`
]

const mapBases: ((g: string) => string)[] = [
  g => `${g} map`, g => `${g} maps`,
  g => `${g} best map`, g => `${g} best maps`
]

const beingBases: ((g: string) => string)[] = [
  g => `smart ways to be ${g}`, g => `best way to be ${g}`,
  g => `how to be ${g}`, g => `how to actually be ${g}`,
  g => `pros of being ${g}`, g => `how hard is it to be ${g}`
]

searches.push(
  ...expand(games, gameBases, gameExtra),
  ...expand(socialMedias, socialBases),
  ...expand(gamesWithMaps, [...mapBases, ...gameBases], gameExtra),
  ...toBe.flatMap(b => beingBases.map(fn => fn(b)))
)

/// =============================================================================== ///
/// DEFINE RANDOM STUFF
/// =============================================================================== ///

const randomHex = (len: number = 32) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

// headers
const PageData: RequestInit[] = [
  {
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7",
      "cache-control": "max-age=0", "priority": "u=0, i",
      "sec-fetch-dest": "document", "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin", "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    method: "GET", credentials: "include", referrer: "https://rewards.bing.com/earn"
  },

  {
    headers: { "priority": "u=1, i", "rsc": "1", },
    referrer: "https://rewards.bing.com/earn", method: "GET", credentials: "include"
  }
]

/// =============================================================================== ///
/// DEFINE NECESSARY FUNCTION OTHERWISE WHY'D I
/// =============================================================================== ///

// chrome mv3 storage
const storage = {
  async get(key: string) { return (await chrome.storage.local.get(key))[key] },
  set(key: string, value: AcceptedStorageData) {return chrome.storage.local.set({ [key]: value })}
}

// report search
const reportSearch = async(query: string) => {
  const [res, suc] = await pcall(async () => {
    const IG = randomHex(32)
    const IID = `SERP.${Math.floor(Math.random() * 10000)}`
    const rdr = Math.floor(Math.random() * 10) + 1
    const rdrig = randomHex(32)

    const url = "https://www.bing.com/rewardsapp/reportActivity"
    const params = new URLSearchParams({ IG, IID, q: query, FORM: "HDRSC1", rdr: `${rdr}`, rdrig, ajaxreq: "1" })
    const body = new URLSearchParams({ url: `https://www.bing.com/search?q=${encodeURIComponent(query)}&FORM=HDRSC1&rdr=${rdr}&rdrig=${rdrig}`, V: "web" })

    return fetch(`${url}?${params}`, {
      method: "POST", body, credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "*/*" }
    })
  })

  if (suc)
    return res
  else
    console.error('failed to report search:', res)
}

// parse the stupid shit
const parseData = async (data?: string, keyword?: string): Promise<any | null> => {
  const [res, suc] = await pcall(() => {
    if (!data || !keyword) return

    // spot the one that stands out
    const list = data.split("\n")
    const breakdown = list.find((e: string) => e.includes(keyword))
    if (!breakdown) return null

    // parse and format data with the help of regret(c)
    const regex = /(?<=\b[0-9]+[a-z]?:)\[[\s\S]*\]/
    const match = breakdown.match(regex)

    if (!match) return null

    let json: string = match[0]
    json = json.replace(/"\$undefined"/g, "null")

    try {
      const parsed = JSON.parse(json)
      return parsed?.[3] ?? null
    } catch (e) {
      console.warn("Parse failed:", e)
      return null
    }
  })

  if (suc)
    return res
  else
    console.error('failed to parse data:', res)
}

/// =============================================================================== ///
/// REWARDS USER-DATA FETCHER
/// =============================================================================== ///

//@ts-expect-error: domparser isn't available natively
import { DOMParser } from 'https://esm.sh/linkedom'

const fetchPage = async (): Promise<cachedResponsePayload> => {
  const [res, suc] = await pcall(async () => {
    if (cachedResponse.rsc && cachedResponse.html) return cachedResponse

    // bimbimbambam all at once
    const promises = await Promise.all([
      fetch('https://rewards.bing.com/earn', PageData[0]),
      fetch('https://rewards.bing.com/earn?_rsc=aq46i', PageData[1]),
    ])

    // parse data
    const [pageRes, rscRes] = promises
    const pageHtml = await pageRes.text()
    const rscData = await rscRes.text() as RewardResponseFormat
    let parsedHtml: RewardResponseFormat = "00:empty"

    try {
      // convert script elements to key:string format
      const parser = new DOMParser()
      const doc = parser.parseFromString(pageHtml, 'text/html')
      const scripts = doc.querySelectorAll("script")
      const scriptList: RewardResponseFormat[] = []
      
      scripts.forEach((element: HTMLScriptElement) => {
        if (element.innerHTML.includes("__next_f")) {
          const str = element.innerHTML
          const match = str.match(/self\.__next_f\.push\((\[.*?\])\)/s)

          if (!match) return
          const dataString = match[1]

          if (!dataString) return
          scriptList.push(JSON.parse(dataString).at(-1))
        }
      })

      parsedHtml = scriptList.join("\n") as RewardResponseFormat
    }
    catch { console.log("what u want?") }

    // self-explainatory
    cachedResponse.html = parsedHtml
    cachedResponse.rsc = rscData

    return cachedResponse
  })

  if (suc) return res
  else
    throw new Error(`couldn't fetch data: ${res}`)
}

/// =============================================================================== ///
/// AUTOMATION ESSENTIALS
/// =============================================================================== ///

const date=(d=new Date):QuestDateFormat=>`${(d.getMonth()+1+'').padStart(2,'0')}/${(d.getDate()+'').padStart(2,'0')}/${d.getFullYear()}`

// complete quest
const postQuest = async (tabid: number, quest: QuestData) =>
  await chrome.tabs.sendMessage(tabid, {
    type: "COMPLETE_QUEST",
    data: JSON.stringify([
      quest.hash, 11, {
        isPromotional: quest.isPromotional,
        offerid: quest.offerId,
        timezoneOffset: `${new Date().getTimezoneOffset()}`
      }
    ])
  })
  

/// =============================================================================== ///
/// AUTOMATION FUNCTIONS
/// =============================================================================== ///

const Task = {
  Search: async (): Promise<TaskResponse | "STUPID_GENERATOR"> => {
    const completed = await storage.get("todaySearchCompleted")
    if (completed == true) return "RETURN_COMPLETE"

    // get search information
    const queries = [...searches].sort(() => 0.5 - Math.random())
    const queryIsntNull = queries.find(Boolean)

    if (queries.find(e => !e) || !queryIsntNull) return "STUPID_GENERATOR"

    const [shutup, search] = await Promise.all([
      fetch(`https://bing.com/search?q=${queryIsntNull}`),
      reportSearch( queryIsntNull )
    ])
    const textResponse = await search.text(); console.log(shutup)

    const earned = Number(textResponse.split("DailySearchPointsEarned")[1].split(",")[0]) || 0
    const limit = Number(textResponse.split("DailySearchPointsLimit")[1].split(",")[0]) || 30

    let searchesDone = earned || 0
    const maxSearches = (limit || 30) + (10 + Math.random() * 10)

    // search done
    if (searchesDone >= maxSearches)
    {
      chrome.alarms.clear("searches")
      storage.set("todaySearchCompleted", true)
      return "DONE_CONFIRMED"
    }

    // self-explainatory
    for (const query of queries) {
      if (searchesDone >= maxSearches) break
      try { reportSearch(query) }
      catch(e) { console.error("Search error:", e) }

      searchesDone++
      await sleep(7000 + Math.random() * 3500)
    }

    return "DONE"
  },

  Quest: async (): Promise<TaskResponse | "PARSED_DATA_NOT_FOUND" | "QUESTS_NOT_FOUND" | "INVALID_QUEST_DATA" | "NO_TAB_ID"> => {
    const completed = await storage.get("todayQuestCompleted")
    if (completed == true) return "RETURN_COMPLETE"

    const pageData = (await fetchPage()).html
    if (!pageData) return "PARSED_DATA_NOT_FOUND"

    const arr = Array.isArray
    const activities = await parseData(pageData, "MoreActivities")
    const dailyset = await parseData(pageData, `"type":"dailyset"`)

    const questList = {
      daily: dailyset.model.dailySetItems,
      activities: (activities.children as Array<Record<string, any>>)?.at(-1)?.activityCards
    }

    // validate data
    if (!questList.daily || !questList.activities) return "QUESTS_NOT_FOUND"
    if (!arr(questList.daily) || !arr(questList.activities)) return "INVALID_QUEST_DATA"

    // bimbimbabmbam
    const combinedList = [...questList.daily, ...questList.activities]
    const unlockedQuests = combinedList.filter((e: QuestData) => (!e.isCompleted && !e.isLocked && e.points > 0))
    const formattedList = unlockedQuests.filter((e: QuestData) => (e.date ? e.date == date() : true))

    if (formattedList.length < 1) return "DONE_CONFIRMED"
    
    // more bimbimbambam
    const rewardTab = await chrome.tabs.create({ url: "https://rewards.bing.com/earn", active: !1 }); if (!rewardTab.id) return "NO_TAB_ID"
    await sleep(3 * 1000); for (const quest of formattedList) { await postQuest(rewardTab.id, quest); await sleep(500 + (Math.random() * 500)) }
    await sleep(2000)
    await chrome.tabs.remove([rewardTab.id])
    
    return "DONE"
  }
}

/// =============================================================================== ///
/// INITALIZATION OF ALARMS, STARTUP AND INSTALLATION OF EXTENSIONS
/// =============================================================================== ///

const init = async () => {
  const todaydate = await storage.get("today") as QuestDateFormat

  // if its not today then kaboom
  if (todaydate !== date()) {
    storage.set("today", date())
    storage.set("todayQuestCompleted", false)
    storage.set("todaySearchCompleted", false)
  }

  // setup some stupid alarms
  chrome.alarms.create("searches", { periodInMinutes: 3.8 })
  chrome.alarms.create("quests", { periodInMinutes: 1 })

  // bimbimbambam
  await sleep(2000)
  Task.Quest().then(id=>{if(id=="DONE_CONFIRMED")chrome.alarms.clear("quests")})
  Task.Search().then(id=>{if(id=="DONE_CONFIRMED")chrome.alarms.clear("searches")})
}


// the events
chrome.runtime.onStartup.addListener(() => init())
chrome.runtime.onInstalled.addListener(() => init())
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "searches") Task.Search()
    if (alarm.name === "quests") Task.Quest()
})

// OPTIONAL INFORMER
console.error("You can ignore or delete this message:\nPlease report issue(s) that's repeated constantly without stopping at https://ocean102.rf.gd/feedback (leaving no stars will mark your feedback as a report of an issue or need help). Thanks for reading")