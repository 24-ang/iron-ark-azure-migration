
import { AppSettings, GameState, PromptModule, AIEndpointConfig, Confidant, MemoryEntry, LogEntry, AIResponse, PhoneAIResponse, ContextModuleConfig, ContextModuleType, InventoryItem, Task, MemoryConfig, PhoneMessage, PhonePost, PhoneState, PhoneThread, MemorySystem, WorldMapData } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
    P_SYS_FORMAT, P_SYS_CORE, P_SYS_STATS, P_SYS_LEVELING, P_SYS_COMBAT,
    P_WORLD_FOUNDATION, P_WORLD_DUNGEON, P_WORLD_PHONE, P_WORLD_ECO, P_WORLD_GUILD_REG, P_WORLD_FACTIONS, P_WORLD_EQUIPMENT, P_DYN_NPC, P_NPC_MEMORY, P_WORLD_NEWS, P_WORLD_DENATUS, P_WORLD_RUMORS, P_WORLD_EVENTS, P_DYN_MAP, P_MAP_DISCOVERY,
    P_COT_LOGIC, P_START_REQ, P_MEM_S2M, P_MEM_M2L, P_DATA_STRUCT,
    P_WRITING_REQ, P_WORLD_VALUES, P_LOOT_SYSTEM,
    P_PHYSIOLOGY_EASY, P_PHYSIOLOGY_NORMAL, P_PHYSIOLOGY_HARD, P_PHYSIOLOGY_HELL,
    P_DIFFICULTY_EASY, P_DIFFICULTY_NORMAL, P_DIFFICULTY_HARD, P_DIFFICULTY_HELL,
    P_JUDGMENT_EASY, P_JUDGMENT_NORMAL, P_JUDGMENT_HARD, P_JUDGMENT_HELL,
    P_ACTION_OPTIONS, P_FAMILIA_JOIN, P_STORY_GUIDE,
    P_PHONE_SYSTEM, P_PHONE_COT,
    P_SYS_FORMAT_MULTI, P_COT_LOGIC_MULTI
} from "../prompts";
import { Difficulty } from "../types/enums";
import { IdentityRoute, FirmwareVersion, WastelandStats } from "../types/character";

// --- Default Configuration ---

export const DEFAULT_PROMPT_MODULES: PromptModule[] = [
    // 【系统设定】
    { id: 'sys_format', name: '1. 输出格式', group: '系统设定', usage: 'CORE', isActive: true, content: P_SYS_FORMAT, order: 1 },
    { id: 'sys_format_multi', name: '1. 输出格式(多重思考)', group: '系统设定', usage: 'CORE', isActive: true, content: P_SYS_FORMAT_MULTI, order: 1 },
    { id: 'sys_core', name: '2. 核心规则', group: '系统设定', usage: 'CORE', isActive: true, content: P_SYS_CORE, order: 2 },
    { id: 'sys_data_struct', name: '3. 数据格式', group: '系统设定', usage: 'CORE', isActive: true, content: P_DATA_STRUCT, order: 3 },
    { id: 'sys_writing', name: '4. 写作要求', group: '系统设定', usage: 'CORE', isActive: true, content: P_WRITING_REQ, order: 4 },
    
    // 【世界观设定】
    { id: 'world_foundation', name: '0. 神时代与眷族契约', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_FOUNDATION, order: 18 },
    { id: 'world_dungeon_law', name: '1. 废土/污染区法则', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_DUNGEON, order: 20 },
    { id: 'world_guild_reg', name: '2. 公会与登记流程', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_GUILD_REG, order: 21 },
    { id: 'world_phone', name: '3. 魔石通讯终端', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_PHONE, order: 22 },
    { id: 'world_eco_social', name: '4. 经济与社会', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_ECO, order: 23 },
    { id: 'world_factions', name: '5. 势力与区域战争', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_FACTIONS, order: 23.5 },
    { id: 'world_equipment', name: '6. 装备与道具', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_EQUIPMENT, order: 23.8 },
    { id: 'world_values', name: '7. 世界数值定义', group: '世界观设定', usage: 'CORE', isActive: true, content: P_WORLD_VALUES, order: 24 },
    // Removed legacy DanMachi IF scenarios
    { id: 'sys_stats', name: '11. 能力值与精神力', group: '世界观设定', usage: 'CORE', isActive: true, content: P_SYS_STATS, order: 25 },
    { id: 'sys_leveling', name: '12. 升级仪式', group: '世界观设定', usage: 'CORE', isActive: true, content: P_SYS_LEVELING, order: 26 },
    { id: 'sys_combat_law', name: '13. 战斗法则与死亡', group: '世界观设定', usage: 'CORE', isActive: true, content: P_SYS_COMBAT, order: 27 },
    { id: 'sys_loot', name: '14. 战利品管理', group: '世界观设定', usage: 'CORE', isActive: true, content: P_LOOT_SYSTEM, order: 28 },
    { id: 'sys_familia_join', name: '15. 势力加入引导', group: '世界观设定', usage: 'CORE', isActive: true, content: P_FAMILIA_JOIN, order: 29 }, 
    
    // 【世界动态】
    { id: 'world_news', name: '1. 公会新闻生成', group: '世界动态', usage: 'CORE', isActive: true, content: P_WORLD_NEWS, order: 30 },
    { id: 'world_denatus', name: '2. 废土董事会', group: '世界动态', usage: 'CORE', isActive: true, content: P_WORLD_DENATUS, order: 31 },
    { id: 'world_rumors', name: '3. 街头传闻', group: '世界动态', usage: 'CORE', isActive: true, content: P_WORLD_RUMORS, order: 32 },
    { id: 'world_events', name: '4. 世界事件管理', group: '世界动态', usage: 'CORE', isActive: true, content: P_WORLD_EVENTS, order: 33 },
    { id: 'sys_story_guide', name: '5. 剧情导演', group: '世界动态', usage: 'CORE', isActive: true, content: P_STORY_GUIDE, order: 34 },

    // 【COT思维链】
    { id: 'cot_logic', name: '1. 核心思维链', group: 'COT思维链', usage: 'CORE', isActive: true, content: P_COT_LOGIC, order: 0 },
    { id: 'cot_logic_multi', name: '1. 核心思维链(多重思考)', group: 'COT思维链', usage: 'CORE', isActive: true, content: P_COT_LOGIC_MULTI, order: 0 },

    // 【判定系统】(随难度切换)
    { id: 'judge_easy', name: '判定系统-轻松', group: '判定系统', usage: 'CORE', isActive: false, content: P_JUDGMENT_EASY, order: 15 },
    { id: 'judge_normal', name: '判定系统-普通', group: '判定系统', usage: 'CORE', isActive: false, content: P_JUDGMENT_NORMAL, order: 15 },
    { id: 'judge_hard', name: '判定系统-困难', group: '判定系统', usage: 'CORE', isActive: false, content: P_JUDGMENT_HARD, order: 15 },
    { id: 'judge_hell', name: '判定系统-地狱', group: '判定系统', usage: 'CORE', isActive: false, content: P_JUDGMENT_HELL, order: 15 },
    
    // 【动态世界提示词】
    { id: 'dyn_npc_event', name: '1. 动态事件生成', group: '动态世界提示词', usage: 'CORE', isActive: true, content: P_DYN_NPC, order: 40 },
    { id: 'dyn_map_gen', name: '2. 地图动态绘制', group: '动态世界提示词', usage: 'CORE', isActive: true, content: P_DYN_MAP, order: 41 },
    { id: 'dyn_npc_mem', name: '3. NPC记忆更新', group: '动态世界提示词', usage: 'CORE', isActive: true, content: P_NPC_MEMORY, order: 42 }, 
    { id: 'dyn_map_discover', name: '4. 新地点发现', group: '动态世界提示词', usage: 'CORE', isActive: true, content: P_MAP_DISCOVERY, order: 43 },
    
    // 【开局提示词】
    { id: 'start_req', name: '1. 开局要求', group: '开局提示词', usage: 'START', isActive: true, content: P_START_REQ, order: 0 },
    
    // 【记忆配置】
    { id: 'mem_s2m', name: '1. 短转中 (S->M)', group: '记忆配置', usage: 'MEMORY_S2M', isActive: true, content: P_MEM_S2M, order: 90 },
    { id: 'mem_m2l', name: '2. 中转长 (M->L)', group: '记忆配置', usage: 'MEMORY_M2L', isActive: true, content: P_MEM_M2L, order: 91 },

    // 难度与生理系统 (默认禁用，动态开启)
    { id: 'diff_easy', name: '难度-轻松', group: '难度系统', usage: 'CORE', isActive: false, content: P_DIFFICULTY_EASY, order: 100 },
    { id: 'diff_normal', name: '难度-普通', group: '难度系统', usage: 'CORE', isActive: false, content: P_DIFFICULTY_NORMAL, order: 100 },
    { id: 'diff_hard', name: '难度-困难', group: '难度系统', usage: 'CORE', isActive: false, content: P_DIFFICULTY_HARD, order: 100 },
    { id: 'diff_hell', name: '难度-地狱', group: '难度系统', usage: 'CORE', isActive: false, content: P_DIFFICULTY_HELL, order: 100 },

    { id: 'phys_easy', name: '生理-轻松', group: '生理系统', usage: 'CORE', isActive: false, content: P_PHYSIOLOGY_EASY, order: 21 },
    { id: 'phys_normal', name: '生理-普通', group: '生理系统', usage: 'CORE', isActive: false, content: P_PHYSIOLOGY_NORMAL, order: 21 },
    { id: 'phys_hard', name: '生理-困难', group: '生理系统', usage: 'CORE', isActive: false, content: P_PHYSIOLOGY_HARD, order: 21 },
    { id: 'phys_hell', name: '生理-地狱', group: '生理系统', usage: 'CORE', isActive: false, content: P_PHYSIOLOGY_HELL, order: 21 },
];

export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
    instantLimit: 10, 
    shortTermLimit: 30,
    mediumTermLimit: 100,
    longTermLimit: 0 
};

const isCotModule = (mod: PromptModule) => mod.id === 'cot_logic' || mod.group === 'COT思维链';

const buildCotPrompt = (settings: AppSettings): string => {
    const multiStage = settings.aiConfig?.multiStageThinking === true;
    const modules = settings.promptModules
        .filter(m => isCotModule(m));
    if (modules.length === 0) return "";
    if (multiStage) {
        const multi = modules.find(m => m.id === 'cot_logic_multi');
        if (multi && multi.isActive !== false) return multi.content;
        return P_COT_LOGIC_MULTI;
    }
    const base = modules.find(m => m.id === 'cot_logic');
    if (base && base.isActive !== false) return base.content;
    const fallback = modules.find(m => m.isActive);
    return fallback ? fallback.content : "";
};


export const extractThinkingBlocks = (rawText: string): { cleaned: string; thinking?: string } => {
    if (!rawText) return { cleaned: rawText };
    const matches = Array.from(rawText.matchAll(/<thinking>([\s\S]*?)<\/thinking>|<think>([\s\S]*?)<\/think>/gi));
    if (matches.length === 0) return { cleaned: rawText };
    const thinking = matches
        .map(m => (m[1] || m[2] || "").trim())
        .filter(Boolean)
        .join('\n\n');
    const cleaned = rawText.replace(/<thinking>[\s\S]*?<\/thinking>|<think>[\s\S]*?<\/think>/gi, '').trim();
    return { cleaned, thinking };
};

export const normalizeThinkingField = (value?: unknown): string => {
    if (typeof value !== 'string') return "";
    const extracted = extractThinkingBlocks(value).thinking;
    return (extracted || value).trim();
};

export const mergeThinkingSegments = (response?: Partial<AIResponse>): string => {
    if (!response) return "";
    const thinkingPre = normalizeThinkingField((response as any).thinking_pre);
    const thinkingPlan = normalizeThinkingField((response as any).thinking_plan);
    const thinkingDraft = normalizeThinkingField((response as any).thinking_draft);
    const thinkingCheck = normalizeThinkingField((response as any).thinking_check);
    const thinkingCanon = normalizeThinkingField((response as any).thinking_canon);
    const thinkingVarsPre = normalizeThinkingField((response as any).thinking_vars_pre);
    const thinkingVarsOther = normalizeThinkingField((response as any).thinking_vars_other);
    const thinkingVarsMerge = normalizeThinkingField((response as any).thinking_vars_merge);
    const thinkingVarsPost = normalizeThinkingField((response as any).thinking_vars_post);
    const thinkingStory = normalizeThinkingField((response as any).thinking_story);
    const thinkingPost = normalizeThinkingField((response as any).thinking_post);
    const thinkingLegacy = normalizeThinkingField((response as any).thinking);
    const segments: string[] = [];
    if (thinkingPre) segments.push(`[思考-前]\n${thinkingPre}`);
    if (thinkingPlan) segments.push(`[剧情预先思考]\n${thinkingPlan}`);
    if (thinkingDraft) segments.push(`[思考-草稿]\n${thinkingDraft}`);
    if (thinkingCheck) segments.push(`[剧情合理性校验]\n${thinkingCheck}`);
    if (thinkingCanon) segments.push(`[原著思考]\n${thinkingCanon}`);
    if (thinkingVarsPre) segments.push(`[变量预思考]\n${thinkingVarsPre}`);
    if (thinkingVarsOther) segments.push(`[其他功能变量]\n${thinkingVarsOther}`);
    if (thinkingVarsMerge) segments.push(`[变量融入剧情矫正]\n${thinkingVarsMerge}`);
    if (thinkingStory) segments.push(`[思考-完整]\n${thinkingStory}`);
    if (thinkingPost) segments.push(`[思考-后]\n${thinkingPost}`);
    if (thinkingVarsPost) segments.push(`[变量矫正思考]\n${thinkingVarsPost}`);
    if (!thinkingPre && !thinkingPlan && !thinkingDraft && !thinkingCheck && !thinkingCanon && !thinkingVarsPre && !thinkingVarsOther && !thinkingVarsMerge && !thinkingVarsPost && !thinkingStory && !thinkingPost && thinkingLegacy) segments.push(thinkingLegacy);
    return segments.join('\n\n').trim();
};

const extractJsonFromFence = (rawText: string): string | null => {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return match ? match[1].trim() : null;
};

const extractFirstJsonObject = (rawText: string): string | null => {
    const start = rawText.indexOf('{');
    if (start === -1) return null;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < rawText.length; i++) {
        const ch = rawText[i];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (ch === '\\') {
            if (inString) escaped = true;
            continue;
        }
        if (ch === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (ch === '{') depth += 1;
            if (ch === '}') {
                depth -= 1;
                if (depth === 0) return rawText.slice(start, i + 1);
            }
        }
    }
    return null;
};

const balanceJsonBraces = (rawText: string): { text: string; changed: boolean } => {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = 0; i < rawText.length; i++) {
        const ch = rawText[i];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (ch === '\\') {
            if (inString) escaped = true;
            continue;
        }
        if (ch === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (ch === '{') depth += 1;
            if (ch === '}') depth = Math.max(0, depth - 1);
        }
    }
    if (depth <= 0) return { text: rawText, changed: false };
    return { text: rawText + '}'.repeat(depth), changed: true };
};

const removeTrailingCommas = (rawText: string): { text: string; changed: boolean } => {
    const repaired = rawText.replace(/,\s*([}\]])/g, '$1');
    return { text: repaired, changed: repaired !== rawText };
};

export const parseAIResponseText = (
    rawText: string
): { response?: AIResponse; repaired: boolean; repairNote?: string; error?: string } => {
    const cleaned = rawText.trim();
    const candidates: { text: string; note?: string }[] = [];

    const fenced = extractJsonFromFence(cleaned);
    if (fenced) candidates.push({ text: fenced, note: "已移除代码块包裹" });

    const firstObject = extractFirstJsonObject(cleaned);
    if (firstObject && firstObject !== cleaned) {
        candidates.push({ text: firstObject, note: "已截断JSON之外内容" });
    }

    if (candidates.length === 0) candidates.push({ text: cleaned });

    let lastError: any = null;
    for (const candidate of candidates) {
        try {
            const parsed = JSON.parse(candidate.text);
            return {
                response: parsed as AIResponse,
                repaired: !!candidate.note,
                repairNote: candidate.note
            };
        } catch (err: any) {
            lastError = err;
        }
    }

    const baseCandidate = candidates[0]?.text ?? cleaned;
    const repairNotes: string[] = [];

    const trimmed = baseCandidate.trim();
    let repairedText = trimmed;

    const commaRepair = removeTrailingCommas(repairedText);
    repairedText = commaRepair.text;
    if (commaRepair.changed) repairNotes.push("已移除尾随逗号");

    const braceRepair = balanceJsonBraces(repairedText);
    repairedText = braceRepair.text;
    if (braceRepair.changed) repairNotes.push("已补齐缺失括号");

    try {
        const parsed = JSON.parse(repairedText);
        const note = repairNotes.length > 0 ? repairNotes.join("，") : "已自动修复JSON结构";
        return { response: parsed as AIResponse, repaired: true, repairNote: note };
    } catch (err: any) {
        return { repaired: false, error: lastError?.message || err?.message || "JSON解析失败" };
    }
};

/**
 * 社交与NPC上下文构建
 */
export const constructSocialContext = (confidants: Confidant[], params: any): string => {
    const presentMemoryDepth = typeof params.presentMemoryLimit === 'number'
        ? params.presentMemoryLimit
        : (typeof params.normalMemoryLimit === 'number' ? params.normalMemoryLimit : 30);
    const absentMemoryDepth = typeof params.absentMemoryLimit === 'number' ? params.absentMemoryLimit : 6;
    const specialPresentMemoryDepth = typeof params.specialPresentMemoryLimit === 'number'
        ? params.specialPresentMemoryLimit
        : (typeof params.specialMemoryLimit === 'number' ? params.specialMemoryLimit : presentMemoryDepth);
    const specialAbsentMemoryDepth = typeof params.specialAbsentMemoryLimit === 'number'
        ? params.specialAbsentMemoryLimit
        : 12;

    let contextOutput = "[社交与NPC状态 (Social & NPCs)]\n";
    contextOutput += "⚠️ 指令提示：修改NPC属性请用 `gameState.社交[Index].属性`。\n";

    const teammates: string[] = [];
    const focusChars: string[] = [];
    const presentChars: string[] = [];
    const absentChars: string[] = [];

    if (!Array.isArray(confidants)) return contextOutput + " (社交数据丢失)";

    confidants.forEach((c, index) => {
        // 数据准备
        const formatMemories = (mems: any[]) => mems.map(m => `[${m.时间戳}] ${m.内容}`);
        
        const lastMemoriesRaw = c.记忆 ? c.记忆.slice(-presentMemoryDepth) : []; 
        const focusMemoriesRaw = c.记忆 ? c.记忆.slice(-specialPresentMemoryDepth) : []; 
        const absentMemoriesRaw = c.记忆 ? c.记忆.slice(-absentMemoryDepth) : [];
        const specialAbsentMemoriesRaw = c.记忆 ? c.记忆.slice(-specialAbsentMemoryDepth) : [];
        
        const lastMemories = formatMemories(lastMemoriesRaw);
        const focusMemories = formatMemories(focusMemoriesRaw);
        
        const lastMem = c.记忆 && c.记忆.length > 0 ? c.记忆[c.记忆.length - 1] : { 内容: "无互动", 时间戳: "-" };

        // Wasteland Fields Mapping
        const baseInfo = {
            索引: index, 姓名: c.姓名, 称号: c.称号, 
            性别: c.性别, 机体型号: c.机体型号, 势力: c.所属势力, 身份: c.身份路线,
            版本: c.机体版本, 运行时间: c.运行时间, 好感度: c.好感度, 关系: c.关系状态,
            是否在场: c.是否在场
        };

        const coordInfo = c.坐标 ? { 坐标: c.坐标 } : {};

        if (c.是否队友) {
            const fullData = {
                ...baseInfo,
                ...coordInfo,
                简介: c.简介, 外貌: c.外貌,
                生存数值: c.生存数值 || "需生成",
                属性: c.属性 || "需生成", // WastelandStats
                装备: c.装备 || "需生成",
                背包: c.背包 || [],
                最近记忆: focusMemories
            };
            teammates.push(JSON.stringify(fullData, null, 2));
        } else if (c.特别关注 || c.强制包含上下文) {
            const isPresent = !!c.是否在场;
            const focusData = {
                ...baseInfo,
                ...coordInfo,
                简介: c.简介, 外貌: c.外貌, 背景: c.背景,
                位置详情: c.位置详情,
                最近记忆: isPresent ? focusMemories : formatMemories(specialAbsentMemoriesRaw)
            };
            focusChars.push(JSON.stringify(focusData));
        } else if (c.是否在场) {
            const presentData = {
                ...baseInfo,
                ...coordInfo,
                外貌: c.外貌,
                最近记忆: lastMemories
            };
            presentChars.push(JSON.stringify(presentData));
        } else {
            const absentData = {
                ...baseInfo,
                最近记忆: formatMemories(absentMemoriesRaw),
                最后记录: `[${lastMem.时间戳}] ${lastMem.内容}`
            };
            absentChars.push(JSON.stringify(absentData));
        }
    });

    if (teammates.length > 0) contextOutput += `\n>>> 【队友】 (最优先):\n${teammates.join('\n')}\n`;
    if (focusChars.length > 0) contextOutput += `\n>>> 【特别关注/强制】:\n${focusChars.join('\n')}\n`;
    if (presentChars.length > 0) contextOutput += `\n>>> 【当前在场】:\n${presentChars.join('\n')}\n`;
    if (absentChars.length > 0) contextOutput += `\n>>> 【已知但是不在场】:\n${absentChars.join('\n')}\n`;

    return contextOutput;
};

/**
 * 地图上下文 (Optimized: Raw Data based on Floor)
 */
export const constructMapContext = (gameState: GameState, params: any): string => {
    const floor = typeof params?.forceFloor === 'number' ? params.forceFloor : (gameState.当前楼层 || 0);
    let output = `[地图环境 (Map Context)]\n`;
    output += `当前位置: ${gameState.当前地点} (Floor: ${floor})\n`;
    output += `坐标: X:${gameState.世界坐标?.x || 0} Y:${gameState.世界坐标?.y || 0}\n`;

    const mapData = gameState.地图;
    if (!mapData) return output + '(地图数据丢失)';

    const surfaceLocations = Array.isArray(mapData.surfaceLocations) ? mapData.surfaceLocations : [];
    const routes = Array.isArray(mapData.routes) ? mapData.routes : [];
    const terrain = Array.isArray(mapData.terrain) ? mapData.terrain : [];
    const territories = Array.isArray(mapData.territories) ? mapData.territories : [];
    const filterByFloor = (items: any[]) => items.filter(item => (item?.floor ?? 0) === floor);

    const floorLocations = filterByFloor(surfaceLocations);
    const floorRoutes = filterByFloor(routes);
    const floorTerrain = filterByFloor(terrain);
    const floorTerritories = filterByFloor(territories);

    if (floor === 0) {
        output += `【地表节点 (Surface)】\n${JSON.stringify(floorLocations, null, 2)}\n`;
        output += `【道路 (Routes)】\n${JSON.stringify(floorRoutes, null, 2)}\n`;
        output += `【地形 (Terrain)】\n${JSON.stringify(floorTerrain, null, 2)}\n`;
        output += `【势力范围 (Territories)】\n${JSON.stringify(floorTerritories, null, 2)}`;
    } else {
        const layerInfo = Array.isArray(mapData.wastelandZones)
            ? mapData.wastelandZones.find(l => floor >= l.zoneStart && floor <= l.zoneEnd)
            : null;

        if (layerInfo) {
            output += `【区域信息 (Layer)】${JSON.stringify(layerInfo)}\n`;
        }

        if (floorLocations.length > 0 || floorRoutes.length > 0 || floorTerrain.length > 0 || floorTerritories.length > 0) {
            if (floorLocations.length > 0) output += `【已探明节点 (Nodes)】\n${JSON.stringify(floorLocations, null, 2)}\n`;
            if (floorRoutes.length > 0) output += `【道路 (Routes)】\n${JSON.stringify(floorRoutes, null, 2)}\n`;
            if (floorTerrain.length > 0) output += `【地形 (Terrain)】\n${JSON.stringify(floorTerrain, null, 2)}\n`;
            if (floorTerritories.length > 0) output += `【势力范围 (Territories)】\n${JSON.stringify(floorTerritories, null, 2)}`;
            output = output.trimEnd();
        } else {
            output += `【未知区域】本层尚未探索，请根据 <地图动态绘制> 规则生成节点。`;
        }
    }
    return output;
};

const constructMapBaseContext = (mapData?: WorldMapData): string => {
    if (!mapData) return "";
    const factions = Array.isArray(mapData.factions) ? mapData.factions : [];
    const basePayload = {
        config: mapData.config || undefined,
        factions: factions.length > 0 ? factions : undefined
    };
    if (!basePayload.config && !basePayload.factions) return "";
    return `【地图基础】\n${JSON.stringify(basePayload, null, 2)}`;
};

/**
 * 任务上下文
 */
export const constructTaskContext = (tasks: Task[], params: any): string => {
    if (!tasks || tasks.length === 0) return "";
    
    const activeTasks = tasks.filter(t => t.状态 === 'active');
    const historyTasks = tasks.filter(t => t.状态 !== 'active');

    let output = "[任务列表 (Quest Log)]\n";
    
    if (activeTasks.length > 0) {
        output += `>>> 进行中:\n${JSON.stringify(activeTasks, null, 2)}\n`;
    }
    
    if (historyTasks.length > 0) {
        const compressed = historyTasks.map(t => {
            const lastLog = t.日志 && t.日志.length > 0 ? t.日志[t.日志.length - 1].内容 : "无记录";
            return { 标题: t.标题, 状态: t.状态, 评级: t.评级, 结案摘要: lastLog };
        });
        output += `>>> 历史记录:\n${JSON.stringify(compressed, null, 2)}`;
    }

    return output;
};

export const constructWorldContext = (world: any, params: any): string => {
    return `[世界动态 (World State)]\n` + 
           `异常指数: ${world.异常指数}\n` +
           `公会声望: ${world.公会声望}\n` +
           `头条新闻: ${JSON.stringify(world.头条新闻 || [])}\n` + 
           `街头传闻: ${JSON.stringify(world.街头传闻 || [])}\n` +
           `废土董事会: ${JSON.stringify(world.废土董事会 || {}, null, 0)}\n` +
           `NPC后台跟踪: ${JSON.stringify(world.NPC后台跟踪 || [])}\n` +
           `势力格局: ${JSON.stringify(world.势力格局 || {}, null, 0)}\n` +
           `区域战争: ${JSON.stringify(world.区域战争 || {}, null, 0)}\n` +
           `下次更新: ${world.下次更新 || "待定"}`;
};

const parseGameTimeLabel = (timestamp?: string) => {
    if (!timestamp) return { dayLabel: "未知日", timeLabel: "??:??", sortValue: null as number | null };
    const dayMatch = timestamp.match(/第(\d+)日/);
    const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
    const day = dayMatch ? parseInt(dayMatch[1], 10) : null;
    const hour = timeMatch ? parseInt(timeMatch[1], 10) : null;
    const minute = timeMatch ? parseInt(timeMatch[2], 10) : null;
    const dayLabel = day !== null ? `第${day}日` : "未知日";
    const timeLabel = hour !== null && minute !== null
        ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        : "??:??";
    const sortValue = day !== null && hour !== null && minute !== null
        ? (day * 24 * 60) + (hour * 60) + minute
        : null;
    return { dayLabel, timeLabel, sortValue };
};

export const constructPhoneContext = (phoneState: PhoneState | undefined, params: any): string => {
    let output = "[手机通讯 (Phone)]\n";
    if (!phoneState) return output + "（终端未接入）";

    const device = phoneState.设备 || { 电量: 0, 当前信号: 0 };
    const battery = typeof device.电量 === 'number' ? device.电量 : 0;
    const signal = typeof device.当前信号 === 'number' ? device.当前信号 : 0;
    const status = device.状态 || (battery <= 0 ? 'offline' : 'online');

    output += `终端状态: 电量 ${battery}%, 信号 ${signal}/4, 状态 ${status}\n`;

    const friends = Array.isArray(phoneState.联系人?.好友) ? phoneState.联系人.好友 : [];
    const recent = Array.isArray(phoneState.联系人?.最近) ? phoneState.联系人.最近 : [];
    if (friends.length > 0) output += `好友: ${friends.join(', ')}\n`;
    if (recent.length > 0) output += `最近联系人: ${recent.join(', ')}\n`;

    const perThreadLimit = typeof params?.perThreadLimit === 'number'
        ? params.perThreadLimit
        : (typeof params?.perTargetLimit === 'number' ? params.perTargetLimit : 10);
    const includeMoments = params?.includeMoments !== false;
    const momentLimit = typeof params?.momentLimit === 'number' ? params.momentLimit : 6;
    const includePublicPosts = params?.includePublicPosts !== false;
    const forumLimit = typeof params?.forumLimit === 'number' ? params.forumLimit : 6;

    const targetFilter = Array.isArray(params?.targets) && params.targets.length > 0 ? new Set(params.targets) : null;
    const targetLimits = params?.targetLimits || {};
    const playerName = params?.playerName || 'Player';

    const getSortValue = (m: PhoneMessage) => {
        if (typeof m.timestampValue === 'number') return m.timestampValue;
        const parsed = parseGameTimeLabel(m.时间戳);
        if (parsed.sortValue !== null) return parsed.sortValue;
        return 0;
    };

    const formatMessage = (m: PhoneMessage) => {
        const time = m.时间戳 || '';
        const sender = m.发送者 || '未知';
        let content = m.内容 || '';
        if (m.图片描述) content += ` (图片: ${m.图片描述})`;
        if (m.引用?.内容) {
            const quoteSender = m.引用.发送者 ? `${m.引用.发送者}: ` : '';
            content += ` (引用: ${quoteSender}${m.引用.内容})`;
        }
        return `[${time}] ${sender}: ${content}`;
    };

    const buildThreadBlock = (label: string, threads: PhoneThread[], applyFilter: boolean) => {
        if (!threads || threads.length === 0) return;
        output += `${label}:\n`;
        threads.forEach(t => {
            if (applyFilter && targetFilter && !targetFilter.has(t.标题)) return;
            const limitOverride = typeof targetLimits?.[t.标题] === 'number' ? targetLimits[t.标题] : perThreadLimit;
            const messages = Array.isArray(t.消息) ? t.消息.slice().sort((a, b) => getSortValue(a) - getSortValue(b)) : [];
            const trimmed = limitOverride > 0 ? messages.slice(-limitOverride) : messages;
            if (trimmed.length === 0) return;
            output += `- ${t.标题} (${t.类型})\n`;
            if (t.摘要) {
                const summaryStamp = t.摘要时间 ? ` 截至 ${t.摘要时间}` : '';
                output += `  [摘要${summaryStamp}] ${t.摘要}\n`;
            }
            trimmed.forEach(m => {
                output += `  ${formatMessage(m)}\n`;
            });
        });
    };

    buildThreadBlock("私聊", phoneState.对话?.私聊 || [], true);
    buildThreadBlock("群聊", phoneState.对话?.群聊 || [], false);
    buildThreadBlock("公共频道", phoneState.对话?.公共频道 || [], false);

    if (includeMoments && Array.isArray(phoneState.朋友圈?.帖子)) {
        const friendSet = new Set(friends);
        const feed = phoneState.朋友圈?.仅好友可见
            ? phoneState.朋友圈.帖子.filter(p => p.发布者 === playerName || friendSet.has(p.发布者))
            : phoneState.朋友圈.帖子;
        const sorted = [...feed].sort((a, b) => (a.timestampValue || 0) - (b.timestampValue || 0));
        const trimmed = momentLimit > 0 ? sorted.slice(-momentLimit) : sorted;
        if (trimmed.length > 0) {
            output += "朋友圈动态:\n";
            trimmed.forEach(m => {
                const tags = Array.isArray(m.话题) && m.话题.length > 0 ? ` #${m.话题.join(' #')}` : '';
                output += `- [${m.时间戳 || ''}] ${m.发布者}: ${m.内容}${tags}\n`;
            });
        }
    }

    if (includePublicPosts && Array.isArray(phoneState.公共帖子?.帖子)) {
        const sorted = [...phoneState.公共帖子.帖子].sort((a, b) => (a.timestampValue || 0) - (b.timestampValue || 0));
        const trimmed = forumLimit > 0 ? sorted.slice(-forumLimit) : sorted;
        if (trimmed.length > 0) {
            output += "公共论坛:\n";
            trimmed.forEach(p => {
                const tag = Array.isArray(p.话题) && p.话题.length > 0 ? ` [${p.话题.join('/')}]` : '';
                output += `- [${p.时间戳 || ''}] ${p.发布者}${tag}: ${p.内容}\n`;
            });
        }
    }

    if (Array.isArray(phoneState.待发送) && phoneState.待发送.length > 0) {
        const pendingBrief = phoneState.待发送.slice(0, 6).map(p => `${p.threadId} -> ${p.deliverAt}`).join(' | ');
        output += `\n待发送队列: ${pendingBrief}${phoneState.待发送.length > 6 ? ' ...' : ''}`;
    }

    return output.trim();
};

const constructPhoneSocialBrief = (confidants: Confidant[] = []): string => {
    const list = confidants
        .filter(c => c.已交换联系方式)
        .map(c => ({
            姓名: c.姓名,
            关系: c.关系状态,
            是否在场: !!c.是否在场,
            位置: c.位置详情 || (c.坐标 ? `(${Math.round(c.坐标.x)},${Math.round(c.坐标.y)})` : undefined)
        }));
    return `[手机联系人摘要]\n${list.length > 0 ? JSON.stringify(list, null, 2) : '（暂无已交换联系方式的联系人）'}`;
};

const constructPhoneTrackingBrief = (gameState: GameState): string => {
    const tracks = Array.isArray(gameState.世界?.NPC后台跟踪) ? gameState.世界.NPC后台跟踪 : [];
    if (tracks.length === 0) return `[NPC后台跟踪]\n（暂无在跟踪的NPC行动）`;
    const contactSet = new Set((gameState.社交 || []).filter(c => c.已交换联系方式).map(c => c.姓名));
    const filtered = tracks.filter(t => !contactSet.size || contactSet.has(t.NPC));
    const trimmed = (filtered.length > 0 ? filtered : tracks).slice(0, 8).map(t => ({
        NPC: t.NPC,
        当前行动: t.当前行动,
        位置: t.位置,
        进度: t.进度,
        预计完成: t.预计完成
    }));
    return `[NPC后台跟踪]\n${JSON.stringify(trimmed, null, 2)}`;
};

const constructPhoneStoryBrief = (gameState: GameState): string => {
    const story = gameState.剧情 || ({} as any);
    const main = story.主线 || {};
    const guide = story.引导 || {};
    return `[剧情摘要]\n主线: ${main.当前阶段 || '未知'} / ${main.关键节点 || '未知'}\n引导目标: ${guide.当前目标 || '未知'}`;
};

const constructPhoneEnvironmentBrief = (gameState: GameState): string => {
    return `[当前环境]\n时间: ${gameState.当前日期 || ''} ${gameState.游戏时间 || ''}\n地点: ${gameState.当前地点 || '未知'} / 楼层: ${gameState.当前楼层 ?? '未知'} / 天气: ${gameState.天气 || '未知'}\n战斗中: ${gameState.战斗?.是否战斗中 ? '是' : '否'}`;
};

const constructPhoneWorldBrief = (gameState: GameState): string => {
    const world = gameState.世界 || ({} as any);
    const news = Array.isArray(world.头条新闻) ? world.头条新闻.slice(0, 5) : [];
    const rumors = Array.isArray(world.街头传闻) ? world.街头传闻.slice(0, 5) : [];
    return `[世界情报摘要]\n头条: ${news.length > 0 ? news.join(' / ') : '无'}\n传闻: ${rumors.length > 0 ? rumors.join(' / ') : '无'}`;
};

const constructPhoneWorldview = (settings: AppSettings): string => {
    const modules = (settings.promptModules || [])
        .filter(m => m.group === '世界观设定' && m.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (modules.length === 0) return '';
    return `[世界观设定]\n${modules.map(m => m.content).join('\n\n')}`;
};

const constructPhoneMemoryBrief = (memory: MemorySystem | undefined): string => {
    if (!memory) return '';
    const short = Array.isArray(memory.shortTerm) ? memory.shortTerm.slice(-8) : [];
    const medium = Array.isArray(memory.mediumTerm) ? memory.mediumTerm.slice(-4) : [];
    const long = Array.isArray(memory.longTerm) ? memory.longTerm.slice(-2) : [];
    if (short.length === 0 && medium.length === 0 && long.length === 0) return '';
    const shortText = short.length > 0
        ? short.map(s => `${s.timestamp || ''} ${s.content}`.trim()).join(' | ')
        : '无';
    const mediumText = medium.length > 0 ? medium.join(' | ') : '无';
    const longText = long.length > 0 ? long.join(' | ') : '无';
    return `[记忆摘要]\n短期: ${shortText}\n中期: ${mediumText}\n长期: ${longText}`;
};

export const assemblePhonePrompt = (
    playerInput: string,
    gameState: GameState,
    settings: AppSettings
): string => {
    const phoneContext = constructPhoneContext(gameState.手机, { perThreadLimit: 10, includeMoments: true, includePublicPosts: true, forumLimit: 6, playerName: gameState.角色?.姓名 || 'Player' });
    const socialBrief = constructPhoneSocialBrief(gameState.社交);
    const trackingBrief = constructPhoneTrackingBrief(gameState);
    const envBrief = constructPhoneEnvironmentBrief(gameState);
    const storyBrief = constructPhoneStoryBrief(gameState);
    const worldBrief = constructPhoneWorldBrief(gameState);
    const worldview = constructPhoneWorldview(settings);
    const memoryBrief = constructPhoneMemoryBrief(gameState.记忆);
    const cot = P_PHONE_COT || "";
    return [
        P_PHONE_SYSTEM,
        cot,
        worldview,
        envBrief,
        storyBrief,
        worldBrief,
        memoryBrief,
        trackingBrief,
        socialBrief,
        phoneContext,
        `[用户输入]\n${playerInput}`
    ].filter(Boolean).join('\n\n');
};

export const constructCombatContext = (combat: any, params: any): string => {
    if (!combat || !combat.是否战斗中) return "";
    const rawEnemies = combat.敌方;
    const enemies = Array.isArray(rawEnemies) ? rawEnemies : (rawEnemies ? [rawEnemies] : []);
    const formatEnemy = (enemy: any, index: number) => {
        const currentHp = typeof enemy.当前生命值 === 'number' ? enemy.当前生命值 : (enemy.生命值 ?? 0);
        const maxHp = typeof enemy.最大生命值 === 'number' ? enemy.最大生命值 : Math.max(currentHp || 0, 1);
        const currentMp = typeof enemy.当前精神MP === 'number' ? enemy.当前精神MP : (enemy.精神力 ?? null);
        const maxMp = typeof enemy.最大精神MP === 'number' ? enemy.最大精神MP : (enemy.最大精神力 ?? null);
        return [
            `#${index + 1} ${enemy.名称 || '未知敌人'}`,
            `- 生命: ${currentHp}/${maxHp}`,
            `- 精神MP: ${currentMp !== null && maxMp !== null ? `${currentMp}/${maxMp}` : '未知'}`,
            `- 攻击力: ${enemy.攻击力 ?? '未知'}`,
            `- 技能: ${(enemy.技能 && enemy.技能.length > 0) ? enemy.技能.join(' / ') : '无'}`,
            `- 描述: ${enemy.描述 || '无'}`,
        ].join('\n');
    };
    const enemyBlock = enemies.length > 0
        ? enemies.map(formatEnemy).join('\n\n')
        : "无敌对目标";
    const battleLog = combat.战斗记录 ? combat.战斗记录.slice(-5).join(' | ') : "";
    return `[战斗状态 (Combat State)]\n${enemyBlock}\n\n战况记录: ${battleLog}`;
};

export const constructMemoryContext = (memory: MemorySystem, logs: LogEntry[], config: MemoryConfig, params: any): string => {
    let output = "[记忆流 (Memory Stream)]\n";
    const instantTurnLimit = config.instantLimit || 10; // Number of turns
    const shortTermEntryLimit = config.shortTermLimit || 30; // Number of summaries
    const excludeTurnIndex = typeof params?.excludeTurnIndex === 'number' ? params.excludeTurnIndex : null;
    const excludePlayerInput = params?.excludePlayerInput === true;
    const fallbackGameTime = typeof params?.fallbackGameTime === 'string' ? params.fallbackGameTime : "";
    const filteredLogs = (excludePlayerInput && excludeTurnIndex !== null)
        ? logs.filter(l => !(l.sender === 'player' && (l.turnIndex || 0) === excludeTurnIndex))
        : logs;

    const formatShortTermLabel = (entry: MemoryEntry) => {
        const stamp = entry.timestamp || "";
        const match = stamp.match(/第(\d+)日\s*(\d{1,2}:\d{2})/);
        if (match) return `第${match[1]}日${match[2]}`;
        if (stamp) return stamp.replace(/\s+/g, "");
        if (!stamp && fallbackGameTime) return fallbackGameTime.replace(/\s+/g, "");
        if (typeof entry.turnIndex === 'number') return `第${entry.turnIndex}日??:??`;
        return "第?日??:??";
    };
    
    // 1. Long Term (All)
    if (memory.longTerm?.length) {
        output += `【长期记忆 (Long Term)】:\n${memory.longTerm.join('\n')}\n\n`;
    }
    
    // 2. Medium Term (All)
    if (memory.mediumTerm?.length) {
        output += `【中期记忆 (Medium Term)】:\n${memory.mediumTerm.join('\n')}\n\n`;
    }

    // Determine Turn Cutoff for Instant vs Short Term
    // We want the last N turns to be Instant.
    // Get all unique turn indices from logs (assuming logs are sorted by time, or sort them)
    // Actually, simply scanning logs is safer.
    const allTurns = Array.from(new Set(filteredLogs.map(l => l.turnIndex || 0))).sort((a, b) => b - a);
    const activeInstantTurns = allTurns.slice(0, instantTurnLimit);
    // The cutoff is the smallest turn number in the active set. 
    // Anything smaller than this goes to Short Term Context.
    const minInstantTurn = activeInstantTurns.length > 0 ? activeInstantTurns[activeInstantTurns.length - 1] : 0;

    // 3. Short Term (Recent Summaries EXCLUDING Instant Turns)
    // Filter out summaries that correspond to the active instant turns (to avoid overlap)
    // We want the M summaries *before* minInstantTurn.
    const validShortTerms = memory.shortTerm
        .filter(m => (m.turnIndex || 0) < minInstantTurn)
        .slice(-shortTermEntryLimit); // Take the last M of the older turns
        
    if (validShortTerms.length > 0) {
        output += `【短期记忆 (Short Term Summary)】:\n${validShortTerms.map(m => `[${formatShortTermLabel(m)}]${m.content}`).join('\n')}\n\n`;
    }

    // 4. Instant Logs (Grouped by Turn)
    // Filter logs that belong to the active instant turns
    const instantLogs = filteredLogs.filter(l => (l.turnIndex || 0) >= minInstantTurn);
    
    if (instantLogs.length > 0) {
        output += `【即时剧情 (Instant Log - Recent ${activeInstantTurns.length} Turns)】:\n`;
        
        let currentTurn = -1;
        instantLogs.forEach(l => {
            const turn = l.turnIndex || 0;
            // Group header
            if (turn !== currentTurn) {
                currentTurn = turn;
                const logTime = l.gameTime || fallbackGameTime || '??:??';
                output += `\n[Turn ${currentTurn} | ${logTime}]\n`;
            }
            output += `[${l.sender}]: ${l.text}\n`;
        });
    } else {
        output += "【即时剧情】: (暂无新消息)";
    }

    return output.trim();
};

export const generateSingleModuleContext = (mod: ContextModuleConfig, gameState: GameState, settings: AppSettings, commandHistory: string[] = [], playerInput: string = ""): string => {
    switch(mod.type) {
        case 'SYSTEM_PROMPTS':
            // Recalculate system prompts based on settings & state
            const isStart = (gameState.回合数 || 1) <= 1; 
            const difficulty = gameState.游戏难度 || Difficulty.NORMAL;
            const hasFamilia = gameState.角色.所属势力 && gameState.角色.所属势力 !== '无' && gameState.角色.所属势力 !== 'None';
            
            // Map Generation Check
            const currentFloor = gameState.当前楼层 || 0;
            const mapData = gameState.地图;
            // Check if map data exists for THIS floor
            const hasMapDataForFloor = currentFloor === 0 
                ? true 
                : mapData.surfaceLocations.some(l => l.floor === currentFloor);
            
            let activePromptModules = settings.promptModules.filter(m => {
                if (!m.isActive) {
                    // Difficulty / Physiology Logic
                    if (m.group === '难度系统' || m.group === '生理系统' || m.group === '判定系统') {
                         return false;
                    }
                     // Familia Logic -> Faction Logic
                    if (m.id === 'sys_familia_join' && hasFamilia) return false; // Hide join guide if already in faction
                    
                    return false;
                }
                return true;
            });
            
             // Sort modules by order
            const sortedModules = activePromptModules.sort((a, b) => (a.order || 0) - (b.order || 0));
            return sortedModules.map(m => m.content).join('\n\n');
        
        case 'WORLD_CONTEXT':
             return constructWorldContext(gameState.世界, mod.params);

        case 'MAP_CONTEXT':
             return constructMapContext(gameState, mod.params);

        case 'SOCIAL_CONTEXT':
             return constructSocialContext(gameState.社交, mod.params);
             
        case 'TASK_CONTEXT':
             return constructTaskContext(gameState.任务, mod.params);

        case 'MEMORY_CONTEXT':
             return constructMemoryContext(gameState.记忆, [], settings.memoryConfig || DEFAULT_MEMORY_CONFIG, mod.params); // Logs passed separately usually

        case 'COMBAT_CONTEXT':
             return constructCombatContext(gameState.战斗, mod.params);
             
        default:
            return '';
    }
};

export const buildFullContext = (
    contextConfig: ContextModuleConfig[],
    gameState: GameState, 
    settings: AppSettings,
    commandHistory: string[], 
    playerInput: string,
    logs: LogEntry[]
): string => {
    // 1. System Prompts
    const sysModule = contextConfig.find(c => c.type === 'SYSTEM_PROMPTS');
    const sysPrompt = sysModule ? generateSingleModuleContext(sysModule, gameState, settings, commandHistory, playerInput) : "";
    
    // 2. Build other contexts
    const otherContexts = contextConfig
        .filter(c => c.type !== 'SYSTEM_PROMPTS')
        .map(c => {
             // Inject logs for memory context if needed
             if (c.type === 'MEMORY_CONTEXT') {
                 return constructMemoryContext(gameState.记忆, logs, settings.memoryConfig || DEFAULT_MEMORY_CONFIG, c.params);
             }
             return generateSingleModuleContext(c, gameState, settings, commandHistory, playerInput);
        })
        .filter(c => c.length > 0)
        .join('\n\n');

    // 3. Command History & Input (Standard Format)
    // Note: This logic might vary, but for now we follow a standard pattern
    let finalPrompt = sysPrompt + "\n\n" + otherContexts;
    
    // Append History if not empty
    if (commandHistory.length > 0) {
        finalPrompt += "\n\n[历史指令 (Command History)]\n" + commandHistory.join('\n');
    }
    
    // Append User Input
    if (playerInput) {
        finalPrompt += "\n\n[用户输入 (User Input)]\n" + playerInput;
    }

    return finalPrompt;
};

// --- Helper Functions ---

// --- Helper Functions - Duplicates Removed ---
// extractThinkingBlocks, parseAIResponseText, mergeThinkingSegments are already defined above.

export const resolveServiceConfig = (settings: AppSettings, serviceName: keyof AppSettings['aiConfig']['services']): AIEndpointConfig => {
    const globalConfig = settings.aiConfig.unified;
    const mode = settings.aiConfig.mode || 'unified';

    if (mode === 'unified') return globalConfig;

    if (settings.aiConfig.useServiceOverrides && settings.aiConfig.serviceOverridesEnabled?.[serviceName]) {
        return settings.aiConfig.services[serviceName] || globalConfig;
    }
    
    return globalConfig;
};

// --- AI Dispatch ---

import OpenAI from 'openai';

export const dispatchAIRequest = async (
    prompt: string, 
    config: AIEndpointConfig, 
    signal?: AbortSignal,
    onStream?: (chunk: string) => void
): Promise<string> => {
    if (!config || !config.apiKey) throw new Error("API Key missing");

    // Check for DeepSeek or OpenAI provider
    const isGemini = !config.provider || config.provider === 'gemini';
    
    if (isGemini) {
        // --- GOOGLE GEMINI IMPLEMENTATION ---
        console.log("[AI] Dispatching Gemini Request...", { model: config.modelId });
        
        try {
            // Fix: Constructor expects string, not object
            const client = new GoogleGenerativeAI(config.apiKey);
            const modelId = config.modelId || 'gemini-1.5-flash';
            const model = client.getGenerativeModel({ model: modelId });
            
            if (onStream) {
                console.log("[AI] Starting Gemini Stream...");
                const result = await model.generateContentStream(prompt);
                let fullText = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullText += chunkText;
                    onStream(fullText);
                }
                console.log("[AI] Gemini Stream Completed", { length: fullText.length });
                return fullText;
            } else {
                console.log("[AI] Starting Gemini Standard Request...");
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                console.log("[AI] Gemini Request Completed", { length: text.length });
                return text;
            }
        } catch (e: any) {
            if (signal?.aborted) throw new Error("Aborted");
            console.error("Gemini Request Failed", e);
            throw e;
        }
    } else {
        // --- OPENAI / DEEPSEEK / CUSTOM IMPLEMENTATION ---
        
        try {
            const baseURL = config.baseUrl || 
                (config.provider === 'deepseek' ? 'https://api.deepseek.com/chat/completions' : 
                 config.provider === 'openai' ? 'https://api.openai.com/v1' : undefined);

            const openai = new OpenAI({
                apiKey: config.apiKey,
                baseURL: baseURL,
                dangerouslyAllowBrowser: true // Required for client-side usage
            });

            const modelId = config.modelId || 
                (config.provider === 'deepseek' ? 'deepseek-chat' : 'gpt-3.5-turbo');

            if (onStream) {
                const stream = await openai.chat.completions.create({
                    model: modelId,
                    messages: [{ role: 'user', content: prompt }],
                    stream: true,
                });

                let fullText = "";
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        fullText += content;
                        onStream(fullText);
                    }
                }
                return fullText;
            } else {
                const completion = await openai.chat.completions.create({
                    model: modelId,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                });
                return completion.choices[0]?.message?.content || "";
            }
        } catch (e: any) {
            if (signal?.aborted) throw new Error("Aborted");
            console.error(`${config.provider || 'OpenAI'} Request Failed`, e);
            throw e;
        }
    }
};

// --- Main Generation Functions ---

export const generateGameMasterResponse = async (
    input: string, 
    state: GameState, 
    settings: AppSettings, 
    additionalContext: string, 
    commandsOverride: string[] = [],
    signal?: AbortSignal,
    onStream?: (chunk: string) => void
): Promise<AIResponse> => {
    const config = resolveServiceConfig(settings, 'world');
    const prompt = buildFullContext(settings.contextConfig.modules, state, settings, [], input, []) + "\n" + additionalContext;
    
    const responseText = await dispatchAIRequest(prompt, config, signal, onStream);
    
    const { thinking, cleaned } = extractThinkingBlocks(responseText);
    const parsedResult = parseAIResponseText(cleaned);
    
    if (!parsedResult.response) {
        return {
            logs: [],
            tavern_commands: [],
            rawResponse: responseText,
            thinking
        };
    }
    
    return {
        ...parsedResult.response,
        rawResponse: responseText,
        thinking
    };
};

export const generatePhoneResponse = async (
    input: string,
    state: GameState,
    settings: AppSettings,
    activeThreadId?: string | null
): Promise<PhoneAIResponse> => {
    // Placeholder implementation to fix build
    return { allowed: true, messages: [] };
};

export const generateWorldInfoResponse = async (...args: any[]) => ({ 
    event: "test", 
    tavern_commands: [], 
    logs: [] 
});

export const generateMemorySummary = async (...args: any[]) => ({ summary: "test" });

export const assembleFullPrompt = buildFullContext;
