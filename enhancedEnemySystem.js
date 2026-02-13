// 增强敌人系统
class EnhancedEnemySystem {
    constructor() {
        this.enemyTemplates = this.initializeEnemyTemplates();
        this.eliteTemplates = this.initializeEliteTemplates();
        this.bossTemplates = this.initializeBossTemplates();
    }
    
    // 初始化普通敌人模板
    initializeEnemyTemplates() {
        return [
            {
                name: "哥布林",
                baseHealth: 30,
                baseAttack: 2,
                baseDefense: 0,
                color: "#27ae60",
                skills: [],
                description: "弱小的绿色生物，通常成群出现"
            },
            {
                name: "骷髅战士",
                baseHealth: 50,
                baseAttack: 3,
                baseDefense: 1,
                color: "#95a5a6",
                skills: ["undead_resilience"],
                description: "不死的战士，对物理攻击有一定抗性"
            },
            {
                name: "野狼",
                baseHealth: 40,
                baseAttack: 4,
                baseDefense: 0,
                color: "#8b4513",
                skills: ["pack_hunter"],
                description: "凶猛的掠食者，攻击速度很快"
            },
            {
                name: "强盗",
                baseHealth: 60,
                baseAttack: 3,
                baseDefense: 2,
                color: "#8b0000",
                skills: ["looter"],
                description: "贪婪的人类敌人，会偷取金币"
            },
            {
                name: "暗影刺客",
                baseHealth: 35,
                baseAttack: 5,
                baseDefense: 0,
                color: "#2c3e50",
                skills: ["stealth_attack", "critical_strike"],
                description: "神秘的刺客，能够进行致命一击"
            },
            {
                name: "石像鬼",
                baseHealth: 80,
                baseAttack: 2,
                baseDefense: 3,
                color: "#696969",
                skills: ["stone_skin", "regeneration"],
                description: "石制魔像，防御力极高且能缓慢恢复"
            }
        ];
    }
    
    // 初始化精英敌人模板
    initializeEliteTemplates() {
        return [
            {
                name: "哥布林首领",
                baseHealth: 80,
                baseAttack: 6,
                baseDefense: 2,
                color: "#1e8449",
                skills: ["rage", "call_reinforcements"],
                description: "哥布林群体的领袖，愤怒时会召唤援军"
            },
            {
                name: "骷髅将军",
                baseHealth: 120,
                baseAttack: 8,
                baseDefense: 4,
                color: "#566573",
                skills: ["undead_resilience", "command_presence", "bone_armor"],
                description: "骷髅军队的指挥官，拥有强大的防御能力"
            },
            {
                name: "阿尔法狼",
                baseHealth: 100,
                baseAttack: 10,
                baseDefense: 1,
                color: "#6d4c41",
                skills: ["pack_hunter", "alpha_howl", "berserker_rage"],
                description: "狼群的首领，嚎叫能增强自身能力"
            },
            {
                name: "暗影大师",
                baseHealth: 90,
                baseAttack: 12,
                baseDefense: 2,
                color: "#1a1a1a",
                skills: ["stealth_attack", "critical_strike", "shadow_step", "poison_blade"],
                description: "刺客组织的首领，掌握多种暗杀技巧"
            }
        ];
    }
    
    // 初始化Boss模板
    initializeBossTemplates() {
        return [
            {
                name: "巨龙",
                baseHealth: 500,
                baseAttack: 20,
                baseDefense: 8,
                color: "#c0392b",
                skills: ["dragon_breath", "wing_flap", "rage", "regeneration", "intimidation"],
                description: "传说中的巨龙，拥有毁灭性的力量"
            },
            {
                name: "暗黑领主",
                baseHealth: 400,
                baseAttack: 18,
                baseDefense: 10,
                color: "#4a235a",
                skills: ["dark_aura", "life_drain", "summon_minions", "curse", "immunity"],
                description: "黑暗势力的统治者，掌握多种黑暗魔法"
            },
            {
                name: "古代守护者",
                baseHealth: 600,
                baseAttack: 15,
                baseDefense: 15,
                color: "#7f8c8d",
                skills: ["stone_skin", "regeneration", "earthquake", "shield_wall", "immunity"],
                description: "古老遗迹的守护者，拥有坚不可摧的防御"
            }
        ];
    }
    
    // 根据玩家等级生成敌人
    generateEnemy(playerLevel, eventsSurvived) {
        // 根据冒险次数计算难度系数
        const difficultyMultiplier = 1 + (eventsSurvived * 0.05); // 每次冒险增加5%难度
        
        // 计算精英和Boss出现概率
        const eliteChance = Math.min(0.1 + (eventsSurvived * 0.02), 0.4); // 最高40%精英概率
        const bossChance = Math.min(0.01 + (eventsSurvived * 0.005), 0.15); // 最高15%Boss概率
        
        const random = Math.random();
        let template, isElite = false, isBoss = false;
        
        if (random < bossChance) {
            // Boss敌人
            template = this.bossTemplates[Math.floor(Math.random() * this.bossTemplates.length)];
            isBoss = true;
        } else if (random < bossChance + eliteChance) {
            // 精英敌人
            template = this.eliteTemplates[Math.floor(Math.random() * this.eliteTemplates.length)];
            isElite = true;
        } else {
            // 普通敌人
            template = this.enemyTemplates[Math.floor(Math.random() * this.enemyTemplates.length)];
        }
        
        // 生成敌人实例
        const enemy = this.createEnemyInstance(template, playerLevel, difficultyMultiplier, isElite, isBoss);
        
        return enemy;
    }
    
    // 创建敌人实例
    createEnemyInstance(template, playerLevel, difficultyMultiplier, isElite, isBoss) {
        const levelMultiplier = 1 + (playerLevel * 0.1); // 每级增加10%属性
        
        // 计算最终属性
        const health = Math.floor(template.baseHealth * levelMultiplier * difficultyMultiplier);
        const attack = Math.floor(template.baseAttack * levelMultiplier * difficultyMultiplier);
        const defense = Math.floor(template.baseDefense * levelMultiplier * difficultyMultiplier);
        
        const enemy = {
            name: template.name,
            health: health,
            maxHealth: health,
            attack: attack,
            defense: defense,
            color: template.color,
            skills: [...template.skills],
            description: template.description,
            isElite: isElite,
            isBoss: isBoss,
            
            // 技能状态
            skillCooldowns: {},
            statusEffects: [],
            rageLevel: 0,
            turnCount: 0,
            
            // 技能系统
            useSkill: function(skillName, player, battleSystem) {
                const skill = this.getSkill(skillName);
                if (!skill || this.skillCooldowns[skillName] > 0) return false;
                
                const result = skill.execute(this, player, battleSystem);
                if (result.success) {
                    this.skillCooldowns[skillName] = skill.cooldown;
                    return true;
                }
                return false;
            },
            
            getSkill: function(skillName) {
                return EnemySkills[skillName];
            },
            
            // 状态更新
            updateStatus: function() {
                this.turnCount++;
                
                // 减少技能冷却
                Object.keys(this.skillCooldowns).forEach(skill => {
                    if (this.skillCooldowns[skill] > 0) {
                        this.skillCooldowns[skill]--;
                    }
                });
                
                // 处理状态效果
                this.statusEffects = this.statusEffects.filter(effect => {
                    effect.duration--;
                    if (effect.duration <= 0) {
                        effect.onEnd?.(this);
                        return false;
                    }
                    effect.onTick?.(this);
                    return true;
                });
                
                // 处理特殊技能逻辑
                this.handleSpecialSkills();
            },
            
            handleSpecialSkills: function() {
                // 处理连续受伤恢复生命等技能
                if (this.health < this.maxHealth * 0.3 && !this.usedDesperationHeal) {
                    this.useSkill('desperation_heal', null, null);
                    this.usedDesperationHeal = true;
                }
            },
            
            // 受到伤害处理
            takeDamage: function(damage) {
                const actualDamage = Math.max(1, damage - this.defense);
                this.health = Math.max(0, this.health - actualDamage);
                
                // 触发某些技能
                this.triggerDamageBasedSkills(actualDamage);
                
                return actualDamage;
            },
            
            triggerDamageBasedSkills: function(damage) {
                // 连续受伤触发技能
                this.consecutiveHits = (this.consecutiveHits || 0) + 1;
                
                if (this.consecutiveHits >= 3) {
                    this.useSkill('counter_attack', null, null);
                    this.consecutiveHits = 0;
                }
                
                // 低血量触发技能
                if (this.health < this.maxHealth * 0.5 && !this.usedLowHealthSkill) {
                    this.useSkill('desperation_power', null, null);
                    this.usedLowHealthSkill = true;
                }
            },
            
            // 重置连续受伤计数
            resetConsecutiveHits: function() {
                this.consecutiveHits = 0;
            }
        };
        
        return enemy;
    }
    
    // 获取敌人描述
    getEnemyDescription(enemy) {
        let description = enemy.description;
        
        if (enemy.isElite) {
            description += "\n⭐ **精英敌人** - 属性大幅提升";
        }
        
        if (enemy.isBoss) {
            description += "\n👑 **Boss敌人** - 极度危险，拥有多种技能";
        }
        
        // 添加技能描述
        if (enemy.skills.length > 0) {
            description += "\n\n**特殊技能:**";
            enemy.skills.forEach(skillName => {
                const skill = EnemySkills[skillName];
                if (skill) {
                    description += `\n• ${skill.name}: ${skill.description}`;
                }
            });
        }
        
        return description;
    }
}

// 敌人技能定义
const EnemySkills = {
    // 不死生物技能
    undead_resilience: {
        name: "不死韧性",
        description: "每3回合恢复10%最大生命值",
        cooldown: 3,
        execute: function(enemy, player, battleSystem) {
            if (enemy.turnCount % 3 === 0) {
                const healAmount = Math.floor(enemy.maxHealth * 0.1);
                enemy.health = Math.min(enemy.maxHealth, enemy.health + healAmount);
                battleSystem.addBattleLog(`${enemy.name} 的不死韧性恢复了 ${healAmount} 点生命！`);
                return { success: true, type: 'heal', amount: healAmount };
            }
            return { success: false };
        }
    },
    
    // 群体狩猎技能
    pack_hunter: {
        name: "群体狩猎",
        description: "连续攻击时伤害提升",
        cooldown: 0,
        execute: function(enemy, player, battleSystem) {
            if (enemy.consecutiveHits >= 2) {
                enemy.attack *= 1.2; // 提升20%攻击力
                battleSystem.addBattleLog(`${enemy.name} 进入狩猎状态，攻击力提升！`);
                return { success: true, type: 'buff', amount: 0.2 };
            }
            return { success: false };
        }
    },
    
    // 愤怒技能
    rage: {
        name: "愤怒",
        description: "生命值低于30%时攻击力翻倍",
        cooldown: 5,
        execute: function(enemy, player, battleSystem) {
            if (enemy.health < enemy.maxHealth * 0.3) {
                enemy.attack *= 2;
                enemy.rageLevel = 1;
                battleSystem.addBattleLog(`${enemy.name} 进入愤怒状态，攻击力翻倍！`);
                return { success: true, type: 'rage', multiplier: 2 };
            }
            return { success: false };
        }
    },
    
    // 潜行攻击
    stealth_attack: {
        name: "潜行攻击",
        description: "有30%概率造成双倍伤害",
        cooldown: 4,
        execute: function(enemy, player, battleSystem) {
            if (Math.random() < 0.3) {
                battleSystem.addBattleLog(`${enemy.name} 发动潜行攻击！`);
                return { success: true, type: 'stealth', multiplier: 2 };
            }
            return { success: false };
        }
    },
    
    // 致命一击
    critical_strike: {
        name: "致命一击",
        description: "有15%概率造成3倍伤害",
        cooldown: 6,
        execute: function(enemy, player, battleSystem) {
            if (Math.random() < 0.15) {
                battleSystem.addBattleLog(`${enemy.name} 发动致命一击！`);
                return { success: true, type: 'critical', multiplier: 3 };
            }
            return { success: false };
        }
    },
    
    // 石化皮肤
    stone_skin: {
        name: "石化皮肤",
        description: "受到伤害时减少50%伤害",
        cooldown: 8,
        execute: function(enemy, player, battleSystem) {
            enemy.statusEffects.push({
                name: 'stone_skin',
                duration: 3,
                onEnd: function(target) {
                    battleSystem.addBattleLog(`${target.name} 的石化皮肤效果消失了。`);
                }
            });
            battleSystem.addBattleLog(`${enemy.name} 激活了石化皮肤！`);
            return { success: true, type: 'defense', duration: 3 };
        }
    },
    
    // 再生
    regeneration: {
        name: "再生",
        description: "每回合恢复5%最大生命值",
        cooldown: 0,
        execute: function(enemy, player, battleSystem) {
            const healAmount = Math.floor(enemy.maxHealth * 0.05);
            enemy.health = Math.min(enemy.maxHealth, enemy.health + healAmount);
            return { success: true, type: 'regeneration', amount: healAmount };
        }
    },
    
    // 召唤援军
    call_reinforcements: {
        name: "召唤援军",
        description: "召唤一个哥布林协助战斗",
        cooldown: 10,
        execute: function(enemy, player, battleSystem) {
            // 这里可以扩展为真正的多敌人战斗系统
            battleSystem.addBattleLog(`${enemy.name} 召唤了援军！`);
            enemy.attack += 2; // 临时增加攻击力
            return { success: true, type: 'summon' };
        }
    },
    
    // 龙息
    dragon_breath: {
        name: "龙息",
        description: "造成50点火焰伤害",
        cooldown: 5,
        execute: function(enemy, player, battleSystem) {
            const damage = 50;
            battleSystem.addBattleLog(`${enemy.name} 喷射龙息！`);
            return { success: true, type: 'damage', amount: damage };
        }
    },
    
    // 生命吸取
    life_drain: {
        name: "生命吸取",
        description: "造成伤害并恢复等量生命",
        cooldown: 4,
        execute: function(enemy, player, battleSystem) {
            const damage = Math.floor(enemy.attack * 1.5);
            const healAmount = damage;
            enemy.health = Math.min(enemy.maxHealth, enemy.health + healAmount);
            battleSystem.addBattleLog(`${enemy.name} 吸取生命值恢复了 ${healAmount} 点！`);
            return { success: true, type: 'lifedrain', damage: damage, heal: healAmount };
        }
    },
    
    // 黑暗光环
    dark_aura: {
        name: "黑暗光环",
        description: "降低玩家攻击力",
        cooldown: 6,
        execute: function(enemy, player, battleSystem) {
            if (player) {
                player.attack *= 0.8; // 降低20%攻击力
                battleSystem.addBattleLog(`${enemy.name} 的黑暗光环降低了你的攻击力！`);
            }
            return { success: true, type: 'debuff', effect: 'attack_down' };
        }
    }
};
