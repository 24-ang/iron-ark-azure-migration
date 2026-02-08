
import { Direction, Enemy, WorldMapData, WorldLocation, WastelandZone, MapFaction, TerritoryData, TradeRoute, TerrainFeature } from "../types";


// Helper to get opposite direction
export const getOppositeDir = (dir: Direction): Direction => {
  switch (dir) {
    case 'North': return 'South';
    case 'South': return 'North';
    case 'East': return 'West';
    case 'West': return 'East';
  }
};

// --- Combat Helper ---
export const generateEnemy = (floor: number, isBoss: boolean = false): Enemy => {
  const baseHp = 50 + (floor * 20);
  const baseAtk = 8 + (floor * 2);
  const baseMp = 20 + (floor * 6);
  const level = Math.max(1, Math.floor((floor - 1) / 12) + 1);

  if (isBoss) {
    return {
      id: 'boss_' + Date.now(),
      名称: `第${floor}层 迷宫孤王`,
      当前生命值: baseHp * 3,
      最大生命值: baseHp * 3,
      当前精神MP: baseMp * 2,
      最大精神MP: baseMp * 2,
      攻击力: Math.round(baseAtk * 1.5),
      描述: "统治该楼层的强大怪物。",
      图片: "https://images.unsplash.com/photo-1620560024765-685b306b3a0c?q=80&w=600&auto=format&fit=crop",
      等级: level + 1,
      技能: ["咆哮震慑", "重击"]
    };
  }

  const commonEnemies = [
    { name: "狗头人", desc: "如同猎犬般的人形怪物。", img: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=400" },
    { name: "哥布林", desc: "身材矮小但生性残忍。", img: "https://images.unsplash.com/photo-1591185854884-1d37452d3774?q=80&w=400" },
    { name: "杀人蚁", desc: "拥有坚硬甲壳的群居怪物。", img: "https://images.unsplash.com/photo-1550747528-cdb45925b3f7?q=80&w=400" },
    { name: "弥诺陶洛斯", desc: "发狂的牛头人怪物。", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400" }
  ];

  const template = commonEnemies[Math.floor(Math.random() * commonEnemies.length)];

  return {
    id: 'enemy_' + Date.now(),
    名称: template.name,
    当前生命值: baseHp + Math.floor(Math.random() * 20),
    最大生命值: baseHp + Math.floor(Math.random() * 20),
    当前精神MP: baseMp + Math.floor(Math.random() * 10),
    最大精神MP: baseMp + Math.floor(Math.random() * 10),
    攻击力: baseAtk,
    描述: template.desc,
    图片: template.img,
    等级: level,
    技能: ["突袭", "连击"]
  };
};

// --- SVG Path Helpers ---

/**
 * 创建扇形区域路径 (Sector)
 * 角度定义 (标准SVG坐标系):
 * 0度 = 3点钟 (东)
 * 90度 = 6点钟 (南)
 * 180度 = 9点钟 (西)
 * 270度 = 12点钟 (北)
 */
const createSectorPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number, innerR: number = 0): string => {
    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Outer Arc
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    // Inner Arc
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    // Large Arc Flag (if > 180 degrees)
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    // SVG Path Command
    // M (Move to Start Outer)
    // A (Arc to End Outer)
    // L (Line to End Inner)
    // A (Arc Back to Start Inner, sweep flag 0 for reverse)
    // Z (Close)
    return [
        `M ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
        `Z`
    ].join(' ');
};

const createCirclePath = (cx: number, cy: number, r: number): string => {
    return [
        `M ${cx - r}, ${cy}`,
        `a ${r},${r} 0 1,0 ${r * 2},0`,
        `a ${r},${r} 0 1,0 -${r * 2},0`
    ].join(' ');
};

const createPolylinePath = (points: { x: number; y: number }[]): string => {
    if (points.length === 0) return '';
    const [first, ...rest] = points;
    return [
        `M ${first.x} ${first.y}`,
        ...rest.map(p => `L ${p.x} ${p.y}`)
    ].join(' ');
};

// --- 欧拉丽全地图生成 (Strict layout) ---

// --- 废土世界地图生成 (Wasteland Map Generation) ---

export const generateWastelandMap = (): WorldMapData => {
    // 基础配置
    const MAP_SIZE = 50000; 
    const CENTER_X = 25000;  
    const CENTER_Y = 25000;
    
    // 半径参数
    const CITY_RADIUS = 20000;  // 钢铁方舟外墙
    const PLAZA_RADIUS = 2000;  // 核心区
    const BABEL_RADIUS = 500;   // 信号塔基座

    // 1. 势力定义 (Factions - Wasteland Re-theme)
    const factions: MapFaction[] = [
        { id: 'f_guild', name: '方舟管理局', color: '#1d4ed8', borderColor: '#1e3a8a', textColor: '#dbeafe', description: '钢铁方舟的统治核心', strength: 100 }, // Was Guild
        { id: 'f_loki', name: '黄昏掠夺者', color: '#dc2626', borderColor: '#7f1d1d', textColor: '#fee2e2', description: '北方废墟的霸主', strength: 95 }, // Was Loki
        { id: 'f_freya', name: '猩红佣兵团', color: '#ca8a04', borderColor: '#713f12', textColor: '#fef9c3', description: '崇尚力量的战斗狂人', strength: 98 }, // Was Freya
        { id: 'f_heph', name: '齿轮工会', color: '#b91c1c', borderColor: '#7f1d1d', textColor: '#fecaca', description: '掌握核心技术的工匠组织', strength: 85 }, // Was Hephaestus
        { id: 'f_ishtar', name: '霓虹辛迪加', color: '#d946ef', borderColor: '#86198f', textColor: '#fae8ff', description: '控制娱乐与违禁品的黑帮', strength: 80 }, // Was Ishtar
        { id: 'f_ganesha', name: '治安维持局', color: '#15803d', borderColor: '#14532d', textColor: '#dcfce7', description: '维护方舟秩序的警察部队', strength: 90 }, // Was Ganesha
        { id: 'f_hestia', name: '拾荒者互助会', color: '#3b82f6', borderColor: '#1d4ed8', textColor: '#ffffff', description: '底层流浪者的避风港', strength: 10 }, // Was Hestia
        { id: 'f_slums', name: '生锈区', color: '#525252', borderColor: '#171717', textColor: '#a3a3a3', description: '被遗忘的贫民窟', strength: 30 }, // Was Slums
        { id: 'f_neutral', name: '自由贸易区', color: '#64748b', borderColor: '#334155', textColor: '#e2e8f0', description: '商业/居住', strength: 50 }, // Was Neutral
    ];

    // 2. 区域划分 (Territories - Wasteland Re-theme)
    // Keep geometry but rename
    const territories: TerritoryData[] = [
        // 北 (247.5° - 292.5°): 黄昏掠夺者
        {
            id: 't_north', factionId: 'f_loki', name: '北区 (掠夺者领地)',
            centerX: CENTER_X, centerY: CENTER_Y - 10000, color: factions[1].color,
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 247.5, 292.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 247.5, endAngle: 292.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.2, floor: 0
        },
        // 东北 (292.5° - 337.5°): 猩红佣兵团
        {
            id: 't_northeast', factionId: 'f_freya', name: '东北工业废墟',
            centerX: CENTER_X + 8000, centerY: CENTER_Y - 8000, color: factions[2].color,
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 292.5, 337.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 292.5, endAngle: 337.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.2, floor: 0
        },
        // 东 (337.5° - 22.5°): 生锈区
        {
            id: 't_east', factionId: 'f_slums', name: '东区 (生锈区)',
            centerX: CENTER_X + 10000, centerY: CENTER_Y, color: factions[7].color,
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, -22.5, 22.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: -22.5, endAngle: 22.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.3, floor: 0
        },
        // 东南 (22.5° - 67.5°): 霓虹辛迪加
        {
            id: 't_southeast', factionId: 'f_ishtar', name: '东南娱乐区',
            centerX: CENTER_X + 8000, centerY: CENTER_Y + 8000, color: factions[4].color,
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 22.5, 67.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 22.5, endAngle: 67.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.25, floor: 0
        },
        // 南 (67.5° - 112.5°): 正门/自由区
        {
            id: 't_south', factionId: 'f_neutral', name: '南门 (检疫区)',
            centerX: CENTER_X, centerY: CENTER_Y + 12000, color: '#94a3b8',
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 67.5, 112.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 67.5, endAngle: 112.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.15, floor: 0
        },
        // 西南 (112.5° - 157.5°): 齿轮工会
        {
            id: 't_southwest', factionId: 'f_heph', name: '西南重工区',
            centerX: CENTER_X - 8000, centerY: CENTER_Y + 8000, color: factions[3].color,
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 112.5, 157.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 112.5, endAngle: 157.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.2, floor: 0
        },
        // 西 (157.5° - 202.5°): 商业区
        {
            id: 't_west', factionId: 'f_neutral', name: '西区 (黑市)',
            centerX: CENTER_X - 10000, centerY: CENTER_Y, color: '#60a5fa',
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 157.5, 202.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 157.5, endAngle: 202.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.15, floor: 0
        },
        // 西北 (202.5° - 247.5°): 管理局
        {
            id: 't_northwest', factionId: 'f_guild', name: '西北行政区',
            centerX: CENTER_X - 8000, centerY: CENTER_Y - 8000, color: factions[0].color,
            boundary: createSectorPath(CENTER_X, CENTER_Y, CITY_RADIUS, 202.5, 247.5, PLAZA_RADIUS),
            shape: 'SECTOR',
            sector: { startAngle: 202.5, endAngle: 247.5, innerRadius: PLAZA_RADIUS, outerRadius: CITY_RADIUS },
            opacity: 0.2, floor: 0
        }
    ];

    // 3. 地形特征 (Terrain)
    const terrain: TerrainFeature[] = [
        {
            id: 'wall_outer', name: '方舟装甲壁', type: 'WALL',
            color: 'none', strokeColor: '#e2e8f0', strokeWidth: 80,
            path: createCirclePath(CENTER_X, CENTER_Y, CITY_RADIUS), floor: 0
        },
        {
            id: 'babel_base', name: '核心枢纽', type: 'OBSTACLE',
            color: '#f8fafc', strokeColor: '#93c5fd', strokeWidth: 20,
            path: createCirclePath(CENTER_X, CENTER_Y, PLAZA_RADIUS), floor: 0
        }
    ];

    // 4. 关键地点 (Locations - Wasteland Re-theme)
    const surfaceLocations: WorldLocation[] = [
        // 中央
        { id: 'loc_babel', name: '方舟核心塔', type: 'LANDMARK', coordinates: { x: CENTER_X, y: CENTER_Y }, radius: BABEL_RADIUS, description: '旧世界的奇迹，控制着整个方舟的维生系统。', icon: 'tower', floor: 0 },
        
        // 北 
        { id: 'loc_twilight', name: '黄昏哨站', type: 'FAMILIA_HOME', coordinates: { x: CENTER_X, y: CENTER_Y - 12000 }, radius: 1500, description: '黄昏掠夺者的前哨基地。', icon: 'flag', floor: 0 },
        
        // 东北
        { id: 'loc_folkvangr', name: '赤色要塞', type: 'FAMILIA_HOME', coordinates: { x: CENTER_X + 10000, y: CENTER_Y - 10000 }, radius: 1500, description: '猩红佣兵团的军事禁区。', icon: 'flag', floor: 0 },
        
        // 东
        { id: 'loc_daedalus', name: '废铁城寨', type: 'SLUM', coordinates: { x: CENTER_X + 14000, y: CENTER_Y }, radius: 2500, description: '用废铁违章搭建的迷宫，生锈区的核心。', icon: 'skull', floor: 0 },
        
        // 东南
        { id: 'loc_ishtar', name: '霓虹街区', type: 'LANDMARK', coordinates: { x: CENTER_X + 10000, y: CENTER_Y + 10000 }, radius: 3000, description: '充满全息广告和非法生意的红灯区。', icon: 'heart', floor: 0 },
        
        // 南
        { id: 'loc_gate', name: '隔离气闸', type: 'STREET', coordinates: { x: CENTER_X, y: CENTER_Y + 18000 }, radius: 1000, description: '连接外部废土的巨大气闸门。', icon: 'door', floor: 0 },
        { id: 'loc_inn', name: '胶囊旅馆区', type: 'SHOP', coordinates: { x: CENTER_X, y: CENTER_Y + 14000 }, radius: 1200, description: '提供廉价休眠舱的区域。', icon: 'bed', floor: 0 },
        
        // 西南
        { id: 'loc_heph', name: '大锻炉', type: 'SHOP', coordinates: { x: CENTER_X - 10000, y: CENTER_Y + 10000 }, radius: 1500, description: '齿轮工会的重工业生产线。', icon: 'hammer', floor: 0 },
        { id: 'loc_church', name: '旧数据中心', type: 'FAMILIA_HOME', coordinates: { x: CENTER_X - 13000, y: CENTER_Y + 13000 }, radius: 500, description: '废弃的服务器机房，拾荒者的据点。', icon: 'home', floor: 0 },
        
        // 西
        { id: 'loc_pub', name: '幸存者酒吧', type: 'SHOP', coordinates: { x: CENTER_X - 9000, y: CENTER_Y }, radius: 600, description: '情报与酒精的集散地。', icon: 'beer', floor: 0 },
        
        // 西北
        { id: 'loc_guild', name: '管理局大楼', type: 'GUILD', coordinates: { x: CENTER_X - 6000, y: CENTER_Y - 6000 }, radius: 1000, description: '方舟的行政与任务发布中心。', icon: 'shield', floor: 0 },
    ];

    const wastelandZones: WastelandZone[] = [
        { zoneStart: 1, zoneEnd: 4, name: "外围·辐射荒原", description: "方舟外的辐射荒漠。变异生物游荡。适合初级拾荒者。", dangerLevel: "LOW", landmarks: [] },
        { zoneStart: 5, zoneEnd: 7, name: "外围·旧城废墟", description: "旧世界的城市残骸。有大量自动防卫系统。", dangerLevel: "LOW-MID", landmarks: [] },
        { zoneStart: 8, zoneEnd: 12, name: "深处·化工污染区", description: "剧毒的化工厂遗址。生化兽出没。", dangerLevel: "MEDIUM", landmarks: [] },
        { zoneStart: 13, zoneEnd: 17, name: "深处·机械坟场", description: "巨大的机械残骸堆积场。失控机兵的领地。", dangerLevel: "HIGH", landmarks: [] },
        { zoneStart: 18, zoneEnd: 18, name: "绿洲 (Oasis)", description: "荒原中的安全据点。", dangerLevel: "SAFE", landmarks: [{ zone: 18, name: "清泉镇", type: "SAFE_ZONE" }] },
        { zoneStart: 19, zoneEnd: 24, name: "禁区·晶体矿脉", description: "生长着奇异晶体的矿区。能量异常。", dangerLevel: "HIGH", landmarks: [] },
        { zoneStart: 25, zoneEnd: 27, name: "核心·地下实验室", description: "旧世界的秘密实验室。", dangerLevel: "EXTREME", landmarks: [] },
        { zoneStart: 37, zoneEnd: 37, name: "地心·融合炉", description: "星球的核心能源设施。", dangerLevel: "HELL", landmarks: [] }
    ];

    const routes: TradeRoute[] = [
        {
            id: 'route_ring_inner',
            name: '内环磁浮轨',
            path: createCirclePath(CENTER_X, CENTER_Y, 4500),
            type: 'MAIN_STREET',
            width: 140,
            color: '#94a3b8',
            floor: 0
        },
        {
            id: 'route_ring_outer',
            name: '外环运输道',
            path: createCirclePath(CENTER_X, CENTER_Y, 15000),
            type: 'MAIN_STREET',
            width: 180,
            color: '#64748b',
            floor: 0
        },
        {
            id: 'route_north_south',
            name: '中轴主干道',
            path: createPolylinePath([
                { x: CENTER_X, y: CENTER_Y - 19000 },
                { x: CENTER_X, y: CENTER_Y },
                { x: CENTER_X, y: CENTER_Y + 19000 }
            ]),
            type: 'MAIN_STREET',
            width: 200,
            color: '#cbd5f5',
            floor: 0
        },
        {
            id: 'route_east_west',
            name: '东西高架路',
            path: createPolylinePath([
                { x: CENTER_X - 19000, y: CENTER_Y },
                { x: CENTER_X, y: CENTER_Y },
                { x: CENTER_X + 19000, y: CENTER_Y }
            ]),
            type: 'MAIN_STREET',
            width: 200,
            color: '#cbd5f5',
            floor: 0
        },
        {
            id: 'route_market_trade',
            name: '走私通道',
            path: createPolylinePath([
                { x: CENTER_X - 9000, y: CENTER_Y + 12000 },
                { x: CENTER_X - 2000, y: CENTER_Y + 6000 },
                { x: CENTER_X + 6000, y: CENTER_Y + 2000 },
                { x: CENTER_X + 14000, y: CENTER_Y }
            ]),
            type: 'TRADE_ROUTE',
            width: 140,
            color: '#f59e0b',
            floor: 0
        },
        {
            id: 'route_slum_alley',
            name: '生锈区暗道',
            path: createPolylinePath([
                { x: CENTER_X + 11000, y: CENTER_Y - 2000 },
                { x: CENTER_X + 14000, y: CENTER_Y },
                { x: CENTER_X + 12000, y: CENTER_Y + 2500 }
            ]),
            type: 'ALLEY',
            width: 80,
            color: '#475569',
            floor: 0
        },
        {
            id: 'route_heph_link',
            name: '工业传送带',
            path: createPolylinePath([
                { x: CENTER_X - 13000, y: CENTER_Y + 13000 },
                { x: CENTER_X - 10000, y: CENTER_Y + 10000 },
                { x: CENTER_X - 6000, y: CENTER_Y + 6000 }
            ]),
            type: 'TRADE_ROUTE',
            width: 120,
            color: '#f97316',
            floor: 0
        }
    ];

    return {
        config: { width: MAP_SIZE, height: MAP_SIZE },
        factions,
        territories,
        terrain,
        routes,
        surfaceLocations,
        wastelandZones
    };
};
