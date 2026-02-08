export const GAME_SCHEMA_DOCS = [
    {
        title: "1. 全局状态 (Global)",
        path: "gameState",
        desc: "全局环境与元数据。",
        structure: {
            "当前界面": "Screen (HOME/CHAR_CREATION/GAME/SETTINGS)",
            "游戏难度": "Difficulty (Easy/Normal/Hard/Hell)",
            "处理中": "Boolean",
            "回合数": "Number",
            "游戏时间": "String ('第X日 HH:MM')",
            "当前日期": "String ('1000-01-01')",
            "当前地点": "String (中文地名)",
            "当前楼层": "Number (0=地表)",
            "天气": "String",
            "世界坐标": { "x": "Number", "y": "Number" },
            "historyArchive": "Array<LogEntry>?"
        }
    },
    {
        title: "2. 日志 (Logs)",
        path: "gameState.日志",
        desc: "剧情与对话历史。",
        structure: "Array<LogEntry>",
        itemStructure: {
            "id": "String",
            "text": "String",
            "sender": "String",
            "timestamp": "Number",
            "turnIndex": "Number?",
            "rawResponse": "String?",
            "snapshot": "String?",
            "isRaw": "Boolean?",
            "gameTime": "String?"
        }
    },
    {
        title: "3. 角色核心 (Character)",
        path: "gameState.角色",
        desc: "玩家属性与状态。",
        structure: {
            "姓名": "String",
            "称号": "String",
            "种族": "String",
            "所属势力": "String",
            "等级": "Number",
            "性别": "String",
            "年龄": "Number",
            "生日": "String",
            "头像": "String",
            "外貌": "String",
            "背景": "String",
            "生命值": "Number",
            "最大生命值": "Number",
            "负载": "Number", // Was 精神力
            "最大负载": "Number",
            "体力": "Number",
            "最大体力": "Number",
            "疲劳度": "Number",
            "废土声望": "String", // Was 公会评级
            "战术槽位": "{上限, 已使用, 扩展来源[]}", // Was 魔法栏位
            "生存状态": { "饱腹度": "Number", "最大饱腹度": "Number", "辐射值": "Number", "最大辐射值": "Number", "水分": "Number", "最大水分": "Number" },
            "身体部位": { "头部": "{当前/最大}", "胸部": "{当前/最大}", "腹部": "{当前/最大}", "左臂": "{当前/最大}", "右臂": "{当前/最大}", "左腿": "{当前/最大}", "右腿": "{当前/最大}" },
            "能力值": { "力量": "Number", "耐久": "Number", "灵巧": "Number", "敏捷": "Number", "逻辑": "Number", "网络": "Number", "能源": "Number" },
            "经验值": "Number",
            "黑匣子数据": "Number", // Was 伟业
            "升级所需数据": "Number",
            "配给券": "Number", // Was 法利
            "战术模块": "Array<{名称, 等级, 类型, 描述, 效果, 解锁条件, 备注}>", // Was 发展能力
            "技能": "Array<{id, 名称, 类别, 描述, 效果, 触发, 持续, 冷却, 消耗, 范围, 命中, 适用, 等级, 关联模块, 限制, 标签, 稀有, 备注}>",
            "战术程序": "Array<{id, 名称, 指令代码, 类别, 属性, 描述, 效果, 范围, 射程, 冷却, 消耗, 施放条件, 标签, 稀有, 备注}>", // Was 魔法
            "系统故障": "Array<{名称, 类型, 效果, 持续时间}>", // Was 诅咒
            "状态": "Array<{名称, 类型, 效果, 持续时间}>",
            "装备": { "主手": "String", "副手": "String", "头部": "String", "身体": "String", "手部": "String", "腿部": "String", "足部": "String", "饰品1": "String", "饰品2": "String", "饰品3": "String" }
        }
    },
    // ...
    {
        title: "9. 世界动态 (World)",
        path: "gameState.世界",
        desc: "公会与都市动态。",
        structure: {
            "异常指数": "Number",
            "公会声望": "Number", // Was 眷族声望
            "头条新闻": "String[]",
            "街头传闻": "Array<{主题, 传播度}>",
            "废土董事会": "{下次会议开启时间, 会议主题, 讨论内容[{角色, 对话}], 最终结果}", // Was 诸神神会
            "NPC后台跟踪": "Array<{NPC, 当前行动, 位置?, 进度?, 预计完成?}>",
            "势力格局": "{S级[], A级[], B级至I级[], 备注?}", // Was 派阀格局
            "区域战争": "{状态, 参战势力[], 形式, 争夺目标, 开始时间, 结束时间, 结果, 备注}", // Was 战争游戏
            "下次更新": "String"
        }
    },
    // ...
    {
        title: "13. 势力 (Faction)", // Was 眷族
        path: "gameState.势力",
        desc: "势力资产与状态。",
        structure: {
            "名称": "String",
            "等级": "String",
            "领袖": "String", // Was 主神
            "资金": "Number",
            "设施状态": "Object",
            "仓库": "Array<InventoryItem>"
        }
    },
    {
        title: "14. 技能池 (Skill Pool)",
        path: "gameState.技能",
        desc: "可用技能池。",
        structure: "Array<Skill>"
    },
    {
        title: "15. 记忆系统 (Memory)",
        path: "gameState.记忆",
        desc: "短中长期记忆。",
        structure: {
            "lastLogIndex": "Number",
            "instant": "Array<LogEntry>?",
            "shortTerm": "Array<{content, timestamp, turnIndex}>",
            "mediumTerm": "String[]",
            "longTerm": "String[]"
        }
    }
];


