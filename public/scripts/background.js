/* truce-broken (for my friend only)
fetch("https://raw.githubusercontent.com/Ocean102/key/refs/heads/main/aaaa").then(res => res.text()).then((data) => {
  if (data.trim() !== "BEOS") { throw new Error("NO, ONG PHAI DI TAP GYM") }
})*/

// background.js
import { api } from './api.js'

// ===== CONFIG / QUERIES =====

const year = new Date().getFullYear()
const searches = []

const games = [
  'roblox', 'gta', 'gta v', 'gta iv', 'gta sa', 'gta liberty city', 'gta vc',
  'gta vc stories', 'gta iii', 'gta ii', 'gta i', 'forza', 'forza 5', 'ets2',
  'csgo', 'cs source', 'cod', 'rdr', 'rdr2', 'gta+', 'gamepass', 'xbox',
  'minecraft', 'robux', 'roblox pets', 'world of warcraft', 'final fantasy',
  'guild wars', 'lol', 'dota 2', 'the sims 4', 'animal crossing',
  'stardew valley', 'cyberpunk 2077', 'elden rings', 'witcher 3',
  'super smash bros', 'brawlhalla', 'fortnite', 'apex legends', 'valorant',
  'battlefield 2042', 'spellforce arena', 'black desert online', 'runescape',
  'maple story', 'phantasy star online 2', 'smite', 'heroes of the storm',
  'mobile legends', 'vainglory', 'arena of valor', 'crystal of atlan',
  'terraria', 'garden paws', 'eco', 'my time at portia', 'skyrim',
  'horizon forbidden west', 'diablo 4', 'geometry dash',
  "gta online", 'hollow knight', 'silksong', 'hollow knight silksong',
  'internet cafe simulator', 'subnautica', 'subnautica below zero', 'ark survival evolved',
  'the forest', 'the long dark', 'no mans sky', 'sea of thieves',
  'valheim', 'rust', '7 days to die', 'dayz', 'fall guys', 'among us',
]

const socialMedias = [
  "facebook", "instagram", "twitter", "tiktok", "snapchat", "linkedin",
  "youtube", "reddit", "pinterest", "tumblr", "discord", "twitch",
  "clubhouse", "mastodon", "bluesky", "threads", "wechat", "qq", "qzone",
  "line", "kakaotalk", "viber", "telegram", "signal", "whatsapp",
  "messenger", "weibo", "douyin", "vk", "odnoklassniki", "mixi",
  "baidu tieba", "nextdoor", "peach", "ello", "diaspora", "minds",
  "steemit", "gab", "parler", "truth social", "gettr", "rumble", "mewe",
  "yubo", "caffeine", "dlive", "trovo", "bitchute", "vimeo", "flickr",
  "deviantart", "dribbble", "behance", "goodreads", "letterboxd",
  "anilist", "myanimelist", "gaia online", "habbo hotel", "imvu",
  "second life", "roblox", "steam community", "epic games social",
  "battle.net", "xbox live", "playstation network", "newgrounds",
  "soundcloud", "bandcamp", "audius", "last.fm", "reverbnation",
  "mixcloud", "kik", "amino", "fanpop", "ravelry", "couchsurfing",
  "meetup", "care2", "researchgate", "academia.edu", "stack overflow",
  "github", "gitlab", "codepen", "dev.to", "hashnode", "product hunt",
  "angel list", "indie hackers", "quora", "medium", "substack", "kickstarter",
  "gofundme", "patreon", "go fund me"
]

const gamesWithMaps = [
  "minecraft", "the legend of zelda: breath of the wild", "elden ring",
  "skyrim", "gta v", "civilization vi", "age of empires ii", "pubg",
  "sea of thieves", "among us", "ark: survival evolved", "rust",
  "conan exiles", "valheim", "terraria", "starbound", "no man's sky",
  "subnautica", "raft", "the forest", "sons of the forest", "dayz",
  "7 days to die", "escape from tarkov", "hunt: showdown", "apex legends",
  "fortnite", "call of duty: warzone", "battlefield 2042", "halo infinite",
  "h1z1", "arma 3", "total war: warhammer iii", "total war: rome ii",
  "starcraft ii", "warcraft iii", "company of heroes 2", "dota 2",
  "league of legends", "smite", "heroes of the storm", "world of warcraft",
  "final fantasy xiv", "guild wars 2", "black desert online",
  "elder scrolls online", "runescape", "old school runescape", "lost ark",
  "path of exile", "diablo iv", "monster hunter world", "monster hunter rise",
  "far cry 6", "just cause 4", "watch dogs 2", "cyberpunk 2077",
  "assassin's creed valhalla", "assassin's creed odyssey",
  "assassin's creed origins", "geometry dash", "gta san andreas", "gta vice city",
  "gta iv", "gta iii", "forza horizon 5", "forza horizon 4",
  "forza motorsport 7", "ets2", "american truck simulator", "red dead redemption 2"
]

const toBe = [
  "successful", "productive", "good at something", "cool", "rich", "a billionare", "a millionare", 
  "a trillionare", "rich guy", "motivated", "sigma", "gooning"
]

const gameTemplates = [
  g => g,
  g => `${g} giveaway`, 
  g => `${g} tips`, 
  g => `${g} tricks`,
  g => `${g} trick`,
  g => `${g} tip`,
  g => `${g} best mods`, 
  g => `${g} best mod`, 
  g => `${g} best tricks`, 
  g => `${g} best trick`, 
  g => `${g} best glitches`, 
  g => `${g} best glitch`, 
  g => `${g} best money tricks`,
  g => `${g} best money trick`,
  g => `${g} download`,
  g => `${g} download tutorial`,

  g => `${g} giveaway ${year}`, 
  g => `${g} tips ${year}`, 
  g => `${g} tricks ${year}`,
  g => `${g} trick ${year}`,
  g => `${g} tip ${year}`,
  g => `${g} best mods ${year}`, 
  g => `${g} best mod ${year}`, 
  g => `${g} best tricks ${year}`, 
  g => `${g} best trick ${year}`, 
  g => `${g} best glitches ${year}`, 
  g => `${g} best glitch ${year}`, 
  g => `${g} best money tricks ${year}`,
  g => `${g} best money trick ${year}`,
  g => `${g} download ${year}`,
  g => `${g} download tutorial ${year}`,

  g => `${g} giveaway in ${year}`, 
  g => `${g} tips in ${year}`, 
  g => `${g} tricks in ${year}`,
  g => `${g} trick in ${year}`,
  g => `${g} tip in ${year}`,
  g => `${g} best mods in ${year}`, 
  g => `${g} best mod in ${year}`, 
  g => `${g} best tricks in ${year}`, 
  g => `${g} best trick in ${year}`, 
  g => `${g} best glitches in ${year}`, 
  g => `${g} best glitch in ${year}`, 
  g => `${g} best money tricks in ${year}`,
  g => `${g} best money trick in ${year}`,
  g => `${g} download in ${year}`,
  g => `${g} download tutorial in ${year}`,

  g => `how to download ${g}`,
  g => `how to get ${g}`,
  g => `how to play ${g}`]

const socialTemplates = [
  s => s, s => `how to get more ${s} followers`, s => `how to get more ${s} subscribers`,
  s => `how to get more ${s} views`, s => `how to get more ${s} likes`,
  s => `how to get more ${s} comments`, s => `how to get more ${s} shares`,
  s => `how to go viral on ${s}`, s => `best ${s} alternatives`, s => `best ${s} tips`,
  s => `best ${s} tricks`, s => `best ${s} features`,
  s => `how to use ${s} effectively`, s => `how to use ${s} safely`,
  s => `how to use ${s} efficiently`, s => `how to use ${s} to advertise legally`,
  s => `how to use ${s} for business`, s => `how to use ${s} for marketing`,

  s => s, s => `how to get more ${s} followers in ${year}`, s => `how to get more ${s} subscribers in ${year}`,
  s => `how to get more ${s} views in ${year}`, s => `how to get more ${s} likes in ${year}`,
  s => `how to get more ${s} comments in ${year}`, s => `how to get more ${s} shares in ${year}`,
  s => `how to go viral on ${s} in ${year}`, s => `best ${s} alternatives in ${year}`, s => `best ${s} tips in ${year}`,
  s => `best ${s} tricks in ${year}`, s => `best ${s} features in ${year}`,
  s => `how to use ${s} effectively in ${year}`, s => `how to use ${s} safely in ${year}`,
  s => `how to use ${s} efficiently in ${year}`, s => `how to use ${s} to advertise legally in ${year}`,
  s => `how to use ${s} for business in ${year}`, s => `how to use ${s} for marketing in ${year}`
]

const beingTemplate = [
  g => `smart ways to be ${g}`,
  g => `smart ways to be ${g} correctly`,
  g => `best way to be ${g}`,
  g => `best way to start being ${g}`,
  g => `best way to start being ${g} correcly`,
  g => `how to be ${g}`,
  g => `how to be ${g} in simple ways`,
  g => `how to actually be ${g}`,
  g => `how to actually be ${g} correcly`,
  g => `good example of being ${g}`,
  g => `good example of being ${g} correctly`,
  g => `pros of being ${g}`,
  g => `good side of being ${g}`,
  g => `great side of being ${g}`,
  g => `hard side of being ${g}`,
  g => `how hard is it to be ${g}`,
]

const mapTemplates = [ g => `${g} map`, g => `${g} maps`, g => `${g} best map`, g => `${g} best maps` ]

searches.push(
  ...games.flatMap(g => gameTemplates.map(fn => fn(g))),
  ...socialMedias.flatMap(s => socialTemplates.map(fn => fn(s))),
  ...gamesWithMaps.flatMap(g => [...mapTemplates.map(fn => fn(g)),...gameTemplates.map(fn => fn(g))]),
  ...toBe.flatMap(b => beingTemplate.map(fn => fn(b)))
)

// ===== HELPERS =====

const d=new Date()
const randomHex = (len = 32) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
const getDate=()=>`${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`
const sleep = (ms) => new Promise(res => setTimeout(res, ms))
const getLevel = (string) => Number(string.toLowerCase().split("level")[1])

// ===== ACCOUNT & QUEST =====
const getAccountData = async () => {
  const accountText = await (await fetch('https://rewards.bing.com/', { credentials: 'include' })).text()
  const token = accountText.split(`<input name="__RequestVerificationToken" type="hidden" value="`)[1].split('"')[0]

  const rewardResp = await fetch(api.data, {
    "headers": {
      "accept": "application/json, text/javascript, */* q=0.01",
      "accept-language": "en-US,enq=0.9,vi-VNq=0.8,viq=0.7",
      "correlation-context": "v=1,ms.b.tel.market=en-US",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Google Chrome\"v=\"143\", \"Chromium\"v=\"143\", \"Not A(Brand\"v=\"24\"",
    },
    "referrer": "https://rewards.bing.com/",
    "credentials": "include"
  })
  const rewards = (await rewardResp.json()).dashboard
  const quest = [...(rewards.dailySetPromotions[getDate()] || []), ...(rewards.morePromotions || [])]

  let unfinished = []
  const userLevel = getLevel(rewards.userStatus.levelInfo.activeLevel)

  quest.forEach(v => { 
    const questLevel = getLevel(v.attributes.locked_category_criteria || "level1")
    if (!v.complete && userLevel >= questLevel) unfinished.push(v)
  })

  const search = rewards.userStatus.counters.pcSearch[0]
  return { token, rewards, quest, unfinished, search }
}

// ===== QUEST REPORTER =====

const PostQuest = async (item, token) => fetch(api.quest, {
  "headers": {
    "priority": "u=1, i",
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "correlation-context": "v=1,ms.b.tel.market=en-GB"
  },
  "referrer": "https://rewards.bing.com/",
  "body": `id=${item.name}&hash=${item.hash}&timeZone=${new Date().getTimezoneOffset()}&activityAmount=1&dbs=0&form=&type=&__RequestVerificationToken=${token}`,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})

// ===== SEARCH REPORTER =====
const ReportBingActivity = async(query) => {
  const IG = randomHex(32)
  const IID = `SERP.${Math.floor(Math.random() * 10000)}`
  const rdr = Math.floor(Math.random() * 10) + 1
  const rdrig = randomHex(32)

  const url = api.search
  const params = new URLSearchParams({ IG, IID, q: query, FORM: "HDRSC1", rdr, rdrig, ajaxreq: 1 })
  const body = new URLSearchParams({ url: `https://www.bing.com/search?q=${encodeURIComponent(query)}&FORM=HDRSC1&rdr=${rdr}&rdrig=${rdrig}`, V: "web" })

  return fetch(`${url}?${params}`, {
    method: "POST",
    body,
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "*/*" }
  })
}

// ===== MAIN LOOP =====
const Search = async () => {
  let { search } = await getAccountData()

  let searchesDone = search.pointProgress / 3
  const maxSearches = search.pointProgressMax

  if (searchesDone * 3 >= maxSearches) return chrome.alarms.clear("searches")
  const queries = [...searches].sort(() => 0.5 - Math.random())

  for (let query of queries) {
    if (searchesDone * 3 >= maxSearches) break
    try {
      console.log("Searching:", query)
      await ReportBingActivity(query)
    }
    catch(e) { console.error("Search error:", e) }

    searchesDone++
    await sleep(6300 + Math.random() * 500)
  }
}

const Quest = async () => {
  let { token, unfinished } = await getAccountData()

  if (unfinished.length < 1) return chrome.alarms.clear("quests")
  if (!token) return console.error("Failed to get token")
  
  for (const quest of unfinished) {
    try {
      await sleep(200)
      await PostQuest(quest, token)
    } catch (e) {
      console.error("Quest error:", e)
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.error("If some issue(s) persists, please report at https://ocean102.rf.gd/feedback (rate 0 stars for bugs report). Thanks")
  chrome.alarms.create("searches", { periodInMinutes: 3.8 })
  chrome.alarms.create("quests", { periodInMinutes: 1 })
  Quest()
  Search()
})

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "searches") Search()
  if (alarm.name === "quests") Quest()
})