
import { InventoryItem } from './item';

// --- Basic Geo Types ---
export interface GeoPoint {
    x: number;
    y: number;
}

// --- Map Features ---
export interface MapFaction {
  id: string;
  name: string; 
  color: string; 
  borderColor: string;
  textColor: string;
  emblem?: string; 
  description: string;
  strength: number; 
}

export interface TerritoryData {
  id: string;
  factionId: string;
  name: string;
  boundary?: string; // SVG path (legacy)
  centerX: number;
  centerY: number;
  color: string;
  opacity?: number;
  floor?: number;
  shape?: 'SECTOR' | 'CIRCLE' | 'POLYGON';
  sector?: { startAngle: number; endAngle: number; innerRadius?: number; outerRadius: number };
  points?: GeoPoint[];
}

export interface TerrainFeature {
  id: string;
  type: 'WALL' | 'WATER' | 'MOUNTAIN' | 'FOREST' | 'OBSTACLE';
  name: string;
  path: string; 
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  floor?: number;
}

export interface TradeRoute {
  id: string;
  name: string;
  path: string; 
  type: 'MAIN_STREET' | 'ALLEY' | 'TRADE_ROUTE';
  width: number;
  color: string;
  floor?: number;
}

export interface WorldLocation {
    id: string;
    name: string; 
    type: 'LANDMARK' | 'SHOP' | 'GUILD' | 'FAMILIA_HOME' | 'SLUM' | 'STREET' | 'WASTELAND_ENTRANCE' | 'SAFE_ZONE';
    coordinates: GeoPoint; 
    radius: number; 
    description: string;
    icon?: string;
    floor?: number; 
}


export interface WastelandZone {
    zoneStart: number;
    zoneEnd: number;
    name: string; 
    description: string;
    dangerLevel: string;
    landmarks: { zone: number, name: string, type: 'SAFE_ZONE' | 'BOSS' | 'POINT' }[];
}


export interface WorldMapConfig {
  width: number;
  height: number;
}

// Keep technical map data in English for compatibility with the map renderer
export interface WorldMapData {
    config: WorldMapConfig;
    factions: MapFaction[];
    territories: TerritoryData[];
    terrain: TerrainFeature[];
    routes: TradeRoute[];
    surfaceLocations: WorldLocation[];
    wastelandZones: WastelandZone[];
}


export interface BoardMeetingState {
  下次会议开启时间: string;
  会议主题: string;
  讨论内容: { 角色: string; 对话: string }[];
  最终结果: string;
}

export interface NpcBackgroundTracking {
  NPC: string;
  当前行动: string;
  位置?: string;
  进度?: string;
  预计完成?: string;
}

export interface FactionTierState {
  S级: string[];
  A级: string[];
  B级至I级: string[];
  备注?: string;
}

export interface ZoneWarState {
  状态: '未开始' | '筹备' | '进行中' | '结束' | string;
  参战势力: string[];
  形式: string;
  争夺目标: string;
  开始时间?: string;
  结束时间?: string;
  结果?: string;
  备注?: string;
}

// Refactor Business States to Chinese
export interface WorldState {
  异常指数: number; // tensionLevel
  公会声望: number; // publicOpinion - replaced 眷族声望
  头条新闻: string[]; // breakingNews
  街头传闻: { 主题: string; 传播度: number }[]; // activeRumors
  废土董事会: BoardMeetingState; // replaced 诸神神会
  NPC后台跟踪: NpcBackgroundTracking[];
  势力格局?: FactionTierState; // replaced 派阀格局
  区域战争?: ZoneWarState; // replaced 战争游戏
  下次更新?: string; // nextUpdate
}

// === WASTELAND: Shelter Management System ===
export interface Facility {
  id: string;
  名称: string;
  类型: '生产' | '防御' | '生活' | '医疗' | '研发';
  等级: number;
  状态: '运行中' | '损坏' | '停用';
  产出?: string; // 每回合产出的资源
  维护成本?: { 能源?: number; 金属?: number };
}

export interface Human {
  id: string;
  姓名: string;
  年龄: number;
  性别: string;
  职业: '农民' | '工程师' | '医生' | '战士' | '无';
  健康: number; // 0-100
  士气: number; // 0-100
  技能: string[];
  状态: '正常' | '受伤' | '生病' | '疲惫';
}

// ShelterState replaced by FactionState alias
// Previous Human/Facility interfaces kept if needed by FactionState facilities


export interface FactionState {
  名称: string;
  等级: string; // "I" - "S" or "Tier 1" - "Tier 5"
  领袖: string; // Leader / God
  资金: number; // Credits / Valis
  设施状态: Record<string, any>;
  仓库: InventoryItem[];
  
  // Optional Shelter Management Extensions
  资源?: {
    食物: number;
    水: number;
    金属: number;
    能源: number;
    医疗用品: number;
  };
  当前人口?: number;
  最大容量?: number;
  信用点?: number; // Legacy alias for 资金
}

// Keep old name for backwards compatibility during transition
export type FamiliaState = FactionState;
export type ShelterState = FactionState; // Alias Shelter to Faction for now to merge concepts
