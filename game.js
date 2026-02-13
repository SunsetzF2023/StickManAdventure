// 游戏核心类
class StickManAdventure {
    constructor() {
        // 初始化存档系统
        this.saveSystem = new SaveSystem();
        this.equipmentSystem = new EquipmentSystem();
        this.upgradeSystem = new UpgradeSystem();
        this.weaponSpriteSystem = new WeaponSpriteSystem();
        this.encyclopediaSystem = new EncyclopediaSystem(this.equipmentSystem);
        this.enhancedEnemySystem = new EnhancedEnemySystem();
        
        // 武器图片缓存
        this.weaponImageCache = {};
        
        // 动画系统
        this.animationSystem = new BattleAnimationSystem();
        this.playerRenderer = new StickmanRenderer();
        this.enemyRenderer = new StickmanRenderer();
        
        // 加载存档数据
        this.saveData = this.saveSystem.loadSave();
        
        // 计算总属性（基础属性 + 装备属性）
        const equipmentStats = this.equipmentSystem.calculateEquipmentStats(this.saveData.equipment);
        const totalStats = this.calculateTotalStats(this.saveData.baseStats, equipmentStats);
        
        this.player = {
            health: totalStats.maxHealth,
            maxHealth: totalStats.maxHealth,
            attack: totalStats.attack,
            defense: totalStats.defense,
            accuracy: totalStats.accuracy,
            luck: totalStats.luck,
            level: this.saveData.baseStats.level,
            eventsSurvived: this.saveData.eventsSurvived
        };
        
        // 游戏状态
        this.currentEnemy = null;
        this.inBattle = false;
        this.gameOver = false;
        this.eventCounter = 0;
        this.nextBattleIn = this.getRandomBattleInterval();
        this.walkingFrame = 0;
        this.walkingAnimation = null;
        this.battleSpeed = 1; // 战斗速度倍数
        this.autoBattleInterval = null;
        
        // 武器动画相关
        this.attackAnimation = null;
        this.attackFrame = 0;
        this.isAttacking = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
        this.drawCharacter();
        this.startWalkingAnimation();
    }
    
    calculateTotalStats(baseStats, equipmentStats) {
        return {
            maxHealth: baseStats.maxHealth + equipmentStats.maxHealth,
            attack: baseStats.attack + equipmentStats.attack,
            defense: baseStats.defense + equipmentStats.defense,
            accuracy: baseStats.accuracy + equipmentStats.accuracy,
            luck: baseStats.luck + equipmentStats.luck
        };
    }
    
    initializeElements() {
        this.elements = {
            // 主界面元素
            mainScreen: document.getElementById('mainScreen'),
            healthDisplay: document.getElementById('health'),
            maxHealthDisplay: document.getElementById('maxHealth'),
            attackDisplay: document.getElementById('attack'),
            defenseDisplay: document.getElementById('defense'),
            accuracyDisplay: document.getElementById('accuracy'),
            luckDisplay: document.getElementById('luck'),
            levelDisplay: document.getElementById('level'),
            goldDisplay: document.getElementById('gold'),
            eventsSurvivedDisplay: document.getElementById('eventsSurvived'),
            characterCanvas: document.getElementById('characterCanvas'),
            characterCtx: document.getElementById('characterCanvas').getContext('2d'),
            
            // 战斗界面元素
            battleScreen: document.getElementById('battleScreen'),
            playerCanvas: document.getElementById('playerCanvas'),
            playerCtx: document.getElementById('playerCanvas').getContext('2d'),
            enemyCanvas: document.getElementById('enemyCanvas'),
            enemyCtx: document.getElementById('enemyCanvas').getContext('2d'),
            playerHealthDisplay: document.getElementById('playerHealth'),
            enemyHealthDisplay: document.getElementById('enemyHealth'),
            battleLog: document.getElementById('battleLog'),
            skipBattleBtn: document.getElementById('skipBattleBtn'),
            speedUpBtn: document.getElementById('speedUpBtn'),
            speedDownBtn: document.getElementById('speedDownBtn'),
            battleSpeedDisplay: document.getElementById('battleSpeed'),
            
            // 游戏结束界面
            gameOverScreen: document.getElementById('gameOverScreen'),
            gameOverTitle: document.getElementById('gameOverTitle'),
            gameOverMessage: document.getElementById('gameOverMessage'),
            finalStats: document.getElementById('finalStats'),
            restartBtn: document.getElementById('restartBtn'),
            
            // 升级界面按钮
            upgradesBtn: document.getElementById('upgradesBtn')
        };
    }
    
    bindEvents() {
        // 跳过战斗按钮
        this.elements.skipBattleBtn.addEventListener('click', () => this.skipBattle());
        
        // 战斗速度控制
        this.elements.speedUpBtn.addEventListener('click', () => this.changeBattleSpeed(1));
        this.elements.speedDownBtn.addEventListener('click', () => this.changeBattleSpeed(-1));
        
        // 重新开始按钮
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        
        // 升级按钮
        this.elements.upgradesBtn.addEventListener('click', () => {
            window.open('upgrades.html', '_blank');
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // 窗口焦点事件
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());
    }
    
    updateUI() {
        this.elements.healthDisplay.textContent = this.player.health;
        this.elements.maxHealthDisplay.textContent = this.player.maxHealth;
        this.elements.attackDisplay.textContent = this.player.attack;
        this.elements.defenseDisplay.textContent = this.player.defense;
        this.elements.accuracyDisplay.textContent = (this.player.accuracy * 100).toFixed(0) + '%';
        this.elements.luckDisplay.textContent = this.player.luck;
        this.elements.levelDisplay.textContent = this.player.level;
        this.elements.goldDisplay.textContent = this.saveData.gold;
        this.elements.eventsSurvivedDisplay.textContent = this.player.eventsSurvived;
    }
    
    drawCharacter() {
        const ctx = this.characterCtx;
        const canvas = this.characterCanvas;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置绘制样式
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // 绘制火柴人
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // 头部
        ctx.beginPath();
        ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 身体
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX, centerY + 20);
        ctx.stroke();
        
        // 手臂（摆动动画）
        const armSwing = Math.sin(this.walkingFrame * Math.PI / 2) * 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY - armSwing);
        ctx.lineTo(centerX + 20, centerY + armSwing);
        ctx.stroke();
        
        // 腿（踏步动画）
        const leftLegOffset = this.walkingFrame % 2 === 0 ? 5 : -5;
        const rightLegOffset = this.walkingFrame % 2 === 0 ? -5 : 5;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX - 15 + leftLegOffset, centerY + 50);
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX + 15 + rightLegOffset, centerY + 50);
        ctx.stroke();
        
        // 绘制武器
        this.drawWeapon(ctx, centerX, centerY);
    }
    
    // 获取武器图片（带缓存）
    getWeaponImage(weaponId) {
        if (this.weaponImageCache[weaponId]) {
            return this.weaponImageCache[weaponId];
        }
        
        const spriteUrl = this.weaponSpriteSystem.getWeaponSprite(weaponId);
        const img = new Image();
        img.src = spriteUrl;
        
        this.weaponImageCache[weaponId] = img;
        return img;
    }
    
    drawWeapon(ctx, centerX, centerY) {
        const weapon = this.saveData.equipment.weapon;
        if (!weapon) return;
        
        // 获取缓存的武器图片
        const img = this.getWeaponImage(weapon.id);
        
        // 绘制像素画武器（放大到合适尺寸）
        const weaponSize = 48; // 游戏内武器大小
        
        // 设置武器位置（火柴人右侧）
        const weaponX = centerX + 20;
        const weaponY = centerY - 24;
        
        // 如果图片已加载，立即绘制
        if (img.complete) {
            ctx.drawImage(img, weaponX, weaponY, weaponSize, weaponSize);
        } else {
            // 图片加载完成后绘制
            img.onload = () => {
                ctx.drawImage(img, weaponX, weaponY, weaponSize, weaponSize);
            };
        }
    }

    drawBattleCharacters() {
        // 清空画布
        this.playerCtx.clearRect(0, 0, this.elements.playerCanvas.width, this.elements.playerCanvas.height);
        this.enemyCtx.clearRect(0, 0, this.elements.enemyCanvas.width, this.elements.enemyCanvas.height);
        
        // 获取画布中心
        const playerCenterX = this.elements.playerCanvas.width / 2;
        const playerCenterY = this.elements.playerCanvas.height / 2;
        const enemyCenterX = this.elements.enemyCanvas.width / 2;
        const enemyCenterY = this.elements.enemyCanvas.height / 2;
        
        // 更新渲染器动画
        this.playerRenderer.update(16, this.isAttacking ? 'attack' : 'idle');
        this.enemyRenderer.update(16, 'idle');
        
        // 渲染玩家
        this.playerRenderer.render(
            this.playerCtx, 
            playerCenterX + this.playerRenderer.position.x, 
            playerCenterY + this.playerRenderer.position.y, 
            '#ffffff'
        );
        
        // 渲染玩家武器
        const weapon = this.saveData.equipment.weapon;
        if (weapon) {
            this.playerRenderer.renderWeapon(
                this.playerCtx,
                playerCenterX + this.playerRenderer.position.x, 
                playerCenterY + this.playerRenderer.position.y,
                weapon.id,
                Math.floor(this.playerRenderer.animationFrames.attack || 0)
            );
        }
        
        // 渲染敌人
        this.enemyRenderer.render(
            this.enemyCtx, 
            enemyCenterX + this.enemyRenderer.position.x, 
            enemyCenterY + this.enemyRenderer.position.y, 
            this.currentEnemy.color
        );
        
        // 渲染动画效果
        this.animationSystem.render(this.playerCtx);
        this.animationSystem.render(this.enemyCtx);
    }
    
    startWalkingAnimation() {
        this.walkingAnimation = setInterval(() => {
            this.walkingFrame = (this.walkingFrame + 1) % 4;
            this.drawCharacter();
        }, 200);
    }
    
    stopWalkingAnimation() {
        if (this.walkingAnimation) {
            clearInterval(this.walkingAnimation);
            this.walkingAnimation = null;
        }
    }
    
    // 事件系统
    generateRandomEvent() {
        const events = [
            { text: "你发现了一个宝箱！", gold: 10 + Math.floor(Math.random() * 20) },
            { text: "你遇到了一个神秘的商人！", gold: 5 + Math.floor(Math.random() * 15) },
            { text: "你在路边发现了一些金币！", gold: 8 + Math.floor(Math.random() * 12) },
            { text: "你帮助了一个旅人，获得了报酬！", gold: 12 + Math.floor(Math.random() * 18) },
            { text: "你发现了一个隐藏的宝库！", gold: 20 + Math.floor(Math.random() * 30) },
            { text: "你完成了一个小任务！", gold: 15 + Math.floor(Math.random() * 25) }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.saveData.gold += event.gold;
        this.showEventResult(event.text);
        this.eventCounter++;
        
        // 保存和更新UI
        this.saveSystem.saveSave(this.saveData);
        this.updateUI();
    }
    
    showEventResult(text) {
        this.elements.eventText.textContent = text;
    }
    
    // 战斗系统
    startBattle() {
        this.inBattle = true;
        this.eventCounter = 0;
        this.nextBattleIn = this.getRandomBattleInterval();
        
        // 使用增强敌人系统生成敌人
        this.currentEnemy = this.enhancedEnemySystem.generateEnemy(
            this.saveData.baseStats.level, 
            this.saveData.eventsSurvived
        );
        
        // 初始化渲染器位置
        this.playerRenderer.position = { x: -50, y: 0 };
        this.enemyRenderer.position = { x: 50, y: 0 };
        this.playerRenderer.facing = 1;
        this.enemyRenderer.facing = -1;
        
        // 重置动画系统
        this.animationSystem = new BattleAnimationSystem();
        
        this.switchToBattleScreen();
        this.updateBattleUI();
        this.drawBattleCharacters();
        this.addBattleLog(`遭遇了 ${this.currentEnemy.name}！`);
        this.addBattleLog(`${this.currentEnemy.description}`);
        this.addBattleLog("自动战斗开始！");
        
        // 启动自动战斗
        this.startAutoBattle();
    }
    
    switchToBattleScreen() {
        this.elements.mainScreen.classList.remove('active');
        this.elements.battleScreen.classList.add('active');
    }
    
    switchToMainScreen() {
        this.elements.battleScreen.classList.remove('active');
        this.elements.mainScreen.classList.add('active');
    }
    
    updateBattleUI() {
        this.elements.playerHealthDisplay.textContent = `${this.player.health} / ${this.player.maxHealth}`;
        this.elements.enemyHealthDisplay.textContent = `${this.currentEnemy.health} / ${this.currentEnemy.maxHealth}`;
        this.elements.battleSpeedDisplay.textContent = `${this.battleSpeed}x`;
    }
    
    // 自动战斗系统
    startAutoBattle() {
        const battleInterval = 1000 / this.battleSpeed; // 根据速度调整间隔
        
        this.autoBattleInterval = setInterval(() => {
            this.performBattleRound();
        }, battleInterval);
        
        // 启动动画循环
        this.startAnimationLoop();
    }
    
    // 动画循环
    startAnimationLoop() {
        const animate = () => {
            if (!this.inBattle) return;
            
            // 更新动画系统
            this.animationSystem.update(16); // 60 FPS
            
            // 更新渲染器
            this.playerRenderer.update(16);
            this.enemyRenderer.update(16);
            
            // 重绘战斗场景
            this.drawBattleCharacters();
            
            // 继续动画循环
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    performBattleRound() {
        if (!this.inBattle || this.gameOver) {
            this.stopAutoBattle();
            return;
        }
        
        // 玩家攻击
        this.isAttacking = true;
        const playerDamage = Math.max(1, this.player.attack - this.currentEnemy.defense);
        this.currentEnemy.health -= playerDamage;
        
        // 添加攻击动画
        this.animationSystem.addAttackAnimation(
            this.playerRenderer, 
            this.enemyRenderer, 
            this.saveData.equipment.weapon?.id || 'sword'
        );
        
        // 添加击中效果
        const isCritical = Math.random() < 0.15; // 15%暴击率
        this.animationSystem.addHitEffect(this.enemyRenderer, playerDamage, isCritical);
        
        // 敌人受伤动画
        this.enemyRenderer.hurt();
        
        this.addBattleLog(`你对 ${this.currentEnemy.name} 造成了 ${playerDamage} 点伤害${isCritical ? ' (暴击!)' : ''}！`);
        this.drawBattleCharacters();
        
        if (this.currentEnemy.health <= 0) {
            this.stopAutoBattle();
            this.winBattle();
            return;
        }
        
        // 敌人攻击
        setTimeout(() => {
            if (!this.inBattle || this.gameOver) return;
            
            this.isAttacking = false;
            
            // 敌人使用技能
            this.enemyRenderer.updateStatus();
            let enemyDamage = Math.max(1, this.currentEnemy.attack - this.player.defense);
            
            // 检查敌人技能
            if (this.currentEnemy.skills && this.currentEnemy.skills.length > 0) {
                const skillName = this.currentEnemy.skills[Math.floor(Math.random() * this.currentEnemy.skills.length)];
                const skill = this.currentEnemy.getSkill(skillName);
                
                if (skill && this.currentEnemy.useSkill(skillName, this.playerRenderer, this)) {
                    // 技能效果
                    this.animationSystem.addSkillEffect(this.enemyRenderer, skillName, this.playerRenderer);
                    this.addBattleLog(`${this.currentEnemy.name} 使用了 ${skill.name}！`);
                    
                    // 根据技能类型调整伤害
                    if (skill.type === 'damage') {
                        enemyDamage = skill.amount || enemyDamage;
                    } else if (skill.type === 'lifedrain') {
                        enemyDamage = skill.damage || enemyDamage;
                    }
                }
            }
            
            this.player.health -= enemyDamage;
            
            // 添加敌人攻击动画
            this.animationSystem.addAttackAnimation(
                this.enemyRenderer, 
                this.playerRenderer, 
                'sword'
            );
            
            // 添加击中效果
            const isEnemyCritical = Math.random() < 0.1; // 10%暴击率
            this.animationSystem.addHitEffect(this.playerRenderer, enemyDamage, isEnemyCritical);
            
            // 玩家受伤动画
            this.playerRenderer.hurt();
            
            this.addBattleLog(`${this.currentEnemy.name} 对你造成了 ${enemyDamage} 点伤害${isEnemyCritical ? ' (暴击!)' : ''}！`);
            this.drawBattleCharacters();
            
            if (this.player.health <= 0) {
                this.stopAutoBattle();
                this.loseGame();
                return;
            }
            
            this.updateBattleUI();
        }, 200 / this.battleSpeed);
        
        this.updateBattleUI();
    }
    
    stopAutoBattle() {
        if (this.autoBattleInterval) {
            clearInterval(this.autoBattleInterval);
            this.autoBattleInterval = null;
        }
    }
    
    skipBattle() {
        this.stopAutoBattle();
        
        // 更智能的战斗结果计算
        const playerDPS = this.player.attack * (1 + this.player.accuracy);
        const enemyDPS = this.currentEnemy.attack * (1 - this.player.defense * 0.1);
        const playerSurvivalTime = this.player.health / Math.max(1, enemyDPS);
        const enemySurvivalTime = this.currentEnemy.health / Math.max(1, playerDPS);
        
        this.addBattleLog("跳过战斗，计算结果...");
        
        if (playerSurvivalTime >= enemySurvivalTime) {
            // 玩家胜利
            this.currentEnemy.health = 0;
            this.winBattle();
        } else {
            // 玩家失败
            this.player.health = 0;
            this.loseGame();
        }
    }
    
    changeBattleSpeed(delta) {
        this.battleSpeed = Math.max(0.5, Math.min(3, this.battleSpeed + delta));
        this.elements.battleSpeedDisplay.textContent = `${this.battleSpeed}x`;
        
        // 如果正在战斗，重新启动自动战斗以应用新速度
        if (this.inBattle && this.autoBattleInterval) {
            this.stopAutoBattle();
            this.startAutoBattle();
        }
    }
    
    addBattleLog(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logEntry.className = 'fade-in';
        this.elements.battleLog.appendChild(logEntry);
        this.elements.battleLog.scrollTop = this.elements.battleLog.scrollHeight;
    }
    
    winBattle() {
        this.stopAutoBattle();
        this.addBattleLog(`你击败了 ${this.currentEnemy.name}！`);
        
        // 添加敌人死亡动画
        this.animationSystem.addDeathEffect(this.enemyRenderer);
        this.enemyRenderer.die();
        
        // 最后一次绘制以显示死亡动画
        this.drawBattleCharacters();
        
        // 获得金币奖励（替代经验值）
        const baseGold = 10 + Math.floor(Math.random() * 15); // 10-24基础金币
        const healthBonus = Math.floor(this.currentEnemy.maxHealth / 4); // 生命值奖励
        const levelBonus = this.player.level * 2; // 等级奖励
        const eliteBonus = this.currentEnemy.isElite ? 20 : 0;
        const bossBonus = this.currentEnemy.isBoss ? 100 : 0;
        const goldGain = baseGold + healthBonus + levelBonus + eliteBonus + bossBonus;
        this.saveData.gold += goldGain;
        this.addBattleLog(`获得 ${goldGain} 金币${this.currentEnemy.isElite ? ' (精英奖励!)' : ''}${this.currentEnemy.isBoss ? ' (Boss奖励!)' : ''}！`);
        
        // 随机装备掉落
        const dropChance = Math.random();
        const actualDropChance = this.currentEnemy.isBoss ? 0.8 : (this.currentEnemy.isElite ? 0.6 : 0.3);
        if (dropChance < actualDropChance) {
            const droppedItem = this.equipmentSystem.generateRandomDrop(this.player.level + (this.currentEnemy.isBoss ? 5 : (this.currentEnemy.isElite ? 2 : 0)));
            this.saveData.inventory.push(droppedItem);
            
            // 发现新装备
            const isNewDiscovery = this.encyclopediaSystem.discoverItem(droppedItem.id);
            this.addBattleLog(`获得装备：${droppedItem.name}！${isNewDiscovery ? ' (新发现!)' : ''}`);
        }
        
        // 恢复少量生命值
        const healthRestore = Math.min(20, this.player.maxHealth - this.player.health);
        if (healthRestore > 0) {
            this.player.health += healthRestore;
            this.addBattleLog(`恢复 ${healthRestore} 点生命值`);
        }
        
        // 更新统计
        this.saveData.totalWins++;
        this.saveData.enemiesDefeated++;
        if (this.currentEnemy.isElite) this.saveData.eliteEnemiesDefeated++;
        if (this.currentEnemy.isBoss) this.saveData.bossesDefeated++;
        this.saveData.totalGold += goldGain;
        this.player.eventsSurvived++;
        
        // 立即保存和更新UI
        this.saveSystem.saveSave(this.saveData);
        this.updateUI();
        
        setTimeout(() => {
            this.inBattle = false;
            this.switchToMainScreen();
        }, 2000);
    }
    
    loseGame() {
        this.gameOver = true;
        this.stopAutoBattle();
        this.addBattleLog("你被击败了...");
        
        setTimeout(() => {
            this.showGameOver();
        }, 1000);
    }
    
    showGameOver() {
        this.elements.gameOverTitle.textContent = "游戏结束";
        this.elements.gameOverMessage.textContent = `你在第 ${this.player.eventsSurvived} 个事件后倒下了`;
        this.elements.finalStats.innerHTML = `
            <div>最终等级: ${this.player.level}</div>
            <div>击败敌人: ${this.saveData.enemiesDefeated}</div>
            <div>获得金币: ${this.saveData.totalGold}</div>
            <div>生存事件: ${this.player.eventsSurvived}</div>
        `;
        
        this.elements.gameOverScreen.classList.add('active');
    }
    
    restartGame() {
        // 重置存档
        this.saveSystem.resetSave();
        location.reload();
    }
    
    getRandomBattleInterval() {
        return Math.floor(Math.random() * 3) + 2; // 2-4个事件后触发战斗
    }
    
    // 页面可见性处理
    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时暂停游戏
            this.wasAutoBattleRunning = this.autoBattleInterval !== null;
            this.stopAutoBattle();
            this.stopWalkingAnimation();
        } else {
            // 页面显示时恢复游戏
            if (this.wasAutoBattleRunning && this.inBattle) {
                this.startAutoBattle();
                this.addBattleLog("游戏已恢复");
            }
            this.startWalkingAnimation();
        }
    }
    
    handleWindowFocus() {
        // 窗口获得焦点时确保游戏运行
        if (this.inBattle && !this.autoBattleInterval && !this.gameOver) {
            this.startAutoBattle();
        }
    }
    
    handleWindowBlur() {
        // 窗口失去焦点时的处理
        // 这里可以选择暂停或继续运行
    }
    
    // 游戏主循环
    startGameLoop() {
        setInterval(() => {
            if (!this.inBattle && !this.gameOver) {
                this.eventCounter++;
                
                // 检查是否应该触发战斗
                if (this.eventCounter >= this.nextBattleIn) {
                    this.startBattle();
                } else {
                    this.generateRandomEvent();
                }
            }
        }, 3000); // 每3秒一个事件
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new StickManAdventure();
    game.startGameLoop();
});
