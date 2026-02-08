
import { GameState, RawGameData, Screen, Difficulty, InventoryItem, BodyParts, PhoneThread, PhonePost, Task, PhoneState, PhoneMessage } from "../types";
import { IdentityRoute, FirmwareVersion, EvolutionStage, WastelandStats, CharacterStats } from "../types/character";
import { generateWastelandMap } from "./mapSystem";

export const createNewGameState = (
    name: string, 
    gender: string, 
    identityKey: string, // Was race, now IdentityRoute key or value
    age: number = 0, 
    birthday: string = "2155-01-01",
    appearance: string = "",
    background: string = "",
    difficulty: Difficulty = Difficulty.NORMAL,
    initialPackage: 'standard' | 'combat' | 'survival' | 'wealth' = 'standard'
): GameState => {
    // 1. 身份路线解析 (Identity Parsing)
    let identity: IdentityRoute = IdentityRoute.WastelandHyena; // Default
    
    // Map legacy inputs or UI keys to IdentityRoute
    if (Object.values(IdentityRoute).includes(identityKey as IdentityRoute)) {
        identity = identityKey as IdentityRoute;
    } else {
        // Fallback mapping for old UI or dev testing
        const map: {[key:string]: IdentityRoute} = {
            'Scout': IdentityRoute.WastelandHyena,
            'Tank': IdentityRoute.HeavyMetalManiac,
            'Medic': IdentityRoute.TechCleric,
            'Engineer': IdentityRoute.OldWorldGhost,
            'Sniper': IdentityRoute.GlitchRunner,
            'Hacker': IdentityRoute.GlitchRunner
        };
        identity = map[identityKey] || IdentityRoute.WastelandHyena;
    }

    const worldMap = generateWastelandMap();
    // 初始坐标根据身份不同而不同 (TODO: Implement different start locations)
    const startLoc = { x: 25000, y: 25800 }; 

    // 2. 初始属性配置 (Initial Stats based on Identity)
    let baseStats: WastelandStats = { STR: 10, END: 10, DEX: 10, AGI: 10, LOG: 10, NET: 10, NRG: 10 };
    let startHp = 100;
    let startLoad = 50; // Mind -> Load
    let startStamina = 100; // Stamina
    let startCredits = 0; // Valis -> Credits
    let initialInventory: InventoryItem[] = [];
    
    // Default Phone (Broken)
    const phoneItem: InventoryItem = {
        id: 'Itm_Phone',
        名称: 'Wasteland Comm Terminal',
        描述: 'A used military PDA with a cracked screen.',
        数量: 1,
        类型: 'key_item',
        品质: 'Common',
        价值: 200,
        重量: 0.5
    };
    initialInventory.push(phoneItem);

    // Identity Specific Loadouts
    switch (identity) {
        case IdentityRoute.OldWorldGhost: // High NRG, LOG, Low END
            baseStats = { STR: 8, END: 6, DEX: 12, AGI: 10, LOG: 16, NET: 14, NRG: 18 };
            startHp = 80; startLoad = 100;
            initialInventory.push(
                { id: 'Eq_Suit_Vault', 名称: 'Vault Jumpsuit', 描述: 'Blue jumpsuit with "101" on the back.', 数量: 1, 类型: 'armor', 防具: { 类型: '轻甲', 部位: '身体', 护甲等级: '轻' }, 已装备: true, 装备槽位: '身体', 防御力: 5, 品质: 'Rare', 价值: 500, 重量: 1.0 },
                { id: 'Itm_OldPDA', 名称: 'Damaged PDA', 描述: 'Contains unreadable old-world data.', 数量: 1, 类型: 'key_item', 品质: 'LostTech', 价值: 1000 }
            );
            break;
        case IdentityRoute.WastelandHyena: // High AGI, END, Low LOG
            baseStats = { STR: 12, END: 16, DEX: 10, AGI: 16, LOG: 6, NET: 8, NRG: 8 };
            startHp = 140; startStamina = 150;
            initialInventory.push(
                { id: 'Eq_Wpn_Pipe', 名称: 'Rusty Pipe Gun', 描述: 'Makeshift firearm cobbled from pipes.', 数量: 1, 类型: 'weapon', 武器: { 类型: '枪械', 伤害类型: '弹道', 射程: '中程', 攻速: '慢' }, 已装备: true, 装备槽位: '主手', 攻击力: 12, 品质: 'Scrap', 价值: 50, 重量: 2.5 },
                { id: 'Itm_Geiger', 名称: 'Geiger Counter', 描述: 'Clicking radiation detector.', 数量: 1, 类型: 'key_item', 品质: 'Common', 价值: 100 }
            );
            break;
         case IdentityRoute.HeavyMetalManiac: // High STR, DEX, Vehicle focus
            baseStats = { STR: 18, END: 14, DEX: 14, AGI: 8, LOG: 8, NET: 6, NRG: 10 };
            startHp = 160; startLoad = 80;
            initialInventory.push(
                { id: 'Eq_Wpn_Wrench', 名称: 'Heavy Wrench', 描述: 'Fixes vehicles and people alike.', 数量: 1, 类型: 'weapon', 武器: { 类型: '钝器', 伤害类型: '打击', 射程: '近战', 攻速: '中' }, 已装备: true, 装备槽位: '主手', 攻击力: 15, 品质: 'Common', 价值: 120, 重量: 3.0 },
                { id: 'Eq_Head_Goggles', 名称: 'Tank Goggles', 描述: 'Oil-stained windproof goggles.', 数量: 1, 类型: 'armor', 防具: { 类型: '头盔', 部位: '头部', 护甲等级: '无' }, 已装备: true, 装备槽位: '头部', 防御力: 2, 品质: 'Common', 价值: 80, 重量: 0.5 }
            );
            break;
        case IdentityRoute.GlitchRunner: // High NRG, LOG, Low STR
            baseStats = { STR: 4, END: 8, DEX: 12, AGI: 14, LOG: 14, NET: 18, NRG: 20 };
            startHp = 70; startLoad = 150;
            initialInventory.push(
                { id: 'Eq_Imp_Jack', 名称: 'Neural Jack', 描述: 'Universal data port on the back of the neck.', 数量: 1, 类型: 'armor', 防具: { 类型: '饰品', 部位: '饰品', 护甲等级: '无' }, 已装备: true, 装备槽位: '饰品1', 效果: '黑客+10%', 品质: 'Rare', 价值: 2000, 重量: 0.1 },
                { id: 'Itm_DataSting', 名称: 'Data Spike', 描述: 'Illegal plugin for injecting viruses.', 数量: 1, 类型: 'consumable', 品质: 'Illegal', 价值: 500 }
            );
            break;
        case IdentityRoute.TechCleric: // Balanced, High DEX/LOG
            baseStats = { STR: 10, END: 10, DEX: 16, AGI: 8, LOG: 14, NET: 12, NRG: 12 };
            startHp = 110; startLoad = 120;
            initialInventory.push(
                { id: 'Eq_Arm_Servo', 名称: 'Damaged Servo Arm', 描述: 'Brotherhood apprentice auxiliary limb.', 数量: 1, 类型: 'armor', 防具: { 类型: '轻甲', 部位: '手部', 护甲等级: '中' }, 已装备: true, 装备槽位: '手部', 防御力: 8, 品质: 'Military', 价值: 800, 重量: 4.0 },
                { id: 'Itm_Scripture', 名称: 'Machine God Scripture', 描述: 'Praise the Omnissiah.', 数量: 1, 类型: 'key_item', 品质: 'Common', 价值: 5 }
            );
            break;
    }

    // 3. 难度调整 (Difficulty Modifiers)
    let phoneBattery = 100;
    let phoneSignal = 4;
    
    if (difficulty === Difficulty.EASY) {
        startCredits = 500;
        startHp += 50;
        phoneBattery = 100;
        initialInventory.push({ id: 'Itm_Rat', 名称: 'Roasted Meat Skewer', 描述: 'Wasteland rat meat skewer, questionable taste.', 数量: 3, 类型: 'consumable', 恢复量: 30, 品质: 'Common', 价值: 20 });
    } else if (difficulty === Difficulty.NORMAL) {
        startCredits = 100;
         initialInventory.push({ id: 'Itm_Water', 名称: 'Murky Water', 描述: 'Cloudy water, radiation barely within safe limits.', 数量: 2, 类型: 'consumable', 恢复量: 10, 品质: 'Common', 价值: 5 });
    } else if (difficulty === Difficulty.HARD) {
        startCredits = 0;
        phoneBattery = 50;
        startHp -= 20;
    } else if (difficulty === Difficulty.HELL) {
        startCredits = 0;
        phoneBattery = 10;
        startHp -= 50;
        // Broken gear logic could be added here
    }

    // 4. Initial Package
    if (initialPackage === 'wealth') startCredits += 1000;
    // other packages...

    // 5. 初始化系统对象
    const bodyParts: BodyParts = {
        头部: { 当前: Math.ceil(startHp * 0.15), 最大: Math.ceil(startHp * 0.15), 状态: '正常' },
        胸部: { 当前: Math.ceil(startHp * 0.30), 最大: Math.ceil(startHp * 0.30), 状态: '正常' },
        腹部: { 当前: Math.ceil(startHp * 0.15), 最大: Math.ceil(startHp * 0.15), 状态: '正常' },
        左臂: { 当前: Math.ceil(startHp * 0.10), 最大: Math.ceil(startHp * 0.10), 状态: '正常' },
        右臂: { 当前: Math.ceil(startHp * 0.10), 最大: Math.ceil(startHp * 0.10), 状态: '正常' },
        左腿: { 当前: Math.ceil(startHp * 0.10), 最大: Math.ceil(startHp * 0.10), 状态: '正常' },
        右腿: { 当前: Math.ceil(startHp * 0.10), 最大: Math.ceil(startHp * 0.10), 状态: '正常' }
    };

    const phoneState: PhoneState = {
        设备: { 电量: phoneBattery, 当前信号: phoneSignal, 状态: 'online' },
        联系人: { 好友: [], 黑名单: [], 最近: [] },
        对话: { 私聊: [], 群聊: [], 公共频道: [] },
        朋友圈: { 仅好友可见: true, 帖子: [] },
        公共帖子: { 板块: ['废土资讯', '赏金布告', '黑市交易', '求助', '远征', '情报'], 帖子: [] },
        待发送: []
    };
    
    // Intro Text
    const introText = `IRON ARK - PERIPHERY SYSTEM BOOT... 
Identity Confirmed: ${identity}
Firmware Version: ${FirmwareVersion.v1_0}
Loading Wasteland Survival Protocols...

Welcome back, ${name}. The world is not quite what you remember.
If this is your first time in the wasteland, check the [STATUS] panel to confirm your chassis functions.`;

    return {
        当前界面: Screen.GAME,
        游戏难度: difficulty,
        处理中: false,
        角色: {
            姓名: name,
            机体型号: "Gemini 10.0", // Can be customized
            身份路线: identity,
            称号: "Sleeper",
            
            机体版本: FirmwareVersion.v1_0,
            进化阶段: EvolutionStage.None,
            
            性别: gender === 'Male' ? '男性' : '女性', // Chassis Type
            出厂日期: birthday,
            运行时间: age, 
            头像: `https://ui-avatars.com/api/?name=${name}&background=random&size=200`,
            外貌: appearance || "标准泛用型机体",
            背景: background,
            
            所属势力: "无",

            生命值: startHp,
            最大生命值: startHp,
            负载: 0,
            最大负载: startLoad,
            体力: startStamina,
            最大体力: startStamina,
            
            逻辑稳定性: 100, // Sanity
            最大逻辑稳定性: 100,

            生存状态: { 饱腹度: 100, 最大饱腹度: 100, 辐射值: 0, 最大辐射值: 100, 水分: 100, 最大水分: 100 },
            身体部位: bodyParts,

            经验值: 0,
            黑匣子数据: 0,
            升级所需数据: 1,
            配给券: startCredits,
            
            疲劳度: 0,
            废土声望: "无名小卒",
            战术槽位: { 上限: 2, 已使用: 0 },

            属性: baseStats,
            战术模块: [],
            技能: [],
            战术程序: [],
            系统故障: [],
            装备: { 
                头部: '', 身体: '', 手部: '', 腿部: '', 足部: '', 
                主手: '', 副手: '', 饰品1: '', 饰品2: '', 饰品3: '', 
                ...initialInventory.reduce((acc, item) => {
                    if (item.已装备 && item.装备槽位) {
                        acc[item.装备槽位] = item.名称;
                    }
                    return acc;
                }, {} as any)
            },
            状态: []
        },
        日志: [
            { id: 'Log_Intro', text: introText, sender: 'System', timestamp: Date.now(), turnIndex: 0 }
        ],
        游戏时间: "第1日 08:00",
        当前日期: "2155-05-20",
        当前地点: "钢铁方舟 - 外围", // Iron Ark Outskirts
        当前区域: 1,
        势力: { 名称: "无", 等级: "I", 领袖: "", 资金: 0, 设施状态: {}, 仓库: [] }, // Initialize Faction
        避难所: null,
        眷族: null, // Legacy null
        天气: "辐射尘暴 (轻微)",
        辐射等级: '低',
        当前楼层: 1, // Legacy compatibility
        
        世界坐标: startLoc,
        背包: initialInventory,
        战利品: [],
        公共战利品: [],
        战利品背负者: name,
        社交: [],
        手机: phoneState,
        地图: worldMap,
        世界: {
            异常指数: 10,
            公会声望: 0, // Replaced 眷族声望
            头条新闻: ["【通缉】代号'Mockingbird'的AI单位逃离圣杯城。", "【天气】今日辐射指数较高，请幸存者减少外出。"],
            街头传闻: [{ 主题: "南边的旧避难所里传来了奇怪的歌声。", 传播度: 20 }],
            废土董事会: { 下次会议开启时间: "", 会议主题: "", 讨论内容: [], 最终结果: "" }, // Replaced 诸神神会
            NPC后台跟踪: [],
            势力格局: undefined, // Replaced 派阀格局
            区域战争: undefined // Replaced 战争游戏
        },
        任务: [],
        技能: [],
        剧情: {
            主线: {
                当前卷数: 1,
                当前篇章: "觉醒",
                当前阶段: "序章",
                关键节点: "逃离初始区域",
                节点状态: "进行中"
            },
            引导: {
                当前目标: "检查并确认自身状态",
                下一触发: "移动或进行一次互动",
                行动提示: "点击屏幕下方的指令按钮"
            },
            时间轴: {预定日期: "", 下一关键时间: ""},
            路线: {是否正史: true, 偏移度: 0, 分歧说明: ""},
            待触发: [], 
            里程碑: [],
            备注: ""
        },
        契约: [],
        记忆: { lastLogIndex: 0, instant: [], shortTerm: [], mediumTerm: [], longTerm: [] },
        战斗: { 是否战斗中: false, 敌方: null, 战斗记录: [] },
        回合数: 1
    };
};

export const mapRawDataToGameState = (raw: RawGameData): GameState => {
   return raw as GameState;
};
