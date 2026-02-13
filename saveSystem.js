// 存档系统 - 管理游戏数据的持久化存储
class SaveSystem {
    constructor() {
        this.saveKey = 'stickManAdventureSave';
        this.defaultData = this.getDefaultData();
    }

    // 获取默认数据
    getDefaultData() {
        return {
            // 基础属性
            baseStats: {
                maxHealth: 100,
                attack: 1,
                defense: 0,
                accuracy: 0.6,
                luck: 3
            },
            
            // 金币
            gold: 0,
            
            // 装备槽位
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            
            // 背包仓库
            inventory: [],
            
            // 升级记录
            upgrades: {
                health: 0,
                attack: 0,
                defense: 0,
                accuracy: 0,
                luck: 0
            },
            
            // 游戏统计
            totalGames: 0,
            totalWins: 0,
            totalGold: 0,
            enemiesDefeated: 0,
            
            // 版本号（用于兼容性检查）
            version: '1.0'
        };
    }

    // 读取存档
    loadSave() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const data = JSON.parse(saveData);
                // 合并默认数据，确保新增字段存在
                return this.mergeWithDefault(data);
            }
        } catch (error) {
            console.error('读取存档失败:', error);
        }
        return this.defaultData;
    }

    // 保存存档
    saveSave(data) {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存存档失败:', error);
            return false;
        }
    }

    // 删除存档
    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            return false;
        }
    }

    // 合并默认数据
    mergeWithDefault(data) {
        const merged = JSON.parse(JSON.stringify(this.defaultData));
        
        // 递归合并对象
        function merge(target, source) {
            for (let key in source) {
                if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        
        merge(merged, data);
        return merged;
    }

    // 检查存档是否存在
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    // 导出存档数据
    exportSave() {
        const data = this.loadSave();
        return JSON.stringify(data, null, 2);
    }

    // 导入存档数据
    importSave(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            const mergedData = this.mergeWithDefault(data);
            return this.saveSave(mergedData);
        } catch (error) {
            console.error('导入存档失败:', error);
            return false;
        }
    }
}

// 装备系统
class EquipmentSystem {
    constructor() {
        this.equipmentDatabase = [];
        this.qualityColors = {
            white: '#ffffff',
            green: '#27ae60',
            blue: '#3498db',
            purple: '#9b59b6'
        };
        this.qualityNames = {
            white: '普通',
            green: '精良',
            blue: '稀有',
            purple: '史诗'
        };
        
        // 装备图标映射
        this.equipmentIcons = {
            // 武器图标
            'dagger_1': 'fa-dagger',
            'dagger_2': 'fa-khanda',
            'dagger_3': 'fa-sickle',
            'dagger_4': 'fa-knife-kitchen',
            'sword_1': 'fa-sword',
            'sword_2': 'fa-sword-laser',
            'sword_3': 'fa-sword-laser',
            'sword_4': 'fa-sword-laser',
            'axe_1': 'fa-axe',
            'axe_2': 'fa-axe-battle',
            'axe_3': 'fa-axe-battle',
            'axe_4': 'fa-axe-battle',
            'hammer_1': 'fa-hammer',
            'hammer_2': 'fa-hammer-crash',
            'hammer_3': 'fa-hammer-crash',
            'hammer_4': 'fa-hammer-crash',
            'bow_1': 'fa-bow-arrow',
            'bow_2': 'fa-bow-arrow',
            'bow_3': 'fa-bow-arrow',
            'bow_4': 'fa-bow-arrow',
            'spear_1': 'fa-spear',
            'spear_2': 'fa-spear',
            'spear_3': 'fa-spear',
            'spear_4': 'fa-spear',
            'knife_1': 'fa-dagger',
            'knife_2': 'fa-scalpel',
            'knife_3': 'fa-scalpel',
            'knife_4': 'fa-scalpel',
            'club_1': 'fa-club',
            'club_2': 'fa-club',
            'club_3': 'fa-club',
            'club_4': 'fa-club',
            
            // 防具图标
            'cloth_1': 'fa-vest',
            'cloth_2': 'fa-vest-patches',
            'cloth_3': 'fa-vest-patches',
            'cloth_4': 'fa-vest-patches',
            'leather_1': 'fa-shield',
            'leather_2': 'fa-shield-halved',
            'leather_3': 'fa-shield-halved',
            'leather_4': 'fa-shield-halved',
            'chain_1': 'fa-shield',
            'chain_2': 'fa-shield',
            'chain_3': 'fa-shield',
            'chain_4': 'fa-shield',
            'plate_1': 'fa-shield-virus',
            'plate_2': 'fa-shield-virus',
            'plate_3': 'fa-shield-virus',
            'plate_4': 'fa-shield-virus',
            
            // 饰品图标
            'ring_1': 'fa-ring',
            'ring_2': 'fa-gem',
            'ring_3': 'fa-gem',
            'ring_4': 'fa-gem',
            'amulet_1': 'fa-amulet',
            'amulet_2': 'fa-amulet',
            'amulet_3': 'fa-amulet',
            'amulet_4': 'fa-amulet',
            'belt_1': 'fa-belt',
            'belt_2': 'fa-belt',
            'belt_3': 'fa-belt',
            'belt_4': 'fa-belt',
            'boots_1': 'fa-socks',
            'boots_2': 'fa-socks',
            'boots_3': 'fa-socks',
            'boots_4': 'fa-socks',
            'gloves_1': 'fa-mitten',
            'gloves_2': 'fa-mitten',
            'gloves_3': 'fa-mitten',
            'gloves_4': 'fa-mitten'
        };
        
        this.generateEquipmentDatabase();
    }

    // 获取装备图标
    getEquipmentIcon(equipmentId) {
        // 首先尝试精确匹配ID
        if (this.equipmentIcons[equipmentId]) {
            return this.equipmentIcons[equipmentId];
        }
        
        // 如果没有精确匹配，尝试根据类型和品质匹配
        const parts = equipmentId.split('_');
        const baseType = parts[0]; // dagger, sword, axe等
        
        // 根据装备类型返回默认图标
        const defaultIcons = {
            'dagger': 'fa-dagger',
            'sword': 'fa-sword',
            'axe': 'fa-axe',
            'hammer': 'fa-hammer',
            'bow': 'fa-bow-arrow',
            'spear': 'fa-spear',
            'knife': 'fa-dagger',
            'club': 'fa-club',
            'cloth': 'fa-vest',
            'leather': 'fa-shield',
            'chain': 'fa-shield',
            'plate': 'fa-shield-virus',
            'ring': 'fa-ring',
            'amulet': 'fa-amulet',
            'belt': 'fa-belt',
            'boots': 'fa-socks',
            'gloves': 'fa-mitten'
        };
        
        return defaultIcons[baseType] || 'fa-question';
    }
    
    // 生成装备数据库
    generateEquipmentDatabase() {
        this.equipmentDatabase = {
            weapons: [
                // 白色品质武器 - 基础装备
                { id: 'wooden_sword', name: '木剑', quality: 'white', type: 'weapon', stats: { attack: 2 }, price: 5, sprite: 'wooden_sword' },
                { id: 'copper_shortsword', name: '铜短剑', quality: 'white', type: 'weapon', stats: { attack: 3 }, price: 10, sprite: 'copper_shortsword' },
                { id: 'rusty_dagger', name: '生锈匕首', quality: 'white', type: 'weapon', stats: { attack: 2, accuracy: 0.05 }, price: 8, sprite: 'rusty_dagger' },
                { id: 'stone_hammer', name: '石锤', quality: 'white', type: 'weapon', stats: { attack: 4 }, price: 12, sprite: 'stone_hammer' },
                { id: 'wooden_bow', name: '木弓', quality: 'white', type: 'weapon', stats: { attack: 3, accuracy: 0.1 }, price: 15, sprite: 'wooden_bow' },
                { id: 'bronze_spear', name: '青铜矛', quality: 'white', type: 'weapon', stats: { attack: 5 }, price: 18, sprite: 'bronze_spear' },
                
                // 绿色品质武器 - 精良装备
                { id: 'iron_sword', name: '铁剑', quality: 'green', type: 'weapon', stats: { attack: 6 }, price: 40, sprite: 'iron_sword' },
                { id: 'silver_dagger', name: '银匕首', quality: 'green', type: 'weapon', stats: { attack: 5, accuracy: 0.15, luck: 1 }, price: 45, sprite: 'silver_dagger' },
                { id: 'war_hammer', name: '战锤', quality: 'green', type: 'weapon', stats: { attack: 8 }, price: 55, sprite: 'war_hammer' },
                { id: 'composite_bow', name: '复合弓', quality: 'green', type: 'weapon', stats: { attack: 7, accuracy: 0.2 }, price: 60, sprite: 'composite_bow' },
                { id: 'steel_spear', name: '钢矛', quality: 'green', type: 'weapon', stats: { attack: 9, accuracy: 0.1 }, price: 65, sprite: 'steel_spear' },
                { id: 'twin_knives', name: '双刀', quality: 'green', type: 'weapon', stats: { attack: 7, accuracy: 0.25 }, price: 70, sprite: 'twin_knives' },
                { id: 'iron_club', name: '铁棒', quality: 'green', type: 'weapon', stats: { attack: 10 }, price: 75, sprite: 'iron_club' },
                
                // 蓝色品质武器 - 稀有装备
                { id: 'gold_sword', name: '黄金剑', quality: 'blue', type: 'weapon', stats: { attack: 10, luck: 2 }, price: 120, sprite: 'gold_sword' },
                { id: 'shadow_blade', name: '暗影之刃', quality: 'blue', type: 'weapon', stats: { attack: 9, accuracy: 0.3, luck: 3 }, price: 140, sprite: 'shadow_blade' },
                { id: 'battle_axe', name: '战斧', quality: 'blue', type: 'weapon', stats: { attack: 15, defense: 1 }, price: 160, sprite: 'battle_axe' },
                { id: 'elven_bow', name: '精灵弓', quality: 'blue', type: 'weapon', stats: { attack: 12, accuracy: 0.4, luck: 2 }, price: 180, sprite: 'elven_bow' },
                { id: 'crystal_spear', name: '水晶矛', quality: 'blue', type: 'weapon', stats: { attack: 14, accuracy: 0.25, luck: 3 }, price: 200, sprite: 'crystal_spear' },
                { id: 'flaming_sword', name: '烈焰之剑', quality: 'blue', type: 'weapon', stats: { attack: 13, luck: 4 }, price: 220, sprite: 'flaming_sword' },
                { id: 'frost_hammer', name: '冰霜战锤', quality: 'blue', type: 'weapon', stats: { attack: 16, defense: 2 }, price: 240, sprite: 'frost_hammer' },
                { id: 'lightning_dagger', name: '雷光匕首', quality: 'blue', type: 'weapon', stats: { attack: 11, accuracy: 0.35, luck: 4 }, price: 250, sprite: 'lightning_dagger' },
                
                // 紫色品质武器 - 史诗装备
                { id: 'excalibur', name: '石中剑', quality: 'purple', type: 'weapon', stats: { attack: 18, defense: 3, accuracy: 0.2, luck: 5 }, price: 400, sprite: 'excalibur' },
                { id: 'muramasa', name: '村正', quality: 'purple', type: 'weapon', stats: { attack: 20, accuracy: 0.4, luck: 6 }, price: 450, sprite: 'muramasa' },
                { id: 'dragon_slayer', name: '屠龙斧', quality: 'purple', type: 'weapon', stats: { attack: 28, defense: 4, luck: 4 }, price: 500, sprite: 'dragon_slayer' },
                { id: 'phoenix_bow', name: '凤凰弓', quality: 'purple', type: 'weapon', stats: { attack: 22, accuracy: 0.5, luck: 7 }, price: 550, sprite: 'phoenix_bow' },
                { id: 'gungnir', name: '永恒之枪', quality: 'purple', type: 'weapon', stats: { attack: 25, accuracy: 0.3, luck: 8 }, price: 600, sprite: 'gungnir' },
                { id: 'blade_of_abyss', name: '深渊之刃', quality: 'purple', type: 'weapon', stats: { attack: 24, accuracy: 0.45, luck: 10 }, price: 700, sprite: 'blade_of_abyss' },
                { id: 'thor_hammer', name: '雷神之锤', quality: 'purple', type: 'weapon', stats: { attack: 30, defense: 5, luck: 6 }, price: 800, sprite: 'thor_hammer' },
                { id: 'celestial_sword', name: '天界圣剑', quality: 'purple', type: 'weapon', stats: { attack: 22, defense: 6, accuracy: 0.25, luck: 12 }, price: 1000, sprite: 'celestial_sword' }
            ],
            
            armors: [
                // 白色品质盔甲
                { id: 'cloth_robe', name: '布袍', quality: 'white', type: 'armor', stats: { defense: 1, maxHealth: 10 }, price: 8, sprite: 'cloth_robe' },
                { id: 'leather_armor', name: '皮甲', quality: 'white', type: 'armor', stats: { defense: 2, maxHealth: 15 }, price: 15, sprite: 'leather_armor' },
                { id: 'wooden_shield', name: '木盾', quality: 'white', type: 'armor', stats: { defense: 3 }, price: 12, sprite: 'wooden_shield' },
                
                // 绿色品质盔甲
                { id: 'chain_mail', name: '锁子甲', quality: 'green', type: 'armor', stats: { defense: 4, maxHealth: 25 }, price: 50, sprite: 'chain_mail' },
                { id: 'scale_armor', name: '鳞甲', quality: 'green', type: 'armor', stats: { defense: 5, maxHealth: 30, accuracy: -0.05 }, price: 70, sprite: 'scale_armor' },
                { id: 'iron_shield', name: '铁盾', quality: 'green', type: 'armor', stats: { defense: 6, maxHealth: 20 }, price: 60, sprite: 'iron_shield' },
                
                // 蓝色品质盔甲
                { id: 'plate_armor', name: '板甲', quality: 'blue', type: 'armor', stats: { defense: 8, maxHealth: 50, accuracy: -0.1 }, price: 180, sprite: 'plate_armor' },
                { id: 'magic_robe', name: '魔法袍', quality: 'blue', type: 'armor', stats: { maxHealth: 40, luck: 3, accuracy: 0.1 }, price: 160, sprite: 'magic_robe' },
                { id: 'steel_shield', name: '钢盾', quality: 'blue', type: 'armor', stats: { defense: 9, maxHealth: 30 }, price: 200, sprite: 'steel_shield' },
                
                // 紫色品质盔甲
                { id: 'dragon_scale', name: '龙鳞甲', quality: 'purple', type: 'armor', stats: { defense: 12, maxHealth: 80, luck: 4 }, price: 550, sprite: 'dragon_scale' },
                { id: 'ethereal_armor', name: '幽魂战甲', quality: 'purple', type: 'armor', stats: { defense: 8, maxHealth: 60, luck: 6, accuracy: 0.2 }, price: 650, sprite: 'ethereal_armor' },
                { id: 'aegis', name: '神盾', quality: 'purple', type: 'armor', stats: { defense: 15, maxHealth: 100, luck: 5 }, price: 800, sprite: 'aegis' }
            ],
            
            accessories: [
                // 白色品质饰品
                { id: 'copper_ring', name: '铜戒指', quality: 'white', type: 'accessory', stats: { luck: 1 }, price: 10, sprite: 'copper_ring' },
                { id: 'wooden_amulet', name: '木护身符', quality: 'white', type: 'accessory', stats: { maxHealth: 5 }, price: 8, sprite: 'wooden_amulet' },
                { id: 'stone_charm', name: '石符', quality: 'white', type: 'accessory', stats: { defense: 1 }, price: 12, sprite: 'stone_charm' },
                
                // 绿色品质饰品
                { id: 'silver_ring', name: '银戒指', quality: 'green', type: 'accessory', stats: { luck: 2, accuracy: 0.1 }, price: 40, sprite: 'silver_ring' },
                { id: 'protection_amulet', name: '守护护身符', quality: 'green', type: 'accessory', stats: { defense: 2, luck: 1 }, price: 50, sprite: 'protection_amulet' },
                { id: 'iron_charm', name: '铁符', quality: 'green', type: 'accessory', stats: { maxHealth: 15, defense: 2 }, price: 45, sprite: 'iron_charm' },
                
                // 蓝色品质饰品
                { id: 'gold_ring', name: '金戒指', quality: 'blue', type: 'accessory', stats: { luck: 4, accuracy: 0.2, maxHealth: 20 }, price: 140, sprite: 'gold_ring' },
                { id: 'wisdom_amulet', name: '智慧护身符', quality: 'blue', type: 'accessory', stats: { luck: 3, accuracy: 0.3, defense: 3 }, price: 180, sprite: 'wisdom_amulet' },
                { id: 'magic_charm', name: '魔符', quality: 'blue', type: 'accessory', stats: { luck: 5, accuracy: 0.25, maxHealth: 25 }, price: 200, sprite: 'magic_charm' },
                
                // 紫色品质饰品
                { id: 'eternal_ring', name: '永恒戒指', quality: 'purple', type: 'accessory', stats: { luck: 7, accuracy: 0.4, maxHealth: 40 }, price: 450, sprite: 'eternal_ring' },
                { id: 'divine_amulet', name: '神圣护身符', quality: 'purple', type: 'accessory', stats: { luck: 9, accuracy: 0.5, defense: 5, maxHealth: 60 }, price: 750, sprite: 'divine_amulet' },
                { id: 'legendary_charm', name: '传说符文', quality: 'purple', type: 'accessory', stats: { luck: 12, accuracy: 0.6, defense: 8, maxHealth: 80 }, price: 1000, sprite: 'legendary_charm' }
            ]
        };
    }

    // 获取所有装备
    getAllEquipment() {
        const allEquipment = [];
        allEquipment.push(...this.equipmentDatabase.weapons);
        allEquipment.push(...this.equipmentDatabase.armors);
        allEquipment.push(...this.equipmentDatabase.accessories);
        return allEquipment;
    }

    // 根据类型获取装备
    getEquipmentByType(type) {
        switch(type) {
            case 'weapon': return this.equipmentDatabase.weapons;
            case 'armor': return this.equipmentDatabase.armors;
            case 'accessory': return this.equipmentDatabase.accessories;
            default: return [];
        }
    }

    // 根据品质获取装备
    getEquipmentByQuality(quality) {
        const allEquipment = this.getAllEquipment();
        return allEquipment.filter(item => item.quality === quality);
    }

    // 根据ID获取装备
    getEquipmentById(id) {
        const allEquipment = this.getAllEquipment();
        return allEquipment.find(item => item.id === id);
    }

    // 获取装备颜色
    getQualityColor(quality) {
        return this.qualityColors[quality] || '#ffffff';
    }

    // 获取品质名称
    getQualityName(quality) {
        return this.qualityNames[quality] || '未知';
    }

    // 计算装备总属性加成
    calculateEquipmentStats(equipment) {
        const totalStats = {
            maxHealth: 0,
            attack: 0,
            defense: 0,
            accuracy: 0,
            luck: 0
        };

        for (const slot in equipment) {
            const item = equipment[slot];
            if (item && item.stats) {
                for (const stat in item.stats) {
                    if (totalStats.hasOwnProperty(stat)) {
                        totalStats[stat] += item.stats[stat] || 0;
                    }
                }
            }
        }

        return totalStats;
    }

    // 生成随机装备掉落
    generateRandomDrop(difficulty = 1) {
        const allEquipment = this.getAllEquipment();
        
        // 根据难度调整品质概率
        const qualityChances = {
            white: 0.6 - difficulty * 0.1,
            green: 0.3 + difficulty * 0.05,
            blue: 0.1 - difficulty * 0.02,
            purple: Math.max(0.01, difficulty * 0.01)
        };

        // 选择品质
        const random = Math.random();
        let selectedQuality = 'white';
        let cumulative = 0;

        for (const quality in qualityChances) {
            cumulative += qualityChances[quality];
            if (random <= cumulative) {
                selectedQuality = quality;
                break;
            }
        }

        // 从选定品质中随机选择装备
        const qualityEquipment = this.getEquipmentByQuality(selectedQuality);
        return qualityEquipment[Math.floor(Math.random() * qualityEquipment.length)];
    }
}

// 升级系统
class UpgradeSystem {
    constructor() {
        this.upgradeCosts = {
            health: { base: 50, multiplier: 1.5 },
            attack: { base: 40, multiplier: 1.6 },
            defense: { base: 30, multiplier: 1.7 },
            accuracy: { base: 60, multiplier: 1.8 },
            luck: { base: 80, multiplier: 2.0 }
        };

        this.upgradeEffects = {
            health: { maxHealth: 20 },
            attack: { attack: 1 },
            defense: { defense: 1 },
            accuracy: { accuracy: 0.05 },
            luck: { luck: 1 }
        };
    }

    // 计算升级费用
    getUpgradeCost(stat, currentLevel) {
        const costConfig = this.upgradeCosts[stat];
        return Math.floor(costConfig.base * Math.pow(costConfig.multiplier, currentLevel));
    }

    // 获取升级效果
    getUpgradeEffect(stat) {
        return this.upgradeEffects[stat] || {};
    }

    // 执行升级
    performUpgrade(baseStats, upgrades, stat, gold) {
        const cost = this.getUpgradeCost(stat, upgrades[stat]);
        
        if (gold < cost) {
            return { success: false, reason: '金币不足' };
        }

        const effect = this.getUpgradeEffect(stat);
        
        // 应用升级效果
        for (const effectStat in effect) {
            if (baseStats.hasOwnProperty(effectStat)) {
                baseStats[effectStat] += effect[effectStat];
            }
        }

        upgrades[stat]++;

        return { 
            success: true, 
            cost: cost, 
            newLevel: upgrades[stat],
            effect: effect 
        };
    }

    // 获取升级描述
    getUpgradeDescription(stat) {
        const effect = this.getUpgradeEffect(stat);
        const descriptions = {
            health: `最大生命值 +${effect.maxHealth}`,
            attack: `攻击力 +${effect.attack}`,
            defense: `防御力 +${effect.defense}`,
            accuracy: `命中率 +${(effect.accuracy * 100).toFixed(0)}%`,
            luck: `运气值 +${effect.luck}`
        };
        return descriptions[stat] || '未知升级';
    }

    // 获取所有升级信息
    getAllUpgradeInfo(upgrades, gold) {
        const info = {};
        
        for (const stat in this.upgradeCosts) {
            const cost = this.getUpgradeCost(stat, upgrades[stat]);
            const description = this.getUpgradeDescription(stat);
            const canAfford = gold >= cost;
            
            info[stat] = {
                currentLevel: upgrades[stat],
                cost: cost,
                description: description,
                canAfford: canAfford,
                nextEffect: this.getUpgradeEffect(stat)
            };
        }
        
        return info;
    }
}

// 抽奖系统
class LotterySystem {
    constructor(equipmentSystem) {
        this.equipmentSystem = equipmentSystem;
        this.lotteryCosts = {
            single: 50,    // 单抽
            multi: 450     // 十抽
        };
        
        // 抽奖概率配置
        this.lotteryRates = {
            white: 0.50,   // 50% 普通装备
            green: 0.35,   // 35% 精良装备
            blue: 0.13,    // 13% 稀有装备
            purple: 0.02   // 2% 史诗装备
        };
    }

    // 执行单次抽奖
    drawSingle() {
        return this.performDraw();
    }

    // 执行十连抽
    drawMulti() {
        const results = [];
        let guaranteedRare = false;
        
        for (let i = 0; i < 10; i++) {
            // 十连抽保底：前9次没有蓝色或紫色装备，第10次必定获得
            if (i === 9 && !guaranteedRare) {
                const quality = Math.random() < 0.8 ? 'blue' : 'purple';
                results.push(this.getEquipmentByQuality(quality));
            } else {
                const equipment = this.performDraw();
                if (equipment.quality === 'blue' || equipment.quality === 'purple') {
                    guaranteedRare = true;
                }
                results.push(equipment);
            }
        }
        
        return results;
    }

    // 执行抽奖逻辑
    performDraw() {
        const quality = this.getRandomQuality();
        return this.getEquipmentByQuality(quality);
    }

    // 随机获取品质
    getRandomQuality() {
        const random = Math.random();
        let cumulative = 0;
        
        for (const [quality, rate] of Object.entries(this.lotteryRates)) {
            cumulative += rate;
            if (random <= cumulative) {
                return quality;
            }
        }
        
        return 'white';
    }

    // 根据品质获取随机装备
    getEquipmentByQuality(quality) {
        const allEquipment = this.equipmentSystem.getAllEquipment();
        const qualityEquipment = allEquipment.filter(item => item.quality === quality);
        
        if (qualityEquipment.length === 0) {
            // 如果没有对应品质的装备，返回白色装备
            return this.getEquipmentByQuality('white');
        }
        
        const randomIndex = Math.floor(Math.random() * qualityEquipment.length);
        return { ...qualityEquipment[randomIndex] }; // 返回副本避免修改原数据
    }

    // 获取抽奖费用
    getLotteryCost(type) {
        return this.lotteryCosts[type] || 0;
    }

    // 获取抽奖概率信息
    getLotteryRates() {
        return { ...this.lotteryRates };
    }

    // 检查金币是否足够
    canAfford(gold, type) {
        return gold >= this.getLotteryCost(type);
    }

    // 格式化抽奖结果
    formatLotteryResults(results) {
        return results.map(item => ({
            id: item.id,
            name: item.name,
            quality: item.quality,
            qualityName: this.equipmentSystem.qualityNames[item.quality],
            qualityColor: this.equipmentSystem.getQualityColor(item.quality),
            type: item.type,
            stats: item.stats,
            price: item.price,
            sprite: item.sprite
        }));
    }

    // 获取品质权重（用于显示）
    getQualityWeights() {
        return {
            white: { weight: 50, color: '#ffffff', name: '普通' },
            green: { weight: 35, color: '#27ae60', name: '精良' },
            blue: { weight: 13, color: '#3498db', name: '稀有' },
            purple: { weight: 2, color: '#9b59b6', name: '史诗' }
        };
    }
}
