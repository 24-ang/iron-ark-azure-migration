import { ShelterState } from './world';

// --- Identity & Evolution ---

export enum IdentityRoute {
    OldWorldGhost = 'Old World Ghost',   // 旧世界幽灵 (Elite/Deep Ruins)
    WastelandHyena = 'Wasteland Hyena', // 废土鬣狗 (Commoner/Slums)
    HeavyMetalManiac = 'Heavy Metal Maniac', // 重装狂徒 (Hunter/Garage)
    GlitchRunner = 'Glitch Runner',     // 故障行者 (Special/Data Dump)
    TechCleric = 'Tech Cleric'          // 钢铁信徒 (Knight/Outpost)
}

export enum EvolutionStage {
    None = 'None',           // v1.0
    Stage1_Bio = 'Bio-Morph I',  // v2.0 Bio
    Stage1_Mech = 'Cyber-Core I', // v2.0 Mech
    Stage2_Bio = 'Bio-Morph II', // v3.0 Bio
    Stage2_Mech = 'Cyber-Core II',// v3.0 Mech
    LimitBreak = 'Limit Break'   // v4.0
}

export enum FirmwareVersion {
    v1_0 = 'v1.0 (Civilian)',
    v2_0 = 'v2.0 (Military)',
    v3_0 = 'v3.0 (Special Ops)',
    v4_0 = 'v4.0 (Catastrophe)'
}

export enum PhysiologyType {
    Organic = 'Organic',       // 有机体 (需进食饮水)
    Construct = 'Construct',   // 构造体 (免疫饥饿/干渴/辐射，由于没有维护系统暂时只做豁免)
    Hybrid = 'Hybrid'          // 半机械 (混合特性)
}

// --- Attributes ---

export interface WastelandStats {
    STR: number; // 力量 - 物理伤害/负重
    END: number; // 耐久 - 生命/抗性
    DEX: number; // 灵巧 - 命中/精密操作
    AGI: number; // 敏捷 - 回避/潜行
    LOG: number; // 逻辑 - 黑客/高智商对话
    NET: number; // 网络 - 嘴炮/电子战
    NRG: number; // 能源 - 技能资源/爆发
}

// --- Abilities & Tech ---

export interface TacticalModule { // Was FalnaAbility
    名称: string;
    等级: string; // I, H, G... S, SS
    类型?: '战斗' | '生产' | '黑客' | '驾驶' | '社交' | '辅助' | string;
    描述?: string;
    效果?: string; // e.g. "STR+10%"
    解锁条件?: string;
    备注?: string;
}

export interface TechArtCost { // Was MagicCost
    Load?: number | string; // 负载 (Mech)
    Stamina?: number | string; // 体力 (Bio)
    Credits?: number | string; // 配给券
    代价?: string;
}

export interface TechArt { // Was MagicSpell
    id: string;
    名称: string;
    指令代码: string; // Was Chant (咏唱) - e.g. "SUDO RUN KILL_MODE"
    类别: '攻击' | '防御' | '黑客' | '超频' | '干扰' | '修复' | '特殊' | string;
    属性?: '物理' | '火焰' | '冰冻' | '电击' | '辐射' | '声波' | string;
    描述?: string;
    效果?: string;
    范围?: string;
    射程?: string;
    冷却?: string;
    消耗?: TechArtCost | string | number;
    施放条件?: string;
    备注?: string;
    稀有?: boolean;
    标签?: string[] | string; // [Bio], [Mech]
}

export interface SkillCost {
    Load?: number | string;
    Stamina?: number | string;
    Credits?: number | string;
    代价?: string;
}

export interface Skill {
    id: string;
    名称: string;
    类别: '主动' | '被动' | '自动' | '条件触发' | string;
    描述?: string;
    效果?: string;
    触发?: string;
    持续?: string;
    冷却?: string;
    消耗?: SkillCost | string | number;
    范围?: string;
    命中?: string;
    适用?: string;
    等级?: string | number;
    关联模块?: string[] | string; // Was 关联发展能力
    限制?: string;
    备注?: string;
    标签?: string[] | string;
    稀有?: boolean;
}

// --- Vitals & Status ---

export interface SurvivalStats {
    饱腹度: number; // 0-100
    最大饱腹度: number;
    辐射值: number; // 0-100 (Was 水分? No, Rads is more consistent)
    最大辐射值: number; // Threshold
    水分: number; // 0-100
    最大水分: number;
}

export interface BodyPartStats {
    当前: number;
    最大: number;
    状态: '正常' | '轻伤' | '重伤' | '损毁';
}

export interface BodyParts {
    头部: BodyPartStats; // 传感器
    胸部: BodyPartStats; // 核心
    腹部: BodyPartStats; // 动力炉
    左臂: BodyPartStats;
    右臂: BodyPartStats;
    左腿: BodyPartStats;
    右腿: BodyPartStats;
}

export interface StatusEffect {
    名称: string;
    类型: 'Buff' | 'DeBuff' | 'Glitch' | 'Radiation';
    效果: string;
    结束时间: string;
}

export interface ProtocolSlotState { // Was MagicSlotState
    上限: number;
    已使用: number;
    扩展来源?: string[];
}

// --- Main Character Interface ---

export interface CharacterStats {
    // Identity
    姓名: string;
    机体型号: string; // Was 种族 (e.g. "Gemini X-10")
    身份路线: IdentityRoute; // New
    称号: string;
    所属势力: string; // Was 所属眷族
    势力数据?: ShelterState; // Was 眷族: FamiliaState

    // Progression
    机体版本: FirmwareVersion; // Was 等级 (v1.0 - v4.0)
    进化阶段: EvolutionStage; // New

    // Visuals
    头像: string;
    性别: string; // 设定性别
    出厂日期: string; // Was 生日
    运行时间: number; // Was 年龄
    外貌?: string;
    背景?: string;

    // Physiology
    生理类型?: PhysiologyType; // New: Defaults to Organic if undefined
    
    // Vitals
    生命值: number; // HP (Structure Integrity)
    最大生命值: number;
    负载: number; // Was 精神力 (Load/Mind) - for Mech arts
    最大负载: number;
    体力: number; // Was 体力 (Stamina/Energy) - for Bio arts & running
    最大体力: number;
    
    // Cognitive - New
    逻辑稳定性: number; // Sanity/Logic (0-100). Low = Memes take over.
    最大逻辑稳定性: number;

    // Hardcore Stats
    生存状态?: SurvivalStats;
    身体部位?: BodyParts;

    // Resources & Exp
    经验值: number; // Excelia
    黑匣子数据: number; // Was 伟业 (Feats)
    升级所需数据: number; 
    配给券: number; // Was 法利 (Credits)

    // Status
    疲劳度: number;
    废土声望: string; // Was 公会评级

    // Slots
    战术槽位?: ProtocolSlotState; // Was 魔法栏位

    // Attributes - 7 Dimensions
    属性: WastelandStats; // Was 能力值

    // Abilities
    战术模块: TacticalModule[]; // Was 发展能力
    技能: Skill[]; // Passive/Active Skills
    战术程序: TechArt[]; // Was 魔法 (Active Spells/Hacks)
    系统故障: StatusEffect[]; // Was 诅咒
    状态: StatusEffect[];

    // Equipment
    装备: {
        头部: string;
        身体: string; // 核心装甲
        手部: string; 
        腿部: string; 
        足部: string; 
        主手: string; 
        副手: string; 
        饰品1: string; 
        饰品2: string; 
        饰品3: string; 
        载具?: string; // NEW - Vehicle slot
        [key: string]: string | any;
    };
}
