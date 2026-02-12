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
        this.equipmentDatabase = this.generateEquipmentDatabase();
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
    }

    // 生成装备数据库
    generateEquipmentDatabase() {
        return {
            weapons: [
                // 白色品质武器
                { id: 'dagger_1', name: '生锈的匕首', quality: 'white', type: 'weapon', stats: { attack: 2 }, price: 10 },
                { id: 'sword_1', name: '旧长剑', quality: 'white', type: 'weapon', stats: { attack: 3 }, price: 15 },
                { id: 'axe_1', name: '破损的斧头', quality: 'white', type: 'weapon', stats: { attack: 4 }, price: 20 },
                
                // 绿色品质武器
                { id: 'dagger_2', name: '精制匕首', quality: 'green', type: 'weapon', stats: { attack: 5, accuracy: 0.1 }, price: 50 },
                { id: 'sword_2', name: '钢制长剑', quality: 'green', type: 'weapon', stats: { attack: 6, defense: 1 }, price: 60 },
                { id: 'axe_2', name: '战斧', quality: 'green', type: 'weapon', stats: { attack: 8 }, price: 80 },
                
                // 蓝色品质武器
                { id: 'dagger_3', name: '暗影匕首', quality: 'blue', type: 'weapon', stats: { attack: 8, accuracy: 0.2, luck: 1 }, price: 150 },
                { id: 'sword_3', name: '魔法长剑', quality: 'blue', type: 'weapon', stats: { attack: 10, defense: 2, accuracy: 0.1 }, price: 200 },
                { id: 'axe_3', name: '狂暴战斧', quality: 'blue', type: 'weapon', stats: { attack: 15, luck: 2 }, price: 250 },
                
                // 紫色品质武器
                { id: 'dagger_4', name: '幻影之刃', quality: 'purple', type: 'weapon', stats: { attack: 12, accuracy: 0.3, luck: 3 }, price: 500 },
                { id: 'sword_4', name: '王者之剑', quality: 'purple', type: 'weapon', stats: { attack: 15, defense: 5, accuracy: 0.2 }, price: 600 },
                { id: 'axe_4', name: '毁灭战斧', quality: 'purple', type: 'weapon', stats: { attack: 25, luck: 5, defense: 3 }, price: 800 }
            ],
            
            armors: [
                // 白色品质盔甲
                { id: 'cloth_1', name: '破布袍', quality: 'white', type: 'armor', stats: { defense: 1, maxHealth: 10 }, price: 10 },
                { id: 'leather_1', name: '旧皮甲', quality: 'white', type: 'armor', stats: { defense: 2, maxHealth: 15 }, price: 20 },
                
                // 绿色品质盔甲
                { id: 'chain_1', name: '锁子甲', quality: 'green', type: 'armor', stats: { defense: 4, maxHealth: 25 }, price: 60 },
                { id: 'scale_1', name: '鳞甲', quality: 'green', type: 'armor', stats: { defense: 5, maxHealth: 30, accuracy: -0.05 }, price: 80 },
                
                // 蓝色品质盔甲
                { id: 'plate_1', name: '板甲', quality: 'blue', type: 'armor', stats: { defense: 8, maxHealth: 50, accuracy: -0.1 }, price: 200 },
                { id: 'magic_1', name: '魔法袍', quality: 'blue', type: 'armor', stats: { maxHealth: 40, luck: 2, accuracy: 0.1 }, price: 180 },
                
                // 紫色品质盔甲
                { id: 'dragon_1', name: '龙鳞甲', quality: 'purple', type: 'armor', stats: { defense: 12, maxHealth: 80, luck: 3 }, price: 600 },
                { id: 'ethereal_1', name: '幽魂战甲', quality: 'purple', type: 'armor', stats: { defense: 8, maxHealth: 60, luck: 5, accuracy: 0.2 }, price: 700 }
            ],
            
            accessories: [
                // 白色品质饰品
                { id: 'ring_1', name: '铜戒指', quality: 'white', type: 'accessory', stats: { luck: 1 }, price: 15 },
                { id: 'amulet_1', name: '破护身符', quality: 'white', type: 'accessory', stats: { maxHealth: 5 }, price: 10 },
                
                // 绿色品质饰品
                { id: 'ring_2', name: '银戒指', quality: 'green', type: 'accessory', stats: { luck: 2, accuracy: 0.1 }, price: 50 },
                { id: 'amulet_2', name: '守护护身符', quality: 'green', type: 'accessory', stats: { defense: 2, luck: 1 }, price: 60 },
                
                // 蓝色品质饰品
                { id: 'ring_3', name: '金戒指', quality: 'blue', type: 'accessory', stats: { luck: 4, accuracy: 0.2, maxHealth: 20 }, price: 150 },
                { id: 'amulet_3', name: '智慧护身符', quality: 'blue', type: 'accessory', stats: { luck: 3, accuracy: 0.3, defense: 3 }, price: 200 },
                
                // 紫色品质饰品
                { id: 'ring_4', name: '永恒戒指', quality: 'purple', type: 'accessory', stats: { luck: 6, accuracy: 0.4, maxHealth: 40 }, price: 500 },
                { id: 'amulet_4', name: '神圣护身符', quality: 'purple', type: 'accessory', stats: { luck: 8, accuracy: 0.5, defense: 5, maxHealth: 60 }, price: 800 }
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
